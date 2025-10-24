// 1. Encontrar os elementos no HTML
const toggleButton = document.getElementById('toggle-btn');
const sidebar = document.querySelector('.sidebar');

// 2. Adicionar um "escutador de eventos" de clique no botão
toggleButton.addEventListener('click', function() {
    
    // 3. Adicionar ou remover a classe 'collapsed' da sidebar
    sidebar.classList.toggle('collapsed');
});


/* --- NOVO CÓDIGO PARA O TEMA --- */

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
});

// 3. Escutador para o botão LUA (Modo Escuro)
moonBtn.addEventListener('click', function() {
    // Adiciona a classe do modo escuro
    body.classList.add('dark-mode');
    
    // Atualiza o botão "ativo"
    moonBtn.classList.add('active');
    sunBtn.classList.remove('active');
});