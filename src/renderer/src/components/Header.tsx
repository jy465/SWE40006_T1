import { format } from "date-fns";

export default function Header() {
  return (
    <header>
      <h1>🍅 Tomato Tasks</h1>
      <p className="subtitle"> To-do Lists + Pomodoro • {format(new Date(), "EEEE, dd MMM yyyy")}</p>
    </header>
  );
}