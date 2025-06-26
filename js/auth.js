document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');

    // Cria ou abre um banco de dados PouchDB chamado 'users_db'.
    // Deve ser o MESMO NOME usado no register.js para acessar os mesmos dados.
    const db = new PouchDB('users_db');
    console.log('PouchDB "users_db" inicializado em auth.js.');

    if (!loginForm || !usernameInput || !passwordInput || !errorMessage) {
        console.error('Erro: Um ou mais elementos HTML essenciais não foram encontrados. Verifique os IDs no HTML e no JS.');
        return; 
    }

    function displayError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('d-none');
    }
    function hideError() {
        errorMessage.textContent = '';
        errorMessage.classList.add('d-none');
    }

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault(); 
        
        errorMessage.textContent = '';
        errorMessage.classList.add('d-none'); 

        const username = usernameInput.value;
        const password = passwordInput.value;

        console.log('Usuário digitado:', username);
        console.log('Senha digitada:', password);

        try {
            // Primeiro, verifica o usuário 'admin' como exceção (ainda fixo)
            if (username === 'admin' && password === 'admin') {
                alert('Login de Administrador bem-sucedido!');
                window.location.href = 'admin.html';
                return; // Para a execução aqui
            }

            const userDoc = await db.get(username); // userDoc será o documento do usuário se encontrado

            if (userDoc && userDoc.password === password) {
                alert('Login de Usuário bem-sucedido!');
                window.location.href = 'index.html';
            } else {
                displayError('Usuário ou senha inválidos.');
            }
        } catch (err) {
            if (err.name === 'not_found') {
                displayError('Usuário ou senha inválidos.');
            } else {
                console.error('Erro ao tentar login:', err);
                displayError('Ocorreu um erro ao tentar fazer login. Tente novamente.');
            }
    }});
});