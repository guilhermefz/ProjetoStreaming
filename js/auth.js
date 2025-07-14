// js/auth.js

document.addEventListener('DOMContentLoaded', function() {
    // 1. Conecta-se aos bancos de dados
    const dbUsers = new PouchDB('users_db');
    console.log('PouchDB "users_db" inicializado para autenticação.');

    // 2. Pega referências aos elementos do formulário
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');

    // 3. Prepara o Modal de Sucesso (o "controle remoto")
    // É importante pegar o elemento HTML primeiro
    const loginSuccessModalElement = document.getElementById('loginSuccessModal');
    // E só então criar o objeto de controle do Bootstrap
    const loginSuccessModal = new bootstrap.Modal(loginSuccessModalElement, {
        keyboard: false, // Impede que a tecla ESC feche o modal
        backdrop: 'static' // Impede que cliques fora do modal o fechem
    });

    // 4. Adiciona o 'event listener' para o envio do formulário
    if (loginForm) {
        loginForm.addEventListener('submit', async function(event) {
            // Impede o recarregamento padrão da página
            event.preventDefault();
            errorMessage.classList.add('d-none'); // Esconde erros antigos

            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();

            // --- Lógica de Login do Administrador ---
            if (username === 'admin' && password === 'admin') {
                // Mostra o modal de sucesso
                loginSuccessModal.show();
                // Aguarda 2 segundos e então redireciona
                setTimeout(() => {
                    window.location.href = 'admin.html';
                }, 2000); // 2000ms = 2 segundos
                return; // Para a execução aqui
            }

            // --- Lógica de Login do Usuário Comum ---
            try {
                // Busca o usuário no banco de dados pelo seu nome/email (que é o _id)
                const userDoc = await dbUsers.get(username);

                // Verifica se a senha corresponde
                if (userDoc && userDoc.password === password) {
                    // Mostra o modal de sucesso
                    loginSuccessModal.show();
                    // Aguarda 2 segundos e então redireciona
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2000);
                } else {
                    // Se o usuário existe mas a senha está errada
                    errorMessage.textContent = 'Senha incorreta. Tente novamente.';
                    errorMessage.classList.remove('d-none');
                }
            } catch (error) {
                // Se o dbUsers.get(username) falhar, significa que o usuário não foi encontrado
                if (error.name === 'not_found') {
                    errorMessage.textContent = 'Usuário não encontrado.';
                    errorMessage.classList.remove('d-none');
                } else {
                    // Para outros erros inesperados do banco de dados
                    errorMessage.textContent = 'Ocorreu um erro. Tente novamente.';
                    errorMessage.classList.remove('d-none');
                    console.error('Erro de login:', error);
                }
            }
        });
    }
});