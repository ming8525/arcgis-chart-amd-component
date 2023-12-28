const express = require("express");
const path = require("path");
const childProcess = require("child_process");

const port = 4012;

async function startServer() {
  const app = express();

  // Serve static files needed for the app
  app.use("/", express.static(path.join(__dirname, "..")));

  // Stuff to do when user goes to localhost:{port}
  app.get("/", (_req, res) => {
    res.sendFile(path.join(__dirname, "../index.html"));
  });

  // Set the port number; port number is internally used by reload(app) call also
  app.set("port", port);

  // Start listening to the port
  app.listen(app.get("port"), () => {
    console.log(`Vanilla app started on http://localhost:${app.get("port")}`);
    childProcess.exec(`open http://localhost:${app.get("port")}`);
  });
}

startServer();
