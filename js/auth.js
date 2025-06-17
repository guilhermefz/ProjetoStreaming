document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');

    if (!loginForm || !usernameInput || !passwordInput || !errorMessage) {
        console.error('Erro: Um ou mais elementos HTML essenciais não foram encontrados. Verifique os IDs no HTML e no JS.');
        return; 
    }

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); 
        
        errorMessage.textContent = '';
        errorMessage.classList.add('d-none'); 

        const username = usernameInput.value;
        const password = passwordInput.value;

        console.log('Usuário digitado:', username);
        console.log('Senha digitada:', password);

        if (username === 'admin' && password === 'admin') {
            alert('Login de Administrador bem-sucedido!');
            window.location.href = 'admin.html';
        } else if (username === 'user' && password === 'user') {
            alert('Login de Usuário bem-sucedido!');
            window.location.href = 'index.html';
        } else {
            errorMessage.textContent = 'Usuário ou senha inválidos.';
            errorMessage.classList.remove('d-none');
        }
    });
});