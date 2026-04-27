const express = require("express");

const router = express.Router();

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function getRuleBasedTip(stats) {
  const avgMs = Number(stats.avgMs) || 0;
  const accuracy = Number(stats.accuracy) || 0;
  const roundsPlayed = Number(stats.roundsPlayed) || 0;
  const confusionPair = typeof stats.topConfusion === "string" ? stats.topConfusion : "";

  if (!roundsPlayed) {
    return "Play at least 5 rounds so I can generate a meaningful coaching tip.";
  }

  if (accuracy < 60) {
    return "Slow down a bit and say the word in your head before clicking. Accuracy first, then speed.";
  }

  if (avgMs > 1200) {
    return "Your reaction time is improving, but still high. Keep your cursor centered and reduce hand movement distance.";
  }

  if (confusionPair) {
    return `You are most often tricked by ${confusionPair}. Focus on reading the word, not the ink color.`;
  }

  return "Great consistency. Try reducing your average reaction by 100ms while keeping accuracy above 80%.";
}

router.post("/reaction-coach", async (req, res) => {
  const body = req.body || {};

  const stats = {
    roundsPlayed: clamp(Number(body.roundsPlayed) || 0, 0, 1000),
    correct: clamp(Number(body.correct) || 0, 0, 1000),
    accuracy: clamp(Number(body.accuracy) || 0, 0, 100),
    avgMs: clamp(Number(body.avgMs) || 0, 0, 60000),
    bestMs: clamp(Number(body.bestMs) || 0, 0, 60000),
    worstMs: clamp(Number(body.worstMs) || 0, 0, 60000),
    topConfusion: typeof body.topConfusion === "string" ? body.topConfusion.slice(0, 80) : ""
  };

  const fallbackTip = getRuleBasedTip(stats);

  const model = process.env.OLLAMA_MODEL || "llama3.2:3b";
  const ollamaUrl = process.env.OLLAMA_URL || "http://127.0.0.1:11434/api/generate";

  const prompt = [
    "You are a concise reaction-time game coach.",
    "Give exactly 2 sentences:",
    "1) one personalized insight from stats",
    "2) one specific next-round action",
    "No markdown, no bullet points, max 45 words total.",
    `Stats: rounds=${stats.roundsPlayed}, correct=${stats.correct}, accuracy=${stats.accuracy}%, avg=${stats.avgMs}ms, best=${stats.bestMs}ms, worst=${stats.worstMs}ms, topConfusion=${stats.topConfusion || "none"}`
  ].join("\n");

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(ollamaUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        options: {
          temperature: 0.2,
          num_predict: 80
        }
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Ollama request failed with status ${response.status}`);
    }

    const data = await response.json();
    const tip = typeof data.response === "string" ? data.response.trim() : "";

    if (!tip) {
      throw new Error("Ollama returned an empty response.");
    }

    res.send({ source: "ollama", tip });
  } catch (error) {
    res.send({
      source: "fallback",
      tip: fallbackTip,
      detail: "Ollama unavailable. Using local rule-based coaching."
    });
  }
});

module.exports = router;
