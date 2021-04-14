const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require("uuid");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const newRepo = { id: uuid(), title, url, techs, likes: 0 };
  repositories.push(newRepo);

  return response.json(newRepo);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const indexOfSelectedRepo = repositories.findIndex((repo) => repo.id === id);

  if (indexOfSelectedRepo < 0) {
    return response.status(400).json({ error: "Repo not found" });
  }

  if (title) repositories[indexOfSelectedRepo].title = title;
  if (url) repositories[indexOfSelectedRepo].url = url;
  if (techs) repositories[indexOfSelectedRepo].techs = techs;

  return response.json(repositories[indexOfSelectedRepo]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const indexOfSelectedRepo = repositories.findIndex((repo) => repo.id === id);

  if (indexOfSelectedRepo < 0) {
    return response.status(400).json({ error: "Repo not found" });
  }

  repositories.splice(indexOfSelectedRepo, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const indexOfSelectedRepo = repositories.findIndex((repo) => repo.id === id);

  if (indexOfSelectedRepo < 0) {
    return response.status(400).json({ error: "Repo not found" });
  }

  repositories[indexOfSelectedRepo].likes += 1;

  return response.json(repositories[indexOfSelectedRepo]);
});

module.exports = app;
