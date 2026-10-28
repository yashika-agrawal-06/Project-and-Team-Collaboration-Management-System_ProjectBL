const projectForm = document.getElementById('project-form');
const projectList = document.getElementById('project-list');
const projectCount = document.getElementById('project-count');

projectForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('project-name');
  const progress = document.getElementById('project-progress');
  const error = document.getElementById('project-error');

  if (!name.value.trim()) {
    error.textContent = 'Project name is required';
    return;
  }
  error.textContent = '';

  const pct = Math.min(100, Math.max(0, Number(progress.value) || 0));

  const card = document.createElement('article');
  card.className = 'project-card';

  const title = document.createElement('h4');
  title.textContent = name.value.trim();

  const track = document.createElement('div');
  track.className = 'progress';
  const bar = document.createElement('div');
  bar.className = 'progress__bar';
  bar.style.width = pct + '%';
  track.appendChild(bar);

  const label = document.createElement('small');
  label.textContent = pct + '% complete';

  card.append(title, track, label);
  projectList.appendChild(card);

  projectCount.textContent = projectList.children.length;
  projectForm.reset();
  document.getElementById('project-modal').classList.remove('modal--open');
});