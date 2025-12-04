import json
from datetime import datetime
from pathlib import Path


DATA_FILE = Path(__file__).with_name("reflections.json")


def load_reflections():
    """Load existing reflections from the JSON file."""
    if not DATA_FILE.exists():
        return []
    try:
        with DATA_FILE.open("r", encoding="utf-8") as f:
            return json.load(f)
    except json.JSONDecodeError:
       
        return []


def save_reflections(reflections):
    """Save the reflections list back to the JSON file."""
    with DATA_FILE.open("w", encoding="utf-8") as f:
        json.dump(reflections, f, indent=2)


def main():
    print("Add a new reflection to reflections.json")
    week = input("Week number (1–14): ").strip()
    title = input("Title: ").strip()
    content = input("Reflection text: ").strip()

    if not week or not title or not content:
        print("All fields are required. Reflection not saved.")
        return

    reflection = {
        "week": week,
        "title": title,
        "content": content,
        "date": datetime.now().isoformat(timespec="seconds")
    }

    reflections = load_reflections()
    reflections.append(reflection)
    save_reflections(reflections)

    print("Reflection saved successfully!")


if __name__ == "__main__":
    main()
