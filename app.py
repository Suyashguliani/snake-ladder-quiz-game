# app.py
from flask import Flask, render_template, request, redirect, session, jsonify
import random

app = Flask(__name__)
app.secret_key = "secret123"

snakes = {16: 7, 59: 17, 67: 30, 63: 19, 93: 69, 87: 24, 95: 75, 99: 77}
ladders = {9: 27, 18: 37, 28:51, 25: 54, 56: 64, 68: 88, 76: 97, 79: 100}

questions = [
    {"question": "What is 2 + 2?", "answer": "4"},
    {"question": "Capital of France?", "answer": "Paris"},
    {"question": "Color of the sky?", "answer": "Blue"},
    {"question": "10 / 2 = ?", "answer": "5"},
    {"question": "Python is a ___ language?", "answer": "programming"},
]

@app.route('/')
def index():
    session['position'] = 1   # Changed from 0 to 1
    return render_template('index.html')


@app.route('/game')
def game():
    return render_template('game.html')

@app.route('/get_question')
def get_question():
    q = random.choice(questions)
    session['current_answer'] = q['answer'].lower()
    return jsonify({"question": q["question"]})

@app.route('/submit_answer', methods=['POST'])
def submit_answer():
    data = request.json
    user_ans = data['answer'].strip().lower()
    position = session.get('position', 0)
    correct = user_ans == session.get('current_answer', '')

    result = {
        "correct": correct,
        "rolled": 0,
        "old_position": position,
        "new_position": position,
        "message": ""
    }

    if correct:
        roll = random.randint(1, 6)
        position += roll
        result["rolled"] = roll
        result["message"] += f"Correct! You rolled a {roll}. "

        if position in snakes:
            result["message"] += f"Oh no, a snake! Down to {snakes[position]}."
            position = snakes[position]
        elif position in ladders:
            result["message"] += f"Ladder up! Climb to {ladders[position]}."
            position = ladders[position]
    else:
        result["message"] = "Wrong answer! No movement."

    result["new_position"] = position
    session["position"] = position

    if position >= 100:
        result["message"] += " 🎉 You win!"
        result["win"] = True

    return jsonify(result)

if __name__ == '__main__':
    print("Flask app starting...")
    app.run(debug=True)
