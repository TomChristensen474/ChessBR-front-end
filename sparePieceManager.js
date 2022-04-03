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

}

let addSparePiece = (piece) => {
    let sparePieceDiv = sparePieces[piece];
    sparePiecesDiv.appendChild(sparePieceDiv.cloneNode());
}

let usedSparePiece = () => {
    sparePiecesDiv.removeChild(sparePiecesDiv.children[0]);
}


