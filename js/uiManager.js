 

/**
 * ----------------------------------------------------------------
 * uiManager.js - A CAMADA DE VISUALIZAÇÃO (A "EQUIPE DE SALÃO")
 * ----------------------------------------------------------------
 * * Responsabilidade: Gerenciar toda a manipulação do DOM.
 * - Contém todas as funções que renderizam HTML (`render...`).
 * - Contém funções que mostram/escondem elementos (modais, etc.).
 * - Contém funções que leem dados *de* formulários (`get...Data`).
 * - NUNCA deve chamar o 'apiService' ou conter lógica de negócios.
 * - É "burro": apenas recebe dados e os desenha.
 */

let lineChartInstance = null;
let barChartCoordInstance = null;
let pieChartCoordInstance = null;

const allNavLinks = [
    { 
        id: 'nav-dashboard',
        href: 'pages/dashboard.html',
        icon: 'fa-solid fa-house', 
        text: 'Início', 
        roles: ['aluno', 'professor', 'coordenador'] 
    },
    { 
        id: 'nav-calendario', 
        href: 'pages/calendario.html', 
        icon: 'fa-solid fa-calendar', 
        text: 'Calendário', 
        roles: ['aluno', 'professor', 'coordenador'] 
    },
    { 
        id: 'nav-materias', 
        href: 'pages/materias.html', 
        icon: 'fa-solid fa-folder-open', 
        text: 'Matérias', 
        roles: ['aluno', 'professor'] 
    },
    { 
        id: 'nav-boletim', 
        href: 'pages/desempenho.html',
        icon: 'fa-solid fa-chart-simple', 
        text: 'Boletim', 
        roles: ['aluno'] 
    },
    { 
        id: 'nav-extra', 
        href: 'pages/extra.html',
        icon: 'fa-solid fa-shapes', 
        text: 'Extracurricular', 
        roles: ['aluno'] 
    },
    { 
        id: 'nav-saida', 
        href: 'pages/saida.html',
        icon: 'fa-solid fa-person-running', 
        text: 'Saída Antecipada', 
        roles: ['aluno'] 
    },
    { 
        id: 'nav-frequencia', 
        href: 'pages/frequencia.html',
        icon: 'fa-solid fa-list-check', 
        text: 'Registrar Frequência', 
        roles: ['professor'] 
    },
    { 
        id: 'nav-notas', 
        href: 'pages/notas.html',
        icon: 'fa-solid fa-pen-to-square', 
        text: 'Registrar Notas', 
        roles: ['professor'] 
    },
    { 
        id: 'nav-alunos', 
        href: 'pages/alunos.html', 
        icon: 'fa-solid fa-person', 
        text: 'Alunos', 
        roles: ['coordenador'] 
    },
    { 
        id: 'nav-professores', 
        href: 'pages/professores.html', 
        icon: 'fa-solid fa-person-chalkboard', 
        text: 'Professores', 
        roles: ['coordenador'] 
    },
    { 
        id: 'nav-comunicados', 
        href: 'pages/comunicados.html',
        icon: 'fa-solid fa-bullhorn', 
        text: 'Comunicados', 
        roles: ['coordenador'] 
    },
    {
        id: 'nav-config', 
        href: 'pages/config.html',
        icon: 'fa-solid fa-gear', 
        text: 'Configurações', 
        roles: ['coordenador'] 
    }
];

export function applySavedTheme() {
    const body = document.body;
    const sunBtn = document.getElementById('theme-sun');
    const moonBtn = document.getElementById('theme-moon');
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

/**
 * Ajusta a visibilidade dos links da sidebar com base no perfil do usuário.
 * @param {string} role - O perfil ('aluno', 'professor', 'coordenador')
 */
export function setupSidebar(role) {
    const navLinksContainer = document.querySelector('.nav-links');
    if (!navLinksContainer) return;

    const accessibleLinks = allNavLinks.filter(link => link.roles.includes(role));

    const htmlToRender = accessibleLinks.map(link => {
        
        let href = link.href;
        
        if (link.id === 'nav-dashboard') {
            href = `pages/dashboard-${role}.html`;
        }

        return `
            <li id="${link.id}">
                <a href="${href}" class="nav-link">
                    <i class="${link.icon}"></i>
                    <span class="link-text">${link.text}</span>
                </a>
            </li>
        `;
    }).join('');  

    navLinksContainer.innerHTML = htmlToRender;
}

/**
 * Renderiza o grid do calendário para um mês/ano específico.
 * @param {Date} date - A data de referência (controla o mês/ano)
 * @param {object} events - O objeto de eventos (vindo da API)
 */
export function renderCalendar(date, events = {}) {
    const monthYearEl = document.getElementById('month-year');
    if (!monthYearEl) return;  

    const year = date.getFullYear();
    const month = date.getMonth();
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    
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
        
        if (events[currentDate]) {
            events[currentDate].forEach(eventTitle => {
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

/**
 * Exibe o modal de eventos.
 * @param {string} date - Data no formato AAAA-MM-DD
 */
export function openEventModal(date) {
    const [year, month, day] = date.split('-');
    document.getElementById('modal-date-display').innerText = `${day}/${month}/${year}`;
    document.getElementById('event-date').value = date;
    document.getElementById('event-title').value = '';
    document.getElementById('event-modal-overlay').style.display = 'flex';
    document.getElementById('event-title').focus();
}

export function closeEventModal() {
    document.getElementById('event-modal-overlay').style.display = 'none';
}

/**
 * Lê os dados preenchidos no modal de eventos.
 * @returns {object} - { date, title }
 */
export function getEventModalData() {
    const date = document.getElementById('event-date').value;
    const title = document.getElementById('event-title').value.trim();
    return { date, title };
}

/**
 * Renderiza a tabela de alunos.
 * @param {Array} studentList - Lista de alunos (vinda da API)
 */
export function renderStudentTable(studentList = []) {
    const tableBody = document.getElementById('student-table-body');
    if (!tableBody) return; 
    tableBody.innerHTML = ''; 

    if (studentList.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Nenhum aluno encontrado.</td></tr>';
        return;
    }

    studentList.forEach(student => {
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

/**
 * Renderiza a tabela de professores.
 * @param {Array} teacherList - Lista de professores (vinda da API)
 */
export function renderTeacherTable(teacherList = []) {
    const tableBody = document.getElementById('teacher-table-body');
    if (!tableBody) return; 
    tableBody.innerHTML = ''; 

    if (teacherList.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Nenhum professor encontrado.</td></tr>'; 
        return;
    }

    teacherList.forEach(teacher => {
         
        let statusClass = '';
        switch(teacher.status) {
            case 'Ativo': statusClass = 'status-ativo'; break;
            case 'Inativo': statusClass = 'status-inativo'; break;
            default: statusClass = '';  
        }

        tableBody.innerHTML += `
            <tr>
                <td>${teacher.matricula}</td>
                <td>${teacher.nome}</td>
                <td>${teacher.disciplina}</td>
                <td><span class="${statusClass}">${teacher.status}</span></td>
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


 

/**
 * Mostra o formulário de adição (rolando até ele).
 * @param {string} formId - O ID do elemento do formulário.
 */
export function showForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/**
 * Limpa um formulário e foca no primeiro campo.
 * @param {string} formId - ID do formulário
 * @param {string} firstInputId - ID do primeiro campo para focar
 */
export function clearAndFocusForm(formId, firstInputId) {
    const form = document.getElementById(formId);
    if(form) form.reset();
    
    const firstInput = document.getElementById(firstInputId);
    if(firstInput) firstInput.focus();

     
    const tableId = formId.includes('aluno') ? 'student-table' : 'teacher-table';
    document.getElementById(tableId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Lê os dados do formulário de novo aluno.
 * @returns {object|null}
 */
export function getStudentFormData() {
    const matricula = document.getElementById('aluno-matricula')?.value;
    const nome = document.getElementById('aluno-nome')?.value;
    const turma = document.getElementById('aluno-turma')?.value;
    const status = document.getElementById('aluno-status')?.value;
    
    if(!matricula || !nome || !turma) return null;
    return { matricula, nome, turma, status };
}

/**
 * Lê os dados do formulário de novo professor.
 * @returns {object|null}
 */
export function getTeacherFormData() {
    const matricula = document.getElementById('prof-matricula')?.value;
    const nome = document.getElementById('prof-nome')?.value;
    const disciplina = document.getElementById('prof-disciplina')?.value;
    const status = document.getElementById('prof-status')?.value;

    if(!matricula || !nome || !disciplina) return null;
    return { matricula, nome, disciplina, status };
}


 

/**
 * Renderiza a tabela de boletim (notas).
 * @param {Array} boletimData - Lista de notas (vinda da API)
 */
export function renderBoletimTable(boletimData = []) {
    const tableBody = document.getElementById('boletim-table-body');
    if (!tableBody) return;
    tableBody.innerHTML = ''; 
    
    boletimData.forEach(row => {
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

/**
 * Renderiza a tabela de faltas.
 * @param {Array} absenceData - Lista de faltas (vinda da API)
 */
export function renderAbsenceTable(absenceData = []) {
    const tableBody = document.getElementById('faltas-table-body');
    if (!tableBody) return;
    tableBody.innerHTML = ''; 
    absenceData.forEach(row => {
        tableBody.innerHTML += `
            <tr>
                <td>${row.materia}</td>
                <td>${row.frequencia}</td>
                <td>${row.faltas}</td>
            </tr>
        `;
    });
}

/**
 * Preenche o <select> de matérias para o gráfico.
 * @param {Array} subjects - Lista de nomes de matérias
 */
export function populateSubjectSelect(subjects = []) {
    const select = document.getElementById('subject-select');
    if (!select) return;
    select.innerHTML = '';
    subjects.forEach(subject => {
        select.innerHTML += `<option value="${subject}">${subject}</option>`;
    });
}

/**
 * Renderiza o gráfico de linhas (evolução das notas).
 * @param {Array} chartLabels - Labels do eixo X
 * @param {Array} chartData - Dados do eixo Y
 */
export function renderEvolutionChart(chartLabels, chartData) {
    const lineCtx = document.getElementById('lineChartEvolucao');
    if (!lineCtx) return;

    const chartRedColor = '#c0392b';
    
     
    if (lineChartInstance) { 
        lineChartInstance.destroy(); 
    }

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


 

/**
 * Renderiza os KPIs e a tabela de atenção do Dashboard do Professor.
 * @param {object} kpis - { mediaTurma, frequenciaTurma, recuperacaoTurma }
 * @param {Array} alunosAtencao - Lista de alunos
 */
export function renderProfessorDashboard(kpis, alunosAtencao = []) {
     
    const kpiMedia = document.getElementById('kpi-media-turma');
    const kpiFreq = document.getElementById('kpi-frequencia-turma');
    const kpiRec = document.getElementById('kpi-recuperacao-turma');
    
    if (kpiMedia) kpiMedia.innerText = kpis.mediaTurma || '--';
    if (kpiFreq) kpiFreq.innerText = kpis.frequenciaTurma || '--';
    if (kpiRec) kpiRec.innerText = kpis.recuperacaoTurma || '--';

     
    const tableBody = document.getElementById('atencao-table-body');
    if (!tableBody) return;
    tableBody.innerHTML = '';

    if(alunosAtencao.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Nenhum aluno precisando de atenção.</td></tr>';
        return;
    }

    alunosAtencao.forEach(aluno => {
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


 

/**
 * Renderiza os KPIs do Dashboard do Coordenador.
 * @param {object} kpis - { totalAlunos, totalProf, mediaEscola, contagemEventos }
 */
export function renderCoordenadorKPIs(kpis) {
    const kpiAlunos = document.getElementById('kpi-total-alunos');
    const kpiProf = document.getElementById('kpi-total-prof');
    const kpiMedia = document.getElementById('kpi-media-escola');
    const kpiEventos = document.getElementById('kpi-eventos-prox');

    if (kpiAlunos) kpiAlunos.innerText = kpis.totalAlunos ?? '--';
    if (kpiProf) kpiProf.innerText = kpis.totalProf ?? '--';
    if (kpiMedia) kpiMedia.innerText = kpis.mediaEscola ?? '--';
    if (kpiEventos) kpiEventos.innerText = kpis.contagemEventos ?? '--';
}

/**
 * Renderiza o gráfico de barras (Média por Matéria).
 * @param {object} barChartData - { labels, data }
 */
export function renderCoordenadorBarChart(barChartData) {
    const barCtx = document.getElementById('coordBarChart');
    if (!barCtx) return; 

    if (barChartCoordInstance) barChartCoordInstance.destroy();

    barChartCoordInstance = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: barChartData.labels,
            datasets: [{
                label: 'Média Geral da Matéria',
                data: barChartData.data,
                backgroundColor: '#c0392b',  
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
}

/**
 * Renderiza o gráfico de pizza (Alunos por Turma).
 * @param {object} pieChartData - { labels, data }
 */
export function renderCoordenadorPieChart(pieChartData) {
    const pieCtx = document.getElementById('coordPieChart');
    if (!pieCtx) return;

    if (pieChartCoordInstance) pieChartCoordInstance.destroy();

    pieChartCoordInstance = new Chart(pieCtx, {
        type: 'doughnut',
        data: {
            labels: pieChartData.labels,
            datasets: [{
                label: 'Alunos',
                data: pieChartData.data,
                backgroundColor: ['#2c3e50', '#e74c3c', '#3498db', '#f1c40f', '#2ecc71'],
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

/**
 * Renderiza a lista de próximos eventos.
 * @param {Array} eventosFuturos - Lista de eventos
 */
export function renderProximosEventosCoord(eventosFuturos = []) {
    const listElement = document.getElementById('proximos-eventos-coord-list');
    if (!listElement) return;
    listElement.innerHTML = '';

    if (eventosFuturos.length === 0) {
        listElement.innerHTML = '<li>Nenhum evento nos próximos 7 dias.</li>';
        return;
    }

    eventosFuturos.forEach(evento => {
        listElement.innerHTML += `<li><strong>${evento.dia}/${evento.mes}:</strong> ${evento.titulo}</li>`;
    });
}

/**
 * Aplica permissões de "somente leitura" à página carregada.
 * @param {string} role - O perfil do usuário
 * @param {string} url - A URL da página carregada
 */
export function applyPagePermissions(role, url) {
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
             
            const safeIds = [
                'student-search-input', 
                'teacher-search-input',
                'prev-month',
                'next-month',
                'subject-select'
            ];

            if (!safeIds.includes(el.id)) {
                el.disabled = true;
            }
        });
    } else {
         
        const interactiveElements = pageContainer.querySelectorAll('input, button, textarea, select, form');
        interactiveElements.forEach(el => el.disabled = false);
    }
}

/**
 * Renderiza a sidebar com a lista de matérias.
 */
export function renderMateriasSidebar(subjects, onSelectCallback) {
    const listEl = document.getElementById('lista-disciplinas');
    if (!listEl) return;
    listEl.innerHTML = '';

    subjects.forEach((subj, index) => {
        const li = document.createElement('li');
        li.className = 'disciplina-item';
        li.innerHTML = `<i class="fa-solid fa-book"></i> ${subj}`;
         
        if (index === 0) li.classList.add('active');

        li.addEventListener('click', () => {
             
            document.querySelectorAll('.disciplina-item').forEach(el => el.classList.remove('active'));
            li.classList.add('active');
            onSelectCallback(subj);
        });

        listEl.appendChild(li);
    });
}

/**
 * Renderiza o conteúdo principal da matéria selecionada.
 * @param {string} subjectName - Nome da matéria
 * @param {Array} modules - Lista de módulos e conteúdos
 * @param {string} userRole - 'aluno' ou 'professor'
 */
export function renderSubjectContent(subjectName, modules, userRole) {
    const titleEl = document.getElementById('disciplina-titulo');
    const contentEl = document.getElementById('conteudo-modulos');
    const teacherActions = document.getElementById('teacher-actions');

    if (titleEl) titleEl.innerText = subjectName;
    if (!contentEl) return;

     
    if (teacherActions) {
        teacherActions.style.display = (userRole === 'professor') ? 'flex' : 'none';
    }

    contentEl.innerHTML = '';

    if (modules.length === 0) {
        contentEl.innerHTML = '<p style="text-align:center; color:var(--icon-inactive);">Nenhum conteúdo disponível.</p>';
        return;
    }

    modules.forEach(module => {
        let itemsHtml = '';

        module.itens.forEach(item => {
             
            let iconClass = 'fa-file-lines';
            if (item.type === 'link') iconClass = 'fa-video';
            if (item.type === 'assignment') iconClass = 'fa-clipboard-list';

             
            let actionsHtml = '';
            
            if (userRole === 'professor') {
                 
                actionsHtml += `<button title="Editar"><i class="fa-solid fa-pen"></i></button>`;
                actionsHtml += `<button title="Excluir"><i class="fa-solid fa-trash"></i></button>`;
                if (item.type === 'assignment') {
                    actionsHtml += `<button title="Ver Envios"><i class="fa-solid fa-users-viewfinder"></i></button>`;
                }
            } else {
                 
                if (item.type === 'file') {
                    actionsHtml += `<button title="Baixar"><i class="fa-solid fa-download"></i></button>`;
                } else if (item.type === 'assignment') {
                    const statusBadge = item.status === 'Entregue' 
                        ? `<span class="status-badge badge-entregue">Entregue</span>` 
                        : `<span class="status-badge badge-pendente">Pendente</span>`;
                    
                     
                    actionsHtml += statusBadge;
                    actionsHtml += `<button class="btn-upload-trigger" data-id="${item.id}" data-name="${item.nome}" title="Enviar"><i class="fa-solid fa-upload"></i></button>`;
                }
            }

            itemsHtml += `
                <li class="resource-item">
                    <div class="resource-info">
                        <i class="fa-solid ${iconClass} resource-icon"></i>
                        <div class="resource-meta">
                            <span class="resource-name">${item.nome}</span>
                            <span class="resource-desc">${item.desc}</span>
                        </div>
                    </div>
                    <div class="resource-actions">
                        ${actionsHtml}
                    </div>
                </li>
            `;
        });

        contentEl.innerHTML += `
            <div class="module-block">
                <h4 class="module-title"><i class="fa-solid fa-caret-down"></i> ${module.titulo}</h4>
                <ul class="resources-list">
                    ${itemsHtml}
                </ul>
            </div>
        `;
    });
}