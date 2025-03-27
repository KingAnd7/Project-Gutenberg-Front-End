# Project-Gutenberg-Front-End
Using the Gutendex API (https://gutendex.com/), develop a tool that will allow you to search Project Gutenbergs catalog of books.  The program should:

- Be a command-line application written in Node (does not rely on a Web browser).  However, if you want to create an Electron App instead, I will allow that.

- Allows a user to search for a book by a word in the title, or by author name.

- Fetches the full-text (not images) of a book once the user selects one from the searches, and displays that for users to read.  Be sure you select the text format, as working with images will be far more involved.

- Displays the books in "pages".  Note that book text is not paged from Project Gutenberg.  You will need to figure out what constitutes a "page" depending on how you are displaying the work.  If you are in the command-line, you can simply divide the text up by the number of characters or words it has.  Do not rely on the number of lines, as paragraphs vary wildly in the amount of text they have before a new-line.

- Keeps track of the last ten books the user read, and has a menu that allows them to select those books directly without going through the normal search process.

- Handles user input errors and network errors without crashing.

To complete this project you should understand fully before starting to code:

- what Project Gutenberg is.

- the Gutendex API.

- how Javascript deals with asynchronous code.

- how to fetch a remote resource using the fetch function (do not use Axios or any other library; stick with the fetch function).

- JSON


The workflow for getting the fulltext of a book will be something like:

- Prompt user for a search term

- Fetch the results

- Show the user the results and let them select the book

- Using that book's id, fetch /book/{id}.  So if the id was 42, you'd fetch /book/42.

- This gives back the formats.  We want the plaintext format.  Find that url and pull it down.  This will be the text of the book.