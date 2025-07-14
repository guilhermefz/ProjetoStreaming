document.addEventListener('DOMContentLoaded', async function() {
    // 1. Inicializar PouchDB para filmes
    const dbMovies = new PouchDB('movies_db');
    console.log('PouchDB "movies_db" inicializado para a página inicial.');

    // 2. Referências aos elementos HTML
    const carouselIndicators = document.getElementById('carousel-indicators');
    const carouselInner = document.getElementById('carousel-inner');
    const allMoviesContainer = document.getElementById('all-movies');

    // 3. Dados de filmes de exemplo (com IDs de trailer corrigidos)
    const initialMoviesData = [
        { _id: 'movie_a_origem', type: 'movie', title: 'A Origem', genre: 'Ficção Científica', synopsis: 'Um ladrão que rouba segredos corporativos...', imageUrl: '../img/aOrigem.png', isFeatured: false, trailerYoutubeId: 'R_VX0e0PX90', carouselImageUrl: '',fullVideoId: 'R_VX0e0PX90',category: 'ficcao-cientifica' },
        { _id: 'movie_o_poderoso_chefao', type: 'movie', title: 'O Poderoso Chefão', genre: 'Drama', synopsis: 'O patriarca de uma família da máfia...', imageUrl: '../img/poderosoChefao.png', isFeatured: false, trailerYoutubeId: '0v6MO0EB7UY', carouselImageUrl: '',fullVideoId: '0v6MO0EB7UY',category: 'drama' },
        { _id: 'movie_interestelar', type: 'movie', title: 'Interestelar', genre: 'Ficção Científica', synopsis: 'Uma equipe de exploradores viaja...', imageUrl: '../img/Interestelar.png', isFeatured: false, trailerYoutubeId: 'mbbPSq63yuM', carouselImageUrl: '',fullVideoId: 'mbbPSq6g3yuM',category: 'ficcao-cientifica' },
        { _id: 'movie_a_chegada', type: 'movie', title: 'A Chegada', genre: 'Ficção Científica', synopsis: 'Quando naves alienígenas aterrissam...', imageUrl: '../img/aChegada.jpeg', isFeatured: false, trailerYoutubeId: 'isWwUJf4KEA', carouselImageUrl: '',fullVideoId: 'isWwUJf4KEA',category: 'ficcao-cientifica' },
        { _id: 'movie_forrest_gump', type: 'movie', title: 'Forrest Gump', genre: 'Drama', synopsis: 'As aventuras de um homem simples...', imageUrl: '../img/forrestGump.jpeg', isFeatured: false, trailerYoutubeId: 'vDY_uZAaU7g', carouselImageUrl: '',fullVideoId: 'vDY_uZAaU7g',category: 'drama' },
        { _id: 'movie_pulp_fiction', type: 'movie', title: 'Pulp Fiction', genre: 'Drama', synopsis: 'As vidas de dois assassinos de aluguel...', imageUrl: '../img/pulpFiction.webp', isFeatured: true, trailerYoutubeId: 'VX68740t308', carouselImageUrl: '../img/capaPulp.png',fullVideoId: 'VX68740t308',category: 'terror' },
        { _id: 'movie_cinco_passos', type: 'movie', title: 'A Cinco Passos de Você', genre: 'Drama', synopsis: 'esperança, romance e a luta contra as dificuldades da vida.', imageUrl: '../img/CincoPassosCapa.jpg', isFeatured: true, trailerYoutubeId: 'OL-Xy-LzP_4', carouselImageUrl: '../img/capaCincoPassos.png',fullVideoId: 'RyqwBSI67YI',category: 'drama' },
        { _id: 'movie_coraline', type: 'movie', title: 'Coraline e o Mundo Secreto', genre: 'animacao', synopsis: 'Um mundo secreto se abre e realiza todos os seus desejos, mas com um preço. Caroline Jones (Dakota Fanning) precisa se adaptar à sua nova realidade e nova casa em Oregon.', imageUrl: '../img/CoralineCapa.webp', isFeatured: true, trailerYoutubeId: 'X3Pc9emMSxk', carouselImageUrl: '../img/capaCoraline.png',fullVideoId: 'SGKL6sbntno',category: 'animacao' },
        { _id: 'movie_ghostbusters', type: 'movie', title: 'GhostBusters', genre: 'terror', synopsis: 'Nesta sequência da franquia Ghostbusters, a família Spengler retorna para onde tudo começou: a famosa estação de bombeiros em Nova York.', imageUrl: '../img/Pôster-Ghostbusters.jpg', isFeatured: true, trailerYoutubeId: 'w3ugHP-yZXw', carouselImageUrl:'../img/ghostlogo.jpeg', fullVideoId: 'w3ugHP-yZXw',category: 'terror' },
        { _id: 'movie_amelie', type: 'movie', title: 'O fabuloso destino de Amélie Poulain', genre: 'comedia', synopsis: 'Amélie engaja-se na realização de pequenos gestos a fim de ajudar e tornar mais felizes as pessoas ao seu redor. Ela ganha aí um novo sentido para a sua existência.', imageUrl: '../img/Amélie_Poulain.jpg', isFeatured: false, trailerYoutubeId: 'x66lQBVLT0Q', carouselImageUrl: '',fullVideoId: 'de9ypiDr9dg&list=PLRzDFu1O6cUyQuPPXCHtHAePn6BRc6RGV',category: 'comedia' }
    ];  
    // Função para adicionar os filmes de exemplo ao DB, se ele estiver vazio
    async function addInitialMovies(movies) {
        for (const movie of movies) {
            try {
                await dbMovies.get(movie._id);
            } catch (err) {
                if (err.name === 'not_found') {
                    await dbMovies.put(movie);
                    console.log(`Filme de exemplo '${movie.title}' adicionado ao 'movies_db'.`);
                }
            }
        }
    }

    // 4. Função para criar o HTML de um cartão de filme
    function createMovieCard(movie) {
        const colDiv = document.createElement('div');
        colDiv.className = 'col';
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card h-100 bg-dark text-white shadow-sm';
        cardDiv.innerHTML = `
            <img src="${movie.imageUrl}" class="card-img-top" alt="${movie.title}">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title text-danger">${movie.title}</h5>
                <p class="card-text flex-grow-1">${movie.synopsis.substring(0, 100)}...</p>
                <p class="card-text"><small class="text-muted">Gênero: ${movie.genre}</small></p>
                <div class="mt-auto">
                    <a href="player.html?movieId=${movie._id}" class="btn btn-danger btn-sm">Assistir Agora</a>
                    <button type="button" class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#trailerModal" data-youtube-id="${movie.trailerYoutubeId}">
                        Ver Trailer
                    </button>
                </div>
            </div>
        `;
        colDiv.appendChild(cardDiv);
        return colDiv;
    }

    // NOVA FUNÇÃO: Constrói os itens do carrossel
    function buildCarousel(featuredMovies) {
        // Limpa qualquer conteúdo anterior para evitar duplicatas
        carouselIndicators.innerHTML = '';
        carouselInner.innerHTML = '';
    
        // Itera sobre cada filme da lista de destaques
        featuredMovies.forEach((movie, index) => {
            
            // --- Cria o Indicador (o pontinho) ---
            const indicator = document.createElement('button');
            indicator.type = 'button';
            indicator.setAttribute('data-bs-target', '#featuredCarousel');
            indicator.setAttribute('data-bs-slide-to', index);
            
            // --- Cria o Slide (a imagem e legenda) ---
            const slide = document.createElement('div');
            slide.classList.add('carousel-item');
            
            // O primeiro item do carrossel PRECISA ter a classe 'active' para ser visível
            if (index === 0) {
                indicator.classList.add('active');
                slide.classList.add('active');
            }
    
            // --- Lógica para escolher a imagem correta ---
            // Se movie.carouselImageUrl existir e não for uma string vazia, usa ela.
            // Senão, usa a movie.imageUrl padrão como alternativa (fallback).
            const imageSrc = movie.carouselImageUrl || movie.imageUrl;
    
            // Define o conteúdo HTML do slide, agora usando a variável imageSrc
            slide.innerHTML = `
                <img src="${imageSrc}" class="d-block w-100" alt="${movie.title}" style="max-height: 400px; object-fit: cover;">
                <div class="carousel-caption d-none d-md-block">
                    <h5>${movie.title}</h5>
                    <p>${movie.synopsis.substring(0, 100)}...</p>
                </div>
            `;
            
            // Adiciona o indicador e o slide recém-criados ao HTML da página
            carouselIndicators.appendChild(indicator);
            carouselInner.appendChild(slide);
        });
    }
    
    // 5. Função para buscar os filmes do PouchDB e exibi-los na página
    async function displayMovies(category = 'all') {
        // Limpa apenas a área da grade principal de filmes
        allMoviesContainer.innerHTML = '<div class="col-12"><p class="text-white text-center">Carregando filmes...</p></div>';

        try {
            const allDocs = await dbMovies.allDocs({ include_docs: true });
            const allMovies = allDocs.rows
                .map(row => row.doc)
                .filter(doc => doc.type === 'movie' && !doc._deleted);

            // --- Lógica do Carrossel ---
            // O carrossel só é atualizado se estivermos na visão principal
            if (category === 'all') {
                const featured = allMovies.filter(movie => movie.isFeatured);
                if (featured.length > 0) {
                    buildCarousel(featured);
                } else {
                    // Se não houver destaques, mostra uma mensagem dentro do carrossel
                    carouselInner.innerHTML = '<div class="carousel-item active"><div class="text-center p-5">Nenhum filme em destaque.</div></div>';
                }
            }

            // --- Lógica da Grade "Todos os Filmes" ---
            let moviesToDisplay = allMovies;
            // Se uma categoria foi selecionada, filtra a lista para a grade
            if (category !== 'all') {
                moviesToDisplay = allMovies.filter(movie => movie.category === category);
            }

            allMoviesContainer.innerHTML = ''; // Limpa a área da grade

            if (moviesToDisplay.length === 0) {
                allMoviesContainer.innerHTML = '<div class="col-12"><p class="text-white text-center">Nenhum filme encontrado.</p></div>';
            } else {
                moviesToDisplay.forEach(movie => {
                    const movieCard = createMovieCard(movie);
                    allMoviesContainer.appendChild(movieCard);
                });
            }

        } catch (error) {
            console.error('Erro ao carregar filmes:', error);
            allMoviesContainer.innerHTML = '<div class="col-12"><p class="text-white text-center text-danger">Erro ao carregar filmes.</p></div>';
        }
    }
    // 6. Lógica do Modal do Trailer
    const trailerModal = document.getElementById('trailerModal');
    const youtubePlayer = document.getElementById('youtubePlayer');

    if (trailerModal) {
        trailerModal.addEventListener('shown.bs.modal', function(event) {
            const button = event.relatedTarget;
            const youtubeId = button.getAttribute('data-youtube-id');
            // **ESTA É A CORREÇÃO PRINCIPAL**
            const embedUrl = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`;
            youtubePlayer.src = embedUrl;
        });

        trailerModal.addEventListener('hide.bs.modal', function() {
            youtubePlayer.src = '';
        });
    }


    const categoryMenu = document.getElementById('category-menu');

    if (categoryMenu) {
        categoryMenu.addEventListener('click', function(event) {
            // Impede o comportamento padrão do link (que é recarregar a página ou ir para '#')
            event.preventDefault();

            // Verifica se o elemento clicado é de fato um link de categoria
            if (event.target.classList.contains('dropdown-item')) {
                // Pega o valor do atributo 'data-category' do link clicado
                const selectedCategory = event.target.getAttribute('data-category');

                // Chama nossa função de exibição, passando a categoria selecionada.
                displayMovies(selectedCategory);
            }
        });
    }

    // 7. Execução Inicial
    await addInitialMovies(initialMoviesData);
    await displayMovies();
});