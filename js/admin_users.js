document.addEventListener('DOMContentLoaded', function() {
    console.log('Página de gerenciamento de usuários carregada.');

    // 1. Conecta ao banco de dados de USUÁRIOS
    const dbUsers = new PouchDB('users_db');

    // 2. Pega a referência da tabela onde os usuários serão listados
    const userListBody = document.getElementById('userList');
    const editUserModalEl = document.getElementById('editUserModal');
    const editUserModal = new bootstrap.Modal(editUserModalEl); // Objeto de controle do modal
    const editUserForm = document.getElementById('editUserForm');
    const editUsernameInput = document.getElementById('editUsername');
    const editUserEmailInput = document.getElementById('editUserEmail');
    const editUserRoleSelect = document.getElementById('editUserRole');
    const saveUserChangesBtn = document.getElementById('saveUserChangesBtn');

    // 3. Função para carregar e exibir os usuários na tabela
    async function loadUsersIntoTable() {
        // Limpa a mensagem "Carregando usuários..."
        userListBody.innerHTML = '';

        try {
            // Busca todos os documentos do banco de dados de usuários
            const result = await dbUsers.allDocs({ include_docs: true });

            // Pega apenas os objetos dos usuários
            // Não precisamos filtrar por 'type' aqui, mas é bom manter o padrão
            const users = result.rows.map(row => row.doc);

            // Se não houver usuários, mostra uma mensagem
            if (users.length === 0) {
                userListBody.innerHTML = '<tr><td colspan="3" class="text-center">Nenhum usuário cadastrado.</td></tr>';
                return;
            }

            // Para cada usuário encontrado, cria uma linha na tabela
            users.forEach(user => {
                // Não exibe o usuário 'admin' na lista, pois ele não deve ser gerenciável
                if (user._id === 'admin') {
                    return; // Pula para o próximo usuário do loop
                }

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user._id}</td>
                    <td>${user.email}</td>
                    <td>
                        <button class="btn btn-info btn-sm me-2" data-id="${user._id}">Editar</button>
                        <button class="btn btn-danger btn-sm" data-id="${user._id}">Excluir</button>
                    </td>
                `;
                userListBody.appendChild(row); // Adiciona a nova linha à tabela
            });

        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
            userListBody.innerHTML = '<tr><td colspan="3" class="text-center text-danger">Erro ao carregar usuários.</td></tr>';
        }
    }

    // 4. Chama a função para carregar os usuários assim que a página é carregada
    loadUsersIntoTable();

    userListBody.addEventListener('click', async function(event) {
        // Verifica se o elemento clicado foi um botão "Editar" (com a classe btn-info)
        if (event.target.classList.contains('btn-info')) {
            const userId = event.target.getAttribute('data-id');
    
            try {
                // Busca o documento completo do usuário no PouchDB
                const userDoc = await dbUsers.get(userId);
    
                // Preenche os campos do modal com os dados do usuário
                editUsernameInput.value = userDoc._id; // O nome de usuário é o _id
                editUserEmailInput.value = userDoc.email;
                // Se o usuário já tiver um 'type' (admin/user), seleciona essa opção.
                // Se não, o padrão será 'user'.
                editUserRoleSelect.value = userDoc.type || 'user';
    
                // Abre o modal na tela
                editUserModal.show();
            } catch (error) {
                console.error("Erro ao carregar usuário para edição:", error);
                alert("Não foi possível carregar os dados do usuário.");
            }
        }
    });

    saveUserChangesBtn.addEventListener('click', async function() {
        // Pega o ID do usuário que estamos editando, que guardamos no formulário
        const userId = editUsernameInput.value;

        // Pega os novos valores dos campos do modal
        const newEmail = editUserEmailInput.value.trim();
        const newRole = editUserRoleSelect.value;

        // Validação simples para o e-mail
        if (newEmail === '') {
            alert('O campo de e-mail não pode ficar vazio.');
            return;
        }

        try {
            // 1. Busca o documento ATUAL do usuário para pegar a revisão (_rev) mais recente
            const userDoc = await dbUsers.get(userId);

            // 2. Atualiza as propriedades do documento com os novos valores
            userDoc.email = newEmail;
            userDoc.type = newRole; // Atualiza a função para 'user' ou 'admin'

            // 3. Salva o documento modificado de volta no PouchDB
            // O PouchDB usa o _rev para garantir que estamos atualizando a versão mais recente
            await dbUsers.put(userDoc);

            // 4. Feedback e atualização
            alert('Usuário atualizado com sucesso!'); // Um alerta simples por enquanto
            editUserModal.hide(); // Esconde o modal do Bootstrap
            await loadUsersIntoTable(); // Recarrega a tabela para mostrar os dados atualizados

        } catch (error) {
            console.error("Erro ao salvar alterações do usuário:", error);
            alert("Não foi possível salvar as alterações. Verifique o console.");
        }
    });

});