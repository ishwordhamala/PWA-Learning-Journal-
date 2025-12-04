
const quoteButton = document.getElementById("load-quote");
const quoteText = document.getElementById("quote-text");

if (quoteButton && quoteText) {
  quoteButton.addEventListener("click", async () => {
    quoteText.textContent = "Loading quote...";

    try {
      const response = await fetch("https://api.quotable.io/random");
      if (!response.ok) throw new Error("Network error");
      const data = await response.json();

      quoteText.textContent = `"${data.content}" — ${data.author}`;
    } catch (error) {
      console.error(error);
      quoteText.textContent = "Sorry, could not load a quote right now.";
    }
  });
}
