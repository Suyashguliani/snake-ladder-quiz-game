const player = document.getElementById("player");
const modal = document.getElementById("questionModal");
const questionText = document.getElementById("questionText");
const status = document.getElementById("status");

let position = 1;

function getXY(pos) {
  const cellSize = 51.2;  // Size of each square
  const boardSize = 512;  // Board size
  
  let row = Math.floor((pos - 1) / 10);
  let col = (pos - 1) % 10;

  // Handle zigzag direction for the Snake and Ladder board
  if (row % 2 === 1) {
    col = 9 - col;
  }

  // Calculate x and y position based on cell size and row/column
  let x = col * cellSize;
  let y = (boardSize - cellSize) - (row * cellSize);  // Adjust the Y position for the correct orientation

  return [x, y];
}

// Function to move the player and adjust the camera view
function movePlayer(pos) {
  const [x, y] = getXY(pos);

  // Move the player to the correct position
  player.style.left = `${x}px`;
  player.style.top = `${y}px`;

  // Move the board with the player (effectively the "camera")
  const board = document.getElementById("board");
  board.scrollLeft = x - 256; // Centers the player horizontally in the view
  board.scrollTop = y - 256;  // Centers the player vertically in the view
}

function showQuestion() {
  fetch('/get_question')
    .then(res => res.json())
    .then(data => {
      questionText.textContent = data.question;
      document.getElementById("answerInput").value = "";
      modal.style.display = "block";
    });
}

function hideModal() {
  modal.style.display = "none";
}

function submitAnswer() {
  const answer = document.getElementById("answerInput").value;

  fetch("/submit_answer", {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ answer: answer })
  })
  .then(res => res.json())
  .then(data => {
    hideModal();
    position = data.new_position;
    movePlayer(position);
    status.innerHTML = data.message;

    if (data.win) {
      alert("🎉 You reached 100 and won the game!");
    } else {
      setTimeout(showQuestion, 500); // Automatically show next question
    }
  });
}

// On page load
document.addEventListener("DOMContentLoaded", () => {
  movePlayer(position);
  showQuestion();  // Automatically ask first question
});
