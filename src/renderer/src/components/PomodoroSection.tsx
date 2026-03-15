type Props = {
  isFocus: boolean;
  secondsLeft: number;
  progress: number;
  running: boolean;
  setRunning: React.Dispatch<React.SetStateAction<boolean>>;
  resetTimer: () => void;
  switchMode: () => void;
};

export default function PomodoroSection({
  isFocus,
  secondsLeft,
  progress,
  running,
  setRunning,
  resetTimer,
  switchMode,
}: Props) {
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <section className="card">
      <h2>{isFocus ? "Focus Time" : "Break Time"}</h2>
      <div className="timer">{mm}:{ss}</div>

      <div className="progressWrap">
        <div className="progressBar" style={{ width: `${progress}%` }} />
      </div>

      <div className="row">
        <button onClick={() => setRunning((r) => !r)}>
          {running ? "Pause" : "Start"}
        </button>
        <button onClick={resetTimer}>Reset</button>
        <button onClick={switchMode}>Switch</button>
      </div>
    </section>
  );
}