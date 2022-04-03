const ws = new WebSocket("ws://192.168.1.206:8765");
// const ws = new WebSocket("ws://localhost:8765");

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
            updateBoard(board, data.newFen)
            break;

        case "BOT_MOVE":
            doMove(board, data.move);
            updateBoard(board, data.newFen)
            break;

        case "BOT_USE_BONUS":
            // data.square and data.piece is also sent
            updateBoard(board, data.fen)
            // todo remove bot bonus piece from ui
            break;

        case "NEIGHBOUR_MOVE":
            if (data.neighbour === 1) {
                updateBoard(board0, data.newFen)
            } else {
                updateBoard(board2, data.newFen)
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
            // data.player_won, data.reason, data.position (what place the player got)
            gameOver(board)
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

function updateBoard(board, FENstring) {
    board.position(FENstring, true)
    game.load(FENstring);
}

function startGame(board) {
    // showOrHideDiv("WaitingList");
    board.start()
}

function updatePlayerCount(playerCount) {
    $('#playerCount').html("Player Count: " + playerCount)
}

function gameOver(board) {
    board.draggable = false
}

function notifyBonusPiece(piece) {
    $("#pieceNotificationText").html("You have received a piece: " + piece)
    $("#pieceNotification").fadeIn()
    $("#pieceNotification").delay(3000).fadeOut()
}

function useBonusPiece(piece, target) {
    send("USE_BONUS_PIECE", {piece: piece, target: target})
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
    alert("You are now in the waiting list!")
    showOrHideDiv("WaitingList")
    // todo show modal
    // todo change "play" button to "start"
    // $('#waitlist_modal')[0].checked = true;

    send("START_GAME") // temp for testing
}

function hideConnectedModal() {
    alert("You are now in the game!")
    // $('#waitlist_modal')[0].checked = false;
}

function connect() {
    console.log("connecting")
    send("CONNECT_REQUEST")
}

function sendMove(move) {
    console.log("Sending Move: " + move)
    send("PLAYER_MOVE", {move: move})
}

startTimer()

// TEMP
window.start = () => startGame(board)
