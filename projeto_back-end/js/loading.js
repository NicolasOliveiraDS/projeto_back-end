const barra = document.querySelector('.barra-progresso');
const porcentagem = document.querySelector('.porcentagem');

let progresso = 0;

const carregamento = setInterval(function() {
    progresso += 1;

    barra.style.width = progresso + '%';
    porcentagem.textContent = progresso + '%';

    if(progresso >=100){
        clearInterval(carregamento);

        setTimeout(function() {
            window.location.href = 'game.html';
        },500);
    }
}, 40);