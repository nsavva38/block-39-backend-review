require("dotenv").config();

const express = require("express");
const app = express();
const PORT = process.env.PORT ?? 3000;

// logging
app.use(require("morgan")("dev"));

app.use(express.json());

//routes go here
app.use(require("./routes/auth").router);
app.use("/tasks", require("./routes/tasks"));


//404
app.use((req, res, next) => {
  next({
    status: 404,
    message: "Endpoint not found."
  });
});

//error-handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status ?? 500);
  res.json(err.message ?? "Sorry, something broke.");
})




app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});