var team = getList(TEAM_KEY, DEFAULT_TEAM);

function createMemberCard(member) {
  var card = document.createElement('article');
  card.className = 'member-card';

  var avatar = document.createElement('div');
  avatar.className = 'avatar';
  avatar.textContent = member.name.charAt(0).toUpperCase();

  var name = document.createElement('h4');
  name.textContent = member.name;

  var role = document.createElement('p');
  role.textContent = member.role;

  var del = document.createElement('button');
  del.className = 'btn-delete';
  del.textContent = 'Remove';
  del.addEventListener('click', function () {
    if (confirm('Remove this member?')) {
      team = removeById(team, member.id);
      saveList(TEAM_KEY, team);
      showTeam();
    }
  });

  card.appendChild(avatar);
  card.appendChild(name);
  card.appendChild(role);
  card.appendChild(del);
  return card;
}

function showTeam() {
  var list = document.getElementById('team-list');
  list.innerHTML = '';
  document.getElementById('team-total').textContent = team.length;

  if (team.length === 0) {
    var message = document.createElement('p');
    message.className = 'empty';
    message.textContent = 'No team members yet.';
    list.appendChild(message);
    return;
  }
  for (var i = 0; i < team.length; i++) {
    list.appendChild(createMemberCard(team[i]));
  }
}

function onFormValid(form) {
  var nameInput = document.getElementById('member-name');
  var roleInput = document.getElementById('member-role');

  team.push({
    id: nextId(team),
    name: nameInput.value.trim(),
    role: roleInput.value.trim()
  });
  saveList(TEAM_KEY, team);

  nameInput.value = '';
  roleInput.value = '';
  showTeam();
}

showTeam();
