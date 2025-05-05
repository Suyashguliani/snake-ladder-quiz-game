let position = 1;
let player = document.getElementById("player");
let board = document.getElementById("board");
let status = document.getElementById("status");
const modal = document.getElementById("questionModal");
const questionText = document.getElementById("questionText");

// Draw board squares
for (let i = 100; i > 0; i--) {
  let cell = document.createElement("div");
  cell.textContent = i;
  board.appendChild(cell);
}

// Convert board position to screen (x, y) coordinates
function getXY(pos) {
  const cellSize = 51.2; // Each square size
  const boardSize = 512;

  let row = Math.floor((pos - 1) / 10);
  let col = (pos - 1) % 10;

  // Zigzag layout
  if (row % 2 === 1) {
    col = 9 - col;
  }

  let x = col * cellSize;
  let y = (boardSize - cellSize) - (row * cellSize);

  return [x, y];
}

// Move player to new board position
function movePlayer(pos) {
  const [x, y] = getXY(pos);
  player.style.left = `${x}px`;
  player.style.top = `${y}px`;
}

// Show the question modal
function showQuestion() {
  fetch('/get_question')
    .then(res => res.json())
    .then(data => {
      questionText.textContent = data.question;
      document.getElementById("answerInput").value = "";
      modal.style.display = "block";
    });
}

// Hide question modal
function hideModal() {
  modal.style.display = "none";
}

// Handle answer submission
function submitAnswer() {
  const answer = document.getElementById("answerInput").value;
  fetch("/submit_answer", {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({answer: answer})
  })
  .then(res => res.json())
  .then(data => {
    hideModal();
    position = data.new_position;
    movePlayer(position); // Correctly move the player
    status.innerHTML = data.message;

    if (data.win) {
      alert("🎉 You reached 100 and won the game!");
    } else {
      showQuestion(); // Automatically trigger next question
    }
  });
}

// Initial load
document.addEventListener('DOMContentLoaded', () => {
  movePlayer(position);
  showQuestion(); // Show first question automatically
});
