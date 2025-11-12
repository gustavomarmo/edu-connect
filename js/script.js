// gustavomarmo/edu-connect/edu-connect-054a0530013bd5b510abada99aec7585770a74b4/script.js

/**
 * ----------------------------------------------------------------
 * script.js - A CAMADA DE APLICAÇÃO (O "GERENTE" / "MAESTRO")
 * ----------------------------------------------------------------
 * * Responsabilidade: Orquestrar o fluxo da aplicação.
 * - Importa 'apiService' e 'uiManager'.
 * - Ouve os eventos do usuário (cliques, submits).
 * - Chama o 'apiService' para buscar dados.
 * - Passa os dados para o 'uiManager' renderizar.
 * - Mantém o estado mínimo da aplicação (ex: 'currentUserRole', 'currentViewDate').
 */

// --- 1. IMPORTAÇÕES ---
import * as api from './apiService.js';
import * as ui from './uiManager.js';

// --- 2. ESTADO DA APLICAÇÃO E AUTENTICAÇÃO ---

const currentUserRole = localStorage.getItem('userRole');
if (!currentUserRole) {
    window.location.href = 'login.html';
}

// Elementos globais para listeners
const toggleButton = document.getElementById('toggle-btn');
const sidebar = document.querySelector('.sidebar');
const sunBtn = document.getElementById('theme-sun');
const moonBtn = document.getElementById('theme-moon');
const body = document.body;

// Mantém o estado de qual mês o calendário está vendo
let currentViewDate = new Date();


// --- 3. INICIALIZAÇÃO DA APLICAÇÃO ---

/**
 * Ocorre quando o DOM está pronto. Ponto de entrada principal.
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Configura a UI inicial (tema e sidebar)
    ui.applySavedTheme();
    ui.setupSidebar(currentUserRole);
    
    // 2. Configura os "ouvintes" de eventos globais
    setupGlobalEventListeners();
    
    // 3. Carrega a página inicial (dashboard)
    const initialPageUrl = document.querySelector('#nav-dashboard a').getAttribute('href');
    loadPage(initialPageUrl);
});


// --- 4. CARREGADOR DE PÁGINA (O ORQUESTRADOR) ---

/**
 * Carrega o HTML de uma sub-página, injeta no #page-content
 * e chama a função "controladora" correta para popular os dados.
 * @param {string} url - A URL da página (ex: "pages/alunos.html")
 */
async function loadPage(url) {
    try {
        const response = await fetch(url);
        
        // Se a dashboard específica (ex: -aluno) não existir, tenta carregar uma genérica
        if (!response.ok && url.includes('dashboard-')) {
            // Nota: O seu projeto original não tem um "dashboard.html" genérico,
            // mas esta é uma boa prática de fallback.
            // Por enquanto, vamos apenas tratar como 404.
            throw new Error(`Página não encontrada: ${response.status}`);
        }
        
        const content = await response.text();
        document.getElementById('page-content').innerHTML = content;

        // Aplica permissões (read-only) ANTES de carregar os dados
        ui.applyPagePermissions(currentUserRole, url);

        // --- MÁGICA DA ORQUESTRAÇÃO ---
        // Após o HTML carregar, chama a função "controladora"
        // para buscar dados da API e renderizar no UI.
        
        if (url.includes('calendario.html')) {
            await initializeCalendarPage();
        } else if (url.includes('alunos.html')) {
            await initializeAlunosPage();
        } else if (url.includes('professores.html')) {
            await initializeProfessoresPage();
        } else if (url.includes('desempenho.html')) {
            await initializeDesempenhoPage();
        } else if (url.includes('dashboard-professor.html')) {
            await initializeProfessorDashboard();
        } else if (url.includes('dashboard-coordenador.html')) {
            await initializeCoordenadorDashboard();
        }
        // Nenhuma ação de inicialização necessária para 'dashboard-aluno.html'

    } catch (error) {
        console.error("Erro ao carregar a página:", error);
        document.getElementById('page-content').innerHTML = `<h1>Erro 404</h1><p>A página <code>${url}</code> não foi encontrada.</p>`;
    }
}


// --- 5. FUNÇÕES CONTROLADORAS (POR PÁGINA) ---
// Cada função é responsável por "montar" uma página.

async function initializeCalendarPage() {
    try {
        // 1. Busca dados
        const events = await api.getCalendarEvents();
        // 2. Renderiza UI
        ui.renderCalendar(currentViewDate, events);
    } catch (e) { 
        console.error("Erro ao inicializar calendário:", e); 
        // Aqui você poderia chamar ui.showError("Falha ao carregar eventos.")
    }
}

async function initializeAlunosPage(filter = '') {
    try {
        // 1. Busca dados (com filtro, se houver)
        const students = await api.getStudents(filter);
        // 2. Renderiza UI
        ui.renderStudentTable(students);
    } catch (e) { 
        console.error("Erro ao inicializar alunos:", e); 
    }
}

async function initializeProfessoresPage(filter = '') {
    try {
        // 1. Busca dados
        const teachers = await api.getTeachers(filter);
        // 2. Renderiza UI
        ui.renderTeacherTable(teachers);
    } catch (e) { 
        console.error("Erro ao inicializar professores:", e); 
    }
}

async function initializeDesempenhoPage() {
    try {
        // 1. Busca dados (em paralelo para performance)
        const [boletimData, absenceData, subjects] = await Promise.all([
            api.getBoletimData(),
            api.getAbsenceData(),
            api.getAvailableSubjects()
        ]);
        
        // 2. Renderiza UI
        ui.renderBoletimTable(boletimData);
        ui.renderAbsenceTable(absenceData);
        ui.populateSubjectSelect(subjects);
        
        // 3. Renderiza o gráfico com a primeira matéria da lista
        if (subjects.length > 0) {
            await updateEvolutionChart(subjects[0]);
        }
    } catch (e) { 
        console.error("Erro ao inicializar desempenho:", e); 
    }
}

/** Função separada para o gráfico, pois ele muda com 'input' */
async function updateEvolutionChart(subject) {
     try {
        // 1. Busca dados
        const chartData = await api.getSubjectEvolutionData(subject);
        // 2. Renderiza UI
        ui.renderEvolutionChart(chartData.labels, chartData.data);
     } catch (e) { 
         console.error("Erro ao atualizar gráfico:", e); 
     }
}

async function initializeProfessorDashboard() {
    try {
        // 1. Busca dados
        const data = await api.getProfessorDashboardData();
        // 2. Renderiza UI
        ui.renderProfessorDashboard(data.kpis, data.alunosAtencao);
    } catch (e) { 
        console.error("Erro ao inicializar dashboard do professor:", e); 
    }
}

async function initializeCoordenadorDashboard() {
    try {
        // 1. Busca dados
        const data = await api.getCoordenadorDashboardData();
        // 2. Renderiza UI (em partes)
        ui.renderCoordenadorKPIs(data.kpis);
        ui.renderCoordenadorBarChart(data.barChartData);
        ui.renderCoordenadorPieChart(data.pieChartData);
        ui.renderProximosEventosCoord(data.proximosEventos);
    } catch (e) { 
        console.error("Erro ao inicializar dashboard do coordenador:", e); 
    }
}


// --- 6. GERENCIAMENTO DE EVENTOS GLOBAIS ---

function setupGlobalEventListeners() {
    
    // --- Listeners da "Casca" (Sidebar, Tema, Logout) ---
    
    toggleButton.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });

    sunBtn.addEventListener('click', () => {
        body.classList.remove('dark-mode');
        sunBtn.classList.add('active');
        moonBtn.classList.remove('active');
        localStorage.setItem('theme', 'light');
    });

    moonBtn.addEventListener('click', () => {
        body.classList.add('dark-mode');
        moonBtn.classList.add('active');
        sunBtn.classList.remove('active');
        localStorage.setItem('theme', 'dark');
    });
    
    document.getElementById('logout-btn').addEventListener('click', (event) => {
        event.preventDefault();
        // Limpa tudo
        localStorage.removeItem('userRole');
        localStorage.removeItem('theme');
        localStorage.removeItem('calendarEvents'); 
        window.location.href = 'login.html';
    });

    // --- Listener para links da Sidebar ---
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); 
            const href = link.getAttribute('href');
            if (href && href !== '#') {
                loadPage(href);
            }
        });
    });

    // --- Delegação de Eventos no #main-content (Onde as páginas são carregadas) ---
    const mainContent = document.getElementById('main-content');

    // --- 1. OUVINTE DE CLIQUES ---
    mainContent.addEventListener('click', async (event) => {
        const target = event.target; // O elemento exato que foi clicado

        // Links de navegação DENTRO do #page-content (Ex: Acesso Rápido do Dashboard)
        const navLink = target.closest('.nav-link');
        if (navLink) {
            event.preventDefault();
            const href = navLink.getAttribute('href');
            if (href && href !== '#') {
                loadPage(href);
            }
            return; 
        }
        
        // --- Calendário ---
        if (target.closest('#next-month')) {
            currentViewDate.setMonth(currentViewDate.getMonth() + 1);
            await initializeCalendarPage(); // Re-renderiza o calendário
            return; 
        }
        if (target.closest('#prev-month')) {
            currentViewDate.setMonth(currentViewDate.getMonth() - 1);
            await initializeCalendarPage();
            return; 
        }
        const dayCell = target.closest('.calendar-day[data-date]');
        if (dayCell) {
            // Se a página for read-only (definido pelo ui.applyPagePermissions), não faz nada
            if (document.getElementById('page-content').classList.contains('read-only')) return;
            
            ui.openEventModal(dayCell.dataset.date);
            return; 
        }
        if (target.id === 'close-modal' || target.id === 'event-modal-overlay') {
            ui.closeEventModal();
            return; 
        }

        // --- Tabelas (Editar, Deletar, Adicionar) ---
        const editLink = target.closest('.action-edit[data-id]');
        if (editLink) {
            event.preventDefault(); 
            alert(`Função "Editar" (ID: ${editLink.dataset.id}) não implementada.`);
            return;
        }
        
        const deleteBtn = target.closest('.action-delete i[data-id]');
        if (deleteBtn) {
            const id = deleteBtn.dataset.id;
            if (!confirm("Tem certeza que deseja remover este registro?")) return;

            try {
                if (deleteBtn.closest('#student-table')) {
                    await api.deleteStudent(id);      // Chama API
                    await initializeAlunosPage();   // Recarrega
                } else if (deleteBtn.closest('#teacher-table')) {
                    await api.deleteTeacher(id);      // Chama API
                    await initializeProfessoresPage(); // Recarrega
                }
            } catch (err) {
                console.error("Erro ao deletar:", err);
                alert("Falha ao remover o registro.");
            }
            return;
        }

        if (target.closest('#btn-add-student')) {
            event.preventDefault(); 
            ui.showForm('form-novo-aluno');
            return; 
        }
        if (target.closest('#btn-add-teacher')) {
            event.preventDefault(); 
            ui.showForm('form-novo-professor');
            return; 
        }
    });

    // --- 2. OUVINTE DE SUBMISSÕES DE FORMULÁRIO ---
    mainContent.addEventListener('submit', async (event) => {
        event.preventDefault(); // Previne o recarregamento da página
        
        // Form: Modal de Evento do Calendário
        if (event.target.id === 'event-form') {
            const { date, title } = ui.getEventModalData();
            if (!title) {
                alert("Por favor, insira um título para o evento.");
                return;
            }
            try {
                await api.saveCalendarEvent(date, title);
                ui.closeEventModal();
                await initializeCalendarPage(); // Recarrega o calendário
            } catch(e) {
                alert("Falha ao salvar evento.");
            }
            return; 
        }

        // Form: Novo Aluno
        if (event.target.id === 'aluno-form') {
            const studentData = ui.getStudentFormData();
            if (!studentData) {
                alert("Por favor, preencha todos os campos obrigatórios.");
                return;
            }
            try {
                await api.addStudent(studentData);
                await initializeAlunosPage(); // Recarrega a tabela
                ui.clearAndFocusForm('aluno-form', 'aluno-matricula');
            } catch (e) {
                alert("Falha ao salvar aluno.");
            }
            return; 
        }

        // Form: Novo Professor
        if (event.target.id === 'professor-form') {
            const teacherData = ui.getTeacherFormData();
             if (!teacherData) {
                alert("Por favor, preencha todos os campos obrigatórios.");
                return;
            }
            try {
                await api.addTeacher(teacherData);
                await initializeProfessoresPage(); // Recarrega a tabela
                ui.clearAndFocusForm('professor-form', 'prof-matricula');
            } catch (e) {
                alert("Falha ao salvar professor.");
            }
            return; 
        }
    });
    
    // --- 3. OUVINTE DE INPUTS (Filtros e Gráficos) ---
    mainContent.addEventListener('input', (event) => {
        const target = event.target;
        
        // Filtro de Alunos
        if (target.id === 'student-search-input') {
            // Re-inicializa a página de alunos com o filtro
            initializeAlunosPage(target.value);
        }
        
        // Filtro de Professores
        else if (target.id === 'teacher-search-input') {
            initializeProfessoresPage(target.value);
        }
        
        // Select de Matéria (Gráfico de Desempenho)
        else if (target.id === 'subject-select') {
            updateEvolutionChart(target.value);
        }
    });
}