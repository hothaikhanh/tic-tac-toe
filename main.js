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
        board.length = 0;
        for (let i = 0; i < rows; i++) {
            board.push(Array(0));
            for (let j = 0; j < columns; j++) {
                board[i].push(Cell());
            }
        }
    };
    const getBoard = () => board;

    const markCell = (x, y, tokenID) => {
        board[x][y].setVal(tokenID);
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

    const rows = board.getRow();
    const cols = board.getColumn();
    const _board = board.getBoard();

    //player controller
    let activePlayer = players[0];
    const switchPlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;

    //results controller
    const results = [];
    const getResults = () => results;

    //game mode controller
    let gameMode = "";
    const setGameMode = (mode) => {
        gameMode = mode;
    };
    const getGameMode = () => gameMode;

    const getPlayers = () => players;
    const setNewBoard = () => board.setBoard();

    const checkWin = (x, y, tokenID) => {
        const winCondition = 3;
        let hori_result = [];
        let vert_result = [];
        let diag_1_result = [];
        let diag_2_result = [];

        // console.log(`Cheking the area around cell [${x},${y}]`);

        for (let i = 1; i < winCondition; i++) {
            let vert = [x - i >= 0, x + i < rows];
            let hori = [y - i >= 0, y + i < cols];
            let diag_1 = [hori[0] && vert[0], hori[1] && vert[1]];
            let diag_2 = [hori[1] && vert[0], hori[0] && vert[1]];

            // console.log(`Loop ${i}:
            // | ${diag_1[0]} | ${vert[0]} | ${diag_2[0]} |
            // | ${hori[0]} |      | ${hori[1]} |
            // | ${diag_2[1]} | ${vert[1]} | ${diag_1[1]} |`);

            // console.log("check vertical");
            if (vert[1] && _board[x + i][y].getVal() == tokenID) vert_result.push(_board[x + i][y]);
            if (vert[0] && _board[x - i][y].getVal() == tokenID) vert_result.unshift(_board[x - i][y]);

            // console.log("check horizontal");
            if (hori[1] && _board[x][y + i].getVal() == tokenID) hori_result.push(_board[x][y + i]);
            if (hori[0] && _board[x][y - i].getVal() == tokenID) hori_result.unshift(_board[x][y - i]);

            // console.log("check diagonal_1");
            if (diag_1[0] && _board[x - i][y - i].getVal() == tokenID) diag_1_result.unshift(_board[x - i][y - i]);
            if (diag_1[1] && _board[x + i][y + i].getVal() == tokenID) diag_1_result.push(_board[x + i][y + i]);

            // console.log("check diagonal_2");
            if (diag_2[0] && _board[x - i][y + i].getVal() == tokenID) diag_2_result.unshift(_board[x - i][y + i]);
            if (diag_2[1] && _board[x + i][y - i].getVal() == tokenID) diag_2_result.push(_board[x + i][y - i]);
        }

        console.log(`Player ${getActivePlayer().getName()} results:
            Horizontal: ${hori_result.length}
            Vertical: ${vert_result.length}
            Diagonal_1: ${diag_1_result.length}
            Diagonal_2: ${diag_2_result.length}`);

        if (
            hori_result.length >= winCondition - 1 ||
            vert_result.length >= winCondition - 1 ||
            diag_1_result.length >= winCondition - 1 ||
            diag_2_result.length >= winCondition - 1
        )
            return true;
        return false;
    };

    const checkDraw = () => {
        for (let j = 0; j < rows; j++) {
            for (let k = 0; k < cols; k++) {
                if (board.getBoard()[j][k].getVal() == "") return false;
            }
        }
        return true;
    };

    const recordResult = () => {
        results.push(getActivePlayer().getToken());
    };

    // const setNewRound = () => {
    //     setNewBoard();
    // };

    const forfeitRound = (playerID) => {
        activePlayer = players[playerID] == players[0] ? players[1] : players[0];
    };

    const play = (x, y) => {
        if (board.getBoard()[x][y].getVal() != "") return;
        board.markCell(x, y, getActivePlayer().getToken());
    };

    return {
        setNewBoard,
        getGameMode,
        setGameMode,
        getResults,
        getActivePlayer,
        switchPlayer,
        getPlayers,
        forfeitRound,
        play,
        checkWin,
        checkDraw,
        recordResult,
        // setNewRound,
        getBoard: board.getBoard,
    };
}

function ScreenController() {
    const title = document.querySelector(".title");
    const startMenu = document.querySelector(".start-menu");
    const playerMenu = document.querySelector(".player-menu");
    const gameBoard = document.querySelector(".game");
    const nameDisplays = document.querySelectorAll(".player_name");
    const titleDisplays = document.querySelectorAll(".player_title");
    const scoreBoard = document.querySelectorAll(".score_display");

    const game = GameController();
    const rows = Board().getRow();
    const cols = Board().getColumn();

    const showPlayerMenu = () => {
        title.classList.add("center");
        startMenu.classList.add("inactive");
        playerMenu.classList.add("active");
    };
    const showGame = () => {
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

    const showWinner = () => {
        console.log(game.getActivePlayer().getName() + " is the winner");
    };
    const showDraw = () => {
        //todo
    };
    const clearBoard = () => {
        for (let x = 0; x < rows; ++x) {
            for (let y = 0; y < cols; ++y) {
                getCells()[x][y].innerText = "";
            }
        }
    };
    const getCells = () => {
        // Create an array to store all of the DOM element of cells from the UI
        let cells = new Array(rows);

        for (let x = 0; x < cells.length; ++x) {
            cells[x] = new Array(0);
            for (let y = 0; y < cols; ++y) {
                let cell_selector = `.cell[y="${y}"][x="${x}"]`;
                cells[x].push(document.querySelector(cell_selector));
            }
        }

        return cells;
    };
    const showBoard = () => {
        for (let x = 0; x < rows; ++x) {
            for (let y = 0; y < cols; ++y) {
                console.log(game.getBoard()[x][y].getVal().nodeValue);
            }
        }
    };
    const updateCell = (x, y) => {
        getCells()[x][y].innerText = game.getBoard()[x][y].getVal().nodeValue;
    };

    const updateScore = () => {
        currentRounds = game.getResults();
        for (let i = 0; i < currentRounds.length; i++) {
            scoreBoard[i].innerText = currentRounds[i];
        }
    };

    const startMenuEventHandler = (function () {
        const gameModeOpts = document.querySelectorAll(".start-menu > button");

        for (let btn of gameModeOpts) {
            btn.addEventListener("click", (e) => {
                e.target === gameModeOpts[0] ? game.setGameMode("pve") : game.setGameMode("pvp");
                showPlayerMenu();
            });
        }
    })();

    const multiPlayerMenuEventHandler = (function () {
        const submitBtn = document.querySelector("#multiPlayerSubmit");
        const submitCondition = [true, true];
        submitBtn.addEventListener("click", () => {
            for (let i = 0; i < game.getPlayers().length; i++) {
                let nameValue = document.querySelectorAll(".name_input")[i].value;
                let tokenValue = "";
                let selectedToken = document.querySelector('input[playerID="' + i + '"]:checked');
                if (selectedToken !== null) {
                    tokenValue = selectedToken.attributes.tokenID;
                }
                let nameAlert = "Plese enter your name";
                let tokenAlert = "Plese pick your player icon";

                let alertContainer = document.querySelectorAll(".player-menu .alert")[i];

                if (nameValue == "") {
                    alertContainer.children[0].innerText = nameAlert;
                } else {
                    alertContainer.children[0].innerText = "";
                    game.getPlayers()[i].setName(nameValue);
                }

                if (tokenValue == "") {
                    alertContainer.children[1].innerText = tokenAlert;
                } else {
                    alertContainer.children[1].innerText = "";
                    game.getPlayers()[i].setToken(tokenValue);
                }

                submitCondition[i] = nameValue !== "" && tokenValue !== "";

                // console.log(game.getPlayers()[i].getName());
                // console.log(game.getPlayers()[i].getToken());
            }

            // console.log(submitCondition.toString());
            if (submitCondition.toString() == "true,true") {
                showGame();
                game.setNewBoard();
            }
        });
    })();

    const gameEventHandler = (function () {
        // add event for each cell on the board
        for (let x = 0; x < rows; x++) {
            for (let y = 0; y < cols; y++) {
                getCells()[x][y].addEventListener("click", () => {
                    //make the move
                    game.play(x, y);
                    //update the coresponding cell to reflect the player's move
                    updateCell(x, y);
                    //check if the move that has just been made have won the game
                    if (game.checkWin(x, y, game.getActivePlayer().getToken())) {
                        //anounce the winner
                        showWinner();
                        //record the result of the round
                        game.recordResult();
                        updateScore();
                        //clear board
                        clearBoard();
                        game.setNewBoard();
                    }

                    // if not then check if the game can still continue
                    if (game.checkDraw()) {
                        console.log("it is draw");
                    }

                    game.switchPlayer();
                });
            }
        }

        const ffBtns = document.querySelectorAll(".ff");
        for (let playerID = 0; playerID < ffBtns.length; playerID++) {
            ffBtns[playerID].addEventListener("click", () => {
                game.forfeitRound(playerID);
            });
        }
    })();
}

ScreenController();
