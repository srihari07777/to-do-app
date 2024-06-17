// frontend/script.js

document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');

    // Fetch tasks from server on page load
    fetchTasks();

    addTaskBtn.addEventListener('click', addTask);

    function fetchTasks() {
        fetch('/api/tasks')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch tasks');
                }
                return response.json();
            })
            .then(tasks => {
                displayTasks(tasks);
            })
            .catch(error => console.error('Error fetching tasks:', error));
    }

    function displayTasks(tasks) {
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const taskItem = createTaskElement(task);
            taskList.appendChild(taskItem);
        });
    }

    function createTaskElement(task) {
        const li = document.createElement('li');
        li.textContent = task.task;

        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('actions');

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => editTask(task.id));
        actionsDiv.appendChild(editBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
        actionsDiv.appendChild(deleteBtn);

        li.appendChild(actionsDiv);
        return li;
    }

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ task: taskText }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to add task');
                }
                return response.text();
            })
            .then(message => {
                console.log(message);
                taskInput.value = '';
                fetchTasks();
            })
            .catch(error => console.error('Error adding task:', error));
        }
    }

    function editTask(taskId) {
        const newTaskText = prompt('Enter new task text:');
        if (newTaskText !== null) {
            fetch(`/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ task: newTaskText }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error updating task');
                }
                return response.text();
            })
            .then(message => {
                console.log(message);
                fetchTasks();
            })
            .catch(error => console.error('Error updating task:', error));
        }
    }

    function deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            fetch(`/api/tasks/${taskId}`, {
                method: 'DELETE',
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error deleting task');
                }
                return response.text();
            })
            .then(message => {
                console.log(message);
                fetchTasks();
            })
            .catch(error => console.error('Error deleting task:', error));
        }
    }
});
