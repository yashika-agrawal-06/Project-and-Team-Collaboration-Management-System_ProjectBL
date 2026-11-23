var tasks = getList(TASK_KEY, DEFAULT_TASKS);
var team = getList(TEAM_KEY, DEFAULT_TEAM);
var STATUS_ORDER = ['todo', 'progress', 'done'];
var draggedId = null;
var editingId = null;

/**
 * Name of the team member with the given id.
 * @param {number|null} id
 * @returns {string} The member's name, or '' if unassigned or not found.
 */
function getMemberName(id) {
  var member = id === null || id === undefined ? null : findById(team, id);
  return member ? member.name : '';
}

/**
 * Format a YYYY-MM-DD date as e.g. "25 Nov".
 * @param {string} dateText
 * @returns {string}
 */
function formatDueDate(dateText) {
  var parts = dateText.split('-');
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return Number(parts[2]) + ' ' + months[Number(parts[1]) - 1];
}

/**
 * Today's date as YYYY-MM-DD in local time.
 * @returns {string}
 */
function todayText() {
  var now = new Date();
  var month = String(now.getMonth() + 1).padStart(2, '0');
  var day = String(now.getDate()).padStart(2, '0');
  return now.getFullYear() + '-' + month + '-' + day;
}

/**
 * Fill a <select> with the team members.
 * @param {HTMLSelectElement} select
 * @param {Array<{value: string, text: string}>} firstOptions - Options placed before the members.
 */
function fillMemberSelect(select, firstOptions) {
  var current = select.value;
  select.innerHTML = '';
  var options = firstOptions.slice();
  for (var i = 0; i < team.length; i++) {
    options.push({ value: String(team[i].id), text: team[i].name });
  }
  for (var j = 0; j < options.length; j++) {
    var option = document.createElement('option');
    option.value = options[j].value;
    option.textContent = options[j].text;
    select.appendChild(option);
  }
  if (current && select.querySelector('option[value="' + current + '"]')) {
    select.value = current;
  }
}

/**
 * Save the task list and redraw the board.
 */
function saveAndShow() {
  saveList(TASK_KEY, tasks);
  showTasks();
}

/**
 * Ask, then delete one task.
 * @param {number} id
 */
function deleteTask(id) {
  if (confirm('Delete this task?')) {
    tasks = removeById(tasks, id);
    saveAndShow();
  }
}

/**
 * Move a task one column left (-1) or right (+1).
 * @param {number} id
 * @param {number} step
 */
function moveTask(id, step) {
  var task = findById(tasks, id);
  if (!task) {
    return;
  }
  var index = STATUS_ORDER.indexOf(task.status) + step;
  if (index < 0 || index >= STATUS_ORDER.length) {
    return;
  }
  task.status = STATUS_ORDER[index];
  saveAndShow();
  focusCard(id);
}

/**
 * Build the card for one task.
 * @param {{id: number, title: string, priority: string, status: string, dueDate: ?string, assigneeId: ?number}} task
 * @returns {HTMLElement}
 */
function createCard(task) {
  var card = document.createElement('article');
  card.className = 'kanban__card';
  card.draggable = true;
  card.tabIndex = 0;
  card.dataset.taskId = task.id;
  card.title = 'Double-click or press Enter to edit';

  var title = document.createElement('span');
  title.className = 'card-title';
  title.textContent = task.title;

  var tag = document.createElement('span');
  tag.className = 'tag tag--' + task.priority;
  tag.textContent = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);

  var del = document.createElement('button');
  del.className = 'btn-delete';
  del.textContent = 'Delete';
  del.addEventListener('click', function (event) {
    event.stopPropagation();
    deleteTask(task.id);
  });

  card.appendChild(title);
  card.appendChild(tag);
  card.appendChild(del);

  var assignee = getMemberName(task.assigneeId);
  if (task.dueDate || assignee) {
    var meta = document.createElement('div');
    meta.className = 'card-meta';
    if (task.dueDate) {
      var due = document.createElement('span');
      due.className = 'card-due';
      if (task.status !== 'done' && task.dueDate < todayText()) {
        due.className += ' card-due--overdue';
      }
      due.textContent = 'Due ' + formatDueDate(task.dueDate);
      meta.appendChild(due);
    }
    if (assignee) {
      var person = document.createElement('span');
      person.className = 'card-assignee';
      person.textContent = assignee;
      meta.appendChild(person);
    }
    card.appendChild(meta);
  }

  card.addEventListener('dragstart', function () {
    draggedId = task.id;
    card.classList.add('kanban__card--dragging');
  });
  card.addEventListener('dragend', function () {
    card.classList.remove('kanban__card--dragging');
  });
  card.addEventListener('dblclick', function () {
    openTaskModal(task);
  });
  card.addEventListener('keydown', function (event) {
    handleCardKey(event, task);
  });

  return card;
}

/**
 * Redraw all three columns using the text, priority and assignee filters.
 */
function showTasks() {
  var text = document.getElementById('task-filter').value.toLowerCase();
  var priority = document.getElementById('priority-filter').value;
  var assignee = document.getElementById('assignee-filter').value;
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
      var assigneeMatch = assignee === 'all' ||
        (assignee === 'none' && !getMemberName(task.assigneeId)) ||
        String(task.assigneeId) === assignee;
      if (task.status === status && textMatch && priorityMatch && assigneeMatch) {
        list.appendChild(createCard(task));
        count++;
      }
    }
    columns[i].querySelector('.kanban__count').textContent = count;
  }
}

/**
 * Put keyboard focus on a task's card, if it is shown.
 * @param {number} id
 */
function focusCard(id) {
  var card = document.querySelector('.kanban__card[data-task-id="' + id + '"]');
  if (card) {
    card.focus();
  }
}

/**
 * Keyboard controls on a focused card:
 * Arrow Up/Down - previous/next card in the column; Arrow Left/Right - same position in the next column;
 * Shift + Arrow Left/Right - move the task to the next column; Enter - edit; Delete - delete.
 * @param {KeyboardEvent} event
 * @param {Object} task
 */
function handleCardKey(event, task) {
  var card = event.currentTarget;
  var column = card.closest('.kanban__column');
  var cards = Array.prototype.slice.call(column.querySelectorAll('.kanban__card'));
  var index = cards.indexOf(card);

  if (event.key === 'Enter') {
    event.preventDefault();
    openTaskModal(task);
  } else if (event.key === 'Delete') {
    event.preventDefault();
    deleteTask(task.id);
  } else if (event.key === 'ArrowDown' && index < cards.length - 1) {
    event.preventDefault();
    cards[index + 1].focus();
  } else if (event.key === 'ArrowUp' && index > 0) {
    event.preventDefault();
    cards[index - 1].focus();
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    var step = event.key === 'ArrowRight' ? 1 : -1;
    if (event.shiftKey) {
      moveTask(task.id, step);
      return;
    }
    var columns = Array.prototype.slice.call(document.querySelectorAll('.kanban__column'));
    var next = columns[columns.indexOf(column) + step];
    if (!next) {
      return;
    }
    var nextCards = next.querySelectorAll('.kanban__card');
    if (nextCards.length > 0) {
      nextCards[Math.min(index, nextCards.length - 1)].focus();
    }
  }
}

/**
 * Open the task modal. With a task it edits that task; without one it adds a new task.
 * @param {Object} [task]
 */
function openTaskModal(task) {
  editingId = task ? task.id : null;
  document.getElementById('task-modal-title').textContent = task ? 'Edit Task' : 'New Task';
  document.getElementById('task-submit').textContent = task ? 'Save Changes' : 'Add Task';
  document.getElementById('task-title').value = task ? task.title : '';
  document.getElementById('task-priority').value = task ? task.priority : 'medium';
  document.getElementById('task-due').value = task && task.dueDate ? task.dueDate : '';
  var assigneeSelect = document.getElementById('task-assignee');
  assigneeSelect.value = task && getMemberName(task.assigneeId) ? String(task.assigneeId) : '';
  document.getElementById('task-error').textContent = '';
  document.getElementById('new-task-modal').classList.add('modal--open');
  document.getElementById('task-title').focus();
}

/**
 * Drag-and-drop handlers for one column.
 * @param {HTMLElement} column
 */
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
    var task = findById(tasks, draggedId);
    if (task) {
      task.status = column.getAttribute('data-status');
      saveAndShow();
    }
  });
}

var allColumns = document.querySelectorAll('.kanban__column');
for (var c = 0; c < allColumns.length; c++) {
  setupColumn(allColumns[c]);
}

fillMemberSelect(document.getElementById('task-assignee'), [{ value: '', text: 'Unassigned' }]);
fillMemberSelect(document.getElementById('assignee-filter'), [
  { value: 'all', text: 'All assignees' },
  { value: 'none', text: 'Unassigned' }
]);

// "+ New Task" opens the modal through modal.js; reset it to add mode first.
document.querySelector('[data-modal-open="new-task-modal"]').addEventListener('click', function () {
  openTaskModal();
});

document.getElementById('task-form').addEventListener('submit', function (event) {
  event.preventDefault();
  var input = document.getElementById('task-title');
  var error = document.getElementById('task-error');
  var title = input.value.trim();

  if (title === '') {
    error.textContent = 'Task title is required';
    input.focus();
    return;
  }
  error.textContent = '';

  var assigneeValue = document.getElementById('task-assignee').value;
  var fields = {
    title: title,
    priority: document.getElementById('task-priority').value,
    dueDate: document.getElementById('task-due').value || null,
    assigneeId: assigneeValue ? Number(assigneeValue) : null
  };

  var savedId = editingId;
  var task = editingId !== null ? findById(tasks, editingId) : null;
  if (task) {
    task.title = fields.title;
    task.priority = fields.priority;
    task.dueDate = fields.dueDate;
    task.assigneeId = fields.assigneeId;
  } else {
    fields.id = nextId(tasks);
    fields.status = 'todo';
    tasks.push(fields);
    savedId = fields.id;
  }

  editingId = null;
  document.getElementById('new-task-modal').classList.remove('modal--open');
  saveAndShow();
  focusCard(savedId);
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
    saveAndShow();
  }
});

document.getElementById('task-filter').addEventListener('input', showTasks);
document.getElementById('priority-filter').addEventListener('change', showTasks);
document.getElementById('assignee-filter').addEventListener('change', showTasks);

showTasks();
