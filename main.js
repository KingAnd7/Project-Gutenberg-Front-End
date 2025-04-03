const { request } = require('http');
const readline = require('readline');
const url = 'https://gutendex.com/books/?search=';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function menuOptions(params) {
    console.log("Main Menu")
    console.log("Please select an option:")
    console.log("1. Search for a book")
    console.log("2. Use id to find book (use this only if you already know the book id)")
    console.log("3. look at last 10 books")
    return rl.question("select the number that you would like to do: ", 
        (answer) =>{
            if (answer == 1){
                askQuestion()
            }
            else if (answer == 2){
                askForId()
            }
            else if (answer == 3){
                tenLastBooks()
            }
            else{
                console.log("Please input the number you would like to select \n")
                menuOptions()
            }

        })
    
}

menuOptions();

async function askQuestion(query){
    return rl.question("What would you like to search for? ", 
        answer => {
        console.log(`You searched for: ${answer} \n`);
        getData(answer);
    });
};

async function getData(str) {
    const request = await fetch(url + str);
    const json = await request.json();
//    console.log(json);
//    console.log(request);

    for (let i = 0; i < json.count && i < 32; ++i) {
        console.log(json.results[i].id,  ': ',  json.results[i].title,
             ' By ', json.results[i].authors.map((author) => author.name).join(", "),  '\n');
    }
    askForId();
};


async function askForId(){
    return rl.question("What is the ID of the book you want to read? ", answer => {
        console.log(`You selected book ID: ${answer} \n`);
        getBook(answer);
        // rl.close();
    });
};

async function getBook(id){
// example link "https://www.gutenberg.org/ebooks/(id).txt.utf-8"
    const request = await fetch('https://www.gutenberg.org/ebooks/' + id + '.txt.utf-8');
    const text = await request.text();
    
//    console.log(text);
//    console.log(text.length)
    printWords(text);
};

async function printWords(text) {
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
    console.log(textSplit[1]);
    T = true
    x = 2
    // allow user input to read the next parapraph or exit the program
    // still need to finish as of 4/3/25 11:10AM
    while (T == true){

        const answer = await askQuestionwords("type 'exit' to close the program or type next to read the next paragraph: ");
        if (answer == "exit") {
        T = false;
        menuOptions(); // return to main menu
        }
        else if (answer == "next") {
        console.log(textSplit[x] + "\n")
        x++;
        };
        }
        
  }

function askQuestionwords(query){
    return new Promise(resolve =>{
      rl.question(query, answer => {
        resolve(answer);
      });
    });
  }