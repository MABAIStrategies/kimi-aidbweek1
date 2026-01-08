// Common Authentication UI Functions
// Include this file in all pages after auth.js

// Update UI based on authentication state
function updateUIForAuthState() {
    const user = window.authSystem ? window.authSystem.getCurrentUser() : null;
    const userInfoEl = document.getElementById('user-info');

    if (userInfoEl) {
        if (user) {
            // User is logged in - show user info
            userInfoEl.innerHTML = `
                <span class="user-name">${user.displayName || user.username}</span>
                <button class="logout-btn" onclick="logout()">Logout</button>
            `;
        } else {
            // User is not logged in - show sign in button
            userInfoEl.innerHTML = `
                <button class="logout-btn" onclick="openAuthModal('login')" style="background: var(--primary); color: white;">Sign In</button>
            `;
        }
    }

    // Update user name in the old format if needed
    const userNameEl = document.getElementById('user-name');
    if (userNameEl && user) {
        userNameEl.textContent = user.displayName || user.username;
    }

    // Trigger page-specific updates if function exists
    if (typeof onAuthStateChange === 'function') {
        onAuthStateChange(user);
    }
}

// Open authentication modal
function openAuthModal(mode = 'login') {
    let modal = document.getElementById('auth-modal');

    // If modal doesn't exist, create it
    if (!modal) {
        createAuthModal();
        modal = document.getElementById('auth-modal');
    }

    const title = document.getElementById('auth-modal-title');
    const submitBtn = document.getElementById('auth-submit-btn');
    const switchText = document.getElementById('auth-switch-text');
    const emailGroup = document.getElementById('auth-email-group');
    const errorEl = document.getElementById('auth-error');
    const successEl = document.getElementById('auth-success');

    // Reset form
    document.getElementById('auth-form').reset();
    errorEl.style.display = 'none';
    successEl.style.display = 'none';

    if (mode === 'login') {
        title.textContent = 'Sign In';
        submitBtn.textContent = 'Sign In';
        emailGroup.style.display = 'none';
        switchText.innerHTML = `Don't have an account? <a href="#" id="auth-switch-link" style="color: var(--primary); font-weight: 500;">Sign up here</a>`;
        document.getElementById('auth-switch-link').onclick = (e) => {
            e.preventDefault();
            openAuthModal('signup');
        };
    } else {
        title.textContent = 'Sign Up';
        submitBtn.textContent = 'Create Account';
        emailGroup.style.display = 'block';
        switchText.innerHTML = `Already have an account? <a href="#" id="auth-switch-link" style="color: var(--primary); font-weight: 500;">Sign in here</a>`;
        document.getElementById('auth-switch-link').onclick = (e) => {
            e.preventDefault();
            openAuthModal('login');
        };
    }

    modal.classList.add('active');
}

// Close authentication modal
function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Create authentication modal if it doesn't exist
function createAuthModal() {
    if (document.getElementById('auth-modal')) return;

    const modalHTML = `
        <div id="auth-modal" class="modal">
            <div class="modal-content" style="max-width: 450px;">
                <div class="modal-header">
                    <h2 id="auth-modal-title">Sign In</h2>
                    <button class="modal-close" onclick="closeAuthModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div id="auth-error" style="background: rgba(239, 68, 68, 0.1); color: #ef4444; padding: 0.75rem; border-radius: 8px; margin-bottom: 1rem; display: none;"></div>
                    <div id="auth-success" style="background: rgba(104, 160, 99, 0.1); color: #68a063; padding: 0.75rem; border-radius: 8px; margin-bottom: 1rem; display: none;"></div>

                    <form id="auth-form">
                        <div class="form-group" style="margin-bottom: 1.5rem;">
                            <label style="display: block; font-weight: 500; color: var(--primary); margin-bottom: 0.5rem;">Username</label>
                            <input type="text" id="auth-username" required
                                   style="width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px; font-family: inherit;">
                        </div>
                        <div class="form-group" id="auth-email-group" style="margin-bottom: 1.5rem; display: none;">
                            <label style="display: block; font-weight: 500; color: var(--primary); margin-bottom: 0.5rem;">Email (optional)</label>
                            <input type="email" id="auth-email"
                                   style="width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px; font-family: inherit;">
                        </div>
                        <div class="form-group" style="margin-bottom: 1.5rem;">
                            <label style="display: block; font-weight: 500; color: var(--primary); margin-bottom: 0.5rem;">Password</label>
                            <input type="password" id="auth-password" required
                                   style="width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px; font-family: inherit;">
                        </div>
                        <button type="submit" id="auth-submit-btn"
                                style="width: 100%; background: var(--primary); color: white; border: none; padding: 0.75rem; border-radius: 8px; font-weight: 500; cursor: pointer; transition: all 0.3s ease;">
                            Sign In
                        </button>
                    </form>

                    <div style="text-align: center; margin-top: 1.5rem;">
                        <p id="auth-switch-text" style="color: var(--text); opacity: 0.7;">
                            Don't have an account?
                            <a href="#" id="auth-switch-link" style="color: var(--primary); font-weight: 500;">Sign up here</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Setup form submission
    const authForm = document.getElementById('auth-form');
    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleAuthSubmit();
        });
    }
}

// Handle auth form submission
function handleAuthSubmit() {
    const username = document.getElementById('auth-username').value;
    const password = document.getElementById('auth-password').value;
    const email = document.getElementById('auth-email').value;
    const mode = document.getElementById('auth-modal-title').textContent === 'Sign In' ? 'login' : 'signup';
    const errorEl = document.getElementById('auth-error');
    const successEl = document.getElementById('auth-success');

    errorEl.style.display = 'none';
    successEl.style.display = 'none';

    let result;
    if (mode === 'signup') {
        result = window.authSystem.signup(username, password, email || null);
    } else {
        result = window.authSystem.login(username, password);
    }

    if (result.success) {
        successEl.textContent = result.message;
        successEl.style.display = 'block';

        setTimeout(() => {
            closeAuthModal();
            updateUIForAuthState();
        }, 1000);
    } else {
        errorEl.textContent = result.message;
        errorEl.style.display = 'block';
    }
}

// Global logout function
function logout() {
    // Trigger page-specific cleanup if function exists
    if (typeof beforeLogout === 'function') {
        beforeLogout();
    }

    if (window.authSystem) {
        window.authSystem.logout();
    }

    // Update UI to show sign in button
    updateUIForAuthState();
}

// Initialize auth UI when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    updateUIForAuthState();
});
