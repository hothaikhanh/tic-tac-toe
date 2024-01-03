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
    const forfeitRound = (playerID) => {
        let roundWinner = playerID == 0 ? player2 : player1;
        players.setActive(roundWinner);
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
        forfeitRound,
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
    const resultOverlay = document.querySelector(".result_overlay");
    const winnerNameDisplay = document.querySelector(".winner_name");

    const rows = ROW;
    const cols = COL;

    const showTitle = () => {
        title.classList.remove("center");
        transitOut(gameBoard, 500);
        transitIn(startMenu, 500);
    };
    const showPlayerMenu = () => {
        title.classList.add("center");
        transitOut(startMenu, 500);
        transitIn(playerMenu, 500);
    };
    const showGame = () => {
        transitOut(playerMenu, 500);
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
    const moveIndicator = () => {
        if (indicators[0].classList.contains("inactive")) {
            transitOut(indicators[1], 200);
            transitIn(indicators[0], 200, 100);
        } else {
            transitOut(indicators[0], 200);
            transitIn(indicators[1], 200, 100);
        }
    };

    const setPlayerInfo = (currentGameMode, players) => {
        //set the text for the player's title
        switch (currentGameMode) {
            case "pvp":
                titleDisplays[0].innerText = "PLAYER ONE";
                titleDisplays[1].innerText = "PLAYER TWO";
                break;
            case "pve":
                titleDisplays[0].innerText = "PLAYER";
                titleDisplays[1].innerText = "BOT";
                break;
        }
        //set the text for the player's info
        nameDisplays[0].innerText = players[0].getName();
        nameDisplays[1].innerText = players[1].getName();
        tokenDisplays[0].innerText = "";
        tokenDisplays[0].appendChild(getIcon(players[0].getToken().nodeValue));
        tokenDisplays[1].innerText = "";
        tokenDisplays[1].appendChild(getIcon(players[1].getToken().nodeValue));
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
                if (board[x][y].getVal() !== "") getCells(x, y).appendChild(getIcon(board[x][y].getVal().nodeValue));
            }
        }
    };
    const updateScore = (currentScores) => {
        let lastestRound = currentScores.length - 1;
        let iconValue = currentScores[lastestRound] == "" ? "draw" : currentScores[lastestRound].nodeValue;
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

        //reset player's turn indicator
        indicators[0].classList.remove("inactive");
        indicators[1].classList.add("inactive");
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
    const rows = ROW;
    const cols = COL;
    const [humanTokenID, botTokenID] = game.players.getAll();
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
        };
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
        console.log(`human has played: ${filledCells.human}\nbot has played: ${filledCells.bot}`);
        switch (filledCells.human.length + filledCells.bot.length) {
            case 0:
                console.log("no moves has been played");
                optimalMove = emptyCells.corner[Math.floor(Math.random() * emptyCells.corner.length)];
                break;
            case 1:
                console.log("1 move has been played");
                //set optimal move to counter the first move
                if (emptyCells.center.length == 0) {
                    optimalMove = emptyCells.corner[Math.floor(Math.random() * emptyCells.corner.length)];
                } else {
                    optimalMove = emptyCells.center[0];
                }
                break;
            default:
                console.log("bot is in default mode");
                if (getWinningMove()) {
                    //set optimal move if check for win is true
                    console.log("bot is checking for win");
                    optimalMove = getWinningMove();
                    break;
                } else if (getCounterMove()) {
                    //else set optimal move if check for loss is true
                    console.log("bot is checking for counter");
                    optimalMove = getCounterMove();
                    break;
                } else if (getForkMove()) {
                    //else check if there is a posible fork
                    console.log("bot is looking for fork");
                    optimalMove = getForkMove();
                    break;
                } else if (getCounterForkMove()) {
                    //else check if human has a posible fork move
                    console.log("bot is countering fork");
                    optimalMove = getCounterForkMove();
                    break;
                } else if (emptyCells.center.length > 0) {
                    //play the center
                    console.log("bot is playing center");
                    optimalMove = emptyCells.center[0];
                } else if (emptyCells.corner.length > 0) {
                    //play an opposite corner of a human corner's move or a random corner
                    console.log("bot is playing corner");
                    if (getOppositeCorner()) {
                        console.log("playing opposite corner");
                        optimalMove = getOppositeCorner();
                        break;
                    } else {
                        console.log("playing random corner");
                        optimalMove = emptyCells.corner[Math.floor(Math.random() * emptyCells.corner.length)];
                        break;
                    }
                } else if (emptyCells.edge.length > 0) {
                    //play random edge
                    console.log("bot is playing edge");
                    optimalMove = emptyCells.edge[Math.floor(Math.random() * emptyCells.edge.length)];
                    break;
                }
                break;
        }

        return optimalMove.split(",").map(Number);
    };

    const getWinningMove = () => {
        if (filledCells.human.length + filledCells.bot.length < 3) return false;
        let totalEmptyCells = emptyCells.corner.concat(emptyCells.edge);
        console.log(totalEmptyCells);
        for (const cell of totalEmptyCells) {
            let cellValue = cell.split(",").map(Number);
            if (game.checkWin(cellValue[0], cellValue[1], botTokenID)) {
                return cell;
            }
        }
        return false;
    };
    const getCounterMove = () => {};
    const getForkMove = () => {};
    const getCounterForkMove = () => {};
    const getOppositeCorner = () => {
        let oppositeCorner = false;
        corners = {
            a: ["0,0", "2,2"],
            b: ["0,2", "2,0"],
        };

        for (const pair in corners) {
            for (let i = 0; i < 2; i++) {
                let j = i == 0 ? 1 : 0;
                if (filledCells.human.includes(pair[i]) && emptyCells.corner.includes(pair[j])) {
                    oppositeCorner = pair[j];
                }
            }
        }

        return oppositeCorner;
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
        screen.moveIndicator();
        //if p2 turn and pve, play bot
        if (game.mode.get() == "pve" && game.players.getActive() !== game.players.getAll()[0]) {
            console.log("it's now the bot's turn to make a move");
            botPlay();
        }
    };

    const botPlay = async () => {
        screen.blockScreen(1000);
        let [x, y] = bot.getOptimalMove();
        // renderMove(x, y);
        console.log(`bot is going to play: ${x} ${y}`);
    };

    //event handler
    const startMenuHandler = () => {
        const gameModeOpts = document.querySelectorAll(".start-menu > button");
        gameModeOpts[0].addEventListener("click", (e) => {
            game.mode.set("pve");
            screen.showPlayerMenu();
        });

        gameModeOpts[1].addEventListener("click", (e) => {
            game.mode.set("pvp");
            screen.showPlayerMenu();
        });
    };
    const playerMenuHandler = () => {
        const submitBtn = document.querySelector("#multiPlayerSubmit");
        submitBtn.addEventListener("click", () => {
            const submitCondition = [true, true];
            for (let i = 0; i < game.players.getAll().length; i++) {
                let nameValue = document.querySelectorAll(".name_input")[i].value;
                let selectedToken = document.querySelector('input[playerID="' + i + '"]:checked');
                let alertContainer = document.querySelectorAll(".player-menu .alert")[i];
                let tokenValue = selectedToken ? selectedToken.attributes.tokenID : "";

                let nameAlert = "Plese enter your name";
                let tokenAlert = "Plese pick your player icon";

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

            //IF PVP, check if the submit conditions from both player's form are met
            if (game.mode.get() == "pvp" && submitCondition[0] == true && submitCondition[1] == true) {
                screen.setPlayerInfo(game.mode.get(), game.players.getAll());
                renderNewRound();
                screen.showGame();
            }

            //IF PVE, check if the submit conditions from both player's form are met
            if (game.mode.get() == "pve" && submitCondition[0] == true) {
                screen.setPlayerInfo(game.mode.get(), game.players.getAll()); //temp

                renderNewRound();
                screen.showGame();
            }
        });
    };
    const forfeitBtnsHandler = () => {
        //add event for forfeit buttons
        const ffBtns = document.querySelectorAll(".ff");
        for (let playerID = 0; playerID < ffBtns.length; playerID++) {
            ffBtns[playerID].addEventListener("click", () => {
                game.forfeitRound(playerID);
                renderScore(game.players.getActive().getToken());
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
