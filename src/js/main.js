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

    //player controller
    let activePlayer = players[0];
    const getPlayers = () => players;
    const switchPlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;

    //score controller
    const score = [];
    const recordScore = () => {
        if (checkWin()) score.push(getActivePlayer().getToken());
        if (checkDraw()) score.push("");
    };
    const getScore = () => score;
    const getGameWinner = () => {
        let p1_score = 0,
            p2_score = 0;
        for (let s of score) {
            if (s == player1.getToken()) p1_score++;
            if (s == player2.getToken()) p2_score++;
        }
        switch (true) {
            case p1_score > p2_score:
                return player1.getName();
            case p1_score < p2_score:
                return player2.getName();
            case p1_score == p2_score:
                return false;
        }
    };

    //game mode controller
    let gameMode = "";
    const setGameMode = (mode) => {
        gameMode = mode;
    };
    const getGameMode = () => gameMode;

    //game logics
    let latestMove = [];
    let cellChain = [];
    const getCellChain = () => cellChain;

    const setNewBoard = () => {
        latestMove = [];
        cellChain = [];
        board.setBoard();
    };

    const play = (x, y) => {
        board.markCell(x, y, getActivePlayer().getToken());
        latestMove = [x, y, getActivePlayer().getToken()];
    };
    const checkLegal = (x, y) => {
        if (board.getBoard()[x][y].getVal() != "") return false;
        return true;
    };
    const checkWin = () => {
        const _board = board.getBoard();
        const winCondition = 3;
        let x = latestMove[0];
        let y = latestMove[1];
        let tokenID = latestMove[2];
        let hori_chain = [[x, y]];
        let vert_chain = [[x, y]];
        let diag_1_chain = [[x, y]];
        let diag_2_chain = [[x, y]];

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
            if (vert[1] && _board[x + i][y].getVal() == tokenID) vert_chain.push([x + i, y]);
            if (vert[0] && _board[x - i][y].getVal() == tokenID) vert_chain.unshift([x - i, y]);

            // console.log("check horizontal");
            if (hori[1] && _board[x][y + i].getVal() == tokenID) hori_chain.push([x, y + i]);
            if (hori[0] && _board[x][y - i].getVal() == tokenID) hori_chain.unshift([x, y - i]);

            // console.log("check diagonal_1");
            if (diag_1[0] && _board[x - i][y - i].getVal() == tokenID) diag_1_chain.unshift([x - i, y - i]);
            if (diag_1[1] && _board[x + i][y + i].getVal() == tokenID) diag_1_chain.push([x + i, y + i]);

            // console.log("check diagonal_2");
            if (diag_2[0] && _board[x - i][y + i].getVal() == tokenID) diag_2_chain.unshift([x - i, y + i]);
            if (diag_2[1] && _board[x + i][y - i].getVal() == tokenID) diag_2_chain.push([x + i, y - i]);
        }

        // console.log(`Player ${getActivePlayer().getName()} results:
        //     Horizontal: ${hori_chain.length}
        //     Vertical: ${vert_chain.length}
        //     Diagonal_1: ${diag_1_chain.length}
        //     Diagonal_2: ${diag_2_chain.length}`);

        if (hori_chain.length >= winCondition) {
            cellChain = hori_chain;
            return true;
        } else if (vert_chain.length >= winCondition) {
            cellChain = vert_chain;
            return true;
        } else if (diag_1_chain.length >= winCondition) {
            cellChain = diag_1_chain;
            return true;
        } else if (diag_2_chain.length >= winCondition) {
            cellChain = diag_2_chain;
            return true;
        }
        return false;
    };
    const checkDraw = () => {
        for (let j = 0; j < rows; j++) {
            for (let k = 0; k < cols; k++) {
                if (board.getBoard()[j][k].getVal() == "") return false;
            }
        }
        return cellChain.length == 0;
    };
    const checkEnd = () => {
        return getScore().length >= 5 ? true : false;
    };

    const forfeitRound = (playerID) => {
        activePlayer = players[playerID] == players[0] ? players[1] : players[0];
        score.push(getActivePlayer().getToken());
        console.log(getActivePlayer().getName());
    };

    const resetAll = () => {
        score.length = 0;
        activePlayer = players[0];
        setNewBoard();
    };

    return {
        setNewBoard,
        getGameMode,
        setGameMode,
        getScore,
        getCellChain,
        getActivePlayer,
        switchPlayer,
        getPlayers,
        forfeitRound,
        play,
        checkLegal,
        checkWin,
        checkDraw,
        checkEnd,
        getGameWinner,
        recordScore,
        resetAll,

        getBoard: board.getBoard,
    };
}

function ScreenController() {
    const endRoundDuration = 2000;

    const title = document.querySelector(".title");
    const startMenu = document.querySelector(".start-menu");
    const playerMenu = document.querySelector(".player-menu");
    const gameBoard = document.querySelector(".game");
    const nameDisplays = document.querySelectorAll(".player_name");
    const tokenDisplays = document.querySelectorAll(".player_token");
    const titleDisplays = document.querySelectorAll(".player_title");
    const scoreBoard = document.querySelectorAll(".score_display");
    const indicators = document.querySelectorAll(".turn-indicator");
    const screenBlocker = document.querySelector(".block-overlay");
    const endResult = document.querySelector(".result_container");
    const winResult = document.querySelector(".result--win");
    const tieResult = document.querySelector(".result--tie");
    const winnerNameDisplay = document.querySelector(".winner_name");

    const game = GameController();
    const rows = Board().getRow();
    const cols = Board().getColumn();

    const showTitle = () => {
        title.classList.remove("center");
        gameBoard.classList.add("inactive");
        setTimeout(() => {
            gameBoard.classList.remove("active");
        }, 500);
        startMenu.classList.remove("inactive");
        playerMenu.classList.remove("inactive");
    };
    const showPlayerMenu = () => {
        title.classList.add("center");
        startMenu.classList.add("inactive");
        playerMenu.classList.add("active");
    };
    const showGame = () => {
        //display game area
        playerMenu.classList.add("inactive");
        setTimeout(() => {
            playerMenu.classList.remove("active");
        }, 500);

        gameBoard.classList.remove("inactive");
        gameBoard.classList.add("active");

        console.log("...starting the game");
        //display the player's title
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
        //display the player's info
        nameDisplays[0].innerText = game.getPlayers()[0].getName();
        nameDisplays[1].innerText = game.getPlayers()[1].getName();
        tokenDisplays[0].innerText = "";
        tokenDisplays[0].appendChild(getIcon(game.getPlayers()[0].getToken().nodeValue));
        tokenDisplays[1].innerText = "";
        tokenDisplays[1].appendChild(getIcon(game.getPlayers()[1].getToken().nodeValue));
    };
    const showWinner = (duration) => {
        let res = game.getCellChain();
        for (let i = 0; i < res.length; i++) {
            let target = getCells()[res[i][0]][res[i][1]];
            target.classList.add("highlight");
            setTimeout(() => {
                target.classList.remove("highlight");
            }, duration);
        }
    };
    const blockScreen = (duration) => {
        screenBlocker.classList.add("active");
        setTimeout(() => {
            screenBlocker.classList.remove("active");
        }, duration);
    };
    const showDraw = (duration) => {
        for (let x = 0; x < rows; ++x) {
            for (let y = 0; y < cols; ++y) {
                getCells()[x][y].classList.add("highlight");
                setTimeout(() => {
                    getCells()[x][y].classList.remove("highlight");
                }, duration);
            }
        }
    };
    const clearBoard = () => {
        for (let x = 0; x < rows; ++x) {
            for (let y = 0; y < cols; ++y) {
                getCells()[x][y].innerText = "";
            }
        }
    };
    const getIcon = (tokenID) => {
        let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute("width", "100%");

        let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        switch (tokenID) {
            case "cross":
                svg.setAttribute("viewBox", "0 0 384 512");
                path.setAttribute(
                    "d",
                    "M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
                );
                break;
            case "circle":
                svg.setAttribute("viewBox", "0 0 512 512");
                path.setAttribute(
                    "d",
                    "M222.7 32.1c5 16.9-4.6 34.8-21.5 39.8C121.8 95.6 64 169.1 64 256c0 106 86 192 192 192s192-86 192-192c0-86.9-57.8-160.4-137.1-184.1c-16.9-5-26.6-22.9-21.5-39.8s22.9-26.6 39.8-21.5C434.9 42.1 512 140 512 256c0 141.4-114.6 256-256 256S0 397.4 0 256C0 140 77.1 42.1 182.9 10.6c16.9-5 34.8 4.6 39.8 21.5z"
                );
                break;
            case "star":
                svg.setAttribute("viewBox", "0 0 576 512");

                path.setAttribute(
                    "d",
                    "M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-257-21.7L381.2 150.3 316.9 18z"
                );
                break;
            case "heart":
                svg.setAttribute("viewBox", "0 0 512 512");
                path.setAttribute(
                    "d",
                    "M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"
                );
                break;
            case "bolt":
                svg.setAttribute("viewBox", "0 0 448 512");

                path.setAttribute(
                    "d",
                    "M349.4 44.6c5.9-13.7 1.5-29.7-10.6-38.5s-28.6-8-39.9 1.8l-256 224c-10 8.8-13.6 22.9-8.9 35.3S50.7 288 64 288H175.5L98.6 467.4c-5.9 13.7-1.5 29.7 10.6 38.5s28.6 8 39.9-1.8l256-224c10-8.8 13.6-22.9 8.9-35.3s-16.6-20.7-30-20.7H272.5L349.4 44.6z"
                );
                break;
            case "flame":
                svg.setAttribute("viewBox", "0 0 384 512");
                path.setAttribute(
                    "d",
                    "M153.6 29.9l16-21.3C173.6 3.2 180 0 186.7 0C198.4 0 208 9.6 208 21.3V43.5c0 13.1 5.4 25.7 14.9 34.7L307.6 159C356.4 205.6 384 270.2 384 337.7C384 434 306 512 209.7 512H192C86 512 0 426 0 320v-3.8c0-48.8 19.4-95.6 53.9-130.1l3.5-3.5c4.2-4.2 10-6.6 16-6.6C85.9 176 96 186.1 96 198.6V288c0 35.3 28.7 64 64 64s64-28.7 64-64v-3.9c0-18-7.2-35.3-19.9-48l-38.6-38.6c-24-24-37.5-56.7-37.5-90.7c0-27.7 9-54.8 25.6-76.9z"
                );
                break;
            case "draw":
                svg.setAttribute("viewBox", "0 0 448 512");
                path.setAttribute(
                    "d",
                    "M48 128c-17.7 0-32 14.3-32 32s14.3 32 32 32H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H48zm0 192c-17.7 0-32 14.3-32 32s14.3 32 32 32H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H48z"
                );
        }
        svg.appendChild(path);
        return svg;
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
        getCells()[x][y].appendChild(getIcon(game.getActivePlayer().getToken().nodeValue));
    };
    const updateScore = () => {
        let scores = game.getScore();

        let lastestRound = scores.length - 1;
        let iconValue = scores[lastestRound] == "" ? "draw" : scores[lastestRound].nodeValue;
        scoreBoard[lastestRound].appendChild(getIcon(iconValue));
    };
    const resetAll = () => {
        for (let score of scoreBoard) {
            score.innerText = "";
        }

        for (let x = 0; x < rows; ++x) {
            for (let y = 0; y < cols; ++y) {
                getCells()[x][y].innerText = "";
            }
        }

        if (endResult.classList.contains("active")) {
            endResult.classList.add("inactive");
            setTimeout(() => {
                endResult.classList.remove("inactive");
                endResult.classList.remove("active");
                winResult.classList.remove("active");
                tieResult.classList.remove("active");
            }, 1000);
        } else {
            endResult.classList.remove("active");
            winResult.classList.remove("active");
            tieResult.classList.remove("active");
        }

        indicators[1].classList.remove("active");
        indicators[1].classList.add("inactive");
        indicators[0].classList.remove("inactive");
        indicators[0].classList.add("active");
    };
    const moveIndicator = () => {
        indicators[0].classList.toggle("inactive");
        indicators[1].classList.toggle("inactive");
        setTimeout(() => {
            indicators[0].classList.toggle("active");
            indicators[1].classList.toggle("active");
        }, 300);
    };
    const showGameResult = () => {
        endResult.classList.add("active");
        if (game.getGameWinner() == false) {
            tieResult.classList.add("active");
        } else {
            winResult.classList.add("active");
            winnerNameDisplay.innerText = game.getGameWinner();
        }
    };
    const startMenuEventHandler = (function () {
        const gameModeOpts = document.querySelectorAll(".start-menu > button");
        gameModeOpts[0].addEventListener("click", (e) => {
            window.alert("Game mode currently in development");
        });

        gameModeOpts[1].addEventListener("click", (e) => {
            e.target === gameModeOpts[0] ? game.setGameMode("pve") : game.setGameMode("pvp");
            showPlayerMenu();
        });
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
                    if (!game.checkLegal(x, y)) return;
                    game.play(x, y);
                    updateCell(x, y);
                    if (game.checkWin() || game.checkDraw()) {
                        game.recordScore();
                        updateScore();
                        blockScreen(2000);
                        setTimeout(() => {
                            if (game.checkEnd()) {
                                showGameResult();
                            } else {
                                game.switchPlayer();
                                moveIndicator();
                                game.setNewBoard();
                                clearBoard();
                            }
                        }, 2000);
                    }

                    if (game.checkWin()) {
                        showWinner(2000);
                    } else if (game.checkDraw()) {
                        showDraw(2000);
                    } else {
                        game.switchPlayer();
                        moveIndicator();
                    }
                });
            }
        }
        //add event for forfeit buttons
        const ffBtns = document.querySelectorAll(".ff");
        for (let playerID = 0; playerID < ffBtns.length; playerID++) {
            ffBtns[playerID].addEventListener("click", () => {
                game.forfeitRound(playerID);
                updateScore();
                blockScreen(1000);
                if (game.checkEnd()) {
                    showGameResult();
                }
                game.switchPlayer();
                moveIndicator();
                game.setNewBoard();
                clearBoard();
            });
        }
        //add event for game end button
        const resetBtns = document.querySelectorAll(".reset");
        for (let btn of resetBtns) {
            btn.addEventListener("click", () => {
                setTimeout(() => {
                    resetAll();
                }, 500);
                game.resetAll();
                showTitle();
            });
        }
    })();
}

ScreenController();
