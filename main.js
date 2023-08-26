function board() {
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
}

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

function players() {
    const players = Array.from(Array(2)).fill(player());

    const getPlayer = () => {
        return players;
    };

    const setPlayer = (index, attribute, value) => {
        if (attribute == "token") {
            players[index].setToken(value);
            return;
        }
        if (attribute == "name") {
            players[index].setName(value);
            return;
        }
    };

    return { getPlayer, setPlayer };
}

function gameController() {
    // const _board = board();
    // const
    // let activePlayer = ;
    // const switchPlayer = () => {
    //     activePlayer = activePlayer ===  ;
    // };
    // const getActivePlayer = () => activePlayer;
    // return { switchPlayer, getActivePlayer };
}

function gameMode() {
    let gameMode = "";
    const set = (mode) => {
        gameMode = mode;
    };

    const get = () => gameMode;
    return { set, get };
}

function transition() {
    const _players = players();
    const title = document.querySelector(".title");
    const startMenu = document.querySelector(".start-menu");
    const playerMenu = document.querySelector(".player-menu");
    const game = document.querySelector(".game");

    const nameDisplays = document.querySelectorAll(".player_name");
    const titleDisplays = document.querySelectorAll(".player_title");

    const toPlayer = () => {
        title.classList.add("center");
        startMenu.classList.add("inactive");
        playerMenu.classList.add("active");
    };
    const toGame = () => {
        playerMenu.classList.add("inactive");
        setTimeout(() => {
            playerMenu.classList.remove("active");
        }, 500);
        game.classList.add("active");

        console.log(_players.getPlayer()[0].getToken());

        console.log("...starting the game");
    };

    return { toPlayer, toGame };
}

const startMenuEventHandler = (function () {
    const _gameMode = gameMode();
    const _transit = transition();

    const gameModeOpts = document.querySelectorAll(".start-menu > button");

    for (let btn of gameModeOpts) {
        btn.addEventListener("click", (e) => {
            e.target === gameModeOpts[0] ? _gameMode.set("pve") : _gameMode.set("pvp");
            _transit.toPlayer();
        });
    }
})();

const multiPlayerMenuEventHandler = (function () {
    const _players = players();
    const _transit = transition();

    const submitBtn = document.querySelector("#multiPlayerSubmit");

    submitBtn.addEventListener("click", () => {
        for (let i = 0; i < _players.getPlayer().length; i++) {
            let nameValue = document.querySelectorAll(".name_input")[i].value;
            let tokenValue = document.querySelector('input[playerID="' + i + '"]:checked').attributes.tokenID;

            _players.setPlayer(i, "name", nameValue);
            _players.setPlayer(i, "token", tokenValue);
            console.log(_players.getPlayer()[i].getToken());
        }
        _transit.toGame();
    });
})();

const gameEventHandler = (function () {
    const _board = board();
    const _gameController = gameController();
    const cells = document.querySelectorAll(".cell");

    //add event for each cell on the board

    for (let x = 0, i = 0; x < board.rows; x++) {
        for (let y = 0; y < board.columns; y++) {
            cells[i].addEventListener("click", () => {
                board[x][y].setToken(_gameController.getActivePlayer().getToken());
            });
            i += 1;
        }
    }
})();
