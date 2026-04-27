import React, { useMemo, useState } from "react";

const COLORS = [
  { name: "RED", hex: "#ef4444" },
  { name: "BLUE", hex: "#3b82f6" },
  { name: "GREEN", hex: "#10b981" },
  { name: "YELLOW", hex: "#eab308" },
  { name: "PURPLE", hex: "#8b5cf6" },
  { name: "ORANGE", hex: "#f97316" },
  { name: "PINK", hex: "#ec4899" },
  { name: "CYAN", hex: "#06b6d4" },
  { name: "LIME", hex: "#84cc16" },
  { name: "INDIGO", hex: "#6366f1" },
  { name: "TEAL", hex: "#14b8a6" },
  { name: "AMBER", hex: "#f59e0b" },
  { name: "BROWN", hex: "#92400e" },
  { name: "GRAY", hex: "#6b7280" },
  { name: "MAGENTA", hex: "#d946ef" },
  { name: "MAROON", hex: "#991b1b" },
  { name: "NAVY", hex: "#1e3a8a" },
  { name: "OLIVE", hex: "#4d7c0f" }
];

const TOTAL_ROUNDS = 10;

const randomIndex = (max) => Math.floor(Math.random() * max);

const createPrompt = () => {
  const wordIndex = randomIndex(COLORS.length);
  let inkIndex = randomIndex(COLORS.length);

  if (inkIndex === wordIndex) {
    inkIndex = (inkIndex + 1) % COLORS.length;
  }

  return {
    word: COLORS[wordIndex].name,
    inkHex: COLORS[inkIndex].hex,
    inkName: COLORS[inkIndex].name
  };
};

const computeTopConfusion = (confusions) => {
  const entries = Object.entries(confusions);
  if (!entries.length) return "";
  const [pair] = entries.sort((a, b) => b[1] - a[1])[0];
  return pair;
};

const ReactionGame = () => {
  const [started, setStarted] = useState(false);
  const [round, setRound] = useState(1);
  const [prompt, setPrompt] = useState(createPrompt);
  const [roundStartAt, setRoundStartAt] = useState(0);
  const [reactionTimes, setReactionTimes] = useState([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [lastResult, setLastResult] = useState("");
  const [confusions, setConfusions] = useState({});
  const [coachTip, setCoachTip] = useState("");
  const [coachSource, setCoachSource] = useState("");
  const [coachLoading, setCoachLoading] = useState(false);
  const [coachError, setCoachError] = useState("");

  const finished = started && round > TOTAL_ROUNDS;

  const stats = useMemo(() => {
    const roundsPlayed = reactionTimes.length;
    const total = reactionTimes.reduce((sum, ms) => sum + ms, 0);
    const avgMs = roundsPlayed ? Math.round(total / roundsPlayed) : 0;
    const bestMs = roundsPlayed ? Math.min(...reactionTimes) : 0;
    const worstMs = roundsPlayed ? Math.max(...reactionTimes) : 0;
    const accuracy = roundsPlayed ? Math.round((correctCount / roundsPlayed) * 100) : 0;

    return {
      roundsPlayed,
      correct: correctCount,
      accuracy,
      avgMs,
      bestMs,
      worstMs,
      topConfusion: computeTopConfusion(confusions)
    };
  }, [reactionTimes, correctCount, confusions]);

  const beginGame = () => {
    setStarted(true);
    setRound(1);
    setPrompt(createPrompt());
    setRoundStartAt(performance.now());
    setReactionTimes([]);
    setCorrectCount(0);
    setLastResult("");
    setConfusions({});
    setCoachTip("");
    setCoachSource("");
    setCoachError("");
  };

  const answerRound = (selectedName) => {
    if (!started || finished) return;

    const elapsed = Math.max(0, Math.round(performance.now() - roundStartAt));
    const isCorrect = selectedName === prompt.inkName;

    setReactionTimes((prev) => [...prev, elapsed]);
    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      setLastResult(`Correct in ${elapsed}ms`);
    } else {
      setLastResult(`Oops! Target was ${prompt.inkName} (${elapsed}ms)`);
      const pair = `${prompt.inkName}->${selectedName}`;
      setConfusions((prev) => ({ ...prev, [pair]: (prev[pair] || 0) + 1 }));
    }

    setRound((prevRound) => {
      const next = prevRound + 1;
      if (next <= TOTAL_ROUNDS) {
        setPrompt(createPrompt());
        setRoundStartAt(performance.now());
      }
      return next;
    });
  };

  const getAiCoach = async () => {
    setCoachLoading(true);
    setCoachError("");

    try {
      const response = await fetch("/ai/reaction-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stats)
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      setCoachTip(data.tip || "No tip returned.");
      setCoachSource(data.source || "unknown");
    } catch (error) {
      setCoachError("Could not fetch AI tip right now. Please try again.");
    } finally {
      setCoachLoading(false);
    }
  };

  return (
    <div className="main-container">
      <section className="stroop-panel">
        <header className="stroop-header">
          <h2>Color Clash Reaction Game</h2>
          <p>
            Rule: click the <strong>ink color</strong>, not the word meaning.
            Anyone can play this without login.
          </p>
        </header>

        {!started ? (
          <button type="button" className="btn btn-primary" onClick={beginGame}>
            Start 10-Round Game
          </button>
        ) : null}

        {started && !finished ? (
          <div className="stroop-round">
            <div className="stroop-meta">
              <span>Round {round} / {TOTAL_ROUNDS}</span>
              <span>Correct: {correctCount}</span>
            </div>

            <div className="stroop-word" style={{ color: prompt.inkHex }}>
              {prompt.word}
            </div>

            <p className="stroop-note">Ignore this word meaning: {prompt.word}</p>

            <div className="stroop-options">
              {COLORS.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  className="btn btn-outline-dark stroop-option"
                  onClick={() => answerRound(color.name)}
                >
                  {color.name}
                </button>
              ))}
            </div>

            {lastResult ? <p className="stroop-result">{lastResult}</p> : null}
          </div>
        ) : null}

        {finished ? (
          <div className="stroop-summary">
            <h3>Game Summary</h3>
            <p>
              Accuracy: <strong>{stats.accuracy}%</strong> ({stats.correct}/{stats.roundsPlayed})
            </p>
            <p>
              Average: <strong>{stats.avgMs}ms</strong> | Best: <strong>{stats.bestMs}ms</strong> |
              Worst: <strong>{stats.worstMs}ms</strong>
            </p>
            {stats.topConfusion ? <p>Top confusion: {stats.topConfusion}</p> : null}

            <div className="stroop-actions">
              <button type="button" className="btn btn-primary" onClick={beginGame}>
                Play Again
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={getAiCoach}
                disabled={coachLoading}
              >
                {coachLoading ? "Getting Tip..." : "Get AI Coach Tip"}
              </button>
            </div>

            {coachTip ? (
              <div className="coach-tip">
                <p className="mb-1"><strong>Coach ({coachSource}):</strong></p>
                <p className="mb-0">{coachTip}</p>
              </div>
            ) : null}

            {coachError ? <p className="text-danger mt-2 mb-0">{coachError}</p> : null}
          </div>
        ) : null}
      </section>
    </div>
  );
};

export default ReactionGame;
