
/**
 * Simula uma espera de rede
 * @param {number} ms - Tempo em milissegundos para a espera.
 */
const simulateNetworkDelay = (ms = 300) => new Promise(res => setTimeout(res, ms));


let _calendarEvents = JSON.parse(localStorage.getItem('calendarEvents')) || {};

let _mockStudentData = [
    { matricula: "2025001", nome: "Ana Silva", turma: "9º Ano A", status: "Ativo" },
    { matricula: "2025002", nome: "Carlos Santos", turma: "9º Ano A", status: "Ativo" },
    { matricula: "2025003", nome: "Beatriz Lima", turma: "8º Ano B", status: "Ativo" },
    { matricula: "2025004", nome: "Daniel Costa", turma: "9º Ano A", status: "Inativo" },
    { matricula: "2025005", nome: "Elena Rodrigues", turma: "8º Ano B", status: "Ativo" },
    { matricula: "2025006", nome: "Fernando Alves", turma: "7º Ano C", status: "Ativo" },
    { matricula: "2025007", nome: "Gabriela Dias", turma: "7º Ano C", status: "Ativo" },
];

let _mockTeacherData = [
    { matricula: "P1001", nome: "Marcos Andrade", disciplina: "Matemática", status: "Ativo" },
    { matricula: "P1002", nome: "Lúcia Pereira", disciplina: "Português", status: "Ativo" },
    { matricula: "P1003", nome: "Roberto Freitas", disciplina: "História", status: "Ativo" },
    { matricula: "P1004", nome: "Sandra Gomes", disciplina: "Ciências", status: "Licença" },
    { matricula: "P1005", nome: "Ricardo Oliveira", disciplina: "Educação Física", status: "Ativo" },
];

const _mockBoletimData = [
    { materia: 'Matemática', n1_n1: 8.0, n1_n2: 7.5, n1_ativ: 9.0, n2_n1: 8.5, n2_n2: 8.0, n2_ativ: 9.0 },
    { materia: 'Português', n1_n1: 9.5, n1_n2: 8.5, n1_ativ: 9.0, n2_n1: 9.0, n2_n2: 9.5, n2_ativ: 10.0 },
    { materia: 'História', n1_n1: 7.0, n1_n2: 7.0, n1_ativ: 8.0, n2_n1: 7.5, n2_n2: 7.0, n2_ativ: 7.5 },
    { materia: 'Geografia', n1_n1: 8.5, n1_n2: 8.0, n1_ativ: 8.0, n2_n1: 8.0, n2_n2: 8.0, n2_ativ: 8.5 },
    { materia: 'Ciências', n1_n1: 9.0, n1_n2: 9.5, n1_ativ: 9.0, n2_n1: 9.0, n2_n2: 9.0, n2_ativ: 9.5 },
    { materia: 'Inglês', n1_n1: 10.0, n1_n2: 10.0, n1_ativ: 10.0, n2_n1: 10.0, n2_n2: 10.0, n2_ativ: 10.0 },
    { materia: 'Educação Física', n1_n1: 10.0, n1_n2: 10.0, n1_ativ: 10.0, n2_n1: 10.0, n2_n2: 10.0, n2_ativ: 10.0 },
];

const _mockAbsenceData = [
    { materia: 'Matemática', frequencia: "95%", faltas: 6 },
    { materia: 'Português', frequencia: "98%", faltas: 3 },
    { materia: 'História', frequencia: "95%", faltas: 6 },
    { materia: 'Geografia', frequencia: "100%", faltas: 0 },
    { materia: 'Ciências', frequencia: "98%", faltas: 3 },
    { materia: 'Inglês', frequencia: "100%", faltas: 0 },
];

const _mockProfessorAtencao = [
    { nome: "Beatriz Lima", turma: "8º Ano B", media: 6.8, frequencia: "80%" },
    { nome: "Daniel Costa", turma: "9º Ano A", media: 5.5, frequencia: "85%" },
    { nome: "Fernando Alves", turma: "7º Ano C", media: 7.0, frequencia: "75%" },
];


/**
 * Busca a lista de alunos, opcionalmente filtrada.
 * (No futuro, o filtro será enviado para a API C#)
 * @param {string} filter - Termo de busca
 * @returns {Promise<Array>} Lista de alunos filtrada
 */
export async function getStudents(filter = '') {
    await simulateNetworkDelay(250); // Simula busca
    
    const lowerCaseFilter = filter.toLowerCase();
    
    const filteredData = _mockStudentData.filter(student => {
        return (
            student.nome.toLowerCase().includes(lowerCaseFilter) ||
            student.turma.toLowerCase().includes(lowerCaseFilter) ||
            student.matricula.includes(lowerCaseFilter)
        );
    });
    
    return Promise.resolve(filteredData);
}

/**
 * Adiciona um novo aluno ao "banco de dados".
 * @param {object} studentData - Objeto com { matricula, nome, turma, status }
 * @returns {Promise<object>} O aluno que foi adicionado
 */
export async function addStudent(studentData) {
    await simulateNetworkDelay(500); // Simula POST
    
    // No futuro, a API C# geraria a matrícula
    _mockStudentData.push(studentData);
    
    return Promise.resolve(studentData);
}

/**
 * Deleta um aluno do "banco de dados"
 * @param {string} studentId - Matrícula do aluno
 * @returns {Promise<boolean>} Sucesso da operação
 */
export async function deleteStudent(studentId) {
    await simulateNetworkDelay(400); // Simula DELETE
    
    _mockStudentData = _mockStudentData.filter(student => student.matricula !== studentId);
    
    return Promise.resolve(true);
}


// --- PROFESSORES ---

/**
 * Busca a lista de professores, opcionalmente filtrada.
 * @param {string} filter - Termo de busca
 * @returns {Promise<Array>} Lista de professores filtrada
 */
export async function getTeachers(filter = '') {
    await simulateNetworkDelay(250);
    
    const lowerCaseFilter = filter.toLowerCase();
    
    const filteredData = _mockTeacherData.filter(teacher => {
        return (
            teacher.nome.toLowerCase().includes(lowerCaseFilter) ||
            teacher.disciplina.toLowerCase().includes(lowerCaseFilter) ||
            teacher.matricula.toLowerCase().includes(lowerCaseFilter)
        );
    });
    
    return Promise.resolve(filteredData);
}

/**
 * Adiciona um novo professor ao "banco de dados".
 * @param {object} teacherData - Objeto com { matricula, nome, disciplina, status }
 * @returns {Promise<object>} O professor que foi adicionado
 */
export async function addTeacher(teacherData) {
    await simulateNetworkDelay(500);
    
    _mockTeacherData.push(teacherData);
    
    return Promise.resolve(teacherData);
}

/**
 * Deleta um professor do "banco de dados"
 * @param {string} teacherId - Matrícula do professor
 * @returns {Promise<boolean>} Sucesso da operação
 */
export async function deleteTeacher(teacherId) {
    await simulateNetworkDelay(400);
    
    _mockTeacherData = _mockTeacherData.filter(teacher => teacher.matricula !== teacherId);
    
    return Promise.resolve(true);
}


// --- CALENDÁRIO ---

/**
 * Busca todos os eventos do calendário.
 * @returns {Promise<object>} Objeto de eventos
 */
export async function getCalendarEvents() {
    await simulateNetworkDelay(100);
    return Promise.resolve(_calendarEvents);
}

/**
 * Salva um novo evento no calendário e persiste no localStorage.
 * @param {string} date - Data (AAAA-MM-DD)
 * @param {string} title - Título do evento
 * @returns {Promise<boolean>} Sucesso da operação
 */
export async function saveCalendarEvent(date, title) {
    await simulateNetworkDelay(300);
    
    if (!_calendarEvents[date]) {
        _calendarEvents[date] = [];
    }
    _calendarEvents[date].push(title);
    
    // Persistência local (no futuro, será uma chamada POST para a API)
    localStorage.setItem('calendarEvents', JSON.stringify(_calendarEvents));
    
    return Promise.resolve(true);
}


// --- DESEMPENHO (BOLETIM) ---

/**
 * Busca os dados do boletim.
 * @returns {Promise<Array>}
 */
export async function getBoletimData() {
    await simulateNetworkDelay(400);
    return Promise.resolve(_mockBoletimData);
}

/**
 * Busca os dados de faltas.
 * @returns {Promise<Array>}
 */
export async function getAbsenceData() {
    await simulateNetworkDelay(300);
    return Promise.resolve(_mockAbsenceData);
}

/**
 * Busca dados de notas de uma matéria específica para o gráfico.
 * @param {string} selectedSubject - Nome da matéria
 * @returns {Promise<object>} Objeto com { labels, data }
 */
export async function getSubjectEvolutionData(selectedSubject) {
    await simulateNetworkDelay(150);
    
    const subjectData = _mockBoletimData.find(row => row.materia === selectedSubject);
    
    if (!subjectData) {
        return Promise.reject(new Error('Matéria não encontrada'));
    }

    const chartLabels = ['1ºBim (N1)', '1ºBim (N2)', '2ºBim (N1)', '2ºBim (N2)'];
    const chartData = [ 
        subjectData.n1_n1, 
        subjectData.n1_n2, 
        subjectData.n2_n1, 
        subjectData.n2_n2 
    ];
    
    return Promise.resolve({ labels: chartLabels, data: chartData });
}

/**
 * Busca todas as matérias disponíveis para o select.
 * @returns {Promise<Array>}
 */
export async function getAvailableSubjects() {
    await simulateNetworkDelay(100);
    const materias = _mockBoletimData.map(row => row.materia);
    const materiasUnicas = [...new Set(materias)]; 
    return Promise.resolve(materiasUnicas);
}


/**
 * Busca dados consolidados para o Dashboard do Professor.
 * @returns {Promise<object>}
 */
export async function getProfessorDashboardData() {
    await simulateNetworkDelay(500);
    
    // KPIs (hardcoded como no script original)
    const kpis = {
        mediaTurma: "7.8",
        frequenciaTurma: "92%",
        recuperacaoTurma: "5"
    };
    
    const alunosAtencao = _mockProfessorAtencao;
    
    return Promise.resolve({ kpis, alunosAtencao });
}

/**
 * Busca dados consolidados para o Dashboard do Coordenador.
 * @returns {Promise<object>}
 */
export async function getCoordenadorDashboardData() {
    await simulateNetworkDelay(600);

    // --- KPIs ---
    const totalAlunos = _mockStudentData.length;
    const totalProf = _mockTeacherData.length;
    
    let somaMedias = 0;
    _mockBoletimData.forEach(row => {
        const mediaBim1 = (row.n1_n1 + row.n1_n2 + row.n1_ativ) / 3;
        const mediaBim2 = (row.n2_n1 + row.n2_n2 + row.n2_ativ) / 3;
        somaMedias += (mediaBim1 + mediaBim2) / 2;
    });
    const mediaEscola = (somaMedias / _mockBoletimData.length).toFixed(1);

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const proxSemana = new Date();
    proxSemana.setDate(hoje.getDate() + 7);
    proxSemana.setHours(23, 59, 59, 999);

    let contagemEventos = 0;
    let eventosFuturos = [];

    for (const dateKey in _calendarEvents) {
        const dataEvento = new Date(dateKey + "T00:00:00"); 
        if (dataEvento >= hoje && dataEvento <= proxSemana) {
            const numEventos = _calendarEvents[dateKey].length;
            contagemEventos += numEventos;
            
            _calendarEvents[dateKey].forEach(titulo => {
                 eventosFuturos.push({ 
                    dataISO: dataEvento.toISOString(), 
                    dia: String(dataEvento.getDate()).padStart(2, '0'),
                    mes: String(dataEvento.getMonth() + 1).padStart(2, '0'),
                    titulo: titulo 
                });
            });
        }
    }
    
    eventosFuturos.sort((a, b) => a.dataISO.localeCompare(b.dataISO));

    const kpis = { totalAlunos, totalProf, mediaEscola, contagemEventos };

    const materiasLabels = _mockBoletimData.map(row => row.materia);
    const materiasMedias = _mockBoletimData.map(row => {
        const mediaBim1 = (row.n1_n1 + row.n1_n2 + row.n1_ativ) / 3;
        const mediaBim2 = (row.n2_n1 + row.n2_n2 + row.n2_ativ) / 3;
        return ((mediaBim1 + mediaBim2) / 2).toFixed(1);
    });
    const barChartData = { labels: materiasLabels, data: materiasMedias };

    const contagemTurmas = {};
    _mockStudentData.forEach(aluno => {
        contagemTurmas[aluno.turma] = (contagemTurmas[aluno.turma] || 0) + 1;
    });
    const pieChartData = {
        labels: Object.keys(contagemTurmas),
        data: Object.values(contagemTurmas)
    };

    return Promise.resolve({ kpis, barChartData, pieChartData, proximosEventos: eventosFuturos });
}

// --- MATÉRIAS E CONTEÚDO (MOCK) ---

const _mockMateriasContent = {
    "Matemática": [
        {
            id: 1,
            titulo: "Álgebra Linear",
            itens: [
                { type: "file", id: 101, nome: "Lista de Exercícios 01.pdf", desc: "Exercícios de revisão", data: "20/10" },
                { type: "link", id: 102, nome: "Vídeo Aula: Matrizes", desc: "YouTube", data: "21/10" }
            ]
        },
        {
            id: 2,
            titulo: "Geometria Analítica",
            itens: [
                { type: "assignment", id: 201, nome: "Trabalho em Grupo", desc: "Entrega até 30/10", status: "Pendente" }
            ]
        }
    ],
    "História": [
        {
            id: 3,
            titulo: "Segunda Guerra Mundial",
            itens: [
                { type: "file", id: 301, nome: "Resumo do Capítulo 4.pdf", desc: "Leitura obrigatória", data: "15/10" },
                { type: "assignment", id: 302, nome: "Redação sobre o Dia D", desc: "Mínimo 30 linhas", status: "Entregue" }
            ]
        }
    ]
    // ... adicione mais se quiser
};

/**
 * Retorna a lista de matérias disponíveis para o usuário.
 */
export async function getSubjectsList() {
    await simulateNetworkDelay(200);
    // Reaproveitando a lista do boletim ou criando uma nova
    return Promise.resolve(Object.keys(_mockMateriasContent));
}

/**
 * Retorna o conteúdo (módulos e arquivos) de uma matéria específica.
 */
export async function getSubjectContent(subjectName) {
    await simulateNetworkDelay(300);
    return Promise.resolve(_mockMateriasContent[subjectName] || []);
}

/**
 * Simula o upload de um arquivo (Aluno enviando atividade).
 */
export async function uploadStudentAssignment(assignmentId, file) {
    await simulateNetworkDelay(1000);
    console.log(`Arquivo ${file.name} enviado para a atividade ${assignmentId}`);
    return Promise.resolve(true);
}

/**
 * Simula professor adicionando material (apenas log).
 */
export async function addMaterialToSubject(subjectName, materialData) {
    await simulateNetworkDelay(500);
    // Em um app real, daria push no array _mockMateriasContent
    return Promise.resolve(true);
}