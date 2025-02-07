const GameBoard = (function() {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;
    const placeMarker = (index, marker) => {
        if (board[index] === "") {
            board[index] = marker;
            return true;
        }
        return false;
    };

    const resetBoard = () => {
        board.fill(""); // Ispravljeno resetiranje ploče
    };

    return { getBoard, placeMarker, resetBoard };
})();

const Player = (name, marker) => {
    return { name, marker };
};

const GameController = (function() {
    let player1, player2, currentPlayer;

    const startGame = (name1 = "Player 1", name2 = "Player 2") => {
        player1 = Player(name1, "X");
        player2 = Player(name2, "O");
        currentPlayer = player1;
        GameBoard.resetBoard();
        DisplayController.renderBoard();  // Ažuriranje DOM-a
        DisplayController.setMessage(`${currentPlayer.name}'s turn`);
    };

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const checkWinner = () => {
        const board = GameBoard.getBoard();
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (let pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return currentPlayer.name;
            }
        }

        return board.includes("") ? null : "Draw";
    };

    const playRound = (index) => {
        if (GameBoard.placeMarker(index, currentPlayer.marker)) {
            DisplayController.renderBoard(); // Ažuriraj prikaz ploče
            let winner = checkWinner();
            if (winner) {
                DisplayController.setMessage(winner === "Draw" ? "It's a draw!" : `${winner} wins!`);
                return;
            }
            switchPlayer();
            DisplayController.setMessage(`${currentPlayer.name}'s turn`);
        } else {
            DisplayController.setMessage("Invalid move, try again.");
        }
    };

    return { startGame, playRound };
})();

const DisplayController = (function() {
    const boardContainer = document.getElementById("gameboard");
    const messageElement = document.getElementById("message");

    const renderBoard = () => {
        boardContainer.innerHTML = "";
        GameBoard.getBoard().forEach((cell, index) => {
            const cellElement = document.createElement("div");
            cellElement.classList.add("cell");
            cellElement.textContent = cell;
            cellElement.addEventListener("click", () => GameController.playRound(index));
            boardContainer.appendChild(cellElement);
        });
    };

    const setMessage = (message) => {
        messageElement.textContent = message;
    };

    document.getElementById("start-game").addEventListener("click", () => {
        GameController.startGame();
    });

    document.getElementById("restart-game").addEventListener("click", () => {
        GameController.startGame();
    });

    return { renderBoard, setMessage };
})();
