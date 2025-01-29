document.addEventListener("DOMContentLoaded", () => {
    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteBtn = document.getElementById("newQuote");
    const exportBtn = document.getElementById("exportJson");
    const importFileInput = document.getElementById("importFile");

    // Array of quotes
    let quotes = JSON.parse(localStorage.getItem("quotes")) || [
        { text: "The best way to predict the future is to invent it.", category: "Motivation" },
        { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Inspiration" },
        { text: "Happiness depends upon ourselves.", category: "Happiness" },
        { text: "Your time is limited, so don’t waste it living someone else’s life.", category: "Life" }
    ];

    function saveQuotes() {
        localStorage.setItem("quotes", JSON.stringify(quotes));
    }

    function showRandomQuote() {
        if (quotes.length === 0) {
            quoteDisplay.innerHTML = "No quotes available. Add a new one.";
            return;
        }
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[randomIndex];
        quoteDisplay.innerHTML = `<p><strong>${quote.category}:</strong> "${quote.text}"</p>`;

        // Save the last viewed quote in session storage
        sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
    }

    // newQuoteBtn.addEventListener("click", showRandomQuote);

    function restoreLastViewedQuote() {
        const lastQuote = JSON.parse(sessionStorage.getItem("lastViewedQuote"));
        if (lastQuote) {
            quoteDisplay.innerHTML = `<p><strong>${lastQuote.category}:</strong> "${lastQuote.text}"</p>`;
        }
    }

    function addQuote() {
        const newQuoteText = document.getElementById("newQuoteText").value.trim();
        const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

        if (newQuoteText === "" || newQuoteCategory === "") {
            alert("Please enter both a new quote and a category.");
            return;
        }

        quotes.push({ text: newQuoteText, category: newQuoteCategory });
        saveQuotes();

        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";
        alert("New quote added successfully");
    }

    function exportToJsonFile() {
        const dataStr = JSON.stringify(quotes, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement("a");
        a.href = url;
        a.download = "quotes.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function importFromJsonFile(event) {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
          const importedQuotes = JSON.parse(event.target.result);
          quotes.push(...importedQuotes);
          saveQuotes();
          alert('Quotes imported successfully!');
        };
        fileReader.readAsText(event.target.files[0]);
    }

    function createAddQuoteForm() {
        const formContainer = document.createElement("div");
    
        // Input for new quote text
        const quoteInput = document.createElement("input");
        quoteInput.id = "newQuoteText";
        quoteInput.type = "text";
        quoteInput.placeholder = "Enter a new quote";
    
        // Input for new quote category
        const categoryInput = document.createElement("input");
        categoryInput.id = "newQuoteCategory";
        categoryInput.type = "text";
        categoryInput.placeholder = "Enter quote category";
    
        // Button to add quote
        const addButton = document.createElement("button");
        addButton.id = "addQuoteBtn";
        addButton.textContent = "Add Quote";
    
        // Append elements to form container
        formContainer.appendChild(quoteInput);
        formContainer.appendChild(categoryInput);
        formContainer.appendChild(addButton);
    
        // Append form to the body or a specific container
        document.body.appendChild(formContainer);

        addButton.addEventListener("click", addQuote)
    }
    
    createAddQuoteForm();
    restoreLastViewedQuote()

    newQuoteBtn.addEventListener("click", showRandomQuote);
    exportBtn.addEventListener("click", exportToJsonFile);
    importFileInput.addEventListener("change", importFromJsonFile);
});