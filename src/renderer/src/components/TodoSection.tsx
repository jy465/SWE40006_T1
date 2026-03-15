import type { Task } from "../App";

type Props = {
  tasks: Task[];
  text: string;
  setText: (v: string) => void;
  addTask: () => void;
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;
};

export default function TodoSection({
  tasks,
  text,
  setText,
  addTask,
  toggleTask,
  deleteTask,
}: Props) {
  return (
    <section className="card">
      <h2>To-Do List</h2>
      <div className="row">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a task..."
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button onClick={addTask}>Add</button>
      </div>

      <ul className="list">
        {tasks.length === 0 && <li className="empty">No tasks yet ✨</li>}
        {tasks.map((task) => (
          <li key={task.id} className="task">
            <label>
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleTask(task.id)}
              />
              <span className={task.done ? "done" : ""}>{task.title}</span>
            </label>
            <button className="delete" onClick={() => deleteTask(task.id)}>
              ✕
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}