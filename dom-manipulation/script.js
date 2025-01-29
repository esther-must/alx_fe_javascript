document.addEventListener("DOMContentLoaded", () => {
    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteBtn = document.getElementById("newQuote");

    // Array of quotes
    const quotes = [
        { text: "The best way to predict the future is to invent it.", category: "Motivation" },
        { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Inspiration" },
        { text: "Happiness depends upon ourselves.", category: "Happiness" },
        { text: "Your time is limited, so don’t waste it living someone else’s life.", category: "Life" }
    ];

    function showRandomQuote() {
        if (quotes.length === 0) {
            quoteDisplay.innerHTML = "No quotes available. Add a new one.";
            return;
        }
        const randomIndex = Math.floor(Math.random() * quotes.length);
        quoteDisplay.innerHTML = `<p><strong>${quotes[randomIndex].category}:</strong> "${quotes[randomIndex].text}"</p>`;
    }

    newQuoteBtn.addEventListener("click", showRandomQuote);

    function addQuote() {
        const newQuoteText = document.getElementById("newQuoteText").value.trim();
        const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

        if (newQuoteText === "" || newQuoteCategory === "") {
            alert("Please enter both a new quote and a category.");
            return;
        }

        quotes.push({ text: newQuoteText, category: newQuoteCategory });
        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";
        alert("New quote added successfully");
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
})