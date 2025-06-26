document.addEventListener('DOMContentLoaded', async function() {
    const db = new PouchDB('movies_db');

    // 2. Referências aos elementos HTML onde os filmes serão exibidos
    const featuredMoviesContainer = document.getElementById('featured-movies');
    const allMoviesContainer = document.getElementById('all-movies');

    
    // Em um cenário real, estes dados viriam do seu banco de dados (PouchDB ou um backend).
    const exampleMovies = [
        { _id: 'movie_1', title: 'A Origem', genre: 'Ficção Científica', synopsis: 'Um ladrão que rouba segredos corporativos através do uso de tecnologia de sonho torna-se um fugitivo.', imageUrl: '../images/aOrigem.png', isFeatured: true, trailerYoutubeId: 'R_VX0e0PX90'},
        { _id: 'movie_2', title: 'O Poderoso Chefão', genre: 'Drama', synopsis: 'O patriarca de uma família da máfia transfere o controle de seu império clandestino para seu filho relutante.', imageUrl: '../images/poderosoChefao.png', isFeatured: true, trailerYoutubeId: '0v6MO0EB7UY' },
        { _id: 'movie_3', title: 'Interestelar', genre: 'Ficção Científica', synopsis: 'Uma equipe de exploradores viaja através de um buraco de minhoca no espaço na tentativa de garantir a sobrevivência da humanidade.', imageUrl: '../images/Interestelar.png', isFeatured: false, trailerYoutubeId: 'mbbPSq63yuM'},
        { _id: 'movie_4', title: 'A Chegada', genre: 'Ficção Científica', synopsis: 'Quando naves alienígenas aterrissam ao redor do mundo, uma linguista de elite é recrutada pelos militares para determinar se os alienígenas vêm em paz ou são uma ameaça.', imageUrl: '../images/aChegada.jpeg', isFeatured: false, trailerYoutubeId: 'isWwUJf4KEA'},
        { _id: 'movie_5', title: 'Forrest Gump', genre: 'Drama', synopsis: 'As aventuras de um homem simples, mas de bom coração, que testemunha e inadvertidamente influencia vários eventos históricos.', imageUrl: '../images/forrestGump.jpeg', isFeatured: false, trailerYoutubeId: 'vDY_uZAaU7g' },
        { _id: 'movie_6', title: 'Pulp Fiction', genre: 'Drama', synopsis: 'As vidas de dois assassinos de aluguel, um boxeador, um gângster e sua esposa, e um par de assaltantes de restaurante se entrelaçam em quatro histórias de violência e redenção.', imageUrl: '../images/pulpFiction.webp', isFeatured: false, trailerYoutubeId: 'VX68740t308'}
    ];

    // Função para criar um cartão de filme
    function createMovieCard(movie) {
        const colDiv = document.createElement('div');
        colDiv.className = 'col'; // Classe genérica de coluna para o grid Bootstrap

        // Cria o cartão em si
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card h-100 bg-dark text-white shadow-sm'; // Estilos Bootstrap para o cartão

        // Conteúdo do cartão
        cardDiv.innerHTML = `
            <img src="${movie.imageUrl}" class="card-img-top" alt="${movie.title}">
            <div class="card-body">
                <h5 class="card-title text-danger">${movie.title}</h5>
                <p class="card-text">${movie.synopsis.substring(0, 100)}...</p>
                <p class="card-text"><small class="text-muted">Gênero: ${movie.genre}</small></p>
                </div>
                <a href="#" class="btn btn-danger btn-sm">Ver Detalhes</a>
                <button type="button" class="btn btn-warning btn-sm mt-2" data-bs-toggle="modal" data-bs-target="#trailerModal" data-youtube-id="${movie.trailerYoutubeId}">
                    Ver Trailer
                </button>
        `;
        
        colDiv.appendChild(cardDiv); // Adiciona o cartão à coluna
        return colDiv; // Retorna a coluna completa com o cartão
    }

    // Função para exibir filmes em um contêiner específico
    function displayMovies(movies, container) {
        container.innerHTML = ''; // Limpa o conteúdo de "Carregando..."
        if (movies.length === 0) {
            container.innerHTML = '<div class="col-12"><p class="text-white text-center">Nenhum filme encontrado nesta categoria.</p></div>';
            return;
        }
        movies.forEach(movie => {
            const movieCard = createMovieCard(movie);
            container.appendChild(movieCard);
        });
    }

    // 4. Exibir filmes ao carregar a página
    // Filmes em destaque
    const featured = exampleMovies.filter(movie => movie.isFeatured);
    displayMovies(featured, featuredMoviesContainer);

    // Todos os filmes
    displayMovies(exampleMovies, allMoviesContainer);

    // TODO: Adicionar lógica para buscar do PouchDB e lidar com categorias no futuro

    // --- NOVO TRECHO: Lógica do Modal do Trailer ---

    // 5. Referências aos elementos do modal
    const trailerModal = document.getElementById('trailerModal');
    const youtubePlayer = document.getElementById('youtubePlayer');

    // 6. Adiciona um event listener para quando o modal é mostrado (aberto)
    // O evento 'shown.bs.modal' é disparado pelo Bootstrap quando o modal se torna visível.
    trailerModal.addEventListener('shown.bs.modal', function(event) {
        // Obtém o botão que ativou o modal (o botão "Ver Trailer" clicado)
        const button = event.relatedTarget; 
        // Obtém o ID do YouTube do atributo 'data-youtube-id' do botão
        const youtubeId = button.getAttribute('data-youtube-id'); 

        // Constrói a URL de incorporação do YouTube.
        // `autoplay=1` faz o vídeo iniciar automaticamente.
        // `rel=0` impede a exibição de vídeos relacionados ao final.
        // `modestbranding=1` remove o logotipo do YouTube.
        const embedUrl = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`;
        
        // Define a URL no atributo 'src' do iframe para carregar e iniciar o vídeo
        youtubePlayer.src = embedUrl;
    });

    // 7. Adiciona um event listener para quando o modal é ocultado (fechado)
    // O evento 'hide.bs.modal' é disparado pelo Bootstrap antes do modal ser ocultado.
    trailerModal.addEventListener('hide.bs.modal', function() {
        // Para o vídeo limpando o atributo 'src' do iframe
        youtubePlayer.src = ''; 
    });

    // --- FIM NOVO TRECHO ---

    // TODO: Adicionar lógica para lidar com categorias no futuro (fica para os próximos passos)

});