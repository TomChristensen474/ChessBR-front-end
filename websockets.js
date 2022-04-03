const ws = new WebSocket("ws://192.168.1.206:8765");
// const ws = new WebSocket("ws://localhost:8765");

let status = "CONNECTING";

ws.onopen = () => {
  console.log("Connected to server");
  // ws.send({type: "CONNECT_REQUEST"})
};

const send = (type, data) => {
    console.log(">>>", JSON.stringify({type, data}));
    ws.send(JSON.stringify({type, data}));
}

ws.onmessage = (message) => {
    message = JSON.parse(message.data)
    console.log("<<<", message);
    const data = message.data;
    switch(message.type) {
        case "CONNECTED":
            showConnectedModal()
            break;

        case "GAME_STARTED":
            hideConnectedModal()
            startGame(board)
            break;

        case "BOARD_FEN_ACK":
            updateMainBoard(data.newFen)
            break;

        case "BOT_MOVE":
            doMove(board, data.move);
            updateMainBoard(data.newFen)
            break;

        case "BOT_USE_BONUS":
            // data.square and data.piece is also sent
            updateMainBoard(data.fen)
            // todo remove bot bonus piece from ui
            break;

        case "NEIGHBOUR_MOVE":
            if (data.neighbour === 1) {
                updateSideBoard(board0, data.newFen)
            } else {
                updateSideBoard(board2, data.newFen)
            }
            break;

        case "NEIGHBOUR_FINISHED":
            // todo implement this
            // data.neighbour is 1 or 2
            // data.neighbour_won is true or false
            break;

        case "BONUS_PIECE":
            notifyBonusPiece(data.piece)
            break;

        case "UPDATE_PLAYER_COUNT":
            updatePlayerCount(data.playerCount)
            break;

        case "GAME_OVER":
            // data.player_won is true or false
            // data.reason is one of "CHECKMATE", "STALEMATE", "OUT_OF_TIME", "PLAYER_RESIGNED", "BOT_RESIGNED"
            // data.position is the leaderboard position of the player
            gameOver(board)
            let GameOverState = document.getElementById("GameState");
            GameOverState.innerHTML = data.reason;
            let placement = document.getElementById("Placement");
            placement.innerHTML = "You placed data.position";
            window.location.href = 'GameOver.html';
            break;

        default:
            console.error(message)
      }

}

ws.onclose = () => {
    console.log("Connection closed");
}

function doMove(board, moveString) {
    board.move(moveString);
}

function updateMainBoard(FENstring) {
    board.position(FENstring, true)
    game.load(FENstring);
}

function updateSideBoard(board, FENstring) {
    board.position(FENstring, true);
}

function startGame(board) {
    showOrHideDiv("WaitingList");
    board.start()
}

function updatePlayerCount(playerCount) {
    $('#playerCount').html("Players left: <br>" + playerCount)
    if (status === "ON_WAITING_LIST"){
      updatePlayersWaiting(playerCount);
    }
}

function updatePlayersWaiting(playerCount){
    let playerList = document.getElementById("playerList");
    // for (const child of playerList.children){
    //     playerList.removeChild(child);
    // }
    playerList.innerHTML = "";
    for (let i = playerCount; i > 0; i--) {
        playerList.innerHTML+=`<li><a>Player ${i}</a></li>`;
    }
}

function gameOver(board) {
    board.draggable = false
}

function notifyBonusPiece(piece) {
    $("#pieceNotificationText").html("You have received a piece: " + piece)
    addSparePiece(piece);
    $("#pieceNotification").fadeIn()
    $("#pieceNotification").delay(3000).fadeOut()
}

function useBonusPiece(piece, target) {
    send("USE_BONUS_PIECE", {piece: piece, square: target})
    usedSparePiece();
}

let counter = 0
function startTimer() {
    counter = 15
    count()
}

function count(){
    if (counter > 0) {
      counter--
      setTimeout(count, 1000)
    }else{
      counter = 15
      setTimeout(count, 1000)
    }
    $("#timer").css("--value", counter)
  }

function showConnectedModal() {
    status = "ON_WAITING_LIST";
    alert("You are now in the waiting list!")
    showOrHideDiv("WaitingList");
    // todo show modal
    // todo change "play" button to "start"
    // $('#waitlist_modal')[0].checked = true;

    // send("START_GAME") // temp for testing
}

function hideConnectedModal() {
    status = "IN_GAME";
    alert("You are now in the game!")
    // $('#waitlist_modal')[0].checked = false;
}

function connect() {
    if(status === "CONNECTING") {
        send("CONNECT_REQUEST")
    } else if(status === "ON_WAITING_LIST") {
        send("START_GAME")
    }
}

function sendMove(move) {
    console.log("Sending Move: " + move)
    send("PLAYER_MOVE", {move: move})
}

startTimer()

// TEMP
window.start = () => startGame(board)
