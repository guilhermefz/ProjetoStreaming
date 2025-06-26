document.addEventListener('DOMContentLoaded', function() {
     // 1. Obter referências para os elementos do formulário no HTML
    // Usamos document.getElementById() para encontrar elementos pelo seu ID único.
    const registerForm = document.getElementById('registerForm'); // O formulário completo
    const usernameInput = document.getElementById('username');   // Campo de nome de usuário
    const emailInput = document.getElementById('email');         // Campo de email
    const passwordInput = document.getElementById('password');   // Campo de senha
    const confirmPasswordInput = document.getElementById('confirmPassword'); // Campo de confirmar senha
    const errorMessage = document.getElementById('errorMessage'); // Onde exibiremos mensagens de erro

    // Cria ou abre um banco de dados PouchDB chamado 'users_db'.
    const db = new PouchDB('users_db');
    console.log('PouchDB "users_db" inicializado.');

    function displayError(message) {
        errorMessage.textContent = message; // Coloca a mensagem de texto dentro da div.
        errorMessage.classList.remove('d-none'); // Remove a classe 'd-none' para mostrar a div.
    }
    function hideError() {
        errorMessage.textContent = ''; // Limpa o texto da mensagem.
        errorMessage.classList.add('d-none'); // Adiciona a classe 'd-none' para esconder a div.
    }

    registerForm.addEventListener('submit', async function(event) {
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


        try {
            // Verifica se o nome de usuário já existe
            try {
                // Tenta buscar um documento com o _id igual ao username
                await db.get(username);
                displayError('Nome de usuário já registrado. Por favor, use outro.');
                return;
            } catch (err) {
                // Se o erro for 'not_found', significa que o nome de usuário está disponível.
                // Outros erros são problemas reais.
                if (err.name !== 'not_found') {
                    console.error("Erro ao verificar nome de usuário:", err);
                    displayError('Erro ao verificar usuário. Tente novamente.');
                    return;
                }
            }

            // Verifica se o e-mail já existe (isso requer uma consulta mais complexa no PouchDB)
            // Para simplificar agora, vamos fazer uma busca por todos os documentos e filtrar.
            const allDocs = await db.allDocs({ include_docs: true });
            const emailExists = allDocs.rows.some(row => row.doc.email === email);

            if (emailExists) {
                displayError('E-mail já registrado. Por favor, use outro.');
                return;
            }

            // Se o usuário e o e-mail não existirem, cria o novo usuário.
            // O _id é o identificador único do documento no PouchDB.
            // O _id aqui será o username.
            const newUser = {
                _id: username, // PouchDB usa '_id' como chave primária única
                email: email,
                password: password, // Lembre-se: em um sistema real, a senha deve ser hash (criptografada)
                type: 'user' // Define um tipo padrão para o usuário
            };

            // Salva o novo usuário no PouchDB
            // db.put() insere ou atualiza um documento.
            const response = await db.put(newUser);
            console.log('Usuário registrado com sucesso:', response);

            alert('Conta criada com sucesso! Faça login para continuar.');
            window.location.href = 'login.html';

        } catch (error) {
            console.error('Erro durante o registro:', error);
            displayError('Erro inesperado durante o registro. Tente novamente.');
        }
    });
});