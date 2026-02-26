const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const userStatus = document.getElementById('user-status');
const adminOptions = document.getElementById('admin-options');

function toggleForms(view) {
    if (view === 'signup') {
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
    } else {
        signupForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    }
}

async function handleLogin() {
    const user = document.getElementById('login-user').value;
    const pass = document.getElementById('login-pass').value;
    
    const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass })
    });

    const data = await res.json();
    if (res.ok) {
        setLoggedIn(data.username);
    } else {
        alert(data.error);
    }
}

async function handleSignup() {
    const user = document.getElementById('signup-user').value;
    const pass = document.getElementById('signup-pass').value;
    
    const res = await fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass })
    });

    if (res.ok) {
        alert('Signup successful! Please log in.');
        toggleForms('login');
    } else {
        const data = await res.json();
        alert(data.error || 'Signup failed');
    }
}

function setLoggedIn(username) {
    loginForm.classList.add('hidden');
    signupForm.classList.add('hidden');
    userStatus.classList.remove('hidden');
    document.getElementById('username-display').innerText = username;
    
    // Enable the admin options
    adminOptions.classList.remove('disabled-area');
}

function handleLogout() {
    userStatus.classList.add('hidden');
    loginForm.classList.remove('hidden');
    
    // Disable the admin options
    adminOptions.classList.add('disabled-area');
}