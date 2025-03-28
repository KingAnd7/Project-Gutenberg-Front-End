const { request } = require('http');
const readline = require('readline');
const url = 'https://gutendex.com/books/?search=';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function menuOptions(params) {
    console.log("1. Search for book")
    console.log("2. Use id to find book (use this only if you already know the book id")
    console.log("3. look at last 10 books")
    return rl.question("select the number that you would like to do? ", 
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
                console.log("Please input the number you would like to select")
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
        rl.close
    });
};

async function getData(str) {
    const request = await fetch(url + 'str');
    const json = await request.json();
//    console.log(json);
//    console.log(json.count);

    for (let i = 0; i < 32; ++i) {
        console.log(json.results[i].id,  ': ',  json.results[i].title, '\n');
    }
    askForId();
};

async function askForId(){
    return rl.question("What is the ID of the book you want to read? ", answer => {
        console.log(`You selected book ID: ${answer} \n`);
        getBook(answer);
        rl.close
    });
}

async function getBook(id){
// example link "https://www.gutenberg.org/ebooks/1661.txt.utf-8"
    const request = await fetch('https://www.gutenberg.org/ebooks/' + id + '.txt.utf-8');
    const text = await request.text();
    
    console.log(text);
} 