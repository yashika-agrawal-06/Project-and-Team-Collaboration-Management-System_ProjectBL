const toggle = document.querySelector('.navbar__toggle');
const sidebar = document.querySelector('.sidebar');

toggle?.addEventListener('click', () => {
  sidebar?.classList.toggle('sidebar--open');
});