const { json, response } = require("express");
const express = require("express");
const RagistrationLogin = require('./Routes/RagistrationLogin/index')
const Attendance = require('./Routes/Attendance')
const app = express();
const post = process.env.PORT || 3000


app.use(express.json());
app.use(RagistrationLogin)
app.use(Attendance)
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.listen(post, () => {
  console.log(`Server is listening on port: http://localhost:${post}`);
});