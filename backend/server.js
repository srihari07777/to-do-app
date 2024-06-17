// backend/server.js

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const connection = require('./db');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the frontend folder
app.use(express.static('../frontend'));

// Get all tasks
app.get('/api/tasks', (req, res) => {
    connection.query('SELECT * FROM tasks', (err, results) => {
        if (err) {
            console.error('Error retrieving tasks from database:', err);
            res.status(500).json({ error: 'Error retrieving tasks from database.' });
            return;
        }
        res.json(results);
    });
});

// Add a new task
app.post('/api/tasks', (req, res) => {
    const { task } = req.body;
    if (!task) {
        res.status(400).json({ error: 'Task text is required.' });
        return;
    }

    connection.query('INSERT INTO tasks (task) VALUES (?)', [task], (err, result) => {
        if (err) {
            console.error('Error adding task to database:', err);
            res.status(500).json({ error: 'Error adding task to database.' });
            return;
        }
        res.status(201).send('Task added successfully.');
    });
});

// Update a task
app.put('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { task } = req.body;
    if (!task) {
        res.status(400).json({ error: 'Task text is required.' });
        return;
    }

    connection.query('UPDATE tasks SET task = ? WHERE id = ?', [task, id], (err, result) => {
        if (err) {
            console.error('Error updating task in database:', err);
            res.status(500).json({ error: 'Error updating task in database.' });
            return;
        }
        res.send('Task updated successfully.');
    });
});

// Delete a task
app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;

    connection.query('DELETE FROM tasks WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Error deleting task from database:', err);
            res.status(500).json({ error: 'Error deleting task from database.' });
            return;
        }
        res.send('Task deleted successfully.');
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
