document.addEventListener('DOMContentLoaded', function() {
     // 1. Obter referências para os elementos do formulário no HTML
    // Usamos document.getElementById() para encontrar elementos pelo seu ID único.
    const registerForm = document.getElementById('registerForm'); // O formulário completo
    const usernameInput = document.getElementById('username');   // Campo de nome de usuário
    const emailInput = document.getElementById('email');         // Campo de email
    const passwordInput = document.getElementById('password');   // Campo de senha
    const confirmPasswordInput = document.getElementById('confirmPassword'); // Campo de confirmar senha
    const errorMessage = document.getElementById('errorMessage'); // Onde exibiremos mensagens de erro


    function displayError(message) {
        errorMessage.textContent = message; // Coloca a mensagem de texto dentro da div.
        errorMessage.classList.remove('d-none'); // Remove a classe 'd-none' para mostrar a div.
    }
    function hideError() {
        errorMessage.textContent = ''; // Limpa o texto da mensagem.
        errorMessage.classList.add('d-none'); // Adiciona a classe 'd-none' para esconder a div.
    }

    registerForm.addEventListener('submit', function(event) {
        event.preventDefault(); 
        // O '.value' pega o que o usuário digitou no campo de entrada.
        const username = usernameInput.value.trim(); // .trim() remove espaços extras no início/fim
        const email = emailInput.value.trim();
        const password = passwordInput.value; // Não usamos .trim() para senhas por segurança
        const confirmPassword = confirmPasswordInput.value;

        hideError(); // Primeiro, esconde qualquer erro anterior.

        if (username === '') {
            displayError('Por favor, preencha o nome de usuário.');
            return; // Para a execução da função se houver erro
        }
        if (email === '') {
            displayError('Por favor, preencha o campo de e-mail.');
            return;
        }
        if (password === '') {
            displayError('Por favor, preencha o campo de senha.');
            return;
        }
        if (confirmPassword === '') {
            displayError('Por favor, preencha o campo de confirmação de senha.');
            return;
        }

        if (password !== confirmPassword) { //validar se as senhas coincidem
            displayError('As senhas não coincidem. Por favor, verifique.');
            return; // Para a execução da função se houver erro
        }

        // 6. Validar formato do e-mail
        // Usamos uma expressão regular (regex) para verificar se o email tem um formato válido.
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) { // O '!' significa "NÃO". Se o email NÃO passar no teste da regex...
            displayError('Por favor, insira um formato de e-mail válido.');
            return; // Para a execução se o formato for inválido.
        }


        // 7. Simular o registro do usuário
        // Em um projeto real, aqui você enviaria esses dados para um servidor/banco de dados.
        // Para este exemplo, vamos "armazenar" o novo usuário no localStorage do navegador.
        
        // Verifica se o usuário (nome de usuário ou email) já existe (simulação)
        const storedUsers = JSON.parse(localStorage.getItem('users')) || {};
        
        if (storedUsers[username] || Object.values(storedUsers).some(user => user.email === email)) {
            displayError('Nome de usuário ou e-mail já registrado. Por favor, use outro.');
            return;
        }

        // Adiciona o novo usuário
        storedUsers[username] = {
            email: email,
            password: password // Em um sistema real, a senha seria hash (criptografada)
        };
        localStorage.setItem('users', JSON.stringify(storedUsers));

        // Se o registro foi "bem-sucedido", redireciona para a página de login
        alert('Conta criada com sucesso! Faça login para continuar.');
        window.location.href = 'login.html';
    
    });
});