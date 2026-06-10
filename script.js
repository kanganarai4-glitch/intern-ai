function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = 'toast show ' + type;
    setTimeout(() => { toast.className = 'toast'; }, 3200);
}

function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const icon = btn.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text';
        if (icon) { icon.classList.remove('fa-eye'); icon.classList.add('fa-eye-slash'); }
    } else {
        input.type = 'password';
        if (icon) { icon.classList.remove('fa-eye-slash'); icon.classList.add('fa-eye'); }
    }
}


function showRegister() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}

function showLogin() {
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
}


function registerUser() {
    const name     = document.getElementById('regName').value.trim();
    const email    = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirm  = document.getElementById('regConfirm').value;

    if (!name || !email || !password || !confirm) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    if (password.length < 8) {
        showToast('Password must be at least 8 characters', 'error');
        return;
    }
    if (password !== confirm) {
        showToast('Passwords do not match', 'error');
        return;
    }
    if (localStorage.getItem('user_' + email)) {
        showToast('Email already registered. Please sign in.', 'error');
        return;
    }

    localStorage.setItem('user_' + email, JSON.stringify({ name, email, password }));
    showToast('Account created! Please sign in.');
    setTimeout(() => showLogin(), 1200);
}

function loginUser() {
    const email    = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        showToast('Please enter your email and password', 'error');
        return;
    }

    const stored = localStorage.getItem('user_' + email);
    if (!stored) {
        showToast('No account found. Please register first.', 'error');
        return;
    }

    const user = JSON.parse(stored);
    if (user.password !== password) {
        showToast('Incorrect password. Please try again.', 'error');
        return;
    }

    localStorage.setItem('loggedInUser', JSON.stringify({ name: user.name, email: user.email }));
    showToast('Login successful! Redirecting...');
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 1000);
}


function demoLogin() {
    localStorage.setItem('loggedInUser', JSON.stringify({ name: 'Kangana Rai', email: 'demo@internai.com' }));
    showToast('Demo login successful! Redirecting...');
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 900);
}


function logoutUser() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('loggedInUser');
        window.location.href = 'index.html';
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const appMain = document.getElementById('appMain');
    if (!sidebar) return;

    if (window.innerWidth <= 768) {
        sidebar.classList.toggle('mobile-open');
        return;
    }

    sidebar.classList.toggle('collapsed');
    if (appMain) appMain.classList.toggle('expanded');
}


document.addEventListener('click', function(e) {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar || window.innerWidth > 768) return;
    const menuBtn = document.querySelector('.mobile-menu-btn');
    if (!sidebar.contains(e.target) && (!menuBtn || !menuBtn.contains(e.target))) {
        sidebar.classList.remove('mobile-open');
    }
});


function initDashboard() {
    const stored = localStorage.getItem('loggedInUser');
    if (!stored) {
        window.location.href = 'index.html';
        return;
    }

    const user      = JSON.parse(stored);
    const firstName = user.name.split(' ')[0];
    const initial   = user.name.charAt(0).toUpperCase();

    const greetName  = document.getElementById('greetName');
    const userName   = document.getElementById('userName');
    const userAvatar = document.getElementById('userAvatar');

    if (greetName)  greetName.textContent  = firstName;
    if (userName)   userName.textContent   = firstName;
    if (userAvatar) userAvatar.textContent = initial;

    const dateEl = document.getElementById('topbarDate');
    if (dateEl) {
        dateEl.textContent = new Date().toLocaleDateString('en-IN', {
            weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
        });
    }

    setTimeout(() => {
        document.querySelectorAll('.match-bar').forEach(bar => {
            const target = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => { bar.style.width = target; }, 100);
        });
    }, 300);
}

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('dashboard.html')) {
        initDashboard();
    }
});