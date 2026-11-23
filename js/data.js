var TEAM_KEY = 'cb_team';
var PROJECT_KEY = 'cb_projects';
var TASK_KEY = 'cb_tasks';
var DEFAULT_TEAM = [
  { id: 1, name: 'Yashika Agrawal', role: 'Frontend Developer' },
  { id: 2, name: 'Vishal', role: 'Frontend Developer' },
  { id: 3, name: 'Vivek Prasad', role: 'Frontend Developer' }
];
var DEFAULT_PROJECTS = [
  { id: 1, name: 'CollabHub Website', progress: 65, status: 'active' },
  { id: 2, name: 'Mobile Prototype', progress: 100, status: 'completed' }
];
var DEFAULT_TASKS = [
  { id: 1, title: 'Create dashboard wireframe', priority: 'high', status: 'todo' },
  { id: 2, title: 'Review team page', priority: 'medium', status: 'progress' },
  { id: 3, title: 'Test navigation', priority: 'low', status: 'done' }
];

function getList(key, defaultValue) {
  var stored = localStorage.getItem(key);
  if (!stored) {
    return defaultValue.slice();
  }

  try {
    var value = JSON.parse(stored);
    return Array.isArray(value) ? value : defaultValue.slice();
  } catch (error) {
    return defaultValue.slice();
  }
}

function saveList(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function removeById(list, id) {
  return list.filter(function (item) {
    return item.id !== id;
  });
}

function nextId(list) {
  var maxId = 0;
  for (var i = 0; i < list.length; i++) {
    if (list[i].id > maxId) {
      maxId = list[i].id;
    }
  }
  return maxId + 1;
}

function updateProfileDisplay() {
  var savedName = localStorage.getItem('cb_user_name');
  var savedPicture = localStorage.getItem('cb_user_picture');
  var profileElements = document.querySelectorAll('.navbar__profile');
  for (var i = 0; i < profileElements.length; i++) {
    var el = profileElements[i];
    el.innerHTML = '';
    if (savedPicture) {
      var img = document.createElement('img');
      img.className = 'avatar-img';
      img.src = savedPicture;
      img.alt = '';
      el.appendChild(img);
    }
    var span = document.createElement('span');
    span.className = 'username';
    span.textContent = savedName || 'User';
    el.appendChild(span);
  }
}

updateProfileDisplay();
