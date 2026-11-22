var tasks = getList(TASK_KEY, DEFAULT_TASKS);
var draggedId = null;

function createCard(task) {
  var card = document.createElement('article');
  card.className = 'kanban__card';
  card.draggable = true;

  var title = document.createElement('span');
  title.className = 'card-title';
  title.textContent = task.title;

  var tag = document.createElement('span');
  tag.className = 'tag tag--' + task.priority;
  tag.textContent = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);

  var del = document.createElement('button');
  del.className = 'btn-delete';
  del.textContent = 'Delete';
  del.addEventListener('click', function () {
    if (confirm('Delete this task?')) {
      tasks = removeById(tasks, task.id);
      saveList(TASK_KEY, tasks);
      showTasks();
    }
  });

  card.addEventListener('dragstart', function () {
    draggedId = task.id;
    card.classList.add('kanban__card--dragging');
  });
  card.addEventListener('dragend', function () {
    card.classList.remove('kanban__card--dragging');
  });

  card.appendChild(title);
  card.appendChild(tag);
  card.appendChild(del);
  return card;
}

function showTasks() {
  var text = document.getElementById('task-filter').value.toLowerCase();
  var priority = document.getElementById('priority-filter').value;
  var columns = document.querySelectorAll('.kanban__column');

  for (var i = 0; i < columns.length; i++) {
    var status = columns[i].getAttribute('data-status');
    var list = columns[i].querySelector('.kanban__list');
    list.innerHTML = '';
    var count = 0;

    for (var j = 0; j < tasks.length; j++) {
      var task = tasks[j];
      var textMatch = task.title.toLowerCase().indexOf(text) !== -1;
      var priorityMatch = priority === 'all' || task.priority === priority;
      if (task.status === status && textMatch && priorityMatch) {
        list.appendChild(createCard(task));
        count++;
      }
    }
    columns[i].querySelector('.kanban__count').textContent = count;
  }
}

function setupColumn(column) {
  column.addEventListener('dragover', function (event) {
    event.preventDefault();
    column.classList.add('kanban__column--over');
  });

  column.addEventListener('dragleave', function () {
    column.classList.remove('kanban__column--over');
  });

  column.addEventListener('drop', function (event) {
    event.preventDefault();
    column.classList.remove('kanban__column--over');
    var status = column.getAttribute('data-status');
    for (var k = 0; k < tasks.length; k++) {
      if (tasks[k].id === draggedId) {
        tasks[k].status = status;
      }
    }
    saveList(TASK_KEY, tasks);
    showTasks();
  });
}

var allColumns = document.querySelectorAll('.kanban__column');
for (var c = 0; c < allColumns.length; c++) {
  setupColumn(allColumns[c]);
}

document.getElementById('task-form').addEventListener('submit', function (event) {
  event.preventDefault();
  var input = document.getElementById('task-title');
  var error = document.getElementById('task-error');
  var title = input.value.trim();

  if (title === '') {
    error.textContent = 'Task title is required';
    return;
  }
  error.textContent = '';

  tasks.push({
    id: nextId(tasks),
    title: title,
    priority: document.getElementById('task-priority').value,
    status: 'todo'
  });
  saveList(TASK_KEY, tasks);

  input.value = '';
  document.getElementById('new-task-modal').classList.remove('modal--open');
  showTasks();
});

document.getElementById('clear-done').addEventListener('click', function () {
  if (confirm('Remove all completed tasks?')) {
    var remaining = [];
    for (var i = 0; i < tasks.length; i++) {
      if (tasks[i].status !== 'done') {
        remaining.push(tasks[i]);
      }
    }
    tasks = remaining;
    saveList(TASK_KEY, tasks);
    showTasks();
  }
});

document.getElementById('task-filter').addEventListener('input', showTasks);
document.getElementById('priority-filter').addEventListener('change', showTasks);

showTasks();
