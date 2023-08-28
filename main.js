class Player {
    constructor() {
        this.name = "";
        this.tokenID = "";
    }
    getToken = () => this.tokenID;
    getName = () => this.name;

    setName = (value) => {
        this.name = value;
    };
    setToken = (value) => {
        this.tokenID = value;
    };
}

function Board() {
    const board = [];
    const columns = 3;
    const rows = 3;

    const getColumn = () => columns;
    const getRow = () => rows;

    const setBoard = () => {
        for (let i = 0; i < rows; i++) {
            board.push(Array(0));
            for (let j = 0; j < columns; j++) {
                board[i].push(Cell());
            }
        }
        console.log(board);
    };
    const getBoard = () => board;

    const markCell = (x, y, tokenID) => {
        if (board[x][y].getVal() == "") board[x][y].setVal(tokenID);
    };

    return { getColumn, getRow, getBoard, setBoard, markCell };
}

function Cell() {
    let value = new String();

    const setVal = (newVal) => {
        value = newVal;
    };

    const getVal = () => value;

    return {
        setVal,
        getVal,
    };
}

function GameController() {
    const board = Board();
    const player1 = new Player();
    const player2 = new Player();
    const players = [player1, player2];

    let activePlayer = players[0];
    const switchPlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;

    let gameMode = "";
    const setGameMode = (mode) => {
        gameMode = mode;
    };
    const getGameMode = () => gameMode;
    const getPlayers = () => players;

    const setNewBoard = () => {
        board.setBoard();
    };

    let winCondition = 3;

    const check = (x, y, tokenID) => {
        let _board = board.getBoard();
        let _row = board.getRow();
        let _col = board.getColumn();
        let x_row = 0;
        let y_row = 0;
        let z_row = 0;

        for (let i = 1; i < winCondition; i++) {
            if (x + i < _row && _board[x + i][y].getToken !== tokenID) break;
            x_row++;
        }
        for (let i = 1; i < winCondition; i++) {
            if (x - i >= 0 && _board[x - i][y].getToken !== tokenID) break;
            x_row++;
        }

        for (let i = 1; i < winCondition; i++) {
            if (y + i < _col && _board[x][y + i].getToken !== tokenID) break;
            y_row++;
        }
        for (let i = 1; i < winCondition; i++) {
            if (y - i >= 0 && _board[x][y - i].getToken !== tokenID) break;
            y_row++;
        }

        for (let i = 1; i < winCondition; i++) {
            if (x + i < _row && y + i < _col && _board[x + i][y + i].getToken !== tokenID) break;
            z_row++;
        }
        for (let i = 1; i < winCondition; i++) {
            if (x - i >= 0 && y - i >= 0 && _board[x - i][y - i].getToken !== tokenID) break;
            z_row++;
        }

        console.log(x_row, y_row, z_row);
        if (x_row >= winCondition || y_row >= winCondition || z_row >= winCondition) return true;
        return false;
    };

    const play = (row, column) => {
        board.markCell(row, column, getActivePlayer().getToken());

        if (check(row, column, getActivePlayer().getToken())) {
            console.log("yep");
        }
        switchPlayer();
    };

    return { setNewBoard, getGameMode, setGameMode, getActivePlayer, getPlayers, play, getBoard: board.getBoard };
}

function ScreenController() {
    const title = document.querySelector(".title");
    const startMenu = document.querySelector(".start-menu");
    const playerMenu = document.querySelector(".player-menu");
    const gameBoard = document.querySelector(".game");
    const nameDisplays = document.querySelectorAll(".player_name");
    const titleDisplays = document.querySelectorAll(".player_title");

    const game = GameController();
    const board = Board();

    const transition = () => {
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
            gameBoard.classList.add("active");

            console.log("...starting the game");

            switch (game.getGameMode()) {
                case "pvp":
                    titleDisplays[0].innerText = "PLAYER ONE";
                    titleDisplays[1].innerText = "PLAYER TWO";
                    break;
                case "pve":
                    titleDisplays[0].innerText = "PLAYER";
                    titleDisplays[1].innerText = "BOT";
                    break;
            }

            nameDisplays[0].innerText = game.getPlayers()[0].getName();
            nameDisplays[1].innerText = game.getPlayers()[1].getName();
        };

        const nextRound = () => {
            game.setNewBoard();
        };

        return { toPlayer, toGame, nextRound };
    };

    const getCells = () => {
        // Create an array to store all of the DOM element of cells from the UI
        let cells = new Array(board.getRow());

        for (let x = 0; x < cells.length; ++x) {
            cells[x] = new Array(0);
            for (let y = 0; y < board.getColumn(); ++y) {
                let cell_selector = `.cell[y="${y}"][x="${x}"]`;
                cells[x].push(document.querySelector(cell_selector));
            }
        }

        return cells;
    };

    const startMenuEventHandler = (function () {
        const gameModeOpts = document.querySelectorAll(".start-menu > button");

        for (let btn of gameModeOpts) {
            btn.addEventListener("click", (e) => {
                e.target === gameModeOpts[0] ? game.setGameMode("pve") : game.setGameMode("pvp");
                transition().toPlayer();
            });
        }
    })();

    const multiPlayerMenuEventHandler = (function () {
        const submitBtn = document.querySelector("#multiPlayerSubmit");

        submitBtn.addEventListener("click", () => {
            for (let i = 0; i < game.getPlayers().length; i++) {
                let nameValue = document.querySelectorAll(".name_input")[i].value;
                let tokenValue = document.querySelector('input[playerID="' + i + '"]:checked').attributes.tokenID;

                game.getPlayers()[i].setName(nameValue);
                game.getPlayers()[i].setToken(tokenValue);

                console.log(game.getPlayers()[i].getName());
                console.log(game.getPlayers()[i].getToken());
            }
            transition().toGame();
            transition().nextRound();
        });
    })();

    const gameEventHandler = (function () {
        // add event for each cell on the board
        for (let x = 0; x < board.getRow(); x++) {
            for (let y = 0; y < board.getColumn(); y++) {
                getCells()[x][y].addEventListener("click", () => {
                    game.play(x, y);
                    updateCell(x, y);
                });
            }
        }
    })();

    const updateCell = (x, y) => {
        getCells()[x][y].innerText = game.getBoard()[x][y].getVal().nodeValue;
    };
}

ScreenController();
