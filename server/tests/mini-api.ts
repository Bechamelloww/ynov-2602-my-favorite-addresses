import express from "express";

const app = express();
app.use(express.json());

app.post("/countword", (req, res) => {
  const { text, word } = req.body;

  if (text == null || word == null) {
    return res.status(400).json({
      message: "text and word are required",
    });
  }

  if (typeof text !== "string" || typeof word !== "string") {
    return res.status(400).json({
      message: "text and word must be strings",
    });
  }

  if (word === "") {
    return res.status(400).json({
      message: "word must not be empty",
    });
  }

  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const count = (text.match(new RegExp(escaped, "g")) ?? []).length;

  return res.json({ count });
});

export default app;
