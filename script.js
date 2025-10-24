// 1. Encontrar os elementos no HTML
const toggleButton = document.getElementById('toggle-btn');
const sidebar = document.querySelector('.sidebar');

// 2. Adicionar um "escutador de eventos" de clique no botão
toggleButton.addEventListener('click', function() {
    
    // 3. Adicionar ou remover a classe 'collapsed' da sidebar
    sidebar.classList.toggle('collapsed');
});

// 1. Encontrar os novos elementos
const sunBtn = document.getElementById('theme-sun');
const moonBtn = document.getElementById('theme-moon');
const body = document.body;

// 2. Escutador para o botão SOL (Modo Claro)
sunBtn.addEventListener('click', function() {
    // Remove a classe do modo escuro
    body.classList.remove('dark-mode');
    
    // Atualiza o botão "ativo"
    sunBtn.classList.add('active');
    moonBtn.classList.remove('active');

    // Salva a escolha no localStorage
    localStorage.setItem('theme', 'light');
});

// 3. Escutador para o botão LUA (Modo Escuro)
moonBtn.addEventListener('click', function() {
    // Adiciona a classe do modo escuro
    body.classList.add('dark-mode');
    
    // Atualiza o botão "ativo"
    moonBtn.classList.add('active');
    sunBtn.classList.remove('active');

    // Salva a escolha no localStorage
    localStorage.setItem('theme', 'dark');
});

function applySavedTheme() {
    // Pega o tema salvo no localStorage
    const savedTheme = localStorage.getItem('theme');

    // Verifica se o tema salvo é o 'dark'
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        moonBtn.classList.add('active');
        sunBtn.classList.remove('active');
    } else {
        // Se for 'light' ou se não houver nada salvo, garante o modo claro
        body.classList.remove('dark-mode');
        sunBtn.classList.add('active');
        moonBtn.classList.remove('active');
    }
}

/* --- CÓDIGO PARA ROTEAMENTO (SPA) --- */

// 1. Função para carregar o conteúdo da página
async function loadPage(url) {
    try {
        // Busca o conteúdo do arquivo HTML (ex: 'pages/alunos.html')
        const response = await fetch(url);
        
        // Se a página não existir, mostra um erro
        if (!response.ok) {
            throw new Error(`Página não encontrada: ${response.status}`);
        }
        
        // Pega o texto (HTML) da resposta
        const content = await response.text();
        
        // Encontra o container <main>
        const pageContainer = document.getElementById('page-content');
        
        // Injeta o novo conteúdo no <main>
        pageContainer.innerHTML = content;

    } catch (error) {
        console.error("Erro ao carregar a página:", error);
        document.getElementById('page-content').innerHTML = "<h1>Erro ao carregar conteúdo.</h1>";
    }
}

// 2. Adicionar "escutadores" em todos os links da sidebar
document.addEventListener('DOMContentLoaded', () => {
    
    // Chama a função para aplicar o tema salvo
    applySavedTheme();

    // Seleciona todos os links com a classe .nav-link
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            // 1. Impede o navegador de recarregar a página
            event.preventDefault(); 
            
            // 2. Pega a URL do link (ex: 'pages/alunos.html')
            const href = link.getAttribute('href');
            
            // 3. Carrega o conteúdo dessa URL
            loadPage(href);
        });
    });

    // 4. Carregar a página inicial (dashboard) por padrão
    loadPage('pages/dashboard.html');
});