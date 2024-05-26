const express = require("express");
const cors = require("cors"); 
const app = express();
const port = 3000;
const instructorRouter = require("./Routes/Instructor");
const courseRouter = require("./Routes/Courses");
const studentRouter = require("./Routes/Student");
const lab_templateRouter = require("./Routes/Lab_Template");
const AuthRouter = require("./Routes/Auth");
const proxmoxManager = require('./Routes/proxmoxManager')


app.use(cors({
  origin: 'http://localhost:4200', // Allow requests from this origin
  // Additional CORS options can be configured here
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

// Your API endpoints
app.use("/instructor", instructorRouter);
app.use("/course", courseRouter);
app.use("/student", studentRouter);
app.use("/lab_template", lab_templateRouter);
app.use("/Auth", AuthRouter);
app.use("/vm", proxmoxManager);


/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
