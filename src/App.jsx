import { useEffect, useState } from "react";

export default function App() {
  const [phases, setPhases] = useState([
    { name: "Work", minutes: "25" },
    { name: "Break", minutes: "5" },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [cheer, setCheer] = useState(false);

  useEffect(() => {
    if (!running) {
      const val = Number(phases[currentIndex].minutes);
      if (!isNaN(val) && val > 0) {
        setSeconds(val * 60);
      }
    }
  }, [phases, currentIndex, running]);

  useEffect(() => {
    let interval;

    if (running && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((s) => s - 1);
      }, 1000);
    }

    if (running && seconds === 0) {
      setRunning(false);
      setCheer(true);

      setTimeout(() => {
        setCheer(false);

        const next = (currentIndex + 1) % phases.length;
        const nextMinutes = Number(phases[next].minutes) || 1;

        setCurrentIndex(next);
        setSeconds(nextMinutes * 60);
        setRunning(true);
      }, 2000);
    }

    return () => clearInterval(interval);
  }, [running, seconds, currentIndex, phases]);

  const formatTime = () => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleChange = (i, value) => {
    const copy = [...phases];
    copy[i].minutes = value;
    setPhases(copy);
  };

  const handleBlur = (i) => {
    const copy = [...phases];
    let val = Number(copy[i].minutes);

    if (!val || val <= 0) val = 1;
    copy[i].minutes = String(val);

    setPhases(copy);
  };

  const reset = () => {
    setRunning(false);
    setCurrentIndex(0);
    setSeconds(Number(phases[0].minutes || 1) * 60);
    setCheer(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-xl shadow-xl w-96">

        <h1 className="text-2xl font-bold text-center mb-1">
         Pomodoro
        </h1>

        <p className="text-center text-gray-400 mb-6">
          {phases[currentIndex].name}
        </p>

        <div className="text-6xl font-mono text-center mb-6">
          {formatTime()}
        </div>

        {cheer && (
          <div className="text-center text-green-400 mb-4 animate-bounce">
            🎉 Phase Complete!
          </div>
        )}

        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setRunning(!running)}
            className="px-5 py-2 bg-green-600 hover:bg-green-700 rounded"
          >
            {running ? "Pause" : "Start"}
          </button>

          <button
            onClick={reset}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 rounded"
          >
            Reset
          </button>
        </div>

        {/* Phase Editor */}
        <div className="space-y-3">
          {phases.map((p, i) => (
            <div
              key={i}
              className="flex items-center justify-between"
            >
              <span>{p.name}</span>
              <input
                type="number"
                value={p.minutes}
                disabled={running}
                onChange={(e) => handleChange(i, e.target.value)}
                onBlur={() => handleBlur(i)}
                className="w-20 bg-gray-700 px-2 py-1 rounded"
              />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
