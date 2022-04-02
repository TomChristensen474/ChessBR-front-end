const ws = new WebSocket("ws://192.168.1.206:8765")

ws.onmessage = (message) => {
    message = JSON.parse(message.data)
    console.log(message)
    switch(message.type) {
        case "CONNECTED":
            showConnectedModal()
            break;

        case "GAME_STARTED":
            hideConnectedModal()
            startGame(board)
            break;

        case "BOARD_FEN_ACK":
            updateBoard(board, message.data)
            break;

        case "BOT_MOVE":
            updateBoard(board, message.data)
            break;

        case "NEIGHBOUR_MOVE":
            if (message.data.board === "board1") {
                updateBoard(board0, message.data)
            } else {
                updateBoard(board2, message.data)
            }
            break;

        case "BONUS_PIECE":
            notifyBonusPiece(message.data)
            break;

        case "UPDATE_PLAYER_COUNT":
            updatePlayerCount(message.data)
            break;

        case "GAME_OVER":
            gameOver(board)
            break; 

        default:
            console.error(message)
      }

}

function updateBoard(board, FENstring) {
    board.position(FENstring, true)
}

function startGame(board) {
    board.start
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
    ws.send(JSON.stringify({type: "USE_BONUS_PIECE", data: {piece: piece, target: target}}))
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
    $('#waitlist_modal')[0].checked = true;
}

function hideConnectedModal() {
    $('#waitlist_modal')[0].checked = false;
}

function connect() {
    console.log("connecting")
    ws.send(JSON.stringify({type: "CONNECT_REQUEST", data: []}))
}

function sendMove(move) {
    console.log("Sending Move: " + move)
    ws.send(JSON.stringify({type: "PLAYER_MOVE", data: {move: move}}))
}

startTimer()
