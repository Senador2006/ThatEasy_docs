// Dashboard JavaScript for ThatEasy

document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    initializeCharts();
    initializeInteractions();
    initializeRealTimeUpdates();
});

// Initialize dashboard features
function initializeDashboard() {
    // Time period selector
    const periodBtns = document.querySelectorAll('.period-btn');
    periodBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            periodBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            updateDashboardData(this.textContent.trim());
        });
    });

    // Chart controls
    const chartControlBtns = document.querySelectorAll('.chart-control-btn');
    chartControlBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const parent = this.closest('.chart-controls');
            parent.querySelectorAll('.chart-control-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            updateChart(this.textContent.trim());
        });
    });

    // Activity filters
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterActivities(this.textContent.trim());
        });
    });

    // Navigation interactions
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Simulate page change with loading state
            showLoadingState();
            setTimeout(() => {
                hideLoadingState();
                showNotification(`Navegando para ${this.querySelector('.nav-text').textContent}`);
            }, 500);
        });
    });

    // Quick actions
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');
    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const actionText = this.querySelector('.action-text').textContent;
            animateButton(this);
            showNotification(`${actionText} criada com sucesso!`);
        });
    });

    // Initialize tooltips for metric cards
    initializeTooltips();
    
    // Initialize progress animations
    animateProgressBars();
    
    // Initialize XP counter animation
    animateXPCounter();
}

// Initialize charts with interactive features
function initializeCharts() {
    // Animate chart bars
    const chartBars = document.querySelectorAll('.chart-bar');
    chartBars.forEach((bar, index) => {
        setTimeout(() => {
            bar.style.height = bar.style.height || `${Math.random() * 80 + 20}%`;
        }, index * 100);
    });

    // Animate chart points
    const chartPoints = document.querySelectorAll('.chart-point');
    chartPoints.forEach((point, index) => {
        point.addEventListener('mouseenter', function() {
            showTooltip(this, `Valor: ${Math.floor(Math.random() * 100)}h`);
        });
        
        point.addEventListener('mouseleave', function() {
            hideTooltip();
        });

        // Animate points on load
        setTimeout(() => {
            point.style.opacity = '1';
            point.style.transform = 'translate(-50%, 50%) scale(1)';
        }, index * 150);
    });

    // Initialize donut chart animation
    animateDonutChart();
}

// Initialize interactive features
function initializeInteractions() {
    // Goal item interactions
    const goalItems = document.querySelectorAll('.goal-item');
    goalItems.forEach(item => {
        item.addEventListener('click', function() {
            if (!this.classList.contains('completed')) {
                const progressBar = this.querySelector('.progress-fill');
                const progressText = this.querySelector('.progress-text');
                const currentProgress = parseInt(progressBar.style.width) || 0;
                const newProgress = Math.min(currentProgress + 10, 100);
                
                progressBar.style.width = newProgress + '%';
                
                if (newProgress === 100) {
                    this.classList.add('completed');
                    this.querySelector('.goal-status').textContent = '✅';
                    showNotification('🎉 Meta concluída! +200 XP');
                    updateXP(200);
                }
            }
        });
    });

    // Achievement item interactions
    const achievementItems = document.querySelectorAll('.achievement-item');
    achievementItems.forEach(item => {
        item.addEventListener('click', function() {
            if (this.classList.contains('unlocked')) {
                showAchievementModal(this);
            }
        });
    });

    // Leaderboard interactions
    const leaderboardItems = document.querySelectorAll('.leaderboard-item');
    leaderboardItems.forEach(item => {
        item.addEventListener('click', function() {
            const username = this.querySelector('.username').textContent;
            if (username !== 'Você') {
                showNotification(`Visualizando perfil de ${username}`);
            }
        });
    });

    // Schedule interactions
    const scheduleItems = document.querySelectorAll('.schedule-item');
    scheduleItems.forEach(item => {
        item.addEventListener('click', function() {
            const title = this.querySelector('h5').textContent;
            showNotification(`Abrindo ${title}`);
        });
    });

    // Metric card interactions
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'scale(1.02)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });
}

// Real-time updates simulation
function initializeRealTimeUpdates() {
    // Update metrics every 30 seconds
    setInterval(() => {
        updateMetrics();
    }, 30000);

    // Add new activities every 2 minutes
    setInterval(() => {
        addNewActivity();
    }, 120000);

    // Update progress bars every 1 minute
    setInterval(() => {
        updateProgressBars();
    }, 60000);

    // Notification updates
    setInterval(() => {
        updateNotificationBadge();
    }, 45000);
}

// Update dashboard data based on time period
function updateDashboardData(period) {
    showLoadingState();
    
    setTimeout(() => {
        // Simulate API call
        const metrics = generateMetricsData(period);
        updateMetricsDisplay(metrics);
        
        const activities = generateActivitiesData(period);
        updateActivitiesDisplay(activities);
        
        hideLoadingState();
        showNotification(`Dashboard atualizado para: ${period}`);
    }, 800);
}

// Generate mock metrics data
function generateMetricsData(period) {
    const multiplier = period === 'Hoje' ? 0.1 : period === 'Esta Semana' ? 1 : period === 'Este Mês' ? 4 : 12;
    
    return {
        studyTime: Math.floor(47 * multiplier) + 'h ' + Math.floor(23 * multiplier) + 'm',
        goalsCompleted: Math.floor(15 * multiplier) + '/' + Math.floor(20 * multiplier),
        xpGained: Math.floor(1240 * multiplier) + ' XP',
        engagement: Math.floor(89 + Math.random() * 10) + '%'
    };
}

// Update metrics display
function updateMetricsDisplay(metrics) {
    const metricValues = document.querySelectorAll('.metric-value');
    metricValues[0].textContent = metrics.studyTime;
    metricValues[1].textContent = metrics.goalsCompleted;
    metricValues[2].textContent = metrics.xpGained;
    metricValues[3].textContent = metrics.engagement;
    
    // Animate value changes
    metricValues.forEach(value => {
        value.style.transform = 'scale(1.1)';
        value.style.color = '#10b981';
        setTimeout(() => {
            value.style.transform = 'scale(1)';
            value.style.color = '';
        }, 300);
    });
}

// Update chart based on selection
function updateChart(chartType) {
    const chartBars = document.querySelectorAll('.chart-bar');
    const chartPoints = document.querySelectorAll('.chart-point');
    
    // Animate chart transition
    chartBars.forEach((bar, index) => {
        setTimeout(() => {
            const newHeight = Math.random() * 80 + 20;
            bar.style.height = newHeight + '%';
        }, index * 50);
    });
    
    chartPoints.forEach((point, index) => {
        setTimeout(() => {
            const newBottom = Math.random() * 80 + 10;
            point.style.bottom = newBottom + '%';
        }, index * 75);
    });
    
    showNotification(`Gráfico atualizado: ${chartType}`);
}

// Filter activities
function filterActivities(filter) {
    const activityItems = document.querySelectorAll('.activity-item');
    
    activityItems.forEach(item => {
        const icon = item.querySelector('.activity-icon');
        let shouldShow = true;
        
        if (filter !== 'Todas') {
            shouldShow = false;
            if (filter === 'Estudos' && icon.classList.contains('study')) shouldShow = true;
            if (filter === 'Posts' && icon.classList.contains('post')) shouldShow = true;
            if (filter === 'Conquistas' && icon.classList.contains('achievement')) shouldShow = true;
        }
        
        if (shouldShow) {
            item.style.display = 'flex';
            item.style.animation = 'slideIn 0.3s ease-out';
        } else {
            item.style.display = 'none';
        }
    });
}

// Generate mock activities data
function generateActivitiesData(period) {
    const activities = [
        { type: 'study', text: 'completou uma sessão de estudo', subject: 'JavaScript Avançado', time: '30 minutos', xp: 50 },
        { type: 'post', text: 'publicou', subject: 'Dicas de CSS Grid', time: '1 hora', xp: 25 },
        { type: 'achievement', text: 'desbloqueou a conquista', subject: 'Streak de 10 dias', time: '2 horas', xp: 100 },
        { type: 'interaction', text: 'recebeu comentário de', subject: 'João Silva', time: '3 horas', xp: 10 }
    ];
    
    return activities;
}

// Add new activity
function addNewActivity() {
    const activityFeed = document.querySelector('.activity-feed');
    const activities = generateActivitiesData();
    const newActivity = activities[Math.floor(Math.random() * activities.length)];
    
    const activityElement = createActivityElement(newActivity);
    activityFeed.insertBefore(activityElement, activityFeed.firstChild);
    
    // Remove old activities to maintain performance
    const allActivities = activityFeed.querySelectorAll('.activity-item');
    if (allActivities.length > 10) {
        activityFeed.removeChild(allActivities[allActivities.length - 1]);
    }
}

// Create activity element
function createActivityElement(activity) {
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';
    activityItem.style.animation = 'slideIn 0.3s ease-out';
    
    activityItem.innerHTML = `
        <div class="activity-icon ${activity.type}">
            ${getActivityIcon(activity.type)}
        </div>
        <div class="activity-content">
            <p><strong>Você</strong> ${activity.text} <strong>${activity.subject}</strong></p>
            <span class="activity-time">Há ${activity.time}</span>
        </div>
        <div class="activity-xp">+${activity.xp} XP</div>
    `;
    
    return activityItem;
}

// Get activity icon
function getActivityIcon(type) {
    const icons = {
        study: '📚',
        post: '📝',
        achievement: '🏆',
        interaction: '💬'
    };
    return icons[type] || '📊';
}

// Update metrics with animation
function updateMetrics() {
    const metricValues = document.querySelectorAll('.metric-value');
    metricValues.forEach(value => {
        // Simulate small changes
        const currentText = value.textContent;
        if (currentText.includes('h')) {
            const hours = parseInt(currentText);
            value.textContent = currentText.replace(hours, hours + Math.floor(Math.random() * 3));
        }
    });
}

// Update progress bars
function updateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        const currentWidth = parseInt(bar.style.width) || 0;
        const newWidth = Math.min(currentWidth + Math.floor(Math.random() * 5), 100);
        bar.style.width = newWidth + '%';
    });
}

// Update notification badge
function updateNotificationBadge() {
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        const count = parseInt(badge.textContent) + Math.floor(Math.random() * 3);
        badge.textContent = Math.min(count, 9);
    }
}

// Animation helpers
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach((bar, index) => {
        const targetWidth = bar.style.width || '0%';
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.width = targetWidth;
        }, index * 200);
    });
}

function animateXPCounter() {
    const xpValue = document.querySelector('.stat-chip .stat-value');
    if (xpValue) {
        const target = parseInt(xpValue.textContent.replace(/[^\d]/g, ''));
        let current = 0;
        const increment = target / 50;
        
        const counter = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(counter);
            }
            xpValue.textContent = Math.floor(current).toLocaleString();
        }, 20);
    }
}

function animateDonutChart() {
    const donutChart = document.querySelector('.donut-chart');
    if (donutChart) {
        donutChart.style.transform = 'scale(0)';
        donutChart.style.transition = 'transform 0.5s ease-out';
        
        setTimeout(() => {
            donutChart.style.transform = 'scale(1)';
        }, 500);
    }
}

function animateButton(button) {
    button.style.transform = 'scale(0.95)';
    button.style.background = '#10b981';
    
    setTimeout(() => {
        button.style.transform = 'scale(1)';
        button.style.background = '';
    }, 150);
}

// Utility functions
function showLoadingState() {
    const mainContent = document.querySelector('.main-content');
    mainContent.classList.add('loading');
}

function hideLoadingState() {
    const mainContent = document.querySelector('.main-content');
    mainContent.classList.remove('loading');
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 16px 20px;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        font-size: 14px;
        max-width: 300px;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function updateXP(amount) {
    const xpValue = document.querySelector('.stat-chip .stat-value');
    if (xpValue) {
        const current = parseInt(xpValue.textContent.replace(/[^\d]/g, ''));
        const newValue = current + amount;
        xpValue.textContent = newValue.toLocaleString();
        
        // Animate XP bar
        const xpFill = document.querySelector('.xp-fill');
        if (xpFill) {
            const currentWidth = parseInt(xpFill.style.width) || 68;
            const newWidth = Math.min(currentWidth + (amount / 100), 100);
            xpFill.style.width = newWidth + '%';
        }
    }
}

function initializeTooltips() {
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const title = this.querySelector('h3').textContent;
            showTooltip(this, `Clique para ver detalhes de ${title}`);
        });
        
        card.addEventListener('mouseleave', function() {
            hideTooltip();
        });
    });
}

function showTooltip(element, text) {
    const tooltip = document.createElement('div');
    tooltip.id = 'tooltip';
    tooltip.style.cssText = `
        position: absolute;
        background: #1e293b;
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        white-space: nowrap;
        z-index: 10001;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s;
    `;
    tooltip.textContent = text;
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
    
    setTimeout(() => {
        tooltip.style.opacity = '1';
    }, 10);
}

function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
        tooltip.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(tooltip);
        }, 200);
    }
}

function showAchievementModal(achievement) {
    const title = achievement.querySelector('h4').textContent;
    const description = achievement.querySelector('p').textContent;
    
    // Simple modal simulation
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10002;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 32px;
        border-radius: 16px;
        text-align: center;
        max-width: 400px;
        margin: 20px;
    `;
    
    modalContent.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 16px;">🏆</div>
        <h3 style="margin-bottom: 8px; color: #1e293b;">${title}</h3>
        <p style="color: #64748b; margin-bottom: 24px;">${description}</p>
        <button onclick="this.closest('[style*=\"position: fixed\"]').remove()" 
                style="background: #3b82f6; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer;">
            Fechar
        </button>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                document.querySelector('.nav-item').click();
                break;
            case '2':
                e.preventDefault();
                document.querySelectorAll('.nav-item')[1]?.click();
                break;
            case 'n':
                e.preventDefault();
                document.querySelector('.notification-btn').click();
                break;
        }
    }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(-20px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    .metric-card:hover {
        animation: pulse 2s infinite;
    }
`;
document.head.appendChild(style);

console.log('ThatEasy Dashboard loaded successfully! 📊');

// Initialize dashboard on load
window.addEventListener('load', function() {
    showNotification('🎉 Dashboard carregado com sucesso!');
    
    // Simulate real-time data updates
    setTimeout(() => {
        addNewActivity();
    }, 5000);
}); 