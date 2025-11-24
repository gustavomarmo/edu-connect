 

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

// Importações
import * as api from './apiService.js';
import * as ui from './uiManager.js';

const currentUserRole = localStorage.getItem('userRole');
if (!currentUserRole) {
    window.location.href = 'login.html';
}

const toggleButton = document.getElementById('toggle-btn');
const sidebar = document.querySelector('.sidebar');
const sunBtn = document.getElementById('theme-sun');
const moonBtn = document.getElementById('theme-moon');
const body = document.body;

let currentViewDate = new Date();

document.addEventListener('DOMContentLoaded', () => {
     
    ui.applySavedTheme();
    ui.setupSidebar(currentUserRole);
    
     
    setupGlobalEventListeners();
    
     
    const initialPageUrl = document.querySelector('#nav-dashboard a').getAttribute('href');
    loadPage(initialPageUrl);
});


 

/**
 * Carrega o HTML de uma sub-página, injeta no #page-content
 * e chama a função "controladora" correta para popular os dados.
 * @param {string} url - A URL da página (ex: "pages/alunos.html")
 */
async function loadPage(url) {
    try {
        const response = await fetch(url);
        
        if (!response.ok && url.includes('dashboard-')) {
            throw new Error(`Página não encontrada: ${response.status}`);
        }
        
        const content = await response.text();
        document.getElementById('page-content').innerHTML = content;

        ui.applyPagePermissions(currentUserRole, url);

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
        } else if (url.includes('materias.html')) {
            await initializeMateriasPage();
        }

    } catch (error) {
        console.error("Erro ao carregar a página:", error);
        document.getElementById('page-content').innerHTML = `<h1>Erro 404</h1><p>A página <code>${url}</code> não foi encontrada.</p>`;
    }
}

async function initializeCalendarPage() {
    try {
        const events = await api.getCalendarEvents();
        ui.renderCalendar(currentViewDate, events);
    } catch (e) { 
        console.error("Erro ao inicializar calendário:", e); 
    }
}

async function initializeAlunosPage(filter = '') {
    try {
         
        const students = await api.getStudents(filter);
         
        ui.renderStudentTable(students);
    } catch (e) { 
        console.error("Erro ao inicializar alunos:", e); 
    }
}

async function initializeProfessoresPage(filter = '') {
    try {
         
        const teachers = await api.getTeachers(filter);
         
        ui.renderTeacherTable(teachers);
    } catch (e) { 
        console.error("Erro ao inicializar professores:", e); 
    }
}

async function initializeDesempenhoPage() {
    try {
         
        const [boletimData, absenceData, subjects] = await Promise.all([
            api.getBoletimData(),
            api.getAbsenceData(),
            api.getAvailableSubjects()
        ]);
        
         
        ui.renderBoletimTable(boletimData);
        ui.renderAbsenceTable(absenceData);
        ui.populateSubjectSelect(subjects);
        
         
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
         
        const chartData = await api.getSubjectEvolutionData(subject);
         
        ui.renderEvolutionChart(chartData.labels, chartData.data);
     } catch (e) { 
         console.error("Erro ao atualizar gráfico:", e); 
     }
}

async function initializeProfessorDashboard() {
    try {
         
        const data = await api.getProfessorDashboardData();
         
        ui.renderProfessorDashboard(data.kpis, data.alunosAtencao);
    } catch (e) { 
        console.error("Erro ao inicializar dashboard do professor:", e); 
    }
}

async function initializeCoordenadorDashboard() {
    try {
         
        const data = await api.getCoordenadorDashboardData();
         
        ui.renderCoordenadorKPIs(data.kpis);
        ui.renderCoordenadorBarChart(data.barChartData);
        ui.renderCoordenadorPieChart(data.pieChartData);
        ui.renderProximosEventosCoord(data.proximosEventos);
    } catch (e) { 
        console.error("Erro ao inicializar dashboard do coordenador:", e); 
    }
}

async function initializeMateriasPage() {
    try {
        const subjects = await api.getSubjectsList();
        
         
        const onSubjectSelect = async (subjectName) => {
             
            const content = await api.getSubjectContent(subjectName);
             
            ui.renderSubjectContent(subjectName, content, currentUserRole);
        };

         
        ui.renderMateriasSidebar(subjects, onSubjectSelect);
        
         
        if (subjects.length > 0) {
            onSubjectSelect(subjects[0]);
        }

    } catch (e) {
        console.error("Erro ao carregar matérias:", e);
    }
}

function setupGlobalEventListeners() {
    
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
         
        localStorage.removeItem('userRole');
        localStorage.removeItem('theme');
        localStorage.removeItem('calendarEvents'); 
        window.location.href = 'login.html';
    });
     
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); 
            const href = link.getAttribute('href');
            if (href && href !== '#') {
                loadPage(href);
            }
        });
    });

    const mainContent = document.getElementById('main-content');

    mainContent.addEventListener('click', async (event) => {
        const target = event.target;  

         
        const navLink = target.closest('.nav-link');
        if (navLink) {
            event.preventDefault();
            const href = navLink.getAttribute('href');
            if (href && href !== '#') {
                loadPage(href);
            }
            return; 
        }
        if (target.closest('#next-month')) {
            currentViewDate.setMonth(currentViewDate.getMonth() + 1);
            await initializeCalendarPage();  
            return; 
        }
        if (target.closest('#prev-month')) {
            currentViewDate.setMonth(currentViewDate.getMonth() - 1);
            await initializeCalendarPage();
            return; 
        }
        const dayCell = target.closest('.calendar-day[data-date]');
        if (dayCell) {
             
            if (document.getElementById('page-content').classList.contains('read-only')) return;
            
            ui.openEventModal(dayCell.dataset.date);
            return; 
        }
        if (target.id === 'close-modal' || target.id === 'event-modal-overlay') {
            ui.closeEventModal();
            return; 
        }

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
                    await api.deleteStudent(id);       
                    await initializeAlunosPage();    
                } else if (deleteBtn.closest('#teacher-table')) {
                    await api.deleteTeacher(id);       
                    await initializeProfessoresPage();  
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

        const uploadBtn = target.closest('.btn-upload-trigger');
        if (uploadBtn) {
            const taskName = uploadBtn.dataset.name;
            const taskId = uploadBtn.dataset.id;  
            
            document.getElementById('upload-task-name').innerText = taskName;
            document.getElementById('upload-modal').style.display = 'flex';
            return;
        }
         
        if (target.closest('#btn-novo-topico')) {
            alert("Funcionalidade de Criar Tópico (Exclusiva do Professor)");
            return;
        }
        if (target.closest('#btn-novo-material')) {
            alert("Funcionalidade de Adicionar Material (Exclusiva do Professor)");
            return;
        }
    });

     
    mainContent.addEventListener('submit', async (event) => {
        event.preventDefault();  
         
        if (event.target.id === 'event-form') {
            const { date, title } = ui.getEventModalData();
            if (!title) {
                alert("Por favor, insira um título para o evento.");
                return;
            }
            try {
                await api.saveCalendarEvent(date, title);
                ui.closeEventModal();
                await initializeCalendarPage();  
            } catch(e) {
                alert("Falha ao salvar evento.");
            }
            return; 
        }

        if (event.target.id === 'aluno-form') {
            const studentData = ui.getStudentFormData();
            if (!studentData) {
                alert("Por favor, preencha todos os campos obrigatórios.");
                return;
            }
            try {
                await api.addStudent(studentData);
                await initializeAlunosPage();  
                ui.clearAndFocusForm('aluno-form', 'aluno-matricula');
            } catch (e) {
                alert("Falha ao salvar aluno.");
            }
            return; 
        }

        if (event.target.id === 'professor-form') {
            const teacherData = ui.getTeacherFormData();
             if (!teacherData) {
                alert("Por favor, preencha todos os campos obrigatórios.");
                return;
            }
            try {
                await api.addTeacher(teacherData);
                await initializeProfessoresPage();  
                ui.clearAndFocusForm('professor-form', 'prof-matricula');
            } catch (e) {
                alert("Falha ao salvar professor.");
            }
            return; 
        }

        if (event.target.id === 'form-upload-atividade') {
            const fileInput = document.getElementById('file-upload');
            if (fileInput.files.length > 0) {
                 
                alert(`Arquivo "${fileInput.files[0].name}" enviado com sucesso!`);
                document.getElementById('upload-modal').style.display = 'none';
                 
            }
            return;
        }
    });
    
    mainContent.addEventListener('input', (event) => {
        const target = event.target;
         
        if (target.id === 'student-search-input') {
             
            initializeAlunosPage(target.value);
        }
        
         
        else if (target.id === 'teacher-search-input') {
            initializeProfessoresPage(target.value);
        }
        
         
        else if (target.id === 'subject-select') {
            updateEvolutionChart(target.value);
        }
    });
}