// import request function from node.js http module
const { request } = require('http');
// import readline from readline module
const readline = require('readline');
// import file system to write and read
const fs = require('fs');
const path = require('path');

// url for API call
const url = 'https://gutendex.com/books/?search=';

//File path for saving the database
const databaseFilePath = path.join(__dirname, 'database.json');

// Function to read the database from a file
function readDatabase() {
    try {
        const data = fs.readFileSync(databaseFilePath, 'utf8');
        const parsedData = new Map(Object.entries(JSON.parse(data)));
        console.log("Database loaded:", parsedData);
        return parsedData;
    } catch (error) {
        console.log("Error reading database:", error);
        return new Map(); // Return an empty Map if the file doesn't exist or an error occurs
    }
}


// Function to write the database to a file

function writeDatabase(database) {
    console.log("Attempting to write database...");
    try {
        fs.writeFileSync(databaseFilePath, JSON.stringify(Object.fromEntries(database), null, 2), 'utf8');
        console.log("Database written successfully.");
    } catch (error) {
        console.error("Error writing database:", error);
    }
}



// function to create interface to handle user input and output
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Initialize the database from the file
let database = readDatabase();

//database.set('chotan', [5603]);

// Function to ask for a username and add to the "database"
// chatgpt implementation
function askForUsername(database) {
    rl.question("Please enter your username: ", (userName) => {
        // Check if the username exists in the "database" (Map)
        if (!database.has(userName)) {
            // If the username doesn't exist, add it with an empty array of 10 elements
            database.set(userName, []); // empty slots of an array
            console.log(`Username "${userName}" added with an empty list of 10 elements.`);
	    // save the database
	    writeDatabase(database);
        } else {
            // If the username exists, just inform the user
            console.log(`Username "${userName}" already exists in the database.`);
        }

        // call the menuOptions to open the program
	menuOptions(userName, database);

    });
}

// open the interface
askForUsername(database);

// function to prompt the user to select a menu from different options
//call function related to the user's option
/*
async function menuOptions(userName, database) {
    while (true) {
        console.log(`Welcome ${userName}`);
        console.log("Main Menu");
        console.log("Please select an option:");
        console.log("1. Search for a book");
        console.log("2. Use id to find book");
        console.log("3. Look at last 10 books");

        const answer = await new Promise((resolve) => {
            rl.question("Select the number that you would like to do: ", resolve);
        });

        if (answer == 1) {
            askQuestion(userName, database);
        } else if (answer == 2) {
            askForId(userName, database);
        } else if (answer == 3) {
            tenLastBooks(userName, database);
        } else {
            console.log("Invalid option, please select again.");
        }
    }
}
*/

async function menuOptions(userName, database) {
    console.log("Main Menu")
    console.log("Please select an option:")
    console.log("1. Search for a book")
    console.log("2. Use id to find book (use this only if you already know the book id)")
    console.log("3. Look at last 10 books")
    console.log("4. Exit")
    return rl.question("Select the number that you would like to do: ", 
        (answer) =>{
            if (answer == 1){
                askQuestion()
            }
            else if (answer == 2){
                askForId(userName, database)
            }
            else if (answer == 3){
                tenLastBooks(userName, database)
            }
            else if (answer == 4){
                console.log("Exiting")
                rl.close();
            }
            else{
                console.log("Please input the number you would like to select \n")
                menuOptions(userName, database)
            }

        })
    
}


// function to get keyword for searching book 
async function askQuestion(userName, database){
    return rl.question("What would you like to search for? ", 
        str => {
        console.log(`You searched for: ${str} \n`);
        // call getData to print out the detail findings giving user input as argument
	getData(userName, str);
    });
};

// function to retrieve data upon API call with a keyword
async function getData(userName, str) {
    // put a request to get data
    const request = await fetch(url + str);
    // format the data into json format
    const json = await request.json();

    // looping over the list of data and print out by formatting into a string
    for (let i = 0; i < json.count && i < 32; ++i) {
        console.log(json.results[i].id,  ': ',  json.results[i].title,
             ' By ', json.results[i].authors.map((author) => author.name).join(", "),  '\n');
    }
    // call another function for next prompt
    askForId(userName, database);
};


// this function prompt user to provide an id; then run another function
// to find out the details about of the book id


async function askForId(userName, database) {
    return rl.question("What is the ID of the book you want to read? ", answer => {
        console.log(`You selected book ID: ${answer} \n`);

        // Get the user's current book list from the database (Map)
        let userBooks = database.get(userName);

        // Check if the user's book list exists
        if (userBooks) {
            // Push the book ID into the array of the user's book list
            if (userBooks.length >= 10) {
                userBooks.shift();  // remove the first item
                userBooks.push(answer);  // add the new one
            } else {
                userBooks.push(answer); // Add the new book ID
            }

            // Update the database with the modified list
            database.set(userName, userBooks);

            console.log(`Updated book list for ${userName}: ${userBooks.join(", ")}`);
        }

        // Write the updated database to the file
        writeDatabase(database);  // Ensure data is persisted in the file

        // Optionally, fetch the book's text after adding the ID to the list
        getBook(answer, userName, database);
    });
}



// this function another get request by fetching 
// data about a book in a text format
async function getBook(id, userName, database){
    // example link "https://www.gutenberg.org/ebooks/(id).txt.utf-8"
    const request = await fetch('https://www.gutenberg.org/ebooks/'+id+'.txt.utf-8');
    const text = await request.text();
    
//    console.log(text);
//    console.log(text.length)
    printWords(text, userName, database);
};

// function to format the print statements of the get query
// based on the book id
// use of regualar expression to format strings
async function printWords(text, userName, database) {
    // Step 1: Replace tab
    text = text.replace(/\t+/g, " ");
    // Step 2: Replace carriage return and line feeds (\r\n) with just newline (\n)
    text = text.replace(/\r\n/g, "\n"); // Normalize line endings
    // Step 3: Split text into paragraphs by detecting two or more consecutive newlines
    const textSplit = text.split(/\n\n+/);
    // Step 4: Clean up leading and trailing spaces from each paragraph
    const trimmedText = textSplit.map((paragraph) => paragraph.trim());
  
    // Output the cleaned paragraphs
    /*
    trimmedText.forEach((paragraph) => {
      console.log(paragraph);
    });
    */        
    // print first paragragh usually the title of book
    console.log("\x1b[90m" + textSplit[1] + "\x1b[0m");
    T = true
    x = 2
    // allow user input to read the next parapraph or exit the program
    // still need to finish as of 4/3/25 11:10AM
    while (T == true){
        const answer = await askQuestionWords("Type 'exit' to close the program or type 'next' to read the next paragraph: ");
        if (answer == "exit") {
            // return to main menu
            T = false;
            menuOptions(userName, database);
        }
        else if (answer == "next") {
            // change the color of the books text to grey and print the next paragraph 
            console.log("\n \x1b[90m" + textSplit[x] + "\x1b[0m" + "\n")
            x++;
        };
        }
        
  }

function askQuestionWords(query){
    return new Promise(resolve =>{
      rl.question(query, answer => {
        resolve(answer);
      });
    });
  }



// helper function to print ten mostly searched book of an user
async function getDataForTen(id) {
     const urlN = 'https://gutendex.com/books/';
    // put a request to get data
    const request = await fetch(urlN + id);
    // format the data into json format
    const json = await request.json();

    // looping over the list of data and print out by formatting into a string

    console.log(json.id,  ': ',  json.title);
};


//  function to print out list of the popular search
async function tenLastBooks(userName, database) {
    // Get the user's current book list from the database (Map)
    // Check if the username exists in the "database" (Map)
    if (database.has(userName)) {
        console.log("Database is not empty.");
        const  userBooks = database.get(userName);
	console.log(`length of book list: ${userBooks.length}`);

        // Check if the user has books in their list
        if (userBooks.length > 0) {
            for (let i = 0; i < userBooks.length; ++i) {
		let id = userBooks[i];
		console.log(typeof(id)+":"+id);
                try {
                    getDataForTen(id);
                } catch (error) {
                    console.error(`Error fetching or parsing data for book ID ${userBooks[i]}: ${error.message}`);
                }
            }
        } else {
            console.log("Your book list is still empty! Keep searching.");
            menuOptions(userName, database);  
        }
    } else {
        console.log(`No user found with the username: ${userName}`);
    }

    console.log("We're printing your data soon!");
}