const ws = new WebSocket("wss://demo.piesocket.com/v3/channel_1?api_key=oCdCMcMPQpbvNjUIzqtvF1d2X2okWpDQj4AwARJuAgtjhzKxVEjQU6IdCjwm&notify_self")

ws.onmessage = (message) => {

    switch(message.type) {
        case "CONNECTED":
            // code block
            break;

        case "GAME_STARTED":
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
    board.position(FENstring, false)
}

function startGame(board) {
    board.start
}

function updatePlayerCount(playerCount) {
    console.log(playerCount)
}

function gameOver(board) {
    board.draggable = false
}

function notifyBonusPiece(piece) {

}

