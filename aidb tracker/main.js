// AI Resolution Tracker - Main JavaScript
// Core functionality for the 10-week AI Resolution competition

class AIResolutionTracker {
    constructor() {
        this.currentWeek = 1;
        this.weekends = this.initializeWeekends();
        this.achievements = this.initializeAchievements();
        this.settings = this.loadSettings();
        this.user = this.loadUser();
        this.init();
    }

    initializeWeekends() {
        return [
            {
                id: 1,
                title: "Resolution Tracker",
                description: "Build a working web app that tracks your progress through these 10 weekends",
                status: "in_progress", // Will be marked complete when user finishes
                completedDate: null,
                notes: "",
                timeSpent: 0, // Will be calculated when completed
                deliverable: "Live web application with progress tracking",
                difficulty: "beginner",
                tags: ["web-app", "tracking", "productivity"],
                startTime: new Date().toISOString() // Track when user started
            },
            {
                id: 2,
                title: "AI Writing Assistant",
                description: "Create an AI-powered tool for content generation and editing",
                status: "not_started",
                notes: "",
                timeSpent: 0,
                deliverable: "AI writing tool with prompt templates",
                difficulty: "intermediate",
                tags: ["ai", "writing", "nlp"],
                startTime: null
            },
            {
                id: 3,
                title: "Data Analysis Dashboard",
                description: "Build an interactive dashboard for data visualization and insights",
                status: "not_started",
                notes: "",
                timeSpent: 0,
                deliverable: "Interactive data visualization tool",
                difficulty: "intermediate",
                tags: ["data", "visualization", "analytics"]
            },
            {
                id: 4,
                title: "Image Generation Tool",
                description: "Develop an AI image generation and editing application",
                status: "not_started",
                notes: "",
                timeSpent: 0,
                deliverable: "Image generation tool with custom models",
                difficulty: "advanced",
                tags: ["ai", "image", "generation"]
            },
            {
                id: 5,
                title: "Voice Processing App",
                description: "Create an application for voice recognition and synthesis",
                status: "not_started",
                notes: "",
                timeSpent: 0,
                deliverable: "Voice processing tool with multiple features",
                difficulty: "advanced",
                tags: ["voice", "audio", "processing"]
            },
            {
                id: 6,
                title: "Automation Workflow",
                description: "Build an automation system for repetitive tasks",
                status: "not_started",
                notes: "",
                timeSpent: 0,
                deliverable: "Workflow automation tool",
                difficulty: "intermediate",
                tags: ["automation", "workflow", "productivity"]
            },
            {
                id: 7,
                title: "Learning Management System",
                description: "Develop an AI-powered learning and education platform",
                status: "not_started",
                notes: "",
                timeSpent: 0,
                deliverable: "Educational platform with AI tutoring",
                difficulty: "advanced",
                tags: ["education", "ai", "learning"]
            },
            {
                id: 8,
                title: "Financial Analysis Tool",
                description: "Create an AI tool for financial planning and analysis",
                status: "not_started",
                notes: "",
                timeSpent: 0,
                deliverable: "Financial analysis and prediction tool",
                difficulty: "intermediate",
                tags: ["finance", "analysis", "prediction"]
            },
            {
                id: 9,
                title: "Creative Content Generator",
                description: "Build an AI tool for creative content and media generation",
                status: "not_started",
                notes: "",
                timeSpent: 0,
                deliverable: "Creative content generation platform",
                difficulty: "advanced",
                tags: ["creativity", "content", "generation"]
            },
            {
                id: 10,
                title: "Personal AI Assistant",
                description: "Develop a comprehensive personal AI assistant",
                status: "not_started",
                notes: "",
                timeSpent: 0,
                deliverable: "Multi-functional AI assistant",
                difficulty: "expert",
                tags: ["ai", "assistant", "personal"]
            }
        ];
    }

    initializeAchievements() {
        return [
            {
                id: 'first_complete',
                title: 'Getting Started',
                description: 'Complete your first weekend',
                icon: '🚀',
                unlocked: true,
                unlockedDate: new Date().toISOString()
            },
            {
                id: 'streak_3',
                title: 'Momentum Builder',
                description: 'Complete 3 weekends in a row',
                icon: '🔥',
                unlocked: false
            },
            {
                id: 'halfway',
                title: 'Halfway Hero',
                description: 'Complete 5 weekends',
                icon: '⭐',
                unlocked: false
            },
            {
                id: 'perfect_streak',
                title: 'Perfect Attendance',
                description: 'Complete all 10 weekends',
                icon: '🏆',
                unlocked: false
            },
            {
                id: 'speed_demon',
                title: 'Speed Demon',
                description: 'Complete a weekend in under 2 hours',
                icon: '⚡',
                unlocked: false
            },
            {
                id: 'reflective',
                title: 'Deep Thinker',
                description: 'Add notes to 5 weekends',
                icon: '🧠',
                unlocked: false
            }
        ];
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.renderWeekends();
        this.updateStats();
        this.initAnimations();
        this.checkAchievements();
    }

    setupEventListeners() {
        // Weekend card clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('.weekend-card')) {
                const weekendId = parseInt(e.target.closest('.weekend-card').dataset.weekendId);
                this.openWeekendModal(weekendId);
            }
            
            if (e.target.closest('.complete-btn')) {
                e.stopPropagation();
                const weekendId = parseInt(e.target.closest('.weekend-card').dataset.weekendId);
                this.toggleComplete(weekendId);
            }
            
            if (e.target.closest('.modal-close')) {
                this.closeModal();
            }
            
            if (e.target.classList.contains('modal-overlay')) {
                this.closeModal();
            }
        });

        // Form submissions
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'weekend-notes-form') {
                e.preventDefault();
                this.saveNotes();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    renderWeekends() {
        const container = document.getElementById('weekends-grid');
        if (!container) return;

        container.innerHTML = this.weekends.map(weekend => `
            <div class="weekend-card ${weekend.status}" data-weekend-id="${weekend.id}">
                <div class="card-header">
                    <span class="weekend-number">Week ${weekend.id}</span>
                    <span class="difficulty-badge ${weekend.difficulty}">${weekend.difficulty}</span>
                </div>
                <h3 class="weekend-title">${weekend.title}</h3>
                <p class="weekend-description">${weekend.description}</p>
                <div class="card-footer">
                    <div class="status-indicator ${weekend.status}">
                        ${this.getStatusIcon(weekend.status)}
                    </div>
                    <button class="complete-btn ${weekend.status === 'completed' ? 'completed' : ''}" 
                            ${weekend.status === 'completed' ? 'disabled' : ''}>
                        ${weekend.status === 'completed' ? '✓ Complete' : 'Mark Complete'}
                    </button>
                </div>
                ${weekend.status === 'completed' ? `
                    <div class="completion-details">
                        <span class="time-spent">⏱ ${Math.round(weekend.timeSpent / 60)}h ${weekend.timeSpent % 60}m</span>
                        <span class="completed-date">📅 ${new Date(weekend.completedDate).toLocaleDateString()}</span>
                    </div>
                ` : ''}
            </div>
        `).join('');

        // Animate cards in
        anime({
            targets: '.weekend-card',
            translateY: [50, 0],
            opacity: [0, 1],
            delay: anime.stagger(100),
            duration: 800,
            easing: 'easeOutExpo'
        });
    }

    getStatusIcon(status) {
        const icons = {
            'not_started': '⏳',
            'in_progress': '🔄',
            'completed': '✅'
        };
        return icons[status] || '❓';
    }

    toggleComplete(weekendId) {
        const weekend = this.weekends.find(w => w.id === weekendId);
        if (!weekend || weekend.status === 'completed') return;

        weekend.status = 'completed';
        weekend.completedDate = new Date().toISOString();
        
        // Calculate actual time spent
        if (weekend.startTime) {
            const startTime = new Date(weekend.startTime);
            const endTime = new Date();
            weekend.timeSpent = Math.round((endTime - startTime) / (1000 * 60)); // minutes
        } else {
            weekend.timeSpent = 180; // Default 3 hours if no start time
        }

        // Save data
        this.saveData();
        
        // Re-render with animation
        this.renderWeekends();
        this.updateStats();
        this.checkAchievements();
        
        // Celebration animation
        this.celebrateCompletion(weekendId);
    }

    celebrateCompletion(weekendId) {
        const card = document.querySelector(`[data-weekend-id="${weekendId}"]`);
        
        // Confetti effect
        if (typeof confetti !== 'undefined') {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }

        // Card celebration animation
        anime({
            targets: card,
            scale: [1, 1.05, 1],
            rotate: [0, 2, -2, 0],
            duration: 1000,
            easing: 'easeInOutQuad'
        });

        // Show success message
        this.showNotification(`🎉 Weekend ${weekendId} completed! Great job!`, 'success');
    }

    openWeekendModal(weekendId) {
        const weekend = this.weekends.find(w => w.id === weekendId);
        if (!weekend) return;

        const modal = document.getElementById('weekend-modal');
        const modalContent = modal.querySelector('.modal-content');

        modalContent.innerHTML = `
            <div class="modal-header">
                <h2>Week ${weekend.id}: ${weekend.title}</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="weekend-details">
                    <div class="detail-section">
                        <h3>Description</h3>
                        <p>${weekend.description}</p>
                    </div>
                    <div class="detail-section">
                        <h3>Deliverable</h3>
                        <p>${weekend.deliverable}</p>
                    </div>
                    <div class="detail-section">
                        <h3>Tags</h3>
                        <div class="tags">
                            ${weekend.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                    ${weekend.status === 'completed' ? `
                        <div class="detail-section">
                            <h3>Completion Details</h3>
                            <p><strong>Completed:</strong> ${new Date(weekend.completedDate).toLocaleDateString()}</p>
                            <p><strong>Time Spent:</strong> ${Math.round(weekend.timeSpent / 60)}h ${weekend.timeSpent % 60}m</p>
                        </div>
                    ` : ''}
                    <div class="detail-section">
                        <h3>Notes & Reflections</h3>
                        <form id="weekend-notes-form">
                            <textarea name="notes" placeholder="Add your notes and reflections about this weekend...">${weekend.notes}</textarea>
                            <input type="hidden" name="weekendId" value="${weekend.id}">
                            <button type="submit" class="save-notes-btn">Save Notes</button>
                        </form>
                    </div>
                </div>
            </div>
        `;

        modal.classList.add('active');
        
        // Animate modal in
        anime({
            targets: modal,
            opacity: [0, 1],
            duration: 300,
            easing: 'easeOutQuad'
        });

        anime({
            targets: modalContent,
            scale: [0.8, 1],
            opacity: [0, 1],
            duration: 400,
            delay: 100,
            easing: 'easeOutBack'
        });
    }

    closeModal() {
        const modal = document.getElementById('weekend-modal');
        
        anime({
            targets: modal,
            opacity: [1, 0],
            duration: 300,
            easing: 'easeInQuad',
            complete: () => {
                modal.classList.remove('active');
            }
        });
    }

    saveNotes() {
        const form = document.getElementById('weekend-notes-form');
        const formData = new FormData(form);
        const weekendId = parseInt(formData.get('weekendId'));
        const notes = formData.get('notes');

        const weekend = this.weekends.find(w => w.id === weekendId);
        if (weekend) {
            weekend.notes = notes;
            this.saveData();
            this.showNotification('Notes saved successfully!', 'success');
        }
    }

    updateStats() {
        const completedCount = this.weekends.filter(w => w.status === 'completed').length;
        const totalTime = this.weekends.reduce((sum, w) => sum + w.timeSpent, 0);
        const completionRate = Math.round((completedCount / this.weekends.length) * 100);

        // Update progress bar
        const progressBar = document.querySelector('.progress-fill');
        if (progressBar) {
            anime({
                targets: progressBar,
                width: `${completionRate}%`,
                duration: 1000,
                easing: 'easeOutExpo'
            });
        }

        // Update stats
        const statsElements = {
            'completed-count': completedCount,
            'total-time': `${Math.round(totalTime / 60)}h`,
            'completion-rate': `${completionRate}%`,
            'current-streak': this.calculateStreak()
        };

        Object.entries(statsElements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }

    calculateStreak() {
        let streak = 0;
        for (let i = 0; i < this.weekends.length; i++) {
            if (this.weekends[i].status === 'completed') {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    }

    checkAchievements() {
        const completedCount = this.weekends.filter(w => w.status === 'completed').length;
        const streak = this.calculateStreak();
        const notesCount = this.weekends.filter(w => w.notes && w.notes.trim().length > 0).length;

        // Check and unlock achievements
        const achievementsToCheck = [
            { id: 'streak_3', condition: streak >= 3 },
            { id: 'halfway', condition: completedCount >= 5 },
            { id: 'perfect_streak', condition: completedCount >= 10 },
            { id: 'reflective', condition: notesCount >= 5 }
        ];

        achievementsToCheck.forEach(({ id, condition }) => {
            const achievement = this.achievements.find(a => a.id === id);
            if (achievement && !achievement.unlocked && condition) {
                achievement.unlocked = true;
                achievement.unlockedDate = new Date().toISOString();
                this.showAchievementUnlock(achievement);
            }
        });

        this.saveData();
    }

    showAchievementUnlock(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-content">
                <span class="achievement-icon">${achievement.icon}</span>
                <div class="achievement-text">
                    <h4>Achievement Unlocked!</h4>
                    <p>${achievement.title}</p>
                    <small>${achievement.description}</small>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        // Animate achievement notification
        anime({
            targets: notification,
            translateX: [300, 0],
            opacity: [0, 1],
            duration: 500,
            easing: 'easeOutBack'
        });

        // Auto-remove after 5 seconds
        setTimeout(() => {
            anime({
                targets: notification,
                translateX: [0, 300],
                opacity: [1, 0],
                duration: 300,
                easing: 'easeInQuad',
                complete: () => notification.remove()
            });
        }, 5000);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        anime({
            targets: notification,
            translateY: [-50, 0],
            opacity: [0, 1],
            duration: 300,
            easing: 'easeOutQuad'
        });

        setTimeout(() => {
            anime({
                targets: notification,
                translateY: [0, -50],
                opacity: [1, 0],
                duration: 300,
                easing: 'easeInQuad',
                complete: () => notification.remove()
            });
        }, 3000);
    }

    initAnimations() {
        // Initialize background particles if p5.js is available
        if (typeof p5 !== 'undefined' && document.getElementById('background-canvas')) {
            this.initBackgroundParticles();
        }

        // Initialize typed text if Typed.js is available
        if (typeof Typed !== 'undefined' && document.getElementById('typed-text')) {
            new Typed('#typed-text', {
                strings: [
                    'Track your AI journey',
                    'Build something amazing every weekend',
                    'Transform your skills in 10 weeks',
                    'Create your AI operating system'
                ],
                typeSpeed: 50,
                backSpeed: 30,
                backDelay: 2000,
                loop: true
            });
        }

        // Initialize text splitting if Splitting.js is available
        if (typeof Splitting !== 'undefined') {
            Splitting({ target: '.split-text', by: 'chars' });
            
            anime({
                targets: '.split-text .char',
                translateY: [100, 0],
                opacity: [0, 1],
                delay: anime.stagger(50),
                duration: 800,
                easing: 'easeOutExpo'
            });
        }
    }

    initBackgroundParticles() {
        new p5((p) => {
            let particles = [];
            
            p.setup = () => {
                const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
                canvas.parent('background-canvas');
                canvas.style('position', 'fixed');
                canvas.style('top', '0');
                canvas.style('left', '0');
                canvas.style('z-index', '-1');
                
                // Create particles
                for (let i = 0; i < 50; i++) {
                    particles.push({
                        x: p.random(p.width),
                        y: p.random(p.height),
                        vx: p.random(-0.5, 0.5),
                        vy: p.random(-0.5, 0.5),
                        size: p.random(2, 6)
                    });
                }
            };
            
            p.draw = () => {
                p.clear();
                
                // Update and draw particles
                particles.forEach(particle => {
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    
                    // Wrap around edges
                    if (particle.x < 0) particle.x = p.width;
                    if (particle.x > p.width) particle.x = 0;
                    if (particle.y < 0) particle.y = p.height;
                    if (particle.y > p.height) particle.y = 0;
                    
                    // Draw particle
                    p.fill(26, 77, 77, 100); // Teal with transparency
                    p.noStroke();
                    p.ellipse(particle.x, particle.y, particle.size);
                });
                
                // Draw connections
                particles.forEach((particle, i) => {
                    particles.slice(i + 1).forEach(other => {
                        const distance = p.dist(particle.x, particle.y, other.x, other.y);
                        if (distance < 100) {
                            p.stroke(26, 77, 77, 50);
                            p.strokeWeight(1);
                            p.line(particle.x, particle.y, other.x, other.y);
                        }
                    });
                });
            };
            
            p.windowResized = () => {
                p.resizeCanvas(p.windowWidth, p.windowHeight);
            };
        });
    }

    saveData() {
        const data = {
            weekends: this.weekends,
            achievements: this.achievements,
            settings: this.settings,
            user: this.user,
            lastUpdated: new Date().toISOString()
        };
        
        localStorage.setItem('ai-resolution-tracker', JSON.stringify(data));
        
        // Also save to a backup key for data persistence
        localStorage.setItem('ai-resolution-backup', JSON.stringify(data));
    }

    loadData() {
        const saved = localStorage.getItem('ai-resolution-tracker');
        const backup = localStorage.getItem('ai-resolution-backup');
        
        let data = null;
        
        if (saved) {
            try {
                data = JSON.parse(saved);
            } catch (e) {
                console.warn('Could not parse main data, trying backup...');
            }
        }
        
        if (!data && backup) {
            try {
                data = JSON.parse(backup);
                console.log('Loaded from backup');
            } catch (e) {
                console.warn('Could not parse backup data either');
            }
        }
        
        if (data) {
            this.weekends = data.weekends || this.weekends;
            this.achievements = data.achievements || this.achievements;
            this.settings = data.settings || this.settings;
            this.user = data.user || this.user;
        }
    }
    
    loadUser() {
        const savedUser = localStorage.getItem('ai-resolution-user');
        return savedUser ? JSON.parse(savedUser) : null;
    }

    loadSettings() {
        return {
            theme: 'light',
            notifications: true,
            autoSave: true
        };
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.aiTracker = new AIResolutionTracker();
    
    // Display user info if logged in
    const user = window.aiTracker.user;
    if (user) {
        const userNameEl = document.getElementById('user-name');
        if (userNameEl) {
            userNameEl.textContent = user.name || user.username;
        }
    } else {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
    }
});

// Global logout function
function logout() {
    if (window.aiTracker) {
        // Save data before logout
        window.aiTracker.saveData();
    }
    
    localStorage.removeItem('ai-resolution-user');
    window.location.href = 'login.html';
}

// Utility functions for other pages
window.TrackerUtils = {
    formatTime: (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    },
    
    formatDate: (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },
    
    getProgressColor: (percentage) => {
        if (percentage >= 80) return '#68a063'; // Sage green
        if (percentage >= 50) return '#d4a574'; // Warm amber
        return '#4a90a4'; // Soft blue
    }
};