const ROW = 3;
const COL = 3;
const WIN_CONDITION = 3;

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
    const columns = COL;
    const rows = ROW;

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

    return { getColumn, getRow, getBoard, setBoard };
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
function PlayerController() {
    const player1 = new Player();
    const player2 = new Player();
    let activePlayer = player1;

    const getAll = () => [player1, player2];
    const getActive = () => activePlayer;
    const setActive = (newActive) => (activePlayer = newActive);
    const switchActive = () => (activePlayer = activePlayer === player1 ? player2 : player1);

    return { getAll, getActive, switchActive, setActive };
}
function ScoreController() {
    let score = [];
    const set = (value) => (score = value);
    const add = (value) => score.push(value);
    const get = () => score;
    return { set, get, add };
}
function ModeController() {
    let gameMode = "";
    const get = () => gameMode;
    const set = (mode) => (gameMode = mode);
    return { get, set };
}
function ChainController() {
    let chain = [];
    const get = () => chain;
    const set = (value) => (chain = value);
    return { set, get };
}

function GameController() {
    const board = Board();
    const rows = board.getRow();
    const cols = board.getColumn();
    const players = PlayerController();
    const player1 = players.getAll()[0];
    const player2 = players.getAll()[1];
    const scores = ScoreController();
    const mode = ModeController();
    const longestChain = ChainController();

    const setNewBoard = () => {
        longestChain.set([]);
        board.setBoard();
    };
    const play = (x, y) => {
        board.getBoard()[x][y].setVal(players.getActive().getToken());
    };
    const checkLegal = (x, y) => {
        if (board.getBoard()[x][y].getVal() != "") return false;
        return true;
    };
    const checkWin = (x, y, tokenID) => {
        const currentBoard = board.getBoard();
        if (!tokenID) tokenID = currentBoard[x][y].getVal();
        let chainsRecord = {
            hori: [[x, y]],
            vert: [[x, y]],
            diag_1: [[x, y]],
            diag_2: [[x, y]],
        };

        // console.log(`Cheking the area around cell [${x},${y}]`);

        for (let i = 1; i < WIN_CONDITION; i++) {
            let cellState = {
                left: x - i >= 0,
                right: x + i < rows,
                above: y - i >= 0,
                below: y + i < cols,
                upperLeft: y - i >= 0 && x - i >= 0,
                upperRight: y - i >= 0 && x + i < rows,
                lowerLeft: y + i < cols && x - i >= 0,
                lowerRight: y + i < cols && x + i < rows,
            };

            // console.log(`Loop ${i}:
            // | ${cellState.upperLeft} | ${cellState.above} | ${cellState.upperRight} |
            // | ${cellState.left} |      | ${cellState.right} |
            // | ${cellState.lowerLeft} | ${cellState.below} | ${cellState.lowerRight} |`);

            // console.log("check vertical");
            if (cellState.right && currentBoard[x + i][y].getVal() == tokenID) chainsRecord.hori.push([x + i, y]);
            if (cellState.left && currentBoard[x - i][y].getVal() == tokenID) chainsRecord.hori.push([x - i, y]);

            // console.log("check horizontal");
            if (cellState.below && currentBoard[x][y + i].getVal() == tokenID) chainsRecord.vert.push([x, y + i]);
            if (cellState.above && currentBoard[x][y - i].getVal() == tokenID) chainsRecord.vert.push([x, y - i]);

            // console.log("check diagonal_1");
            if (cellState.upperLeft && currentBoard[x - i][y - i].getVal() == tokenID)
                chainsRecord.diag_1.push([x - i, y - i]);
            if (cellState.lowerRight && currentBoard[x + i][y + i].getVal() == tokenID)
                chainsRecord.diag_1.push([x + i, y + i]);

            // console.log("check diagonal_2");
            if (cellState.lowerLeft && currentBoard[x - i][y + i].getVal() == tokenID)
                chainsRecord.diag_2.push([x - i, y + i]);
            if (cellState.upperRight && currentBoard[x + i][y - i].getVal() == tokenID)
                chainsRecord.diag_2.push([x + i, y - i]);
        }

        // console.log(`Player ${getActivePlayer().getName()} results:
        //     Horizontal: ${chainsRecord.hori.length}
        //     Vertical: ${chainsRecord.vert.length}
        //     Diagonal_1: ${chainsRecord.diag_1.length}
        //     Diagonal_2: ${chainsRecord.diag_2.length}`);

        for (let chain in chainsRecord) {
            if (chainsRecord[chain].length >= WIN_CONDITION) {
                longestChain.set(chainsRecord[chain]);
                return true;
            }
        }
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
    const checkEnd = () => {
        return scores.get().length >= 5 ? true : false;
    };
    const getGameWinner = () => {
        let p1_score = 0,
            p2_score = 0;
        for (let s of scores.get()) {
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

    const resetAll = () => {
        scores.set([]);
        players.setActive(player1);
        setNewBoard();
    };
    return {
        players,
        scores,
        mode,
        longestChain,
        setNewBoard,
        play,
        checkLegal,
        checkWin,
        checkDraw,
        checkEnd,
        getGameWinner,
        resetAll,
        getBoard: board.getBoard,
    };
}
function ScreenController() {
    const title = document.querySelector(".title");

    const startMenu = document.querySelector(".start-menu");

    const multiPlayerMenu = document.querySelector(".player-menu-pvp");
    const singlePlayerMenu = document.querySelector(".player-menu-pve");

    const gameBoard = document.querySelector(".game");

    const playerInfo = document.querySelectorAll(".player_info");
    const botInfo = document.querySelector(".bot_info");

    const nameDisplays = document.querySelectorAll(".player_name");
    const tokenDisplays = document.querySelectorAll(".player_token");
    const titleDisplays = document.querySelectorAll(".player_title");

    const botTitleDisplay = document.querySelector(".bot_title");
    const botTokenDisplay = document.querySelector(".bot_token");

    const scoreBoard = document.querySelectorAll(".score_display");
    const indicators = document.querySelectorAll(".turn-indicator");

    const screenBlocker = document.querySelector(".block-overlay");
    const endResult = document.querySelector(".result_container");
    const winResult = document.querySelector(".result--win");
    const tieResult = document.querySelector(".result--tie");
    const resultOverlay = document.querySelector(".result_overlay");
    const winnerNameDisplay = document.querySelector(".winner_name");

    const rows = ROW;
    const cols = COL;

    const showTitle = () => {
        title.classList.remove("center");
        transitOut(gameBoard, 500);
        transitIn(startMenu, 500);
    };
    const showPlayerMenu = (gameMode) => {
        title.classList.add("center");
        transitOut(startMenu, 500);
        gameMode == "pvp" ? transitIn(multiPlayerMenu, 500) : transitIn(singlePlayerMenu, 500);
    };
    const showGame = (gameMode) => {
        if (gameMode == "pvp") {
            transitOut(multiPlayerMenu, 500);
            playerInfo[1].classList.remove("inactive");
            botInfo.classList.add("inactive");
        } else {
            transitOut(singlePlayerMenu, 500);
            playerInfo[1].classList.add("inactive");
            botInfo.classList.remove("inactive");
        }
        transitIn(gameBoard, 500);
        // console.log("...starting the game");
    };
    const showEndGame = (winner) => {
        transitIn(endResult, 500);
        transitIn(resultOverlay, 500);
        if (winner) {
            transitIn(winResult, 500);
            winnerNameDisplay.innerText = winner;
        } else {
            transitIn(tieResult, 500);
        }
    };
    const moveIndicator = (gameMode) => {
        if (gameMode == "pvp") {
            if (indicators[0].classList.contains("inactive")) {
                transitOut(indicators[1], 200);
                transitIn(indicators[0], 200, 100);
            } else {
                transitOut(indicators[0], 200);
                transitIn(indicators[1], 200, 100);
            }
        }

        if (gameMode == "pve") {
            console.log("good so far");

            if (indicators[0].classList.contains("inactive")) {
                transitIn(indicators[0], 200, 100);
                botInfo.classList.remove("active");
            } else {
                transitOut(indicators[0], 200);
                botInfo.classList.add("active");
            }
        }
    };

    const setPlayerInfo = (currentGameMode, players) => {
        //set the text for the player's title
        switch (currentGameMode) {
            case "pvp":
                titleDisplays[0].innerText = "PLAYER ONE";
                nameDisplays[0].innerText = players[0].getName();
                tokenDisplays[0].innerText = "";
                tokenDisplays[0].appendChild(getIcon(players[0].getToken()));

                titleDisplays[1].innerText = "PLAYER TWO";
                nameDisplays[1].innerText = players[1].getName();
                tokenDisplays[1].innerText = "";
                tokenDisplays[1].appendChild(getIcon(players[1].getToken()));

                break;
            case "pve":
                titleDisplays[0].innerText = "PLAYER ";
                nameDisplays[0].innerText = players[0].getName();
                tokenDisplays[0].innerText = "";
                tokenDisplays[0].appendChild(getIcon(players[0].getToken()));

                botTitleDisplay.innerText = "BOT";
                botTokenDisplay.innerText = "";
                botTokenDisplay.appendChild(getIcon(players[1].getToken()));

                break;
        }
        //set the text for the player's info
    };

    const showRoundTie = (duration) => {
        blockScreen(duration);
        for (let x = 0; x < rows; ++x) {
            for (let y = 0; y < cols; ++y) {
                getCells(x, y).classList.add("highlight");
                setTimeout(() => {
                    getCells(x, y).classList.remove("highlight");
                }, duration);
            }
        }
    };
    const showRoundWinner = (duration, winning_chain = []) => {
        blockScreen(duration);
        for (let i = 0; i < winning_chain.length; i++) {
            let target = getCells(winning_chain[i][0], winning_chain[i][1]);
            target.classList.add("highlight");
            setTimeout(() => {
                target.classList.remove("highlight");
            }, duration);
        }
    };

    const updateBoard = (board) => {
        for (let x = 0; x < rows; ++x) {
            for (let y = 0; y < cols; ++y) {
                getCells(x, y).innerText = "";
                if (board[x][y].getVal() !== "") getCells(x, y).appendChild(getIcon(board[x][y].getVal()));
            }
        }
    };
    const updateScore = (currentScores) => {
        let lastestRound = currentScores.length - 1;
        let iconValue = currentScores[lastestRound] == "" ? "draw" : currentScores[lastestRound];
        scoreBoard[lastestRound].appendChild(getIcon(iconValue));
    };

    const resetAll = () => {
        //reset scoreboard display
        for (let score of scoreBoard) {
            score.innerText = "";
        }
        //reset cell display
        for (let x = 0; x < rows; ++x) {
            for (let y = 0; y < cols; ++y) {
                getCells(x, y).innerText = "";
            }
        }
        //hide game result
        if (!endResult.classList.contains("inactive")) {
            if (!winResult.classList.contains("inactive")) transitOut(winResult, 500);
            if (!tieResult.classList.contains("inactive")) transitOut(tieResult, 500);
            transitOut(resultOverlay, 500);
            transitOut(endResult, 500);
        }

        //reset pvp turn indicator
        indicators[0].classList.remove("inactive");
        indicators[1].classList.add("inactive");
        //reset pvp turn indicator
        botInfo.classList.remove("active");
    };
    const blockScreen = (duration) => {
        screenBlocker.classList.add("active");
        setTimeout(() => {
            screenBlocker.classList.remove("active");
        }, duration);
    };

    return {
        showTitle,
        showPlayerMenu,
        showGame,
        showEndGame,
        showRoundTie,
        showRoundWinner,
        blockScreen,
        setPlayerInfo,
        updateBoard,
        updateScore,
        moveIndicator,
        resetAll,
    };
}

function BotController(game) {
    let humanTokenID = "";
    let botTokenID = "";
    let emptyCells = {};
    let filledCells = {};
    let optimalMove = "";

    const setUp = () => {
        emptyCells = {
            corner: ["0,0", "2,0", "0,2", "2,2"],
            edge: ["0,1", "1,0", "2,1", "1,2"],
            center: ["1,1"],
        };

        filledCells = {
            human: [],
            bot: [],
            total: function () {
                return this.human.concat(this.bot);
            },
        };
        humanTokenID = game.players.getAll()[0].getToken();
        botTokenID = game.players.getAll()[1].getToken();
    };

    const recordHumanMove = (x, y) => {
        let value = `${x},${y}`;
        filledCells.human.push(value);
        for (const area in emptyCells) {
            if (emptyCells[area].includes(value)) {
                emptyCells[area].splice(emptyCells[area].indexOf(value), 1);
            }
        }
    };
    const recordBotMove = (x, y) => {
        let value = `${x},${y}`;
        filledCells.bot.push(value);
        for (const area in emptyCells) {
            if (emptyCells[area].includes(value)) {
                emptyCells[area].splice(emptyCells[area].indexOf(value), 1);
            }
        }
    };
    const getOptimalMove = () => {
        console.log(`RECORD:\n__human has played: ${filledCells.human}\n__bot has played: ${filledCells.bot}`);
        switch (filledCells.human.length + filledCells.bot.length) {
            case 0:
                optimalMove = emptyCells.corner[Math.floor(Math.random() * emptyCells.corner.length)];
                break;
            case 1:
                //set optimal move to counter the first move
                if (emptyCells.center.length == 0) {
                    optimalMove = emptyCells.corner[Math.floor(Math.random() * emptyCells.corner.length)];
                } else {
                    optimalMove = emptyCells.center[0];
                }
                break;
            default:
                if (filledCells.bot.length >= 2 && checkForWinningMove(botTokenID)) {
                    //set optimal move if check for win is true
                    console.log("BOT: found win move");
                    optimalMove = checkForWinningMove(botTokenID);
                    break;
                } else if (filledCells.human.length >= 2 && checkForWinningMove(humanTokenID)) {
                    //else set optimal move if check for loss is true
                    console.log("BOT: found win counter");
                    optimalMove = checkForWinningMove(humanTokenID);
                    break;
                } else if (filledCells.bot.length >= 2 && checkForFork(botTokenID)) {
                    //else check if there is a posible fork
                    console.log("BOT: found fork move");
                    optimalMove = checkForFork(botTokenID);
                    break;
                } else if (filledCells.human.length >= 2 && checkForFork(humanTokenID)) {
                    //else check if human has a posible fork move
                    console.log("BOT: found fork counter");
                    optimalMove = checkForFork(humanTokenID);

                    break;
                } else if (emptyCells.center.length > 0) {
                    //play the center
                    console.log("BOT: found empty center");
                    optimalMove = emptyCells.center[0];
                } else if (emptyCells.corner.length > 0) {
                    //play an opposite corner of a human corner's move or a random corner
                    console.log("BOT: found empty corner");
                    if (getOppositeCorner()) {
                        console.log("--CORNER: opposite");
                        optimalMove = getOppositeCorner();
                        break;
                    } else {
                        console.log("--CORNER: random");
                        optimalMove = emptyCells.corner[Math.floor(Math.random() * emptyCells.corner.length)];
                        break;
                    }
                } else if (emptyCells.edge.length > 0) {
                    //play random edge
                    console.log("BOT: found empty edge");
                    optimalMove = emptyCells.edge[Math.floor(Math.random() * emptyCells.edge.length)];
                    break;
                }
                break;
        }
        return optimalMove.split(",").map(Number);
    };

    const checkForWinningMove = (tokenID) => {
        let totalEmptyCells = emptyCells.corner.concat(emptyCells.edge);
        for (const cell of totalEmptyCells) {
            let cellValue = cell.split(",").map(Number);
            if (game.checkWin(cellValue[0], cellValue[1], tokenID)) {
                return cell;
            }
        }
        console.log("found no winning move for: " + tokenID.value);
        return false;
    };

    const checkForFork = (tokenID) => {
        let sides = {
            top: {
                cells: ["0,0", "1,0", "2,0"],
                viable: false,
                unviable: false,
                mid: false,
            },
            bottom: {
                cells: ["0,2", "1,2", "2,2"],
                viable: false,
                unviable: false,
                mid: false,
            },
            left: {
                cells: ["0,0", "0,1", "0,2"],
                viable: false,
                unviable: false,
                mid: false,
            },
            right: {
                cells: ["2,0", "2,1", "2,2"],
                viable: false,
                unviable: false,
                mid: false,
            },
        };
        let forkSides = [];
        let movePlayed = tokenID == humanTokenID ? filledCells.human : filledCells.bot;
        let moveOpponentPlayed = tokenID == humanTokenID ? filledCells.bot : filledCells.human;

        //get available sides
        for (const direction in sides) {
            for (const cell of sides[direction].cells) {
                if (movePlayed.includes(cell)) {
                    sides[direction].viable = true;
                    if (cell.includes("1")) sides[direction].mid = true;
                }
                if (moveOpponentPlayed.includes(cell)) {
                    sides[direction].unviable = true;
                }
            }
            if (!sides[direction].viable || sides[direction].unviable) delete sides[direction];
        }

        //if bottom and top OR left and right are not viable then quit
        if ((!sides.top && !sides.bottom) || (!sides.right && !sides.left)) return false;

        //get the first side
        if (sides.top || sides.bottom) forkSides[0] = sides.top ? sides.top : sides.bottom;
        if (sides.top && sides.bottom) {
            if (sides.top.mid) forkSides[0] = sides.top;
            if (sides.bottom.mid) forkSides[0] = sides.bottom;
        }
        //get the second side
        if (sides.left || sides.right) forkSides[1] = sides.left ? sides.left : sides.right;
        if (sides.left && sides.right) {
            if (sides.left.mid) forkSides[1] = sides.left;
            if (sides.right.mid) forkSides[1] = sides.right;
        }
        //get the current position of the viable moves
        let posibleMove = forkSides[0].cells.concat(forkSides[1].cells);
        let head = forkSides[0].cells.filter((element) => forkSides[1].cells.includes(element));
        let mid = posibleMove.filter((element) => element.includes("1"));
        //return the fork move
        if (!forkSides[0].mid && !forkSides[1].mid) {
            return mid[0];
        } else if (forkSides[0].mid || forkSides[1].mid) {
            return head[0];
        }
        return false;
    };

    const getOppositeCorner = () => {
        corners = {
            a: ["0,0", "2,2"],
            b: ["0,2", "2,0"],
        };

        for (const pair in corners) {
            for (let i = 0; i < 2; i++) {
                let j = i == 0 ? 1 : 0;
                if (filledCells.total().includes(corners[pair][i]) && emptyCells.corner.includes(corners[pair][j])) {
                    return corners[pair][j];
                }
            }
        }

        return false;
    };

    return {
        setUp,
        recordHumanMove,
        recordBotMove,
        getOptimalMove,
    };
}

//utilities functions
async function transitIn(el, duration, delay = 0) {
    document.documentElement.style.setProperty("--animation-duration", `${duration}ms`);
    await wait(delay);
    el.classList.toggle("inactive");
    el.classList.add("moveIn");
    await wait(duration);
    el.classList.remove("moveIn");
}
async function transitOut(el, duration, delay = 0) {
    document.documentElement.style.setProperty("--animation-duration", `${duration}ms`);
    await wait(delay);
    el.classList.add("moveOut");
    await wait(duration);
    el.classList.remove("moveOut");
    el.classList.toggle("inactive");
}
function wait(duration) {
    return new Promise((resolve) => setTimeout(resolve, duration));
}
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

        case "bot":
            svg.setAttribute("viewBox", "0 0 640 512");
            path.setAttribute(
                "d",
                "M320 0c17.7 0 32 14.3 32 32V96H472c39.8 0 72 32.2 72 72V440c0 39.8-32.2 72-72 72H168c-39.8 0-72-32.2-72-72V168c0-39.8 32.2-72 72-72H288V32c0-17.7 14.3-32 32-32zM208 384c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H208zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H304zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H400zM264 256a40 40 0 1 0 -80 0 40 40 0 1 0 80 0zm152 40a40 40 0 1 0 0-80 40 40 0 1 0 0 80zM48 224H64V416H48c-26.5 0-48-21.5-48-48V272c0-26.5 21.5-48 48-48zm544 0c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H576V224h16z"
            );
            break;
        case "draw":
            svg.setAttribute("viewBox", "0 0 448 512");
            path.setAttribute(
                "d",
                "M48 128c-17.7 0-32 14.3-32 32s14.3 32 32 32H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H48zm0 192c-17.7 0-32 14.3-32 32s14.3 32 32 32H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H48z"
            );
            break;
    }
    svg.appendChild(path);
    return svg;
};
const getCells = (cordinate_x, cordinate_y) => {
    // Create an array to store all of the DOM element of cells from the UI
    const rows = ROW;
    const cols = COL;
    let cells = new Array(rows);

    for (let x = 0; x < cells.length; ++x) {
        cells[x] = new Array(0);
        for (let y = 0; y < cols; ++y) {
            let cell_selector = `.cell[x="${x}"][y="${y}"]`;
            cells[x].push(document.querySelector(cell_selector));
        }
    }

    return cells[cordinate_x][cordinate_y];
};

function app() {
    const rows = ROW;
    const cols = COL;
    const game = GameController();
    const screen = ScreenController();
    const bot = BotController(game);

    const evalMove = (x, y) => {
        let roundEnd = game.checkDraw() || game.checkWin(x, y) ? true : false;
        let roundWinner = "";
        if (game.checkWin(x, y)) {
            roundWinner = game.players.getActive().getToken();
        } else if (game.checkDraw()) {
            roundWinner = "";
        }
        return [roundEnd, roundWinner];
    };
    const renderMove = (x, y) => {
        game.play(x, y);
        if (game.mode.get() == "pve") {
            game.players.getActive() == game.players.getAll()[0] ? bot.recordHumanMove(x, y) : bot.recordBotMove(x, y);
        }
        screen.updateBoard(game.getBoard());
    };
    const renderScore = (roundWinner) => {
        game.scores.add(roundWinner);
        screen.updateScore(game.scores.get());
    };
    const renderRoundResult = async (roundWinner) => {
        if (roundWinner == "") {
            screen.showRoundTie(2000);
        } else {
            screen.showRoundWinner(2000, game.longestChain.get());
        }
        await wait(2000);
    };
    const renderNewRound = () => {
        game.setNewBoard();
        screen.updateBoard(game.getBoard());
        if (game.mode.get() == "pve") {
            console.log("a new bot has been created");
            bot.setUp();
        }
    };
    const switchActivePlayer = () => {
        game.players.switchActive();
        screen.moveIndicator(game.mode.get());
        //if p2 turn and pve, play bot

        if (game.mode.get() == "pve" && game.players.getActive() !== game.players.getAll()[0]) {
            console.log("BOT TURN:");
            botPlay();
        }
    };

    const botPlay = async () => {
        screen.blockScreen(500);
        await wait(500);
        let [x, y] = bot.getOptimalMove();
        renderMove(x, y);
        console.log(`----> bot is going to play: ${x} ${y}`);
        let [roundEnd, roundWinner] = evalMove(x, y);
        //if the move resulted in a win or a draw
        if (roundEnd) {
            renderScore(roundWinner);
            await renderRoundResult(roundWinner);
            renderNewRound();
            //if this is the last round
            if (game.checkEnd()) {
                screen.showEndGame(game.getGameWinner());
                return;
            }
        }
        //switch active player
        switchActivePlayer();
    };

    //event handler
    const startMenuHandler = () => {
        const gameModeOpts = document.querySelectorAll(".start-menu > button");
        gameModeOpts[0].addEventListener("click", (e) => {
            game.mode.set("pve");
            screen.showPlayerMenu(game.mode.get());
        });

        gameModeOpts[1].addEventListener("click", (e) => {
            game.mode.set("pvp");
            screen.showPlayerMenu(game.mode.get());
        });
    };
    const playerMenuHandler = () => {
        const pvpSubmitBtn = document.querySelector("#multiPlayerSubmit");
        const pveSubmitBtn = document.querySelector("#singlePlayerSubmit");
        const nameAlert = "Plese enter your name";
        const tokenAlert = "Plese pick your player icon";

        pvpSubmitBtn.addEventListener("click", () => {
            const submitCondition = [true, true];
            for (let i = 0; i < game.players.getAll().length; i++) {
                let nameValue = document.querySelectorAll(".player-menu-pvp .name_input")[i].value;
                let selectedToken = document.querySelector('.player-menu-pvp input[playerID="' + i + '"]:checked');
                let alertContainer = document.querySelectorAll(".player-menu-pvp .alert")[i];
                let tokenValue = selectedToken ? selectedToken.attributes.tokenID.value : "";

                if (nameValue == "") {
                    alertContainer.children[0].innerText = nameAlert;
                } else {
                    alertContainer.children[0].innerText = "";
                    game.players.getAll()[i].setName(nameValue);
                }

                if (tokenValue == "") {
                    alertContainer.children[1].innerText = tokenAlert;
                } else {
                    alertContainer.children[1].innerText = "";
                    game.players.getAll()[i].setToken(tokenValue);
                }

                submitCondition[i] = nameValue !== "" && tokenValue !== "";
            }

            //if the submit conditions from both player's form are met
            if (submitCondition[0] == true && submitCondition[1] == true) {
                screen.setPlayerInfo(game.mode.get(), game.players.getAll());
                renderNewRound();
                screen.showGame(game.mode.get());
            }
        });

        pveSubmitBtn.addEventListener("click", () => {
            let nameValue = document.querySelector(".player-menu-pve .name_input").value;
            let selectedToken = document.querySelector(".player-menu-pve input:checked");
            let alertContainer = document.querySelector(".player-menu-pve .alert");
            let tokenValue = selectedToken ? selectedToken.attributes.tokenID.value : "";

            //asign default name and token value for Bot
            game.players.getAll()[1].setToken("bot");
            game.players.getAll()[1].setName("BOT");

            //check if the player has entered enough data
            if (nameValue == "") {
                alertContainer.children[0].innerText = nameAlert;
            } else {
                alertContainer.children[0].innerText = "";
                game.players.getAll()[0].setName(nameValue);
            }

            if (tokenValue == "") {
                alertContainer.children[1].innerText = tokenAlert;
            } else {
                alertContainer.children[1].innerText = "";
                game.players.getAll()[0].setToken(tokenValue);
            }

            //if the submit conditions from player's form are met
            if (nameValue !== "" && tokenValue !== "") {
                screen.setPlayerInfo(game.mode.get(), game.players.getAll());
                renderNewRound();
                screen.showGame(game.mode.get());
            }
        });
    };
    const forfeitBtnsHandler = () => {
        //add event for forfeit buttons
        const ffBtns = document.querySelectorAll(".ff");
        for (let playerID = 0; playerID < ffBtns.length; playerID++) {
            ffBtns[playerID].addEventListener("click", () => {
                let winner = playerID == 0 ? game.players.getAll()[1] : game.players.getAll()[0];
                renderScore(winner.getToken());

                screen.blockScreen(1000);
                renderNewRound();
                if (game.checkEnd()) {
                    screen.showEndGame(game.getGameWinner());
                    return;
                }

                switchActivePlayer();
            });
        }
    };
    const cellHandler = () => {
        // add event for each cell on the board
        for (let x = 0; x < rows; x++) {
            for (let y = 0; y < cols; y++) {
                getCells(x, y).addEventListener("click", async () => {
                    //check if the move is legal first
                    if (!game.checkLegal(x, y)) return;
                    //render move into view
                    renderMove(x, y);
                    //evaluating the result of the move
                    let [roundEnd, roundWinner] = evalMove(x, y);
                    //if the move resulted in a win or a draw
                    if (roundEnd) {
                        renderScore(roundWinner);
                        await renderRoundResult(roundWinner);
                        renderNewRound();
                        //if this is the last round
                        if (game.checkEnd()) {
                            screen.showEndGame(game.getGameWinner());
                            return;
                        }
                    }
                    //switch active player
                    switchActivePlayer();
                });
            }
        }
    };
    const endGameBtnsHandler = () => {
        //add event for game end button
        const resetBtns = document.querySelectorAll(".reset");
        for (let btn of resetBtns) {
            btn.addEventListener("click", async () => {
                game.resetAll();
                screen.showTitle();
                await wait(500);
                screen.resetAll();
            });
        }
    };

    (function startGame() {
        startMenuHandler();
        playerMenuHandler();
        cellHandler();
        forfeitBtnsHandler();
        endGameBtnsHandler();
    })();
}
app();
