const startMenu = (function () {
    let gameMode = "";
    const startMenu = document.querySelector(".start-menu");
    const title = document.querySelector(".title");
    const pvp = document.querySelector("#PVP");
    const pve = document.querySelector("#PVE");

    const setGamemMode = (mode) => {
        gameMode = mode;
        startMenu.classList.add("hide");
        title.style.transform = "none";
    };

    pvp.addEventListener("click", () => {
        setGamemMode("pvp");
        multiPlayerMenu();
    });
    pve.addEventListener("click", () => {
        setGamemMode("pve");
        singlePlayerMenu();
    });
})();

const singlePlayerMenu = () => {};
const multiPlayerMenu = () => {};

const gameBoard = function () {
    const board = [];
    const columns = 3;
    const rows = 3;

    const setBoard = () => {
        for (let i = 0; i < rows; i++) {
            board.push(Array.from(Array(columns).fill(cell())));
        }
    };

    const getBoard = () => {
        return board;
    };

    return { setBoard, getBoard };
};

function cell() {
    let value = 0;

    const addToken = (tokenID) => {
        value = tokenID;
    };

    const getVal = () => value;

    return {
        addToken,
        getVal,
    };
}

function players() {
    const player = { name: "", tokenID: 0 };

    const getToken = () => player.tokenID;
    const getName = () => player.name;

    const setName = (name) => {
        player.name = name;
    };
    const setToken = (tokenID) => {
        player.tokenID = tokenID;
    };

    return { getToken, getName, setName, setToken };
}

function gameController() {
    const board = gameBoard();
    const p1 = players();
    const p2 = players();

    let activePlayer = p1;

    const switchPlayer = () => {
        activePlayer = activePlayer === p1 ? p2 : p1;
    };
    const getActivePlayer = () => activePlayer;

    return { switchPlayer, getActivePlayer };
}

function eventHandler() {
    const board = gameBoard();
    const game = gameController();
    const cells = document.querySelectorAll(".cell");

    //add event for each cell on the board
    const cellEventHandler = () => {
        for (let x = 0, i = 0; x < board.rows; x++) {
            for (let y = 0; y < board.columns; y++) {
                cells[i].addEventListener("click", () => {
                    board[x][y].setToken(game.getActivePlayer().getToken());
                });
                i += 1;
            }
        }
    };
}
