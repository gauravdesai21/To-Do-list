
document.addEventListener('DOMContentLoaded', () => {
  const taskForm = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input');
  const taskPriority = document.getElementById('task-priority');
  const taskList = document.getElementById('task-list');
  const filterButtons = document.querySelectorAll('.filter-btn');

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  const renderTasks = (filter = 'all') => {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
      if (filter === 'completed' && !task.completed) return;
      if (filter === 'incomplete' && task.completed) return;

      const li = document.createElement('li');
      li.className = `task-item ${task.completed ? 'completed' : ''}`;

      const leftDiv = document.createElement('div');
      leftDiv.className = 'task-left';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.completed;
      checkbox.addEventListener('change', () => {
        task.completed = !task.completed;
        saveTasks();
        renderTasks(filter);
      });

      const span = document.createElement('span');
      span.className = 'task-text';
      span.textContent = `${task.text} [${task.priority}]`;

      leftDiv.appendChild(checkbox);
      leftDiv.appendChild(span);

      const actions = document.createElement('div');
      actions.className = 'task-actions';

      const editBtn = document.createElement('button');
      editBtn.className = 'edit-btn';
      editBtn.textContent = 'Edit';
      editBtn.addEventListener('click', () => {
        const newText = prompt('Edit task:', task.text);
        if (newText) {
          task.text = newText.trim();
          saveTasks();
          renderTasks(filter);
        }
      });

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', () => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks(filter);
      });

      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);

      li.appendChild(leftDiv);
      li.appendChild(actions);

      taskList.appendChild(li);
    });
  };

  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (!text) return alert('Please enter a task');
    const priority = taskPriority.value;
    tasks.push({ text, completed: false, priority });
    saveTasks();
    renderTasks();
    taskForm.reset();
  });

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTasks(btn.dataset.filter);
    });
  });

  renderTasks();
});
