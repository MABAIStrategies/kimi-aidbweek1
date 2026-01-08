// Enhanced Multi-User Authentication System
// Supports signup, login, logout with password validation

class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.USERS_KEY = 'ai-tracker-users';
        this.CURRENT_USER_KEY = 'ai-tracker-current-user';
        this.init();
    }

    init() {
        this.loadCurrentUser();
    }

    // Simple password hashing (for demo purposes - in production use bcrypt or similar)
    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(36);
    }

    // Get all users from localStorage
    getAllUsers() {
        const users = localStorage.getItem(this.USERS_KEY);
        return users ? JSON.parse(users) : {};
    }

    // Save all users to localStorage
    saveAllUsers(users) {
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    }

    // Check if username exists
    userExists(username) {
        const users = this.getAllUsers();
        return users.hasOwnProperty(username.toLowerCase());
    }

    // Sign up a new user
    signup(username, password, email = null) {
        if (!username || !password) {
            return { success: false, message: 'Username and password are required' };
        }

        if (username.length < 3) {
            return { success: false, message: 'Username must be at least 3 characters' };
        }

        if (password.length < 4) {
            return { success: false, message: 'Password must be at least 4 characters' };
        }

        const normalizedUsername = username.toLowerCase();

        if (this.userExists(normalizedUsername)) {
            return { success: false, message: 'Username already exists' };
        }

        const users = this.getAllUsers();
        const hashedPassword = this.hashPassword(password);

        // Create new user
        const newUser = {
            username: username,
            normalizedUsername: normalizedUsername,
            password: hashedPassword,
            email: email || `${normalizedUsername}@aitracker.com`,
            displayName: username,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        };

        users[normalizedUsername] = newUser;
        this.saveAllUsers(users);

        return { success: true, message: 'Account created successfully!', user: newUser };
    }

    // Login user
    login(username, password) {
        if (!username || !password) {
            return { success: false, message: 'Username and password are required' };
        }

        const normalizedUsername = username.toLowerCase();
        const users = this.getAllUsers();

        if (!users[normalizedUsername]) {
            return { success: false, message: 'Invalid username or password' };
        }

        const user = users[normalizedUsername];
        const hashedPassword = this.hashPassword(password);

        if (user.password !== hashedPassword) {
            return { success: false, message: 'Invalid username or password' };
        }

        // Update last login
        user.lastLogin = new Date().toISOString();
        users[normalizedUsername] = user;
        this.saveAllUsers(users);

        // Set current user
        this.currentUser = user;
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));

        return { success: true, message: 'Login successful!', user: user };
    }

    // Logout user
    logout() {
        this.currentUser = null;
        localStorage.removeItem(this.CURRENT_USER_KEY);
        return { success: true, message: 'Logged out successfully' };
    }

    // Load current user from localStorage
    loadCurrentUser() {
        const savedUser = localStorage.getItem(this.CURRENT_USER_KEY);
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
                return this.currentUser;
            } catch (e) {
                console.error('Error loading current user:', e);
                this.currentUser = null;
            }
        }
        return null;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Update user profile
    updateProfile(updates) {
        if (!this.currentUser) {
            return { success: false, message: 'No user logged in' };
        }

        const users = this.getAllUsers();
        const normalizedUsername = this.currentUser.normalizedUsername;

        if (!users[normalizedUsername]) {
            return { success: false, message: 'User not found' };
        }

        // Update allowed fields
        const allowedUpdates = ['displayName', 'email'];
        allowedUpdates.forEach(field => {
            if (updates[field] !== undefined) {
                users[normalizedUsername][field] = updates[field];
            }
        });

        this.saveAllUsers(users);
        this.currentUser = users[normalizedUsername];
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(this.currentUser));

        return { success: true, message: 'Profile updated successfully', user: this.currentUser };
    }

    // Get user-specific data key
    getUserDataKey(dataType = 'tracker') {
        if (!this.currentUser) return null;
        return `ai-${dataType}-${this.currentUser.normalizedUsername}`;
    }

    // Save user-specific data
    saveUserData(data, dataType = 'tracker') {
        if (!this.currentUser) {
            console.error('No user logged in');
            return false;
        }

        const key = this.getUserDataKey(dataType);
        try {
            localStorage.setItem(key, JSON.stringify(data));
            // Also save backup
            localStorage.setItem(`${key}-backup`, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Error saving user data:', e);
            return false;
        }
    }

    // Load user-specific data
    loadUserData(dataType = 'tracker') {
        if (!this.currentUser) {
            return null;
        }

        const key = this.getUserDataKey(dataType);
        const data = localStorage.getItem(key);

        if (data) {
            try {
                return JSON.parse(data);
            } catch (e) {
                console.error('Error parsing user data, trying backup...', e);
                // Try backup
                const backup = localStorage.getItem(`${key}-backup`);
                if (backup) {
                    try {
                        return JSON.parse(backup);
                    } catch (e2) {
                        console.error('Error parsing backup data:', e2);
                    }
                }
            }
        }

        return null;
    }
}

// Global auth instance
window.authSystem = new AuthSystem();
