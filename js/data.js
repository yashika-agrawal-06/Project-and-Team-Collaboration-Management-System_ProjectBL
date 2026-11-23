var TASK_KEY = 'cb_tasks';
var PROJECT_KEY = 'cb_projects';
var TEAM_KEY = 'cb_team';
var PROJECT_KEY = 'cb_projects';
var TASK_KEY = 'cb_tasks';

var DEFAULT_TASKS = [
  { id: 1, title: 'Design login page', priority: 'high', status: 'todo', dueDate: null, assigneeId: 1 },
  { id: 2, title: 'Set up repo structure', priority: 'medium', status: 'todo', dueDate: null, assigneeId: 3 },
  { id: 3, title: 'Build dashboard grid', priority: 'medium', status: 'progress', dueDate: null, assigneeId: 2 },
  { id: 4, title: 'Project synopsis', priority: 'low', status: 'done', dueDate: null, assigneeId: null }
];

var DEFAULT_PROJECTS = [
  { id: 1, name: 'Collaboration Portal UI', progress: 65, originalProgress: 65, status: 'active' },
  { id: 2, name: 'Documentation', progress: 30, originalProgress: 30, status: 'active' }
];

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

/**
 * Read a plain string from localStorage.
 * @param {string} key - Storage key.
 * @returns {string|null} The stored value, or null if missing or storage is unavailable.
 */
function readValue(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.warn('Could not read ' + key + ' from localStorage:', error);
    return null;
  }
}

/**
 * Write a plain string to localStorage.
 * @param {string} key - Storage key.
 * @param {string} value - Value to store.
 * @returns {boolean} True if the value was saved.
 */
function saveValue(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn('Could not save ' + key + ' to localStorage:', error);
    return false;
  }
}

/**
 * Load an array from localStorage, falling back to a copy of the defaults.
 * @param {string} key - Storage key.
 * @param {Array} defaultValue - Used when nothing valid is stored.
 * @returns {Array} The stored list or a copy of defaultValue.
 */
function getList(key, defaultValue) {
  var stored = readValue(key);
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

/**
 * Save an array to localStorage as JSON.
 * @param {string} key - Storage key.
 * @param {Array} value - List to store.
 * @returns {boolean} True if the list was saved.
 */
function saveList(key, value) {
  return saveValue(key, JSON.stringify(value));
}

/**
 * Return a new list without the item that has the given id.
 * @param {Array<{id: number}>} list
 * @param {number} id
 * @returns {Array}
 */
function removeById(list, id) {
  return list.filter(function (item) {
    return item.id !== id;
  });
}

/**
 * Find the item with the given id.
 * @param {Array<{id: number}>} list
 * @param {number} id
 * @returns {Object|null}
 */
function findById(list, id) {
  for (var i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      return list[i];
    }
  }
  return null;
}

/**
 * Next free id for a list (highest id + 1).
 * @param {Array<{id: number}>} list
 * @returns {number}
 */
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
