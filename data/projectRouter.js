const express = require('express');

const Projects = require('./helpers/projectModel.js');

const router = express.Router();

router.get('/', (req, res) => {
    Projects.get()
        .then(project => {
            res.status(200).json(project);
        })
        .catch(err => {
            res.status(500).json({ error: 'failed to get projects from database' });
        });
});

router.post('/', validateProject, (req, res) => {
    const body = req.body;
    Projects.insert(body)
        .then(project => {
            res.status(200).json(project);
        })
        .catch(err => {
            res.status(500).json({ error: 'failed to post project to the database' });
        });
});

//custom middleware

function validateProjectId(req, res, next) {
    const id = req.params.id;
    Projects.getById(id)
        .then(project => {
            if (!id) {
                res.status(400).json({ message: 'invalid project id' });
            } else {
                console.log('project id validated');
                res.status(200).json(project);
                next();
            }
        })
};

function validateProject(req, res, next) {
    const projectData = req.body;
    if (!projectData.name) {
        res.status(400).json({ message: 'missing project name field' });
    } else if (!projectData.description) {
        res.status(400).json({ message: 'missing project description field' });
    } else {
        console.log('project validated');
        next();
    }
};

module.exports = router;
