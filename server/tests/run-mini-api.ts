import app from "./mini-api";

const port = 3001;
app.listen(port, () => {
  console.log(`Mini API: http://localhost:${port}`);
});
