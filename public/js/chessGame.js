const socket = io();
const chess = new Chess()
const boardElement = document.querySelector(".chessboard")
const statusElement = document.querySelector("#status")
const roleMessageElement = document.querySelector("#role-message")

let draggedPiece = null
let sourceSquare = null
let playerRole = null

const renderBoard = () => {
    const board = chess.board()
    boardElement.innerHTML = ""
    board.forEach((row, rowindex) => {
        row.forEach((square, squareindex) => {
            const squareElement = document.createElement("div")
            squareElement.classList.add("square",
                (rowindex + squareindex) % 2 === 0 ? "light" : "dark"
            )

            squareElement.dataset.row = rowindex
            squareElement.dataset.col = squareindex

            if (square) {
                const pieceElement = document.createElement("div")
                pieceElement.classList.add("piece",
                    square.color === "w" ? "white" : "black"
                )

                pieceElement.innerText = getPieceUnicode(square)
                pieceElement.draggable = playerRole === square.color

                pieceElement.addEventListener("dragstart", (e) => {
                    if (pieceElement.draggable) {
                        draggedPiece = pieceElement
                        sourceSquare = { row: rowindex, col: squareindex }
                        e.dataTransfer.setData("text/plain", "")
                    }
                })

                pieceElement.addEventListener("dragend", (e) => {
                    draggedPiece = null
                    sourceSquare = null
                })

                squareElement.appendChild(pieceElement)
            }

            squareElement.addEventListener("dragover", function (e) {
                e.preventDefault()
            })

            squareElement.addEventListener("drop", function (e) {
                e.preventDefault()
                if (draggedPiece) {
                    const targetSource = {
                        row: parseInt(squareElement.dataset.row),
                        col: parseInt(squareElement.dataset.col)
                    }
                    handleMove(sourceSquare, targetSource)
                }
            })
            boardElement.appendChild(squareElement)
        })
    })
    if (playerRole === 'b') {
        boardElement.classList.add("flipped")
    }
    else {
        boardElement.classList.remove("flipped")
    }
}

const handleMove = (source, target) => {
    const move = {
        from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
        to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
        promotion: 'q'
    }
    socket.emit("move", move)
}

const getPieceUnicode = (piece) => {
    const unicodePieces = {
        p: "♙", r: "♜", n: "♞", b: "♝", q: "♛", k: "♚",
        P: "♙", R: "♖", N: "♘", B: "♗", Q: "♕", K: "♔"
    }
    const key = piece.color === "w" ? piece.type.toUpperCase() : piece.type
    return unicodePieces[key]
}

socket.on("playerRole", function (role) {
    playerRole = role
    renderBoard()
})

socket.on("spectatorRole", function () {
    playerRole = null
    renderBoard()
})

socket.on("boardState", function (fen) {
    chess.load(fen)
    renderBoard()
})

socket.on("turn", function (turn) {
    if (turn === "w") {
        statusElement.textContent = "⚪ White's Turn"
        statusElement.className = "mt-4 text-center text-2xl font-bold text-white"
    } else {
        statusElement.textContent = "⚫ Black's Turn"
        statusElement.className = "mt-4 text-center text-2xl font-bold text-black bg-white px-4 py-1 inline-block rounded"
    }
})

socket.on("roleMessage", function (msg) {
    const roleBanner = document.createElement("div")
    roleBanner.textContent = msg
    roleBanner.className = "fixed top-4 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black px-6 py-2 rounded-lg shadow-lg text-lg font-bold"
    document.body.appendChild(roleBanner)

    setTimeout(() => roleBanner.remove(), 4000)
})


socket.on("gameEnd", (message) => {
    const status = document.getElementById("status");
    status.textContent = message;
    status.className = "mt-4 text-center text-3xl font-bold text-red-500";
});

socket.on("redirectHome", () => {
    window.location.href = "/";
});



renderBoard()
