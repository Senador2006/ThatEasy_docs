// Academic JavaScript for ThatEasy

document.addEventListener('DOMContentLoaded', function() {
    initializeAcademicFeatures();
    initializeCalendar();
    initializeSearchFunctionality();
    initializeResourceInteractions();
    initializeAITutor();
});

// Initialize academic features
function initializeAcademicFeatures() {
    // Navigation interactions
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navLinks.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            const section = this.querySelector('.nav-text').textContent;
            showAcademicNotification(`Navegando para: ${section}`);
            simulatePageLoad();
        });
    });

    // Course item interactions
    const courseItems = document.querySelectorAll('.course-item');
    courseItems.forEach(item => {
        item.addEventListener('click', function() {
            courseItems.forEach(course => course.classList.remove('active'));
            this.classList.add('active');
            
            const courseName = this.querySelector('h4').textContent;
            showAcademicNotification(`Disciplina selecionada: ${courseName}`);
            loadCourseDetails(courseName);
        });
    });

    // Filter buttons functionality
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterResources(this.textContent.trim());
        });
    });

    // Assignment progress interactions
    const assignmentItems = document.querySelectorAll('.assignment-item');
    assignmentItems.forEach(item => {
        item.addEventListener('click', function() {
            const title = this.querySelector('h4').textContent;
            const progressFill = this.querySelector('.progress-fill');
            const progressText = this.querySelector('.progress-text');
            
            // Simulate progress update
            const currentProgress = parseInt(progressFill.style.width) || 0;
            const newProgress = Math.min(currentProgress + 5, 100);
            
            progressFill.style.width = newProgress + '%';
            progressText.textContent = newProgress + '% concluído';
            
            if (newProgress === 100) {
                this.classList.remove('urgent');
                showAcademicNotification(`✅ ${title} - Atividade concluída!`);
            } else {
                showAcademicNotification(`📝 ${title} - Progresso atualizado: ${newProgress}%`);
            }
        });
    });

    // Study group interactions
    const joinButtons = document.querySelectorAll('.join-session-btn');
    joinButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const groupName = this.closest('.study-group-item').querySelector('h4').textContent;
            showAcademicNotification(`🎓 Entrando no grupo: ${groupName}`);
            simulateGroupJoin(groupName);
        });
    });

    // Create group button
    const createGroupBtn = document.querySelector('.create-group-btn');
    if (createGroupBtn) {
        createGroupBtn.addEventListener('click', function() {
            showCreateGroupModal();
        });
    }

    // Breadcrumb navigation
    const breadcrumbItems = document.querySelectorAll('.breadcrumb-item');
    breadcrumbItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.textContent;
            showAcademicNotification(`Navegando para: ${section}`);
            updateBreadcrumb(section);
        });
    });
}

// Calendar functionality
function initializeCalendar() {
    const calendarDays = document.querySelectorAll('.day');
    const currentMonth = document.querySelector('.current-month');
    let currentDate = new Date();

    calendarDays.forEach(day => {
        if (day.textContent.trim()) {
            day.addEventListener('click', function() {
                // Remove previous selections
                calendarDays.forEach(d => d.classList.remove('selected'));
                
                // Add selection to clicked day
                this.classList.add('selected');
                
                const dayNumber = this.textContent;
                showAcademicNotification(`📅 Data selecionada: ${dayNumber} de ${currentMonth.textContent}`);
                
                // Show events for selected day
                showDayEvents(dayNumber);
            });
        }
    });

    // Calendar navigation
    window.changeMonth = function(direction) {
        currentDate.setMonth(currentDate.getMonth() + direction);
        updateCalendarDisplay(currentDate);
        showAcademicNotification(`📅 Calendário atualizado: ${currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`);
    };
}

// Search functionality
function initializeSearchFunctionality() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    const searchFilter = document.querySelector('.search-filter');
    const suggestionTags = document.querySelectorAll('.suggestion-tag');

    // Search button click
    searchBtn.addEventListener('click', function() {
        performAcademicSearch();
    });

    // Enter key in search
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            performAcademicSearch();
        }
    });

    // Search as you type (debounced)
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            if (this.value.length > 2) {
                showSearchSuggestions(this.value);
            }
        }, 300);
    });

    // Suggestion tags
    suggestionTags.forEach(tag => {
        tag.addEventListener('click', function() {
            searchInput.value = this.textContent;
            performAcademicSearch();
        });
    });

    // Filter change
    searchFilter.addEventListener('change', function() {
        if (searchInput.value.trim()) {
            performAcademicSearch();
        }
    });
}

// Resource interactions
function initializeResourceInteractions() {
    // Resource action buttons
    const resourceBtns = document.querySelectorAll('.resource-btn');
    resourceBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const action = this.querySelector('span:last-child').textContent;
            const resourceTitle = this.closest('.resource-item').querySelector('h3').textContent;
            
            handleResourceAction(action, resourceTitle);
            animateButton(this);
        });
    });

    // Featured content actions
    const featuredBtns = document.querySelectorAll('.btn-primary, .btn-secondary');
    featuredBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const action = this.textContent.trim();
            const title = this.closest('.featured-item').querySelector('h3, h4').textContent;
            
            handleResourceAction(action, title);
            animateButton(this);
        });
    });

    // Load more functionality
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            loadMoreResources();
        });
    }

    // Resource item hover effects
    const resourceItems = document.querySelectorAll('.resource-item');
    resourceItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// AI Tutor functionality
function initializeAITutor() {
    const aiSuggestionBtns = document.querySelectorAll('.ai-suggestion-btn');
    const aiChatBtn = document.querySelector('.ai-chat-btn');

    aiSuggestionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const suggestion = this.textContent;
            showAcademicNotification(`🤖 Solicitação enviada: ${suggestion}`);
            simulateAIResponse(suggestion);
        });
    });

    if (aiChatBtn) {
        aiChatBtn.addEventListener('click', function() {
            openAITutorChat();
        });
    }
}

// Helper Functions

function performAcademicSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchFilter = document.querySelector('.search-filter');
    const query = searchInput.value.trim();
    const filter = searchFilter.value;

    if (!query) {
        showAcademicNotification('⚠️ Digite um termo para buscar');
        return;
    }

    showLoadingState();
    showAcademicNotification(`🔍 Buscando por: "${query}" em ${filter}`);

    // Simulate search delay
    setTimeout(() => {
        hideLoadingState();
        const resultsCount = Math.floor(Math.random() * 500) + 50;
        showAcademicNotification(`📊 Encontrados ${resultsCount} resultados para "${query}"`);
        displaySearchResults(query, filter, resultsCount);
    }, 1000);
}

function showSearchSuggestions(query) {
    const suggestions = [
        'Machine Learning algorithms',
        'Cálculo diferencial',
        'Programação orientada a objetos',
        'Estruturas de dados',
        'Física quântica',
        'Algoritmos de ordenação'
    ].filter(s => s.toLowerCase().includes(query.toLowerCase()));

    if (suggestions.length > 0) {
        // Create suggestions dropdown (simplified)
        console.log('Sugestões:', suggestions);
    }
}

function filterResources(filterType) {
    const resourceItems = document.querySelectorAll('.resource-item');
    
    resourceItems.forEach(item => {
        const resourceType = item.querySelector('.resource-type-badge').textContent;
        
        if (filterType === 'Todos' || resourceType.includes(filterType)) {
            item.style.display = 'block';
            item.style.animation = 'fadeIn 0.3s ease-out';
        } else {
            item.style.display = 'none';
        }
    });

    showAcademicNotification(`📋 Filtro aplicado: ${filterType}`);
}

function handleResourceAction(action, resourceTitle) {
    const actionMessages = {
        'Ler Artigo': '📖 Abrindo artigo para leitura',
        'Ler Online': '📖 Abrindo livro online',
        'Assistir': '▶️ Iniciando videoaula',
        'Download': '📥 Download iniciado',
        'Download PDF': '📥 Download do PDF iniciado',
        'Citar': '📋 Citação copiada para área de transferência',
        'Salvar': '🔖 Recurso salvo na biblioteca pessoal',
        'Favoritar': '⭐ Adicionado aos favoritos',
        'Compartilhar': '📤 Opções de compartilhamento abertas',
        'Continuar': '📝 Continuando exercícios',
        'Resoluções': '✅ Abrindo resoluções',
        'Anotações': '📝 Abrindo bloco de anotações',
        'Quiz': '📊 Iniciando quiz interativo',
        'Relatório': '📊 Gerando relatório de progresso',
        'Dicas': '💡 Mostrando dicas de estudo'
    };

    const message = actionMessages[action] || `⚡ Ação executada: ${action}`;
    showAcademicNotification(`${message} - ${resourceTitle.substring(0, 50)}...`);

    // Simulate specific actions
    if (action.includes('Download')) {
        simulateDownload(resourceTitle);
    } else if (action === 'Citar') {
        generateCitation(resourceTitle);
    } else if (action === 'Quiz') {
        openQuizModal(resourceTitle);
    }
}

function loadCourseDetails(courseName) {
    showLoadingState();
    
    setTimeout(() => {
        hideLoadingState();
        
        // Simulate loading course-specific content
        const courseData = {
            'Algoritmos e Estruturas de Dados': {
                nextClass: 'Árvores Binárias',
                assignment: 'Implementação de BST',
                progress: 78
            },
            'Cálculo Diferencial e Integral': {
                nextClass: 'Integrais Definidas',
                assignment: 'Lista de Integrais',
                progress: 65
            }
        };

        const data = courseData[courseName];
        if (data) {
            showAcademicNotification(`📚 ${courseName} - Próxima aula: ${data.nextClass}`);
        }
    }, 500);
}

function simulateGroupJoin(groupName) {
    showLoadingState();
    
    setTimeout(() => {
        hideLoadingState();
        showAcademicNotification(`✅ Entrou no grupo "${groupName}" com sucesso!`);
        
        // Simulate opening group interface
        setTimeout(() => {
            showAcademicNotification(`👥 ${Math.floor(Math.random() * 5) + 3} membros online no grupo`);
        }, 1000);
    }, 800);
}

function openAITutorChat() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(44, 62, 80, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;

    const chatInterface = document.createElement('div');
    chatInterface.style.cssText = `
        background: white;
        width: 500px;
        height: 600px;
        border-radius: 12px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    `;

    chatInterface.innerHTML = `
        <div style="background: #2c3e50; color: white; padding: 20px; display: flex; justify-content: space-between; align-items: center;">
            <h3>🤖 Tutor IA Acadêmico</h3>
            <button onclick="this.closest('[style*=\"position: fixed\"]').remove()" 
                    style="background: none; border: none; color: white; font-size: 20px; cursor: pointer;">✕</button>
        </div>
        <div style="flex: 1; padding: 20px; overflow-y: auto;">
            <div style="background: #ecf0f1; padding: 12px; border-radius: 8px; margin-bottom: 12px;">
                <strong>Tutor IA:</strong> Olá! Sou seu tutor acadêmico. Em que posso ajudar com seus estudos hoje?
            </div>
        </div>
        <div style="padding: 20px; border-top: 1px solid #ecf0f1;">
            <div style="display: flex; gap: 8px;">
                <input type="text" placeholder="Digite sua pergunta..." 
                       style="flex: 1; padding: 12px; border: 1px solid #bdc3c7; border-radius: 6px;">
                <button style="background: #3498db; color: white; border: none; padding: 12px 20px; border-radius: 6px; cursor: pointer;">
                    Enviar
                </button>
            </div>
        </div>
    `;

    modal.appendChild(chatInterface);
    document.body.appendChild(modal);

    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

function simulateAIResponse(suggestion) {
    const responses = {
        'Explicar conceito': 'Posso explicar qualquer conceito acadêmico. Sobre qual tópico você gostaria de aprender?',
        'Resolver exercício': 'Vou ajudar você a resolver exercícios passo a passo. Compartilhe o exercício!',
        'Revisar matéria': 'Que matéria você gostaria de revisar? Posso criar um plano de estudos personalizado.'
    };

    setTimeout(() => {
        const response = responses[suggestion] || 'Como posso ajudar você com seus estudos?';
        showAcademicNotification(`🤖 Tutor IA: ${response}`);
    }, 1000);
}

function loadMoreResources() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    const resourcesList = document.querySelector('.resources-list');
    
    loadMoreBtn.style.opacity = '0.6';
    loadMoreBtn.disabled = true;
    loadMoreBtn.querySelector('span').textContent = 'Carregando...';

    setTimeout(() => {
        // Simulate adding new resources
        for (let i = 0; i < 3; i++) {
            const newResource = createResourceElement();
            resourcesList.appendChild(newResource);
        }

        loadMoreBtn.style.opacity = '1';
        loadMoreBtn.disabled = false;
        loadMoreBtn.querySelector('span').textContent = 'Carregar mais recursos';
        
        showAcademicNotification('📚 Novos recursos carregados');
    }, 1500);
}

function createResourceElement() {
    const resourceTypes = ['article', 'video', 'exercise', 'reference'];
    const type = resourceTypes[Math.floor(Math.random() * resourceTypes.length)];
    
    const resource = document.createElement('article');
    resource.className = 'resource-item';
    resource.style.animation = 'fadeIn 0.3s ease-out';
    
    resource.innerHTML = `
        <div class="resource-type-badge ${type}">${type}</div>
        <div class="resource-content">
            <div class="resource-header">
                <h3>Novo Recurso Acadêmico ${Math.floor(Math.random() * 1000)}</h3>
                <div class="resource-rating">
                    <span class="stars">⭐⭐⭐⭐⭐</span>
                    <span class="rating-value">4.${Math.floor(Math.random() * 9)}/5</span>
                </div>
            </div>
            <div class="resource-meta">
                <span class="authors">Prof. Exemplo</span>
                <span class="separator">•</span>
                <span class="course">Curso Exemplo</span>
            </div>
            <p class="resource-abstract">
                Este é um recurso acadêmico de exemplo carregado dinamicamente para demonstrar 
                a funcionalidade de carregamento adicional de conteúdo.
            </p>
            <div class="resource-actions">
                <button class="resource-btn primary">
                    <span class="btn-icon">📖</span>
                    <span>Ver Recurso</span>
                </button>
                <button class="resource-btn">
                    <span class="btn-icon">🔖</span>
                    <span>Salvar</span>
                </button>
            </div>
        </div>
    `;
    
    // Add event listeners to new buttons
    const newBtns = resource.querySelectorAll('.resource-btn');
    newBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const action = this.querySelector('span:last-child').textContent;
            handleResourceAction(action, 'Novo Recurso');
            animateButton(this);
        });
    });
    
    return resource;
}

function showCreateGroupModal() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(44, 62, 80, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;

    modal.innerHTML = `
        <div style="background: white; padding: 32px; border-radius: 12px; width: 400px; max-width: 90vw;">
            <h3 style="margin-bottom: 20px; color: #2c3e50;">👥 Criar Novo Grupo de Estudo</h3>
            <form>
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 6px; font-weight: bold;">Nome do Grupo:</label>
                    <input type="text" style="width: 100%; padding: 10px; border: 1px solid #bdc3c7; border-radius: 6px;">
                </div>
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 6px; font-weight: bold;">Disciplina:</label>
                    <select style="width: 100%; padding: 10px; border: 1px solid #bdc3c7; border-radius: 6px;">
                        <option>Algoritmos e Estruturas de Dados</option>
                        <option>Cálculo Diferencial</option>
                        <option>Programação OO</option>
                        <option>Física</option>
                    </select>
                </div>
                <div style="display: flex; gap: 12px; margin-top: 24px;">
                    <button type="button" onclick="this.closest('[style*=\"position: fixed\"]').remove()" 
                            style="flex: 1; padding: 12px; background: #95a5a6; color: white; border: none; border-radius: 6px; cursor: pointer;">
                        Cancelar
                    </button>
                    <button type="submit" 
                            style="flex: 1; padding: 12px; background: #3498db; color: white; border: none; border-radius: 6px; cursor: pointer;">
                        Criar Grupo
                    </button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    // Handle form submission
    const form = modal.querySelector('form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const groupName = this.querySelector('input').value;
        if (groupName.trim()) {
            showAcademicNotification(`✅ Grupo "${groupName}" criado com sucesso!`);
            document.body.removeChild(modal);
        }
    });

    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Utility functions
function showLoadingState() {
    const mainContent = document.querySelector('.main-academic-content');
    if (mainContent) {
        mainContent.style.opacity = '0.6';
        mainContent.style.pointerEvents = 'none';
    }
}

function hideLoadingState() {
    const mainContent = document.querySelector('.main-academic-content');
    if (mainContent) {
        mainContent.style.opacity = '1';
        mainContent.style.pointerEvents = 'auto';
    }
}

function simulatePageLoad() {
    showLoadingState();
    setTimeout(() => {
        hideLoadingState();
    }, 800);
}

function animateButton(button) {
    button.style.transform = 'scale(0.95)';
    button.style.transition = 'transform 0.1s ease';
    
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 100);
}

function showAcademicNotification(message) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.academic-notification');
    existingNotifications.forEach(notif => notif.remove());

    const notification = document.createElement('div');
    notification.className = 'academic-notification';
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: white;
        border: 1px solid #3498db;
        border-left: 4px solid #3498db;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(44, 62, 80, 0.15);
        z-index: 10001;
        font-size: 14px;
        max-width: 350px;
        animation: slideIn 0.3s ease-out;
        font-family: 'Times New Roman', Georgia, serif;
        color: #2c3e50;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

function updateCalendarDisplay(date) {
    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    const currentMonth = document.querySelector('.current-month');
    if (currentMonth) {
        currentMonth.textContent = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    }
}

function showDayEvents(day) {
    const events = {
        '26': ['Entrega de Projeto - CC302', 'Prova de Cálculo - MAT201'],
        '30': ['Apresentação Final', 'Revisão de Literatura'],
        '15': ['Seminário de IA', 'Workshop React'],
        '20': ['Defesa de TCC', 'Palestra Algoritmos']
    };

    const dayEvents = events[day];
    if (dayEvents && dayEvents.length > 0) {
        const eventsList = dayEvents.join('\n• ');
        showAcademicNotification(`📅 Eventos do dia ${day}:\n• ${eventsList}`);
    } else {
        showAcademicNotification(`📅 Nenhum evento agendado para o dia ${day}`);
    }
}

function updateBreadcrumb(section) {
    const breadcrumbCurrent = document.querySelector('.breadcrumb-current');
    if (breadcrumbCurrent) {
        breadcrumbCurrent.textContent = section;
    }
}

function generateCitation(title) {
    const citation = `${title}. Disponível em: ThatEasy Platform. Acesso em: ${new Date().toLocaleDateString('pt-BR')}.`;
    
    // Copy to clipboard if available
    if (navigator.clipboard) {
        navigator.clipboard.writeText(citation).then(() => {
            showAcademicNotification('📋 Citação copiada para área de transferência');
        });
    } else {
        showAcademicNotification('📋 Citação gerada (copie manualmente)');
        console.log('Citação:', citation);
    }
}

function simulateDownload(title) {
    const downloadProgress = document.createElement('div');
    downloadProgress.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: white;
        border: 1px solid #3498db;
        padding: 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10002;
        width: 300px;
    `;

    downloadProgress.innerHTML = `
        <div style="margin-bottom: 8px; font-weight: bold;">📥 Baixando...</div>
        <div style="margin-bottom: 8px; font-size: 12px;">${title.substring(0, 40)}...</div>
        <div style="width: 100%; height: 6px; background: #ecf0f1; border-radius: 3px;">
            <div id="download-progress" style="width: 0%; height: 100%; background: #3498db; border-radius: 3px; transition: width 0.3s;"></div>
        </div>
        <div style="font-size: 12px; color: #7f8c8d; margin-top: 4px;">0% concluído</div>
    `;

    document.body.appendChild(downloadProgress);

    // Simulate download progress
    let progress = 0;
    const progressBar = downloadProgress.querySelector('#download-progress');
    const progressText = downloadProgress.querySelector('[style*="margin-top: 4px"]');

    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;

        progressBar.style.width = progress + '%';
        progressText.textContent = Math.floor(progress) + '% concluído';

        if (progress >= 100) {
            clearInterval(progressInterval);
            progressText.textContent = '✅ Download concluído!';
            setTimeout(() => {
                document.body.removeChild(downloadProgress);
            }, 2000);
        }
    }, 200);
}

function openQuizModal(resourceTitle) {
    const questions = [
        {
            question: "Qual a complexidade do algoritmo Bubble Sort?",
            options: ["O(n)", "O(n log n)", "O(n²)", "O(2ⁿ)"],
            correct: 2
        },
        {
            question: "O que é uma árvore binária?",
            options: ["Estrutura linear", "Estrutura hierárquica", "Estrutura circular", "Estrutura matricial"],
            correct: 1
        }
    ];

    // Create quiz modal (simplified version)
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(44, 62, 80, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;

    modal.innerHTML = `
        <div style="background: white; padding: 32px; border-radius: 12px; width: 500px; max-width: 90vw;">
            <h3 style="margin-bottom: 20px; color: #2c3e50;">📊 Quiz: ${resourceTitle}</h3>
            <p style="margin-bottom: 20px; color: #7f8c8d;">Teste seus conhecimentos!</p>
            <div style="text-align: center;">
                <button onclick="this.closest('[style*=\"position: fixed\"]').remove()" 
                        style="background: #3498db; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer;">
                    Iniciar Quiz
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Keyboard shortcuts for academic environment
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 'k':
                e.preventDefault();
                document.querySelector('.search-input').focus();
                break;
            case 'b':
                e.preventDefault();
                document.querySelector('.nav-link').click();
                break;
            case 'h':
                e.preventDefault();
                showAcademicNotification('🔑 Atalhos: Ctrl+K (buscar), Ctrl+B (biblioteca), Ctrl+H (ajuda)');
                break;
        }
    }
});

// Add CSS animations for academic theme
const academicStyle = document.createElement('style');
academicStyle.textContent = `
    @keyframes slideIn {
        from { transform: translateX(20px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .academic-notification {
        font-family: 'Times New Roman', Georgia, serif;
    }
    
    .day.selected {
        background: #3498db !important;
        color: white !important;
        font-weight: bold;
    }
`;
document.head.appendChild(academicStyle);

console.log('ThatEasy Academic Platform loaded successfully! 🎓');

// Initialize with welcome message
window.addEventListener('load', function() {
    setTimeout(() => {
        showAcademicNotification('🎓 Bem-vindo à Plataforma Acadêmica ThatEasy!');
    }, 1000);
}); 