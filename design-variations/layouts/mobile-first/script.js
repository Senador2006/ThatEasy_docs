// Mobile-First JavaScript for ThatEasy

document.addEventListener('DOMContentLoaded', function() {
    initializeMobileFeatures();
    initializeInteractions();
    initializeSwipeGestures();
});

// Initialize mobile-specific features
function initializeMobileFeatures() {
    // Search functionality
    const searchBtn = document.querySelector('.search-btn');
    const searchOverlay = document.getElementById('searchOverlay');
    
    searchBtn.addEventListener('click', openSearch);
    
    // Bottom navigation
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            navBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Add haptic feedback on supported devices
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }
        });
    });
    
    // Story progress indicators
    const storyItems = document.querySelectorAll('.story-item');
    storyItems.forEach(item => {
        item.addEventListener('click', function() {
            storyItems.forEach(s => s.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Search functions
function openSearch() {
    const searchOverlay = document.getElementById('searchOverlay');
    const searchInput = document.querySelector('.search-input');
    
    searchOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus input after animation
    setTimeout(() => {
        searchInput.focus();
    }, 100);
}

function closeSearch() {
    const searchOverlay = document.getElementById('searchOverlay');
    
    searchOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Post interactions
function initializeInteractions() {
    // Like buttons
    const likeButtons = document.querySelectorAll('.action-btn.like');
    likeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('liked');
            
            // Animation feedback
            this.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate(5);
            }
        });
    });
    
    // Post actions
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Visual feedback
            this.style.backgroundColor = '#f1f5f9';
            setTimeout(() => {
                this.style.backgroundColor = '';
            }, 200);
        });
    });
    
    // Quick actions
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');
    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Scale animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// Swipe gestures for mobile
function initializeSwipeGestures() {
    let startX, startY, startTime;
    const threshold = 100; // minimum distance for swipe
    const timeThreshold = 300; // maximum time for swipe
    
    // Add swipe to stories
    const storiesContainer = document.querySelector('.progress-stories');
    
    storiesContainer.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        startTime = Date.now();
    });
    
    storiesContainer.addEventListener('touchend', function(e) {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const endTime = Date.now();
        
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const deltaTime = endTime - startTime;
        
        if (deltaTime < timeThreshold && Math.abs(deltaX) > threshold && Math.abs(deltaY) < threshold) {
            if (deltaX > 0) {
                // Swipe right - previous story
                navigateStories(-1);
            } else {
                // Swipe left - next story
                navigateStories(1);
            }
        }
    });
}

// Story navigation
function navigateStories(direction) {
    const stories = document.querySelectorAll('.story-item');
    const activeIndex = Array.from(stories).findIndex(story => story.classList.contains('active'));
    
    let newIndex = activeIndex + direction;
    if (newIndex < 0) newIndex = stories.length - 1;
    if (newIndex >= stories.length) newIndex = 0;
    
    stories.forEach(story => story.classList.remove('active'));
    stories[newIndex].classList.add('active');
    
    // Scroll to active story
    stories[newIndex].scrollIntoView({ behavior: 'smooth', inline: 'center' });
}

// Floating Action Button
function openCreatePost() {
    // Simple alert for demo - in real app would open modal
    alert('Abrir tela de criação de post');
}

// AI Assistant interaction
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('ai-chat-btn')) {
        // Simple alert for demo - in real app would open chat
        alert('Iniciando conversa com IA Assistant');
    }
});

// Infinite scroll simulation
let isLoading = false;
let page = 1;

function loadMorePosts() {
    if (isLoading) return;
    
    isLoading = true;
    const feed = document.querySelector('.posts-feed');
    
    // Show loading indicator
    const loadingEl = document.createElement('div');
    loadingEl.className = 'loading-indicator';
    loadingEl.innerHTML = 'Carregando mais posts...';
    loadingEl.style.textAlign = 'center';
    loadingEl.style.padding = '20px';
    loadingEl.style.color = '#64748b';
    feed.appendChild(loadingEl);
    
    // Simulate API call
    setTimeout(() => {
        loadingEl.remove();
        
        // Add new posts (simulation)
        for (let i = 0; i < 3; i++) {
            const newPost = createPostElement();
            feed.appendChild(newPost);
        }
        
        isLoading = false;
        page++;
    }, 1000);
}

// Create post element (simulation)
function createPostElement() {
    const post = document.createElement('article');
    post.className = 'post-card';
    post.innerHTML = `
        <div class="post-header">
            <div class="user-info">
                <div class="user-avatar">U</div>
                <div class="user-details">
                    <h4>Usuário ${Math.floor(Math.random() * 100)}</h4>
                    <span class="user-badge">Estudante</span>
                </div>
            </div>
            <div class="post-time">${Math.floor(Math.random() * 12)}h</div>
        </div>
        
        <div class="post-content">
            <h3>Post de exemplo ${page}</h3>
            <p>Este é um post de exemplo carregado dinamicamente através do infinite scroll.</p>
            
            <div class="post-tags">
                <span class="tag">#exemplo</span>
                <span class="tag">#mobile</span>
            </div>
        </div>

        <div class="post-engagement">
            <div class="engagement-stats">
                <span>❤️ ${Math.floor(Math.random() * 100)}</span>
                <span>💬 ${Math.floor(Math.random() * 50)}</span>
                <span>📤 ${Math.floor(Math.random() * 20)}</span>
            </div>
        </div>

        <div class="post-actions">
            <button class="action-btn like">
                <span>❤️</span>
            </button>
            <button class="action-btn comment">
                <span>💬</span>
            </button>
            <button class="action-btn share">
                <span>📤</span>
            </button>
            <button class="action-btn save">
                <span>🔖</span>
            </button>
        </div>
    `;
    
    // Re-initialize interactions for new post
    const likeBtn = post.querySelector('.action-btn.like');
    likeBtn.addEventListener('click', function() {
        this.classList.toggle('liked');
        this.style.transform = 'scale(1.2)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });
    
    return post;
}

// Infinite scroll detection
window.addEventListener('scroll', function() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 1000) {
        loadMorePosts();
    }
});

// Handle keyboard events
document.addEventListener('keydown', function(e) {
    // ESC to close search
    if (e.key === 'Escape') {
        closeSearch();
    }
    
    // Enter in search
    if (e.key === 'Enter' && e.target.classList.contains('search-input')) {
        // Perform search (simulation)
        console.log('Searching for:', e.target.value);
        closeSearch();
    }
});

// Handle orientation change
window.addEventListener('orientationchange', function() {
    // Refresh layout after orientation change
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 100);
});

// Pull to refresh simulation
let startY = 0;
let isRefreshing = false;

document.addEventListener('touchstart', function(e) {
    if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
    }
});

document.addEventListener('touchmove', function(e) {
    if (window.scrollY === 0 && !isRefreshing) {
        const currentY = e.touches[0].clientY;
        const pullDistance = currentY - startY;
        
        if (pullDistance > 100) {
            isRefreshing = true;
            
            // Show refresh indicator
            const header = document.querySelector('.header');
            const refreshIndicator = document.createElement('div');
            refreshIndicator.className = 'refresh-indicator';
            refreshIndicator.innerHTML = '🔄 Atualizando...';
            refreshIndicator.style.position = 'fixed';
            refreshIndicator.style.top = '60px';
            refreshIndicator.style.left = '0';
            refreshIndicator.style.right = '0';
            refreshIndicator.style.textAlign = 'center';
            refreshIndicator.style.padding = '10px';
            refreshIndicator.style.background = '#f1f5f9';
            refreshIndicator.style.fontSize = '14px';
            refreshIndicator.style.zIndex = '1001';
            
            document.body.appendChild(refreshIndicator);
            
            // Simulate refresh
            setTimeout(() => {
                refreshIndicator.remove();
                isRefreshing = false;
                // In real app, would reload posts
            }, 1500);
        }
    }
});

console.log('ThatEasy Mobile-First layout loaded successfully!'); 