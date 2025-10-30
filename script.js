/* --- 1. CONFIGURAÇÃO INICIAL E AUTENTICAÇÃO --- */
const currentUserRole = localStorage.getItem('userRole');

if (!currentUserRole) {
    window.location.href = 'login.html';
}

// Elementos da Sidebar e Tema
const toggleButton = document.getElementById('toggle-btn');
const sidebar = document.querySelector('.sidebar');
const sunBtn = document.getElementById('theme-sun');
const moonBtn = document.getElementById('theme-moon');
const body = document.body;

/* --- VARIÁVEIS GLOBAIS DE "BANCO DE DADOS" (MOCK) --- */
let currentViewDate = new Date();
let calendarEvents = JSON.parse(localStorage.getItem('calendarEvents')) || {};

// MODIFICADO: 'const' mudou para 'let' para podermos adicionar novos
let mockStudentData = [
    { matricula: "2025001", nome: "Ana Silva", turma: "9º Ano A", status: "Ativo" },
    { matricula: "2025002", nome: "Carlos Santos", turma: "9º Ano A", status: "Ativo" },
    { matricula: "2025003", nome: "Beatriz Lima", turma: "8º Ano B", status: "Ativo" },
    { matricula: "2025004", nome: "Daniel Costa", turma: "9º Ano A", status: "Inativo" },
    { matricula: "2025005", nome: "Elena Rodrigues", turma: "8º Ano B", status: "Ativo" },
    { matricula: "2025006", nome: "Fernando Alves", turma: "7º Ano C", status: "Ativo" },
    { matricula: "2025007", nome: "Gabriela Dias", turma: "7º Ano C", status: "Ativo" },
];

let mockTeacherData = [
    { matricula: "P1001", nome: "Marcos Andrade", disciplina: "Matemática", status: "Ativo" },
    { matricula: "P1002", nome: "Lúcia Pereira", disciplina: "Português", status: "Ativo" },
    { matricula: "P1003", nome: "Roberto Freitas", disciplina: "História", status: "Ativo" },
    { matricula: "P1004", nome: "Sandra Gomes", disciplina: "Ciências", status: "Licença" },
    { matricula: "P1005", nome: "Ricardo Oliveira", disciplina: "Educação Física", status: "Ativo" },
];

const mockBoletimData = [
    { materia: 'Matemática', n1_n1: 8.0, n1_n2: 7.5, n1_ativ: 9.0, n2_n1: 8.5, n2_n2: 8.0, n2_ativ: 9.0 },
    { materia: 'Português', n1_n1: 9.5, n1_n2: 8.5, n1_ativ: 9.0, n2_n1: 9.0, n2_n2: 9.5, n2_ativ: 10.0 },
    { materia: 'História', n1_n1: 7.0, n1_n2: 7.0, n1_ativ: 8.0, n2_n1: 7.5, n2_n2: 7.0, n2_ativ: 7.5 },
    { materia: 'Geografia', n1_n1: 8.5, n1_n2: 8.0, n1_ativ: 8.0, n2_n1: 8.0, n2_n2: 8.0, n2_ativ: 8.5 },
    { materia: 'Ciências', n1_n1: 9.0, n1_n2: 9.5, n1_ativ: 9.0, n2_n1: 9.0, n2_n2: 9.0, n2_ativ: 9.5 },
    { materia: 'Inglês', n1_n1: 10.0, n1_n2: 10.0, n1_ativ: 10.0, n2_n1: 10.0, n2_n2: 10.0, n2_ativ: 10.0 },
    { materia: 'Educação Física', n1_n1: 10.0, n1_n2: 10.0, n1_ativ: 10.0, n2_n1: 10.0, n2_n2: 10.0, n2_ativ: 10.0 },
];

const mockAbsenceData = [
    { materia: 'Matemática', frequencia: "95%", faltas: 6 },
    { materia: 'Português', frequencia: "98%", faltas: 3 },
    { materia: 'História', frequencia: "95%", faltas: 6 },
    { materia: 'Geografia', frequencia: "100%", faltas: 0 },
    { materia: 'Ciências', frequencia: "98%", faltas: 3 },
    { materia: 'Inglês', frequencia: "100%", faltas: 0 },
];

const mockProfessorAtencao = [
    { nome: "Beatriz Lima", turma: "8º Ano B", media: 6.8, frequencia: "80%" },
    { nome: "Daniel Costa", turma: "9º Ano A", media: 5.5, frequencia: "85%" },
    { nome: "Fernando Alves", turma: "7º Ano C", media: 7.0, frequencia: "75%" },
];

/* --- Variável global do gráfico --- */
let lineChartInstance = null;
let barChartCoordInstance = null; // NOVO: Gráfico de Barras do Coordenador
let pieChartCoordInstance = null; // NOVO: Gráfico de Pizza do Coordenador

/* --- 2. LÓGICA DO TEMA --- */
sunBtn.addEventListener('click', function() {
    body.classList.remove('dark-mode');
    sunBtn.classList.add('active');
    moonBtn.classList.remove('active');
    localStorage.setItem('theme', 'light');
});
moonBtn.addEventListener('click', function() {
    body.classList.add('dark-mode');
    moonBtn.classList.add('active');
    sunBtn.classList.remove('active');
    localStorage.setItem('theme', 'dark');
});
function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        moonBtn.classList.add('active');
        sunBtn.classList.remove('active');
    } else {
        body.classList.remove('dark-mode');
        sunBtn.classList.add('active');
        moonBtn.classList.remove('active');
    }
}

toggleButton.addEventListener('click', function() {
    sidebar.classList.toggle('collapsed');
});
function setupSidebar(role) {
    document.getElementById('nav-alunos').style.display = 'none';
    document.getElementById('nav-professores').style.display = 'none';
    document.getElementById('nav-desempenho').style.display = 'none';
    switch (role) {
        case 'aluno':
            document.getElementById('nav-desempenho').style.display = 'list-item';
            break;
        case 'professor':
            document.getElementById('nav-alunos').style.display = 'list-item';
            break;
        case 'coordenador':
            document.getElementById('nav-alunos').style.display = 'list-item';
            document.getElementById('nav-professores').style.display = 'list-item';
            break;
    }
    const dashboardLink = document.querySelector('#nav-dashboard a');
    dashboardLink.href = `pages/dashboard-${role}.html`;
}
function setupLogout() {
    document.getElementById('logout-btn').addEventListener('click', (event) => {
        event.preventDefault();
        localStorage.removeItem('userRole');
        localStorage.removeItem('theme');
        localStorage.removeItem('calendarEvents'); 
        window.location.href = 'login.html';
    });
}

function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const monthYearEl = document.getElementById('month-year');
    if (!monthYearEl) return; 
    monthYearEl.innerText = `${monthNames[month]} ${year}`;
    const calendarDays = document.getElementById('calendar-days');
    if (!calendarDays) return;
    calendarDays.innerHTML = ''; 
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay(); 
    const lastDay = new Date(year, month + 1, 0);
    const lastDateOfMonth = lastDay.getDate();
    const prevLastDay = new Date(year, month, 0);
    const prevLastDate = prevLastDay.getDate();
    for (let i = firstDayOfWeek; i > 0; i--) {
        calendarDays.innerHTML += `<div class="calendar-day other-month"><span>${prevLastDate - i + 1}</span></div>`;
    }
    for (let i = 1; i <= lastDateOfMonth; i++) {
        const currentDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        let eventsHtml = '<div class="day-events">';
        if (calendarEvents[currentDate]) {
            calendarEvents[currentDate].forEach(eventTitle => {
                eventsHtml += `<div class="event-item">${eventTitle}</div>`;
            });
        }
        eventsHtml += '</div>';
        calendarDays.innerHTML += `
            <div class="calendar-day" data-date="${currentDate}">
                <span class="day-number">${i}</span>
                ${eventsHtml}
            </div>
        `;
    }
    const totalDays = calendarDays.children.length;
    let nextDay = 1;
    while (totalDays + nextDay - 1 < 42) { 
        calendarDays.innerHTML += `<div class="calendar-day other-month"><span>${nextDay}</span></div>`;
        nextDay++;
    }
}
function openEventModal(date) {
    const [year, month, day] = date.split('-');
    document.getElementById('modal-date-display').innerText = `${day}/${month}/${year}`;
    document.getElementById('event-date').value = date;
    document.getElementById('event-title').value = '';
    document.getElementById('event-modal-overlay').style.display = 'flex';
}
function closeEventModal() {
    document.getElementById('event-modal-overlay').style.display = 'none';
}
function saveEvent() {
    const date = document.getElementById('event-date').value;
    const title = document.getElementById('event-title').value;
    if (!title) return; 
    if (!calendarEvents[date]) {
        calendarEvents[date] = [];
    }
    calendarEvents[date].push(title);
    localStorage.setItem('calendarEvents', JSON.stringify(calendarEvents));
    closeEventModal();
    renderCalendar(currentViewDate);
}

function renderStudentTable(filter = '') {
    const tableBody = document.getElementById('student-table-body');
    if (!tableBody) return; 
    tableBody.innerHTML = ''; 
    const lowerCaseFilter = filter.toLowerCase();
    const filteredData = mockStudentData.filter(student => {
        return (
            student.nome.toLowerCase().includes(lowerCaseFilter) ||
            student.turma.toLowerCase().includes(lowerCaseFilter) ||
            student.matricula.includes(lowerCaseFilter)
        );
    });
    if (filteredData.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Nenhum aluno encontrado.</td></tr>'; // colspan mudou para 6
        return;
    }
    filteredData.forEach(student => {
        const statusClass = student.status === 'Ativo' ? 'status-ativo' : 'status-inativo';
        tableBody.innerHTML += `
            <tr>
                <td>${student.matricula}</td>
                <td>${student.nome}</td>
                <td>${student.turma}</td>
                <td><span class="${statusClass}">${student.status}</span></td>
                <td class="col-acoes">
                    <a class="action-edit" data-id="${student.matricula}">Editar</a>
                </td>
                <td class="action-delete">
                    <i class="fa-solid fa-trash" data-id="${student.matricula}"></i>
                </td>
            </tr>
        `;
    });
}

function renderTeacherTable(filter = '') {
    const tableBody = document.getElementById('teacher-table-body');
    if (!tableBody) return; 
    tableBody.innerHTML = ''; 
    const lowerCaseFilter = filter.toLowerCase();
    const filteredData = mockTeacherData.filter(teacher => {
        return (
            teacher.nome.toLowerCase().includes(lowerCaseFilter) ||
            teacher.disciplina.toLowerCase().includes(lowerCaseFilter) ||
            teacher.matricula.toLowerCase().includes(lowerCaseFilter)
        );
    });
    if (filteredData.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Nenhum professor encontrado.</td></tr>'; 
        return;
    }
    filteredData.forEach(teacher => {
        const statusClass = teacher.status === 'Ativo' ? 'status-ativo' : 'status-inativo';
        tableBody.innerHTML += `
            <tr>
                <td>${teacher.matricula}</td>
                <td>${teacher.nome}</td>
                <td>${teacher.disciplina}</td>
                <td><span class="${statusClass}">${teacher.status === 'Licença' ? 'Licença' : teacher.status}</span></td>
                <td class="col-acoes">
                    <a class="action-edit" data-id="${teacher.matricula}">Editar</a>
                </td>
                <td class="action-delete">
                    <i class="fa-solid fa-trash" data-id="${teacher.matricula}"></i>
                </td>
            </tr>
        `;
    });
}

function renderBoletimTable() {
    const tableBody = document.getElementById('boletim-table-body');
    if (!tableBody) return;
    tableBody.innerHTML = ''; 
    
    mockBoletimData.forEach(row => {
        const mediaBim1 = (row.n1_n1 + row.n1_n2 + row.n1_ativ) / 3;
        const mediaBim2 = (row.n2_n1 + row.n2_n2 + row.n2_ativ) / 3;
        let bimestresComNota = 0;
        let somaMedias = 0;
        if (mediaBim1 > 0) { somaMedias += mediaBim1; bimestresComNota++; }
        if (mediaBim2 > 0) { somaMedias += mediaBim2; bimestresComNota++; }
        const mediaAnual = (bimestresComNota > 0) ? (somaMedias / bimestresComNota) : 0;
        
        tableBody.innerHTML += `
            <tr>
                <td>${row.materia}</td>
                <td>${row.n1_n1.toFixed(1)}</td>
                <td>${row.n1_n2.toFixed(1)}</td>
                <td>${row.n1_ativ.toFixed(1)}</td>
                <td class="media-bim"><strong>${mediaBim1.toFixed(1)}</strong></td>
                <td>${row.n2_n1.toFixed(1)}</td>
                <td>${row.n2_n2.toFixed(1)}</td>
                <td>${row.n2_ativ.toFixed(1)}</td>
                <td class="media-bim"><strong>${mediaBim2.toFixed(1)}</strong></td>
                <td class="media-anual"><strong>${mediaAnual.toFixed(1)}</strong></td>
            </tr>
        `;
    });
}
function renderAbsenceTable() {
    const tableBody = document.getElementById('faltas-table-body');
    if (!tableBody) return;
    tableBody.innerHTML = ''; 
    mockAbsenceData.forEach(row => {
        tableBody.innerHTML += `
            <tr>
                <td>${row.materia}</td>
                <td>${row.frequencia}</td>
                <td>${row.faltas}</td>
            </tr>
        `;
    });
}
function populateSubjectSelect() {
    const select = document.getElementById('subject-select');
    if (!select) return;
    select.innerHTML = '';
    mockBoletimData.forEach(row => {
        select.innerHTML += `<option value="${row.materia}">${row.materia}</option>`;
    });
}
function renderEvolutionChart() {
    const lineCtx = document.getElementById('lineChartEvolucao');
    if (!lineCtx) return;
    const selectedSubject = document.getElementById('subject-select').value;
    const subjectData = mockBoletimData.find(row => row.materia === selectedSubject);
    if (!subjectData) return;
    const chartLabels = ['1ºBim (N1)', '1ºBim (N2)', '2ºBim (N1)', '2ºBim (N2)'];
    const chartData = [ subjectData.n1_n1, subjectData.n1_n2, subjectData.n2_n1, subjectData.n2_n2 ];
    const chartRedColor = '#c0392b';
    if (lineChartInstance) { lineChartInstance.destroy(); }
    lineChartInstance = new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: chartLabels,
            datasets: [{
                label: 'Nota',
                data: chartData,
                borderColor: chartRedColor,
                backgroundColor: chartRedColor,
                fill: false,
                tension: 0.1, 
                pointRadius: 5,
                pointBackgroundColor: chartRedColor
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { display: false } },
                y: { beginAtZero: true, max: 10, ticks: { stepSize: 2 } }
            }
        }
    });
}

function populateSubjectFormSelect() {
    const select = document.getElementById('prof-disciplina');
    if (!select) return;

    const materias = mockBoletimData.map(row => row.materia);

    const materiasUnicas = [...new Set(materias)]; 

    materiasUnicas.forEach(materia => {
        select.innerHTML += `<option value="${materia}">${materia}</option>`;
    });
}

function renderProfessorDashboard() {
    const kpiMedia = document.getElementById('kpi-media-turma');
    const kpiFreq = document.getElementById('kpi-frequencia-turma');
    const kpiRec = document.getElementById('kpi-recuperacao-turma');
    
    if (kpiMedia) kpiMedia.innerText = "7.8";
    if (kpiFreq) kpiFreq.innerText = "92%";
    if (kpiRec) kpiRec.innerText = "5";

    const tableBody = document.getElementById('atencao-table-body');
    if (!tableBody) return;
    tableBody.innerHTML = '';

    mockProfessorAtencao.forEach(aluno => {
        tableBody.innerHTML += `
            <tr>
                <td>${aluno.nome}</td>
                <td>${aluno.turma}</td>
                <td><span class="${aluno.media < 7 ? 'status-inativo' : 'status-ativo'}">${aluno.media.toFixed(1)}</span></td>
                <td><span class="${aluno.frequencia.replace('%', '') < 80 ? 'status-inativo' : 'status-ativo'}">${aluno.frequencia}</span></td>
            </tr>
        `;
    });
}

function renderProximosEventosCoord() {
    const listElement = document.getElementById('proximos-eventos-coord-list');
    if (!listElement) return;
    listElement.innerHTML = '';

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const proxSemana = new Date();
    proxSemana.setDate(hoje.getDate() + 7);
    proxSemana.setHours(23, 59, 59, 999);

    let eventosFuturos = [];

    for (const dateKey in calendarEvents) {
        const dataEvento = new Date(dateKey + "T00:00:00"); 
        if (dataEvento >= hoje && dataEvento <= proxSemana) {
            calendarEvents[dateKey].forEach(titulo => {
                eventosFuturos.push({ data: dataEvento, titulo: titulo });
            });
        }
    }

    eventosFuturos.sort((a, b) => a.data - b.data);

    if (eventosFuturos.length === 0) {
        listElement.innerHTML = '<li>Nenhum evento nos próximos 7 dias.</li>';
    } else {
        eventosFuturos.slice(0, 5).forEach(evento => {
            const dia = String(evento.data.getDate()).padStart(2, '0');
            const mes = String(evento.data.getMonth() + 1).padStart(2, '0');
            listElement.innerHTML += `<li><strong>${dia}/${mes}:</strong> ${evento.titulo}</li>`;
        });
        if(eventosFuturos.length > 5) {
             listElement.innerHTML += '<li>...</li>';
        }
    }
}

function renderCoordenadorDashboard() {
    
    const kpiAlunos = document.getElementById('kpi-total-alunos');
    const kpiProf = document.getElementById('kpi-total-prof');
    const kpiMedia = document.getElementById('kpi-media-escola');
    const kpiEventos = document.getElementById('kpi-eventos-prox');

    if (kpiAlunos) kpiAlunos.innerText = mockStudentData.length;
    
    if (kpiProf) kpiProf.innerText = mockTeacherData.length;
    
    if (kpiMedia) {
        let somaMedias = 0;
        mockBoletimData.forEach(row => {
            const mediaBim1 = (row.n1_n1 + row.n1_n2 + row.n1_ativ) / 3;
            const mediaBim2 = (row.n2_n1 + row.n2_n2 + row.n2_ativ) / 3;
            somaMedias += (mediaBim1 + mediaBim2) / 2;
        });
        kpiMedia.innerText = (somaMedias / mockBoletimData.length).toFixed(1);
    }
    
    if (kpiEventos) {
        const hoje = new Date();
        const proxSemana = new Date();
        proxSemana.setDate(hoje.getDate() + 7);

        let contagemEventos = 0;
        for (const dateKey in calendarEvents) {
            const dataEvento = new Date(dateKey + "T00:00:00");
            if (dataEvento >= hoje && dataEvento <= proxSemana) {
                contagemEventos += calendarEvents[dateKey].length;
            }
        }
        kpiEventos.innerText = contagemEventos;
    }


    const barCtx = document.getElementById('coordBarChart');
    const pieCtx = document.getElementById('coordPieChart');
    if (!barCtx || !pieCtx) return; // Se não estiver na página, sai

    // Destrói gráficos antigos
    if (barChartCoordInstance) barChartCoordInstance.destroy();
    if (pieChartCoordInstance) pieChartCoordInstance.destroy();

    // --- Gráfico de Barras: Média por Matéria ---
    const materiasLabels = mockBoletimData.map(row => row.materia);
    const materiasMedias = mockBoletimData.map(row => {
        const mediaBim1 = (row.n1_n1 + row.n1_n2 + row.n1_ativ) / 3;
        const mediaBim2 = (row.n2_n1 + row.n2_n2 + row.n2_ativ) / 3;
        return ((mediaBim1 + mediaBim2) / 2).toFixed(1);
    });

    barChartCoordInstance = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: materiasLabels,
            datasets: [{
                label: 'Média Geral da Matéria',
                data: materiasMedias,
                backgroundColor: '#c0392b', // Vermelho
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { display: false } },
                y: { beginAtZero: true, max: 10 }
            }
        }
    });

    // Gráfico de Pizza
    const contagemTurmas = {};
    mockStudentData.forEach(aluno => {
        contagemTurmas[aluno.turma] = (contagemTurmas[aluno.turma] || 0) + 1;
    });

    // Preparar dados para o Chart.js
    const turmasLabels = Object.keys(contagemTurmas);
    const turmasData = Object.values(contagemTurmas);

    pieChartCoordInstance = new Chart(pieCtx, {
        type: 'doughnut', // 'pie' ou 'doughnut' (com buraco)
        data: {
            labels: turmasLabels,
            datasets: [{
                label: 'Alunos',
                data: turmasData,
                backgroundColor: [ // Cores aleatórias (pode definir as suas)
                    '#2c3e50',
                    '#e74c3c',
                    '#3498db',
                    '#f1c40f',
                    '#2ecc71'
                ],
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom', // Põe a legenda em baixo
                }
            }
        }
    });

    renderProximosEventosCoord();
}

/* --- Função de Permissões (Corrigida) --- */
function applyPagePermissions(role, url) {
    const pageContainer = document.getElementById('page-content');
    if (!pageContainer) return;

    pageContainer.classList.remove('read-only');
    let isReadOnly = false;

    if (role === 'aluno') {
        isReadOnly = true; 
    } else if (role === 'professor') {
        if (!url.includes('calendario.html') && !url.includes('alunos.html')) {
            isReadOnly = true;
        }
    } else if (role === 'coordenador') {
        if (!url.includes('calendario.html') && !url.includes('alunos.html') && !url.includes('professores.html')) {
            isReadOnly = true;
        }
    }

    if (isReadOnly) {
        pageContainer.classList.add('read-only');
        const interactiveElements = pageContainer.querySelectorAll('input, button, textarea, select, form');
        
        interactiveElements.forEach(el => {
            if (el.id !== 'student-search-input' && 
                el.id !== 'teacher-search-input' &&
                el.id !== 'prev-month' &&
                el.id !== 'next-month' &&
                el.id !== 'subject-select')
            {
                el.disabled = true;
            }
        });
    } else {
        const interactiveElements = pageContainer.querySelectorAll('input, button, textarea, select, form');
        interactiveElements.forEach(el => el.disabled = false);
    }
}

async function loadPage(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            if (url.includes('dashboard-')) {
                await loadPage('pages/dashboard.html'); 
                return;
            }
            throw new Error(`Página não encontrada: ${response.status}`);
        }
        
        const content = await response.text();
        const pageContainer = document.getElementById('page-content');
        pageContainer.innerHTML = content;

        applyPagePermissions(currentUserRole, url);

        // --- RENDERIZAÇÃO PÓS-CARGA ---
        if (url.includes('calendario.html')) {
            renderCalendar(currentViewDate);
        }
        if (url.includes('alunos.html')) {
            renderStudentTable();
        }
        if (url.includes('professores.html')) {
            renderTeacherTable();
            populateSubjectFormSelect();
        }
        if (url.includes('desempenho.html')) {
            renderBoletimTable();      
            renderAbsenceTable();      
            populateSubjectSelect();   
            renderEvolutionChart();    
        }
        if (url.includes('dashboard-professor.html')) {
            renderProfessorDashboard();
        }
        if (url.includes('dashboard-coordenador.html')) {
            renderCoordenadorDashboard();
        }

    } catch (error) {
        console.error("Erro ao carregar a página:", error);
        document.getElementById('page-content').innerHTML = `<h1>Erro 404</h1><p>A página <code>${url}</code> não foi encontrada.</p>`;
    }
}

/* Evento DOMContentLoaded */
document.addEventListener('DOMContentLoaded', () => {
    
    applySavedTheme();
    setupSidebar(currentUserRole);
    setupLogout();

    // Links da Sidebar
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); 
            const href = link.getAttribute('href');
            if (href && href !== '#') {
                loadPage(href);
            }
        });
    });

    const initialPageUrl = document.querySelector('#nav-dashboard a').getAttribute('href');
    loadPage(initialPageUrl);

    const mainContent = document.getElementById('main-content');

    mainContent.addEventListener('click', (event) => {
        
        const navLink = event.target.closest('.nav-link');
        if (navLink) {
            event.preventDefault();
            const href = navLink.getAttribute('href');
            if (href && href !== '#') {
                loadPage(href);
            }
            return; 
        }
        
        const nextButton = event.target.closest('#next-month');
        const prevButton = event.target.closest('#prev-month');
        if (nextButton) {
            currentViewDate.setMonth(currentViewDate.getMonth() + 1);
            renderCalendar(currentViewDate);
            return; 
        }
        if (prevButton) {
            currentViewDate.setMonth(currentViewDate.getMonth() - 1);
            renderCalendar(currentViewDate);
            return; 
        }
        const dayCell = event.target.closest('.calendar-day');
        if (dayCell) {
            if (document.getElementById('page-content').classList.contains('read-only') || dayCell.classList.contains('other-month')) {
                return;
            }
            const date = dayCell.dataset.date;
            openEventModal(date);
            return; 
        }
        if (event.target.id === 'close-modal' || event.target.id === 'event-modal-overlay') {
            closeEventModal();
            return; 
        }

        const editLink = event.target.closest('.action-edit');
        if (editLink) {
            event.preventDefault(); 
            const id = editLink.dataset.id;
            if (editLink.closest('#student-table')) {
                alert(`Função "Editar Aluno" chamada para a matrícula: ${id}`);
            } else if (editLink.closest('#teacher-table')) {
                alert(`Função "Editar Professor" chamada para a matrícula: ${id}`);
            }
            return;
        }
        
        const addStudentBtn = event.target.closest('#btn-add-student');
        if (addStudentBtn) {
            event.preventDefault(); 
            const form = document.getElementById('form-novo-aluno');
            if (form) {
                form.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            return; 
        }
        
        const addTeacherBtn = event.target.closest('#btn-add-teacher');
        if (addTeacherBtn) {
            event.preventDefault(); 
            const form = document.getElementById('form-novo-professor');
            if (form) {
                form.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            return; 
        }

        const deleteBtn = event.target.closest('.action-delete i');
        if (deleteBtn) {
            const id = deleteBtn.dataset.id;
            
            const confirmed = confirm("Tem certeza que deseja remover este registro?");
            
            if (confirmed) {
                if (deleteBtn.closest('#student-table')) {
                    mockStudentData = mockStudentData.filter(student => student.matricula !== id);
                    
                    renderStudentTable();

                } else if (deleteBtn.closest('#teacher-table')) {
                    mockTeacherData = mockTeacherData.filter(teacher => teacher.matricula !== id);

                    renderTeacherTable();
                }
            }
            return;
        }
    });

    mainContent.addEventListener('submit', (event) => {
        if (event.target.id === 'event-form') {
            event.preventDefault(); 
            saveEvent();
            return; 
        }

        if (event.target.id === 'aluno-form') {
            event.preventDefault();
            const matricula = document.getElementById('aluno-matricula').value;
            const nome = document.getElementById('aluno-nome').value;
            const turma = document.getElementById('aluno-turma').value;
            const status = document.getElementById('aluno-status').value;
            
            mockStudentData.push({ matricula, nome, turma, status });
            renderStudentTable();
            event.target.reset();
            document.getElementById('student-table').scrollIntoView({ behavior: 'smooth', block: 'start' });
            return; 
        }

        if (event.target.id === 'professor-form') {
            event.preventDefault();
            const matricula = document.getElementById('prof-matricula').value;
            const nome = document.getElementById('prof-nome').value;

            const disciplina = document.getElementById('prof-disciplina').value;
            const status = document.getElementById('prof-status').value;

            mockTeacherData.push({ matricula, nome, disciplina, status });
            renderTeacherTable();
            event.target.reset();
            document.getElementById('teacher-table').scrollIntoView({ behavior: 'smooth', block: 'start' });
            return; 
        }
    });

    mainContent.addEventListener('input', (event) => {
        if (event.target.id === 'student-search-input') {
            const filterValue = event.target.value;
            renderStudentTable(filterValue);
        }
        else if (event.target.id === 'teacher-search-input') {
            const filterValue = event.target.value;
            renderTeacherTable(filterValue);
        }
        else if (event.target.id === 'subject-select') {
            renderEvolutionChart();
        }
    });

    if (notificationPanel) {
        notificationPanel.addEventListener('click', (event) => {
            const markReadBtn = event.target.closest('.mark-read-btn');
            if (markReadBtn) {
                const notificationItem = markReadBtn.closest('.notification-item');
                if (notificationItem) {
                    const notificationId = parseInt(notificationItem.dataset.notificationId, 10);
                    markNotificationAsRead(notificationId);
                }
            }
        });
    }
});