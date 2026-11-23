var GOOGLE_CLIENT_ID = '758440353691-13361njuk9brrg14e1l9udtbdrosjik5.apps.googleusercontent.com';
var googleIdentityServicesPromise;

function isGoogleClientIdConfigured() {
  return /^[0-9]+-[A-Za-z0-9_-]+\.apps\.googleusercontent\.com$/.test(GOOGLE_CLIENT_ID);
}

function loadGoogleIdentityServices() {
  if (googleIdentityServicesPromise) {
    return googleIdentityServicesPromise;
  }

  googleIdentityServicesPromise = new Promise(function (resolve, reject) {
    var script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = function () {
      reject(new Error('Google Identity Services could not be loaded.'));
    };
    document.head.appendChild(script);
  });

  return googleIdentityServicesPromise;
}

function setGoogleSignInMessage(message) {
  var status = document.getElementById('google-signin-message');
  if (status) {
    status.textContent = message;
  }
}

function initGoogleSignIn() {
  var button = document.getElementById('google-signin-btn');
  if (!button) {
    return;
  }

  if (!isGoogleClientIdConfigured()) {
    setGoogleSignInMessage('Google Sign-In is not configured. Add your OAuth Client ID in js/auth.js.');
    return;
  }

  loadGoogleIdentityServices().then(function () {
    if (!window.google || !window.google.accounts || !window.google.accounts.id) {
      throw new Error('Google Identity Services did not initialize.');
    }

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: true
    });

    window.google.accounts.id.renderButton(button, {
      theme: 'outline',
      size: 'large',
      width: Math.min(button.clientWidth, 400),
      text: 'continue_with',
      shape: 'rectangular',
      logo_alignment: 'center'
    });

    window.google.accounts.id.prompt();
  }).catch(function (error) {
    console.error('Google Sign-In initialization failed:', error);
    setGoogleSignInMessage('Google Sign-In is temporarily unavailable. Please use email and password.');
  });
}

function handleCredentialResponse(response) {
  if (!response || !response.credential) {
    setGoogleSignInMessage('Google Sign-In did not return a credential. Please try again.');
    return;
  }

  var profile = parseGoogleCredential(response.credential);
  if (!profile || !profile.email) {
    setGoogleSignInMessage('Could not read your Google profile. Please try again.');
    return;
  }

  localStorage.setItem('cb_user_name', profile.name || profile.given_name || 'User');
  localStorage.setItem('cb_user_email', profile.email);
  localStorage.setItem('cb_user_picture', profile.picture || '');

  if (typeof renderProfileDisplay === 'function') {
    renderProfileDisplay();
  }

  window.location.href = 'dashboard.html';
}

function parseGoogleCredential(token) {
  try {
    var base64Url = token.split('.')[1];
    if (!base64Url) {
      return null;
    }

    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (character) {
      return '%' + ('00' + character.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Could not parse the Google credential:', error);
    return null;
  }
}

function signOutGoogle() {
  if (window.google && window.google.accounts && window.google.accounts.id) {
    window.google.accounts.id.disableAutoSelect();
  }

  localStorage.removeItem('cb_user_name');
  localStorage.removeItem('cb_user_email');
  localStorage.removeItem('cb_user_picture');
  window.location.href = 'index.html';
}

function setupSignOutControls() {
  var controls = document.querySelectorAll('[data-google-signout]');
  for (var i = 0; i < controls.length; i++) {
    controls[i].addEventListener('click', function (event) {
      event.preventDefault();
      signOutGoogle();
    });
  }
}

function initializeAuthPage() {
  setupSignOutControls();
  initGoogleSignIn();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAuthPage);
} else {
  initializeAuthPage();
}
