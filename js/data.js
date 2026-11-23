var TASK_KEY = 'cb_tasks';
var PROJECT_KEY = 'cb_projects';
var TEAM_KEY = 'cb_team';
var USER_NAME_KEY = 'cb_user_name';
var USER_PICTURE_KEY = 'cb_user_picture';

var DEFAULT_TASKS = [
  { id: 1, title: 'Design login page', priority: 'high', status: 'todo' },
  { id: 2, title: 'Set up repo structure', priority: 'medium', status: 'todo' },
  { id: 3, title: 'Build dashboard grid', priority: 'medium', status: 'progress' },
  { id: 4, title: 'Project synopsis', priority: 'low', status: 'done' }
];

var DEFAULT_PROJECTS = [
  { id: 1, name: 'Collaboration Portal UI', progress: 65 },
  { id: 2, name: 'Documentation', progress: 30 }
];

var DEFAULT_TEAM = [
  { id: 1, name: 'Yashika Agrawal', role: 'Frontend Developer' },
  { id: 2, name: 'Vishal', role: 'Frontend Developer' },
  { id: 3, name: 'Vivek Prasad', role: 'Frontend Developer' }
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

function renderProfileDisplay() {
  var savedName = localStorage.getItem(USER_NAME_KEY);
  var savedPicture = localStorage.getItem(USER_PICTURE_KEY);
  var profileElements = document.querySelectorAll('.navbar__profile');

  for (var i = 0; i < profileElements.length; i++) {
    var profile = profileElements[i];
    profile.textContent = savedName || 'Yashika';

    if (savedPicture && /^https:\/\//i.test(savedPicture)) {
      var avatar = document.createElement('img');
      avatar.className = 'avatar-img';
      avatar.src = savedPicture;
      avatar.alt = '';
      avatar.setAttribute('aria-hidden', 'true');
      profile.insertBefore(avatar, profile.firstChild);
    }
  }
}

renderProfileDisplay();
