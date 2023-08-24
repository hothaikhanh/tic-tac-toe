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

    const setVal = (tokenID) => {
        value = tokenID;
    };

    const getVal = () => value;

    return {
        setVal,
        getVal,
    };
}

function player() {
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

function playersController() {
    const player1 = player();
    const player2 = player();

    const getPlayer = (playerName) => {
        return playerName === "player1" ? player1 : player2;
    };

    return { getPlayer };
}

const getPlayer = () => {};

function gameController() {
    // const board = gameBoard();
    // const
    // let activePlayer = ;
    // const switchPlayer = () => {
    //     activePlayer = activePlayer ===  ;
    // };
    // const getActivePlayer = () => activePlayer;
    // return { switchPlayer, getActivePlayer };
}

const gameMode = () => {
    const startMenu = document.querySelector(".start-menu");
    const title = document.querySelector(".title");

    let gameMode = "";
    const set = (mode) => {
        gameMode = mode;
        startMenu.classList.add("hide");
        title.style.transform = "none";
    };

    const get = () => gameMode;
    return { set, get };
};

const startMenu = (function () {
    const _GameMode = gameMode();

    const playerMenu = document.querySelector(".player-menu");
    const pvpOption = document.querySelector("#PVP");
    const pveOption = document.querySelector("#PVE");

    pvpOption.addEventListener("click", () => {
        _GameMode.set("pvp");
        playerMenu.classList.add("active");
    });
    pveOption.addEventListener("click", () => {
        _GameMode.set("pve");
        playerMenu.classList.add("active");
    });
})();

const chosenToken = () => {
    const p1_token_inputs = document.querySelectorAll('[name="p1_token"]');
    const p2_token_inputs = document.querySelectorAll('[name="p2_token"]');

    const getP1Token = () => {
        for (let input of p1_token_inputs) {
            if (input.checked) return input.attributes.tokenID;
        }
    };

    const getP2Token = () => {
        for (let input of p2_token_inputs) {
            if (input.checked) return input.attributes.tokenID;
        }
    };

    return { getP1Token, getP2Token };
};

const multiPlayerMenu = (function () {
    const _players = playersController();
    const _chosenToken = chosenToken();

    const p1 = _players.getPlayer("player1");
    const p2 = _players.getPlayer("player2");

    const p1_name_input = document.querySelector("#p1_name");
    const p2_name_input = document.querySelector("#p2_name");

    const submitBtn = document.querySelector("#multiPlayerSubmit");

    submitBtn.addEventListener("click", () => {
        if (p1_name_input.value == "" || p2_name_input.value == "") {
            //todo
        }

        p1.setName(p1_name_input.value);
        p2.setName(p2_name_input.value);
        p1.setToken(_chosenToken.getP1Token());
        p2.setToken(_chosenToken.getP2Token());

        console.log("...starting the game");

        startGame();
    });
})();

const startGame = function () {
    const playerMenu = document.querySelector(".player-menu");
    const gameBoard = document.querySelector(".game-container");
    playerMenu.classList.add("active");
    gameBoard.classList.add("active");
};

function gameHandler() {
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
