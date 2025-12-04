from flask import Flask, jsonify, request
from pathlib import Path
import json
from datetime import datetime

app = Flask(__name__)

DATA_FILE = Path(__file__).with_name("reflections.json")


def load_reflections():
    if not DATA_FILE.exists():
        return []
    try:
        with DATA_FILE.open("r", encoding="utf-8") as f:
            return json.load(f)
    except json.JSONDecodeError:
        return []


def save_reflections(reflections):
    with DATA_FILE.open("w", encoding="utf-8") as f:
        json.dump(reflections, f, indent=2)


@app.route("/")
def home():

    return "Learning Journal Flask backend is running."


@app.route("/api/reflections", methods=["GET"])
def get_reflections():
    """
    Return all reflections as JSON.
    Optional query: ?week=3 to filter by week.
    """
    reflections = load_reflections()
    week = request.args.get("week")

    if week:
        reflections = [r for r in reflections if str(r.get("week")) == str(week)]

    return jsonify(reflections)


@app.route("/api/reflections", methods=["POST"])
def add_reflection():
    """
    Add a new reflection sent from the frontend.
    Expected JSON body: { "week": "5", "title": "...", "content": "..." }
    """
    data = request.get_json(silent=True) or {}

    week = data.get("week")
    title = data.get("title")
    content = data.get("content")

    if not (week and title and content):
        return jsonify({"error": "week, title and content are required"}), 400

    reflections = load_reflections()

    new_entry = {
        "week": str(week),
        "title": title,
        "content": content,
        "date": datetime.now().isoformat(timespec="seconds")
    }

    reflections.append(new_entry)
    save_reflections(reflections)

    return jsonify(new_entry), 201


@app.route("/api/reflections/<int:index>", methods=["DELETE"])
def delete_reflection(index):
    """
    Extra Week 6 feature: delete a reflection by index.
    """
    reflections = load_reflections()

    if index < 0 or index >= len(reflections):
        return jsonify({"error": "Index out of range"}), 404

    deleted = reflections.pop(index)
    save_reflections(reflections)

    return jsonify({"deleted": deleted, "remaining": len(reflections)}), 200


if __name__ == "__main__":
    app.run()
