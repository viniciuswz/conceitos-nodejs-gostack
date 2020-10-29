const express = require("express");
const cors = require("cors");

 const { v4: uuid, validate: isUuid, v4 } = require('uuid');
const { json } = require("express");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const verifyId = (request, response, next) => {
  const { id } = request.params;
  const indexRepository = repositories.findIndex( repository => repository.id == id);
  if(indexRepository < 0){
    return response.status(400).json({error: 'Repository not found'})
  }

  return next();
}

app.use('/repositories/:id', verifyId)

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const respository = {
    id: v4(),
    title,
    url,
    techs,
    likes: 0
  }
  repositories.push(respository);
  return response.json(respository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { techs, title, url } = request.body;

  const indexProject = repositories.findIndex( respository => respository.id == id );

  repositories[indexProject].title = title;
  repositories[indexProject].techs = techs;
  repositories[indexProject].url = url;

  return response.json(repositories[indexProject]);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const indexProject = repositories.findIndex( repository => repository.id == id);

  repositories.splice(indexProject, 1);

  return response.status(204).json()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const indexProject = repositories.findIndex( repository => repository.id == id )
  let repositoryLike = repositories[indexProject].likes;
  
  repositories[indexProject].likes = ++repositoryLike;

  return response.json(repositories[indexProject]);

});

module.exports = app;
