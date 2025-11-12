// Encontrar temas
const body = document.body;
const sunBtn = document.getElementById('theme-sun');
const moonBtn = document.getElementById('theme-moon');

// Aplicar o tema
function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        moonBtn.classList.add('active');
        sunBtn.classList.remove('active');
    } else {
        // Se for 'light' ou não houver nada salvo, garante o modo claro
        body.classList.remove('dark-mode');
        sunBtn.classList.add('active');
        moonBtn.classList.remove('active');
    }
}

// Escutadores dos botões de tema
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

applySavedTheme();

// Lógica de Login
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const roleButtons = document.querySelectorAll('.role-btn');
const errorMessageDiv = document.getElementById('error-message');

let selectedRole = null;

roleButtons.forEach(button => {
    button.addEventListener('click', () => {
        roleButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        selectedRole = button.dataset.role; 
        errorMessageDiv.textContent = '';
        errorMessageDiv.style.display = 'none';
    });
});

loginForm.addEventListener('submit', (event) => {
    event.preventDefault(); 
    
    const email = emailInput.value;
    const password = passwordInput.value;

    let errorMessage = '';
    if (!email || !password) {
        errorMessage = 'Por favor, preencha o email e a senha.';
    } else if (!selectedRole) {
        errorMessage = 'Por favor, selecione o seu perfil (Aluno, Professor ou Coordenador).';
    }

    if (errorMessage) {
        errorMessageDiv.textContent = errorMessage;
        errorMessageDiv.style.display = 'block'; 
        return; 
    }

    errorMessageDiv.textContent = ''; 
    errorMessageDiv.style.display = 'none'; 

    localStorage.setItem('userRole', selectedRole);
    window.location.href = 'index.html';
});