var projects = getList(PROJECT_KEY, DEFAULT_PROJECTS);
var tasks = getList(TASK_KEY, DEFAULT_TASKS);
var team = getList(TEAM_KEY, DEFAULT_TEAM);
var statusNames = { todo: 'To-Do', progress: 'In Progress', done: 'Completed' };

function showStats() {
  var pending = 0;
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].status !== 'done') {
      pending++;
    }
  }
  document.getElementById('project-count').textContent = projects.length;
  document.getElementById('pending-count').textContent = pending;
  document.getElementById('team-count').textContent = team.length;
}

function createProjectCard(project) {
  var card = document.createElement('article');
  card.className = 'project-card';

  var top = document.createElement('div');
  top.className = 'project-card__top';

  var title = document.createElement('h4');
  title.textContent = project.name;

  var del = document.createElement('button');
  del.className = 'btn-delete';
  del.textContent = 'Delete';
  del.addEventListener('click', function () {
    if (confirm('Delete this project?')) {
      projects = removeById(projects, project.id);
      saveList(PROJECT_KEY, projects);
      showProjects();
      showStats();
    }
  });

  top.appendChild(title);
  top.appendChild(del);

  var track = document.createElement('div');
  track.className = 'progress';
  var bar = document.createElement('div');
  bar.className = 'progress__bar';
  bar.style.width = project.progress + '%';
  track.appendChild(bar);

  var label = document.createElement('small');
  label.textContent = project.progress + '% complete';

  card.appendChild(top);
  card.appendChild(track);
  card.appendChild(label);
  return card;
}

function showProjects() {
  var list = document.getElementById('project-list');
  list.innerHTML = '';
  if (projects.length === 0) {
    var message = document.createElement('p');
    message.className = 'empty';
    message.textContent = 'No projects yet. Click + New Project.';
    list.appendChild(message);
    return;
  }
  for (var i = 0; i < projects.length; i++) {
    list.appendChild(createProjectCard(projects[i]));
  }
}

function createTaskItem(task) {
  var item = document.createElement('li');
  var button = document.createElement('button');
  button.className = 'task-list__item';
  button.setAttribute('data-modal-open', 'task-modal');
  button.textContent = task.title;

  var status = document.createElement('span');
  status.className = 'task-list__status';
  status.textContent = statusNames[task.status];
  button.appendChild(status);

  button.addEventListener('click', function () {
    document.getElementById('detail-title').textContent = task.title;
    document.getElementById('detail-status').textContent = statusNames[task.status];
    document.getElementById('detail-priority').textContent = task.priority;
  });

  item.appendChild(button);
  return item;
}

function showRecentTasks() {
  var list = document.getElementById('recent-tasks');
  list.innerHTML = '';
  var shown = 0;
  for (var i = tasks.length - 1; i >= 0 && shown < 3; i--) {
    list.appendChild(createTaskItem(tasks[i]));
    shown++;
  }
  if (shown === 0) {
    var message = document.createElement('li');
    message.className = 'empty';
    message.textContent = 'No tasks yet. Add some on the Task Board.';
    list.appendChild(message);
  }
}

document.getElementById('project-form').addEventListener('submit', function (event) {
  event.preventDefault();
  var nameInput = document.getElementById('project-name');
  var progressInput = document.getElementById('project-progress');
  var error = document.getElementById('project-error');
  var name = nameInput.value.trim();

  if (name === '') {
    error.textContent = 'Project name is required';
    return;
  }
  error.textContent = '';

  var progress = Number(progressInput.value);
  if (isNaN(progress) || progress < 0) {
    progress = 0;
  }
  if (progress > 100) {
    progress = 100;
  }

  projects.push({ id: nextId(projects), name: name, progress: progress });
  saveList(PROJECT_KEY, projects);

  nameInput.value = '';
  progressInput.value = 0;
  document.getElementById('project-modal').classList.remove('modal--open');
  showProjects();
  showStats();
});

showStats();
showProjects();
showRecentTasks();