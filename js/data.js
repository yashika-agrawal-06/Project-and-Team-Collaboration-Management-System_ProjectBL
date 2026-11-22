var TASK_KEY = 'cb_tasks';
var PROJECT_KEY = 'cb_projects';
var TEAM_KEY = 'cb_team';

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
  { id: 1, name: 'Yashika Agrawal', role: 'Login and Settings' },
  { id: 2, name: 'Vishal', role: 'Dashboard' },
  { id: 3, name: 'Vivek Prasad', role: 'Task Board' }
];

function getList(key, defaults) {
  var saved = localStorage.getItem(key);
  if (saved === null) {
    localStorage.setItem(key, JSON.stringify(defaults));
    return defaults;
  }
  return JSON.parse(saved);
}

function saveList(key, list) {
  localStorage.setItem(key, JSON.stringify(list));
}

function nextId(list) {
  var max = 0;
  for (var i = 0; i < list.length; i++) {
    if (list[i].id > max) {
      max = list[i].id;
    }
  }
  return max + 1;
}

function removeById(list, id) {
  var result = [];
  for (var i = 0; i < list.length; i++) {
    if (list[i].id !== id) {
      result.push(list[i]);
    }
  }
  return result;
}

var savedName = localStorage.getItem('cb_user_name');
var profileBox = document.querySelector('.navbar__profile');
if (savedName && profileBox) {
  profileBox.textContent = savedName;
}