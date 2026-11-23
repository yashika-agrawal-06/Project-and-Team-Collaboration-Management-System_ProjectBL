var TEAM_KEY = 'cb_team';
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

var savedName = localStorage.getItem('cb_user_name');
if (savedName) {
  var profileElements = document.querySelectorAll('.navbar__profile');
  for (var i = 0; i < profileElements.length; i++) {
    profileElements[i].textContent = savedName;
  }
}
