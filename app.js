const express = require("express");
const socket = require("socket.io");
const http = require("http");
const { Chess } = require("chess.js");
const path = require("path");
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socket(server);

const chess = new Chess();
let players = { white: null, black: null };
let spectators = new Set();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/instructions", (req, res) => {
    res.render("instructions");
});

app.get("/game", (req, res) => {
    res.render("index");
});

function resetGame() {
    chess.reset();
    players = { white: null, black: null };
    spectators.clear();
}

function endGame(winnerColor) {
    let winnerText = winnerColor === "w" ? "White wins!" : "Black wins!";
    io.emit("gameEnd", winnerText);

    setTimeout(() => {
        resetGame();
        io.emit("redirectHome");
    }, 4000); // 4 seconds before redirect
}

io.on("connection", (socket) => {
    console.log("New connection:", socket.id);

    // Assign roles
    if (!players.white) {
        players.white = socket.id;
        socket.emit("playerRole", "w");
        socket.emit("roleMessage", "You play as White");
    } else if (!players.black) {
        players.black = socket.id;
        socket.emit("playerRole", "b");
        socket.emit("roleMessage", "You play as Black");
    } else {
        spectators.add(socket.id);
        socket.emit("spectatorRole");
        socket.emit("roleMessage", "You are a spectator");
    }

    // Handle moves
    socket.on("move", (move) => {
        try {
            if (chess.turn() === "w" && socket.id !== players.white) return;
            if (chess.turn() === "b" && socket.id !== players.black) return;

            const result = chess.move(move);
            if (result) {
                io.emit("move", move);
                io.emit("boardState", chess.fen());
                io.emit("turn", chess.turn());

                if (chess.isGameOver()) {
                    if (chess.isCheckmate()) {
                        endGame(chess.turn() === "w" ? "b" : "w"); // last mover wins
                    }
                }
            } else {
                socket.emit("invalidMove", move);
            }
        } catch (err) {
            console.error(err);
        }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        if (socket.id === players.white) {
            console.log("White disconnected");
            endGame("b");
        } else if (socket.id === players.black) {
            console.log("Black disconnected");
            endGame("w");
        } else {
            spectators.delete(socket.id);
            console.log("Spectator disconnected");
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});