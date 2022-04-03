var board = null
var game = new Chess()
var $status = $('#status')
var $fen = $('#fen')
var $pgn = $('#pgn')

function onDragStart (source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false
  if(status !== "IN_GAME") return false;

  // only pick up pieces for the white side
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false
  }
}

function onDrop (source, target, piece) {
  console.log(piece[1], target)
  if(target === "offboard") return "snapback";
  if (source === "spare") {
    useBonusPiece(piece[1], target)
    game.turn()
    return
  }

  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  })

  // illegal move
  if (move === null) return 'snapback'

  updateStatus()
  sendMove(source + target)
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
  board.position(game.fen(), true)
}

function updateStatus () {
  var status = ''

  var moveColor = 'White'
  if (game.turn() === 'b') {
    moveColor = 'Black'
  }

  // checkmate?
  if (game.in_checkmate()) {
    status = 'Game over, ' + moveColor + ' is in checkmate.'
  }

  // draw?
  else if (game.in_draw()) {
    status = 'Game over, drawn position'
  }

  // game still on
  else {
    status = moveColor + ' to move'

    // check?
    if (game.in_check()) {
      status += ', ' + moveColor + ' is in check'
    }
  }

  $status.html(status)
  $fen.html(game.fen())
  $pgn.html(game.pgn())
}

var config = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
  sparePieces: true,
  pieceTheme: 'img/chesspieces/wikipedia/{piece}.png',
}
board = Chessboard('board', config)
$(window).resize(board.resize)

board0 = Chessboard('board0', {...config, draggable: false, showNotation: false})
board2 = Chessboard('board2', {...config, draggable: false, showNotation: false})
$(window).resize(board0.resize)
$(window).resize(board2.resize)
document.getElementById("HowToPlay").style.display = "none";
document.getElementById("WaitingList").style.display = "none";

initSpareDiv();
updateStatus()

function showOrHideDiv(elementID) {
  let v = document.getElementById(elementID);
  if (v.style.display === "none") {
    v.style.display = "block";
  } else {
    v.style.display = "none";
  }
}
