const botaoJogar = document.querySelector("#btn-jogar");
const lobby = document.querySelector(".lobby");

botaoJogar.addEventListener("click", function () {
  lobby.innerHTML = `
    <p>PARTIDA ENCONTRADA</p>

    <h2>Entrando na arena...</h2>

    <p>
      Prepare-se. A batalha vai começar.
    </p>
  `;
});