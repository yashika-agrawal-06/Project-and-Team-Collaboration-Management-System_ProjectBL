var TASK_KEY = 'cb_tasks';
var PROJECT_KEY = 'cb_projects';
var TEAM_KEY = 'cb_team';
var USER_NAME_KEY = 'cb_user_name';
var USER_PICTURE_KEY = 'cb_user_picture';

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

/**
 * Display text for a project status.
 * @param {string} status - 'active' or 'completed'.
 * @returns {string}
 */
function getStatusLabel(status) {
  return status === 'completed' ? 'Completed' : 'Active';
}

/**
 * CSS modifier class for a project status badge.
 * @param {string} status - 'active' or 'completed'.
 * @returns {string}
 */
function getStatusClass(status) {
  return status === 'completed' ? 'status--completed' : 'status--active';
}

/**
 * Give projects saved before the status feature a status and originalProgress.
 * Runs before page scripts read the project list.
 */
function migrateProjects() {
  var stored = readValue(PROJECT_KEY);
  if (!stored) {
    return;
  }

  try {
    var list = JSON.parse(stored);
    if (!Array.isArray(list)) {
      return;
    }

    var migrated = false;
    for (var i = 0; i < list.length; i++) {
      if (!list[i] || typeof list[i] !== 'object') {
        continue;
      }
      if (!Object.prototype.hasOwnProperty.call(list[i], 'status')) {
        list[i].status = list[i].progress >= 100 ? 'completed' : 'active';
        migrated = true;
      }
      if (!Object.prototype.hasOwnProperty.call(list[i], 'originalProgress')) {
        list[i].originalProgress = list[i].progress;
        migrated = true;
      }
    }

    if (migrated) {
      saveList(PROJECT_KEY, list);
    }
  } catch (error) {
    console.warn('Project migration failed:', error);
  }
}

function renderProfileDisplay() {
  var savedName = readValue(USER_NAME_KEY);
  var savedPicture = readValue(USER_PICTURE_KEY);
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

migrateProjects();
renderProfileDisplay();
