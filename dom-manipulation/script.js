document.addEventListener("DOMContentLoaded", () => {
    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteBtn = document.getElementById("newQuote");
    const exportBtn = document.getElementById("exportJson");
    const importFileInput = document.getElementById("importFile");
    const categoryFilter = document.getElementById("categoryFilter");

    // Array of quotes
    let quotes = JSON.parse(localStorage.getItem("quotes")) || [
        { text: "The best way to predict the future is to invent it.", category: "Motivation" },
        { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Inspiration" },
        { text: "Happiness depends upon ourselves.", category: "Happiness" },
        { text: "Your time is limited, so don’t waste it living someone else’s life.", category: "Life" }
    ];

    function saveQuotes() {
        localStorage.setItem("quotes", JSON.stringify(quotes));
        populateCategories();
    }

    function populateCategories() {
        if (!categoryFilter) return;
        
        // Clear existing options
        categoryFilter.innerHTML = "";

        // Add 'All' option
        const allOption = document.createElement("option");
        allOption.value = "all";
        allOption.textContent = "All Categories";
        categoryFilter.appendChild(allOption);

        // Get unique categories from quotes
        const categories = [...new Set(quotes.map(q => q.category))]
        console.log("Categories found:", categories); 

        // Create dropdown options
        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        })

        // Restore last selected filter
        const lastFilter = localStorage.getItem("selectedCategory") || "all";
        categoryFilter.value = lastFilter;
    }

    function filterQuotes() {
        const selectedCategory = categoryFilter.value;
        localStorage.setItem("selectedCategory", selectedCategory);

        let filteredQuotes = selectedCategory === "all"
            ? quotes
            : quotes.filter(q => q.category === selectedCategory);

        if (filteredQuotes.length === 0) {
            categoryFilter.value = "all";
            localStorage.setItem("selectedCategory", "all");
            showRandomQuote();
        } else {
            displayQuote(getRandomQuote(filteredQuotes));
        }
    }

    function getRandomQuote(filteredQuotes) {
        if (filteredQuotes.length === 0) {
            return null;
        }
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        return filteredQuotes[randomIndex];
    }
    
    function displayQuote(quote) {
        quoteDisplay.innerHTML = quote
            ? `<p><strong>${quote.category}:</strong> "${quote.text}"</p>`
            : "No quotes available.";
    }

    function showRandomQuote() {
        const selectedCategory = categoryFilter.value;
        let filteredQuotes = selectedCategory === "all"
            ? quotes
            : quotes.filter(q => q.category === selectedCategory);

        displayQuote(getRandomQuote(filteredQuotes));
    }

    // newQuoteBtn.addEventListener("click", showRandomQuote);

    function restoreLastViewedQuote() {
        const lastQuote = JSON.parse(sessionStorage.getItem("lastViewedQuote"));
        if (lastQuote) {
            displayQuote(lastQuote);
        }
    }

    function addQuote() {
        const newQuoteText = document.getElementById("newQuoteText").value.trim();
        const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

        if (!newQuoteText || !newQuoteCategory) {
            alert("Please enter both a quote and a category.");
            return;
        }

        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        quotes.push(newQuote);
        saveQuotes();

        // Post to the server
        postQuoteToServer(newQuote);

        // UI Update
        showRandomQuote();

        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";
        // alert("New quote added successfully");
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
    restoreLastViewedQuote();
    populateCategories();

    categoryFilter.addEventListener("change", filterQuotes);
    newQuoteBtn.addEventListener("click", showRandomQuote);
    exportBtn.addEventListener("click", exportToJsonFile);
    importFileInput.addEventListener("change", importFromJsonFile);

    async function fetchQuotesFromServer() {
        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/posts");
            let serverQuotes = await response.json();
            
            // Convert to match the app's structure
            serverQuotes = serverQuotes.map(q => ({ text: q.title, category: "General", id: q.id }));
    
            console.log("Fetched quotes from server:", serverQuotes);
    
            return serverQuotes;
        } catch (error) {
            console.error("Error fetching quotes:", error);
            return [];
        }
    }

    function postQuoteToServer(newQuote) {
        fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newQuote)
        })
        .then(response => response.json())
        .then(data => {
            console.log("Quote posted successfully:", data);
            alert("Quote added and synced with server!");
        })
        .catch(error => {
            console.error("Error posting quote:", error);
        });
    }  
    
    async function syncQuotes() {
        const serverQuotes = await fetchQuotesFromServer();
        let localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
    
        // Conflict resolution: server data takes precedence
        let mergedQuotes = [...localQuotes, ...serverQuotes].filter(
            (q, index, self) =>
                index === self.findIndex((t) => t.text === q.text)
        );        
    
        localStorage.setItem("quotes", JSON.stringify(mergedQuotes));
    
        console.log("Data synced with server:", mergedQuotes);
        populateCategories();
    }

    function resolveConflicts(localQuotes, serverQuotes) {
        const localMap = new Map(localQuotes.map(q => [q.id, q]));
        const serverMap = new Map(serverQuotes.map(q => [q.id, q]));
    
        // Merge the data, prioritizing server changes
        serverMap.forEach((serverQuote, id) => {
            if (localMap.has(id)) {
                const localQuote = localMap.get(id);
                
                if (serverQuote.text !== localQuote.text) {
                    console.warn(`Conflict detected for quote ID ${id}: Using server version.`);
                }
            }
            localMap.set(id, serverQuote);
        });
    
        return Array.from(localMap.values());
    }

    function notifyUser(message) {
        const notification = document.createElement("div");
        notification.classList.add("notification");
        notification.textContent = message;
    
        document.body.appendChild(notification);
    
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }
    
    notifyUser("Quotes synced with server!");

    setInterval(syncQuotes, 30000);
});