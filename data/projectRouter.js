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
            res.status(201).json(project);
        })
        .catch(err => {
            res.status(500).json({ error: 'failed to post project to the database' });
        });
});

router.delete('/:id', validateProjectId, (req, res) => {
    const id = req.params.id;
    Projects.remove(id)
        .then(project => {
            res.status(200).json({ message: 'project removed' });
        })
        .catch(err => {
            res.status(500).json({ error: 'failed to remove project from the database' });
        });

});

router.put('/:id', validateProjectId, validateProject, (req, res) => {
    const id = req.params.id;
    const changes = req.body;
    Projects.update(id, changes)
        .then(project => {
            res.status(200).json(changes);
        })
        .catch(err => {
            res.status(500).json({ error: 'failed to update project' });
        });
});

//custom middleware

function validateProjectId(req, res, next) {
    const id = req.params.id;
    Projects.get(id)
        .then(project => {
            if (!id) {
                res.status(400).json({ error: 'invalid project id' });
            } else {
                console.log('project id validated');
                next();
            }
        })
};

function validateProject(req, res, next) {
    const projectData = req.body;
    if (!projectData.name) {
        res.status(400).json({ error: 'missing project name field' });
    } else if (!projectData.description) {
        res.status(400).json({ error: 'missing project description field' });
    } else {
        console.log('project validated');
        next();
    }
};

module.exports = router;
