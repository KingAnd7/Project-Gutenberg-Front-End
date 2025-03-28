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
    console.log("2. Use id to find book (use this only if you already know the book id")
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
        rl.close();
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
async function printWords(text){
    const textSplit = text.split("/\r?\n/");
    console.log(textSplit);
    console.log(textSplit[1]);
}