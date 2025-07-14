


document.addEventListener('DOMContentLoaded', function() {
    const dbMovies = new PouchDB('movies_db'); 
    console.log('PouchDB "movies_db" inicializado para administração.'); // Mensagem de depuração no console.

    const movieForm = document.getElementById('movieForm');
    const movieTitleInput = document.getElementById('movieTitle');
    const movieSynopsisInput = document.getElementById('movieSynopsis');
    const movieTrailerIdInput = document.getElementById('movieTrailerId');
    const movieCategorySelect = document.getElementById('movieCategory');
    const movieImageUrlInput = document.getElementById('movieImageUrl');
    const isFeaturedCheckbox = document.getElementById('isFeatured');
    const adminErrorMessage = document.getElementById('adminErrorMessage'); // Elemento para exibir erros
    const adminSuccessMessage = document.getElementById('adminSuccessMessage'); // Elemento para exibir sucesso
     
    const movieListBody = document.getElementById('movieList'); // O <tbody> da tabela onde os filmes serão listados
    const noMoviesMessage = document.getElementById('noMoviesMessage'); // A div da mensagem "Nenhum filme cadastrado"
    
    function displayError(message) {
        adminErrorMessage.textContent = message; 
        adminErrorMessage.classList.remove('d-none');
        adminSuccessMessage.classList.add('d-none'); // Garante que a mensagem de sucesso esteja oculta
    }

    function hideError() {
        adminErrorMessage.textContent = '';
        adminErrorMessage.classList.add('d-none');
    }

    function displaySuccess(message) {
        adminSuccessMessage.textContent = message;
        adminSuccessMessage.classList.remove('d-none');
        adminErrorMessage.classList.add('d-none'); 
    }

    function hideSuccess() {
        adminSuccessMessage.textContent = '';
        adminSuccessMessage.classList.add('d-none');
    }


    // NOVO TRECHO: Função para Carregar e Exibir Filmes na Tabela
    async function loadMoviesIntoTable() {
        // Limpa o conteúdo atual da tabela (o "Carregando filmes...")
        movieListBody.innerHTML = ''; 
        // Oculta a mensagem de "Nenhum filme" por enquanto
        noMoviesMessage.classList.add('d-none');

        try {
            // Busca todos os documentos do banco de dados de filmes.
            // include_docs: true garante que os dados completos do filme são retornados.
            const result = await dbMovies.allDocs({ include_docs: true });
            
            // Filtra apenas os documentos que são do tipo 'movie'.
            // Isso é uma boa prática para garantir que não estamos processando outros tipos de documentos, caso existam.
            const movies = result.rows
                .map(row => row.doc)
                .filter(doc => doc.type === 'movie');

            // Se não houver filmes, exibe a mensagem apropriada.
            if (movies.length === 0) {
                noMoviesMessage.classList.remove('d-none');
                return; // Para a execução da função aqui
            }

            // Para cada filme encontrado, cria uma linha na tabela.
            movies.forEach(movie => {
                const row = document.createElement('tr'); // Cria um novo elemento <tr> (linha da tabela)
                row.innerHTML = `
                    <td>${movie.title}</td>
                    <td>${movie.category}</td>
                    <td><a href="https://www.youtube.com/watch?v=E2hJlVoUD707${movie.trailerYoutubeId}" target="_blank">${movie.trailerYoutubeId.substring(0, 10)}...</a></td>
                    <td>${movie.isFeatured ? 'Sim' : 'Não'}</td>
                    <td>
                        <button class="btn btn-info btn-sm me-2" data-id="${movie._id}">Editar</button>
                        <button class="btn btn-danger btn-sm" data-id="${movie._id}">Excluir</button>
                    </td>
                `;
                movieListBody.appendChild(row); // Adiciona a nova linha ao <tbody> da tabela
            });

        } catch (error) {
            console.error('Erro ao carregar filmes para a tabela:', error);
            // Exibe uma mensagem de erro na tabela se algo der errado
            movieListBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Erro ao carregar filmes.</td></tr>`;
            noMoviesMessage.classList.add('d-none'); // Oculta a mensagem de "Nenhum filme"
        }
    }
    // FIM NOVO TRECHO

    // Adicionar um 'event listener' ao formulário para o evento de 'submit' (envio).
    // O 'async' é importante porque vamos fazer operações de banco de dados, que são assíncronas.
    movieForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        hideError(); 
        hideSuccess(); 

        const title = movieTitleInput.value.trim();
        const synopsis = movieSynopsisInput.value.trim();
        const trailerId = movieTrailerIdInput.value.trim();
        const category = movieCategorySelect.value; // O valor do 'select' já é o que precisamos.
        const imageUrl = movieImageUrlInput.value.trim();
        const isFeatured = isFeaturedCheckbox.checked; // Para checkboxes, '.checked' retorna true ou false.
        const carouselImageUrl = document.getElementById('movieCarouselImageUrl').value.trim();
        const fullVideoId = document.getElementById('movieFullVideoId').value.trim();

        // Se um campo obrigatório estiver vazio, exibimos um erro e paramos a execução da função.
        if (title === '') {
            displayError('Por favor, preencha o título do filme.');
            return; 
        }
        if (synopsis === '') {
            displayError('Por favor, preencha a sinopse do filme.');
            return;
        }
        if (trailerId === '') {
            displayError('Por favor, preencha o ID do trailer do YouTube.');
            return;
        }
        if (category === '') { // Para o select, se o valor for vazio, significa que "Selecione uma categoria" está selecionado.
            displayError('Por favor, selecione uma categoria para o filme.');
            return;
        }
        if (imageUrl === '') {
            displayError('Por favor, preencha a URL da imagem de capa.');
            return;
        }

        if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://') && !imageUrl.startsWith('../')) {
            // Se não começar com nenhum desses, exibe um erro.
            displayError('URL inválida. Use uma URL completa (http://...) ou um caminho local (../img/...).');
            return;
        }


        const movieId = `movie_${Date.now()}_${title.toLowerCase().replace(/\s+/g, '-')}`;
        
        const newMovie = {
            _id: movieId, 
            type: 'movie', 
            title: title,
            synopsis: synopsis,
            trailerYoutubeId: trailerId,
            category: category,
            imageUrl: imageUrl,
            isFeatured: isFeatured,
            carouselImageUrl: carouselImageUrl,
            fullVideoId: fullVideoId
        };

        console.log("Objeto do novo filme pronto para salvar:", newMovie);

        try {
            // Verifica se estamos no modo de edição.
            // Pegamos o ID e a revisão do formulário, se existirem.
            const editingMovieId = movieForm.getAttribute('data-editing-id');
            const editingMovieRev = movieForm.getAttribute('data-editing-rev');

            let movieToSave = { ...newMovie }; // Cria uma cópia do newMovie inicial.

            // Se o formulário tiver um ID e uma revisão de edição, significa que estamos atualizando.
            if (editingMovieId && editingMovieRev) {
                movieToSave._id = editingMovieId; // Mantém o _id original do filme que está sendo editado.
                movieToSave._rev = editingMovieRev; // Adiciona o _rev original, CRUCIAL para atualização no PouchDB.
            }

            // Agora, chamamos dbMovies.put() com o objeto que contém _id e _rev (se for edição)
            // ou apenas _id (se for adição de um novo).
            const response = await dbMovies.put(movieToSave);
            
            console.log('Filme salvo/atualizado com sucesso no PouchDB:', response); 

            // Mensagem de sucesso diferente para adição e edição.
            if (editingMovieId) {
                displaySuccess('Filme "' + movieToSave.title + '" atualizado com sucesso!');
            } else {
                displaySuccess('Filme "' + movieToSave.title + '" adicionado com sucesso!');
            }
            
            // Limpa o formulário após o sucesso.
            movieForm.reset(); 
            // Limpa os atributos de edição do formulário, tirando-o do modo de edição.
            movieForm.removeAttribute('data-editing-id');
            movieForm.removeAttribute('data-editing-rev');
            // Retorna o texto original do botão.
            movieForm.querySelector('button[type="submit"]').textContent = 'Adicionar Filme';

            // Recarrega a tabela de filmes para exibir as alterações (ou o novo filme).
            await loadMoviesIntoTable();

        } catch (error) {
            console.error('Erro ao salvar/atualizar filme:', error); 
            // Mensagem de erro mais específica se for conflito de revisão
            if (error.name === 'conflict') {
                displayError('Erro: O filme foi modificado por outra pessoa. Recarregue a página e tente novamente.');
            } else {
                displayError('Erro ao salvar/atualizar filme. Verifique o console para mais detalhes.'); 
            }
        }

    });
    loadMoviesIntoTable(); 

    movieListBody.addEventListener('click', async function(event) {
        // Verifica se o clique foi em um botão com a classe 'btn-danger' (o botão "Excluir")
        if (event.target.classList.contains('btn-danger')) {
            const button = event.target; // Pega o botão que foi clicado
            // Pega o ID do filme que está guardado no atributo 'data-id' do botão.
            const movieId = button.getAttribute('data-id'); 

            // Confirmação antes de excluir: Uma boa prática para evitar exclusões acidentais.
            if (confirm(`Tem certeza que deseja excluir o filme com ID: ${movieId}? Esta ação é irreversível!`)) {
                try {
                    // PouchDB exige o _rev (revisão) do documento para excluí-lo.
                    // Primeiro, precisamos pegar o documento completo do banco de dados para obter seu _rev.
                    const docToDelete = await dbMovies.get(movieId);
                    
                    // Em seguida, excluímos o documento passando seu ID (_id) e _rev (revisão).
                    const response = await dbMovies.remove(docToDelete._id, docToDelete._rev);
                    
                    console.log('Filme excluído com sucesso:', response); // Loga o sucesso no console.
                    displaySuccess('Filme excluído com sucesso!'); // Exibe mensagem verde na página.
                    
                    // Após a exclusão, recarregamos a tabela para que o filme removido não apareça mais.
                    await loadMoviesIntoTable();

                } catch (error) {
                    console.error('Erro ao excluir filme:', error); // Loga o erro completo no console.
                    displayError('Erro ao excluir filme. Verifique o console para mais detalhes.'); // Exibe mensagem vermelha na página.
                }
            }
        }
          // NOVO TRECHO: Detecta o clique no botão "Editar"
          else if (event.target.classList.contains('btn-info')) { // Botão "Editar" tem a classe 'btn-info'
            const button = event.target; // Pega o botão que foi clicado
            const movieId = button.getAttribute('data-id'); // Pega o ID do filme do atributo data-id
            
            try {
                // Limpa qualquer mensagem de erro ou sucesso anterior do formulário.
                hideError();
                hideSuccess();

                // 1. Busca o documento completo do filme no PouchDB usando o ID.
                // O 'await' faz o JavaScript esperar o resultado da busca.
                const movieToEdit = await dbMovies.get(movieId);
                
                // 2. Preenche cada campo do formulário com os dados do filme.
                movieTitleInput.value = movieToEdit.title;
                movieSynopsisInput.value = movieToEdit.synopsis;
                movieTrailerIdInput.value = movieToEdit.trailerYoutubeId; // Consistente com o nome no objeto
                movieCategorySelect.value = movieToEdit.category;
                movieImageUrlInput.value = movieToEdit.imageUrl;
                isFeaturedCheckbox.checked = movieToEdit.isFeatured;
                document.getElementById('movieCarouselImageUrl').value = movieToEdit.carouselImageUrl || '';
                document.getElementById('movieFullVideoId').value = movieToEdit.fullVideoId || '';

                // 3. Armazena o _id e _rev do filme que está sendo editado no próprio formulário.
                // Isso é CRUCIAL para que, ao submeter, saibamos que é uma EDIÇÃO e QUAL documento ATUALIZAR.
                movieForm.setAttribute('data-editing-id', movieToEdit._id);
                movieForm.setAttribute('data-editing-rev', movieToEdit._rev); // PouchDB exige _rev para atualizações.

                // 4. Muda o texto do botão de "Adicionar Filme" para "Salvar Alterações".
                movieForm.querySelector('button[type="submit"]').textContent = 'Salvar Alterações';

                // 5. Exibe uma mensagem de sucesso para o usuário.
                displaySuccess('Modifique os campos e clique em "Salvar Alterações" para atualizar o filme.');

            } catch (error) {
                console.error('Erro ao carregar filme para edição:', error); // Loga o erro no console.
                displayError('Erro ao carregar filme para edição. Tente novamente ou verifique o console.'); // Mensagem na tela.
            }
          }
    });
    // FIM NOVO TRECHO DE EXCLUSÃO
});