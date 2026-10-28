let dragged = null;

function bindCard(card) {
  card.draggable = true;
  card.addEventListener('dragstart', () => {
    dragged = card;
    card.classList.add('kanban__card--dragging');
  });
  card.addEventListener('dragend', () => {
    card.classList.remove('kanban__card--dragging');
    updateCounts();
  });
}

function updateCounts() {
  document.querySelectorAll('.kanban__column').forEach((col) => {
    col.querySelector('.kanban__count').textContent = col.querySelectorAll('.kanban__card').length;
  });
}

document.querySelectorAll('.kanban__card').forEach(bindCard);

document.querySelectorAll('.kanban__column').forEach((col) => {
  col.addEventListener('dragover', (e) => {
    e.preventDefault();
    col.classList.add('kanban__column--over');
  });
  col.addEventListener('dragleave', () => col.classList.remove('kanban__column--over'));
  col.addEventListener('drop', (e) => {
    e.preventDefault();
    col.classList.remove('kanban__column--over');
    if (dragged) col.appendChild(dragged);
    updateCounts();
  });
});

document.getElementById('task-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.getElementById('task-title');
  const title = input.value.trim();
  if (!title) {
    document.getElementById('task-error').textContent = 'Task title is required';
    return;
  }
  document.getElementById('task-error').textContent = '';
  const card = document.createElement('article');
  card.className = 'kanban__card';
  card.textContent = title;
  bindCard(card);
  document.querySelector('[data-status="todo"]').appendChild(card);
  input.value = '';
  document.getElementById('new-task-modal').classList.remove('modal--open');
  updateCounts();
});

document.getElementById('task-filter')?.addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase();
  document.querySelectorAll('.kanban__card').forEach((c) => {
    c.style.display = c.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
});

updateCounts();
