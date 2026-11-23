(function () {
  var toggle = document.querySelector('.navbar__toggle');
  var sidebar = document.getElementById('mobile-sidebar');
  var overlay = document.getElementById('sidebar-overlay');

  if (!toggle || !sidebar || !overlay) return;

  function openSidebar() {
    sidebar.classList.add('sidebar--open');
    overlay.classList.add('sidebar__overlay--visible');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.innerHTML = '&times;';
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('sidebar--open');
    overlay.classList.remove('sidebar__overlay--visible');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '&#9776;';
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', function () {
    if (sidebar.classList.contains('sidebar--open')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });

  overlay.addEventListener('click', closeSidebar);
  sidebar.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeSidebar);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && sidebar.classList.contains('sidebar--open')) {
      closeSidebar();
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 900 && sidebar.classList.contains('sidebar--open')) {
      closeSidebar();
    }
  });

  var currentPath = window.location.pathname.split('/').pop() || 'dashboard.html';
  var activeLink = sidebar.querySelector('a[href="' + currentPath + '"]');
  if (activeLink) {
    activeLink.style.background = '#eef2ff';
    activeLink.style.color = '#4f46e5';
    activeLink.style.fontWeight = '600';
  }
})();