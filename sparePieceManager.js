let sparePiecesDiv;
let sparePieces = {};

let initSpareDiv = () => {
    let middleBoard = document.getElementsByClassName("chessboard-63f37")[1]; // will this class change after each chessboardjs update?
    sparePiecesDiv = middleBoard.children[2];
    sparePieces['wK'] = sparePiecesDiv.children[0];
    sparePieces['wQ'] = sparePiecesDiv.children[1];
    sparePieces['wR'] = sparePiecesDiv.children[2];
    sparePieces['wB'] = sparePiecesDiv.children[3];
    sparePieces['wN'] = sparePiecesDiv.children[4];
    sparePieces['wP'] = sparePiecesDiv.children[5];

    for(const sparePieceDiv of Object.values(sparePieces)) {
        // sparePieceDiv.style.display = 'none';
        sparePiecesDiv.removeChild(sparePieceDiv);
    }

    // remove spare pieces of other boards
    let leftBoard = document.getElementsByClassName("chessboard-63f37")[0];
    leftBoard.removeChild(leftBoard.children[2]);
    let rightBoard = document.getElementsByClassName("chessboard-63f37")[2];
    rightBoard.removeChild(rightBoard.children[2]);
}

let addSparePiece = (piece) => {
    if(piece.startsWith('b')) return;
    let sparePieceDiv = sparePieces[piece];
    sparePiecesDiv.appendChild(sparePieceDiv.cloneNode());
}

let usedSparePiece = () => {
    sparePiecesDiv.removeChild(sparePiecesDiv.children[0]);
}


