const form = document.getElementById('form');
const taskInput = document.getElementById('taskInput');
const tasksList = document.getElementById('tasksList');
const emptyList = document.getElementById('emptyList');

let tasks = [];

if (localStorage.getItem('tasks')) {
	tasks = JSON.parse(localStorage.getItem('tasks'));
	tasks.forEach((task) => renderTask(task));
}

checkEmptyList();

// Add new task
form.addEventListener('submit', addTask);

// Remove task
tasksList.addEventListener('click', removeTask);

// Select task
tasksList.addEventListener('click', doneTask);

function addTask(e) {
	e.preventDefault();

	const taskText = taskInput.value;

	// Object of task
	const newTask = {
		id: Date.now(),
		text: taskText,
		done: false,
	};

	tasks.push(newTask);
	saveToLocalStorage();

	//Render new task
	renderTask(newTask);

	taskInput.value = '';
	taskInput.focus();

	checkEmptyList();
}

function removeTask(e) {
	if (e.target.dataset.action !== 'delete') return;
	else {
		const parentNode = e.target.closest('.list-group-item');

		// Find id of task
		const id = Number(parentNode.id);
		const elementIndex = tasks.findIndex((task) => task.id === id);

		// Remove task from array
		tasks.splice(elementIndex, 1);

		saveToLocalStorage();

		parentNode.remove();
		checkEmptyList();
	}
}

function doneTask(e) {
	if (e.target.dataset.action !== 'done') return;

	const parentNode = e.target.closest('.list-group-item');

	// Find id of task
	const id = Number(parentNode.id);
	const task = tasks.find((task) => task.id === id);
	task.done = !task.done;

	saveToLocalStorage();

	const taskTitle = parentNode.querySelector('.task-title');

	taskTitle.classList.toggle('task-title--done');
}

function checkEmptyList() {
	if (tasks.length === 0) {
		const emptyListHTML = `
              <li id="emptyList" class="list-group-item empty-list">
              <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
              <div class="empty-list__title">List is empty</div>
            </li>
  `;
		tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
	}

	if (tasks.length > 0) {
		const emptyListElement = document.querySelector('.empty-list');
		emptyListElement ? emptyListElement.remove() : null;
	}
}

function saveToLocalStorage() {
	localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
	// Toggle class to mark done task
	const spanClass = task.done ? 'task title task-title--done' : 'task-title';

	const taskHTML = `
  <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
					<span class="${spanClass}">${task.text}</span>
					<div class="task-item__buttons">
						<button type="button" data-action="done" class="btn-action">
							<img src="./img/tick.svg" alt="Done" width="18" height="18">
						</button>
						<button type="button" data-action="delete" class="btn-action">
							<img src="./img/cross.svg" alt="Done" width="18" height="18">
						</button>
					</div>
				</li>
        `;

	tasksList.insertAdjacentHTML('beforeend', taskHTML);
}
