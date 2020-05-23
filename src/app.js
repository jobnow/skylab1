const express = require("express");
const cors = require("cors");

//Gerador de ids 
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

//Rota que mostra todos os repositorios
app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

//Rota que cadastra um novo repositorio passando title, url e techs, gerando id automatico e like 0
app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const project = { id: uuid(), title, url, techs, likes: 0 }

  repositories.push(project)

  return response.json(project)
});

//Rota que altera um repositorio via id sendo possivel apenas alterar title, url e techs
app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body
  const { id } = request.params

  let repository = repositories.find(repository => repository.id === id)
  if (!repository)
    return response.status(400).json({ error: "Repository not found!" })

  repository = { ...repository, title, url, techs }

  return response.json(repository)
});

//Rota que exlui um repositorio por id
app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)
  if (repositoryIndex < 0)
    return response.status(400).json({ error: "Repository not found!" })

  repositories.splice(repositoryIndex, 1)

  return response.status(204).send()

});

//Rota que cadastra likes no repositorio de 1 em 1, optei pelo put porém da pra usar post.
app.put("/repositories/:id/like", (request, response) => {
  const { id } = request.params

  const repository = repositories.find(repository => repository.id === id)

  if (!repository)
    return response.status(400).json({ error: "Repository not found!" })

  repository.likes += 1

  return response.json(repository)
});

//Rota que deleta um like (optei por deixar negativo tbm, funcionando como um sistema de deslike)
app.delete("/repositories/:id/like", (request, response) => {
  const { id } = request.params

  const repository = repositories.find(repository => repository.id === id)

  if (!repository)
    return response.status(400).json({ error: "Repository not found!" })

  repository.likes -= 1

  return response.json(repository)
});

module.exports = app;
