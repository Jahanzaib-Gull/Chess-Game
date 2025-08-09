# ♟️ Real-Time Multiplayer Chess

## 🌐 Live Demo  
  https://chess-game-pzdz.onrender.com

## ✨ Features

### Gameplay
- 🎮 **2-player online chess** with role assignment (White/Black)
- 👁️ **Spectator mode** for additional viewers
- ♟️ **Full chess rules** with move validation
- 🔄 **Auto-flipped board** for Black player
- ⏳ **Turn indicators** with visual styling

### Technical
- 💻 **Real-time sync** using Socket.IO
- ✅ **Move validation** via chess.js
- 📶 **Connection handling** (disconnect/reconnect)
- 🏁 **Game end detection** (checkmate, stalemate)
- 🔄 **Auto-reset** after game completion

## 🛠️ Technologies

| Component       | Technology          | Purpose                          |
|----------------|--------------------|----------------------------------|
| **Backend**    | Node.js + Express  | Server infrastructure           |
| **Real-time**  | Socket.IO v4.8     | Live gameplay synchronization   |
| **Game Logic** | chess.js v1.4      | Move validation & game state    |
| **Frontend**   | Vanilla JS         | Drag-and-drop interface         |
| **Templating** | EJS v3.1           | Dynamic HTML rendering          |

## 🚀 Installation

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/chess-game.git
cd chess-game
```
### 2. Install Dependencies
```bash
npm install
```
### 3. Start Server
```bash
npm start
# Or for development with auto-reload:
npx nodemon app.js
```
### 4. Access Game
```bash
http://localhost:3000
```
