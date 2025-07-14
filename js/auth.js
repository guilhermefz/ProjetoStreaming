document.addEventListener('DOMContentLoaded', function() {
    // 1. Conecta-se aos bancos de dados
    const dbUsers = new PouchDB('users_db');
    console.log('PouchDB "users_db" inicializado para autenticação.');

    // 2. Pega referências aos elementos do formulário
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');

    // 3. Prepara o Modal de Sucesso
    const loginSuccessModalElement = document.getElementById('loginSuccessModal');
    const loginSuccessModal = new bootstrap.Modal(loginSuccessModalElement, {
        keyboard: false,
        backdrop: 'static'
    });

    // 4. Adiciona o 'event listener' para o envio do formulário
    if (loginForm) {
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            errorMessage.classList.add('d-none');

            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();

            // --- Lógica de Login do Super-Administrador (sempre existe) ---
            if (username === 'admin' && password === 'admin') {
                loginSuccessModal.show();
                setTimeout(() => {
                    window.location.href = 'admin.html';
                }, 2000);
                return;
            }

            // --- Lógica de Login para TODOS os outros usuários ---
            try {
                const userDoc = await dbUsers.get(username);

                if (userDoc && userDoc.password === password) {
                    // Login bem-sucedido, agora verificamos a FUNÇÃO do usuário
                    loginSuccessModal.show();

                    setTimeout(() => {
                        // Se o tipo do usuário for 'admin', redireciona para o painel de admin
                        if (userDoc.type === 'admin') {
                            window.location.href = 'admin.html';
                        } else {
                            // Senão, redireciona para a página inicial
                            window.location.href = 'index.html';
                        }
                    }, 2000);

                } else {
                    errorMessage.textContent = 'Senha incorreta. Tente novamente.';
                    errorMessage.classList.remove('d-none');
                }
            } catch (error) {
                if (error.name === 'not_found') {
                    errorMessage.textContent = 'Usuário não encontrado.';
                    errorMessage.classList.remove('d-none');
                } else {
                    errorMessage.textContent = 'Ocorreu um erro. Tente novamente.';
                    errorMessage.classList.remove('d-none');
                    console.error('Erro de login:', error);
                }
            }
        });
    }
});