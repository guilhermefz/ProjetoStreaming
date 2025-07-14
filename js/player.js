document.addEventListener('DOMContentLoaded', async function() {
    console.log('Página do player carregada.');
    
    // 1. Conecta ao banco de dados de filmes
    const dbMovies = new PouchDB('movies_db');

    // 2. Lê o ID do filme da URL da página
    const params = new URLSearchParams(window.location.search);
    const movieId = params.get('movieId'); // Ex: Pega o valor de "?movieId=..."

    // 3. Pega as referências dos elementos HTML que vamos manipular
    const videoWrapper = document.getElementById('video-player-wrapper');
    const movieTitleElement = document.getElementById('movie-title-player');

    // 4. Se nenhum ID de filme foi passado na URL, mostra um erro
    if (!movieId) {
        movieTitleElement.textContent = 'Filme não encontrado';
        videoWrapper.innerHTML = '<p class="text-center text-danger h3">Erro: Filme não especificado.</p>';
        return; // Para a execução do script
    }

    // 5. Busca o filme no banco de dados e monta o player
    try {
        const movie = await dbMovies.get(movieId);

        // Atualiza o título da página e do cabeçalho
        document.title = `Assistindo: ${movie.title}`;
        movieTitleElement.textContent = movie.title;

        // Se o filme tiver um ID de vídeo, cria o player
        if (movie.fullVideoId) {
            const iframe = document.createElement('iframe');
            iframe.className = 'video-iframe'; // Classe do nosso CSS para tela cheia
            iframe.src = `https://www.youtube.com/embed/${movie.fullVideoId}?autoplay=1&rel=0&controls=1`;
            iframe.setAttribute('title', movie.title);
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
            iframe.setAttribute('allowfullscreen', true);

            // Adiciona o iframe do player na página
            videoWrapper.appendChild(iframe);
        } else {
            // Caso o filme não tenha um vídeo associado
            videoWrapper.innerHTML = `<p class="text-center text-warning h3">Vídeo indisponível para ${movie.title}.</p>`;
        }

    } catch (error) {
        // Se o filme com o ID especificado não for encontrado no banco de dados
        console.error('Erro ao buscar o filme:', error);
        document.title = 'Erro - Filme não encontrado';
        movieTitleElement.textContent = 'Filme não encontrado';
        videoWrapper.innerHTML = '<p class="text-center text-danger h3">O filme solicitado não existe.</p>';
    }
});