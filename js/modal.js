document.addEventListener('click', (e) => {
  const openBtn = e.target.closest('[data-modal-open]');
  if (openBtn) {
    document.getElementById(openBtn.dataset.modalOpen)?.classList.add('modal--open');
    return;
  }
  if (e.target.closest('[data-modal-close]') || e.target.classList.contains('modal')) {
    e.target.closest('.modal')?.classList.remove('modal--open');
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal--open').forEach((m) => m.classList.remove('modal--open'));
  }
});