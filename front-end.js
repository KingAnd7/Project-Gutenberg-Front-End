const { request } = require('http');
const readline = require('readline');
const url = 'https://gutendex.com/books/?search=';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
async function askQuestion(query){
    return rl.question("What would you like to search for? ", answer => {
        console.log(`You searched for: ${answer} \n`);
        getData(answer);
        rl.close
    });
};

askQuestion();

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
//"https://www.gutenberg.org/ebooks/1661.txt.utf-8"
    const request = await fetch('https://www.gutenberg.org/ebooks/' + id + '.txt.utf-8');
    const text = await request.text();
    console.log(text);
} 