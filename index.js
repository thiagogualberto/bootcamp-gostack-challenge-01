const express = require('express');
const server = express();

server.use(express.json());
server.listen(3000);

//Vetor de objetos. As propriedades são as informações de um projeto.
const projects = [];

/* Middleware com o número de requisições */
server.use((req, res, next) => {
    console.count("Número de requisições: ");
    return next();
});

/* Middleware local para verificar se o projeto existe no vetor. */
function projectExists(req, res, next) {
    const { id } = req.params;
    const findProject = projects.find(p => p.id == id);

    if (!findProject){
        return res.status(400).json('Project not found.');
    }
    return next();
}


/* Retorna todos os projetos */
server.get('/projects', (req, res) => {
    return res.json(projects);
});

/*Cadastra um novo projeto*/
server.post('/projects', (req, res) => {
    const { id, title } = req.body;
    const project = {
        id,
        title,
        tasks: []
    };

    projects.push(project);     //empilha (insere) um novo projeto no vetor.
    return res.json(projects);
});

/* Altera o título de um projeto com o id sendo passado nos parâmetros na rota */
server.put('/projects/:id', projectExists, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    const indexProject = projects.find(p => p.id == id); 

    indexProject.title = title;

    return res.json(projects);
});

/* Deleta projeto associado ao id presente nos parâmetros da rota */
server.delete('/projects/:id', projectExists, (req, res) => {
    const { id } = req.params;
    const indexProject = projects.findIndex(p => p.id == id);
    
    projects.splice(indexProject, 1);

    return res.send();
});

server.post('/projects/:id/tasks', projectExists, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const indexProject = projects.findIndex(p => p.id == id);
    projects[indexProject].tasks.push(title);

    //Poderia comentar as duas linhas acima e fazer como descrito abaixo:
    //const project = projects.find(p => p.id == id);
    //project.tasks.push(title);

    return res.json(projects);
});