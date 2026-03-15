import { useEffect, useMemo, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import TodoSection from "./components/TodoSection";
import PomodoroSection from "./components/PomodoroSection";

export type Task = {
  id: number;
  title: string;
  done: boolean;
};

const FOCUS_MIN = 25;
const BREAK_MIN = 5;

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [text, setText] = useState("");
  const [isFocus, setIsFocus] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_MIN * 60);
  const [running, setRunning] = useState(false);

  const totalSeconds = useMemo(
    () => (isFocus ? FOCUS_MIN * 60 : BREAK_MIN * 60),
    [isFocus]
  );
  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          const nextIsFocus = !isFocus;
          setIsFocus(nextIsFocus);
          return (nextIsFocus ? FOCUS_MIN : BREAK_MIN) * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [running, isFocus]);

  const addTask = () => {
    if (!text.trim()) return;
    setTasks((prev) => [
      { id: Date.now(), title: text.trim(), done: false },
      ...prev,
    ]);
    setText("");
  };

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const resetTimer = () => {
    setRunning(false);
    setSecondsLeft((isFocus ? FOCUS_MIN : BREAK_MIN) * 60);
  };

  const switchMode = () => {
    const next = !isFocus;
    setIsFocus(next);
    setRunning(false);
    setSecondsLeft((next ? FOCUS_MIN : BREAK_MIN) * 60);
  };

  return (
    <div className="app">
      <Header />
      <TodoSection
        tasks={tasks}
        text={text}
        setText={setText}
        addTask={addTask}
        toggleTask={toggleTask}
        deleteTask={deleteTask}
      />
      <PomodoroSection
        isFocus={isFocus}
        secondsLeft={secondsLeft}
        progress={progress}
        running={running}
        setRunning={setRunning}
        resetTimer={resetTimer}
        switchMode={switchMode}
      />
    </div>
  );
}