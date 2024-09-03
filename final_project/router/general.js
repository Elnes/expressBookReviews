const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (isValid(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "Customer successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "Customer already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register Customer. Password or username missing"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  let booksPromise = new Promise((resolve,reject) => {
    resolve(JSON.stringify(books,null,4))
  })
  booksPromise.then(
    res.send(JSON.stringify(books,null,4))
  )
  //res.send(JSON.stringify(books,null,4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let bookPromise = new Promise((resolve,reject)=>{
    let book = books[isbn];
    resolve(book);
  })
  bookPromise.then((book) => { 
       res.send(book)
  })
 
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author
  let bookPromise = new Promise((resolve,reject)=>{
    let matchingBook = []
    let currentBook = {}
    for (let i in books){
      currentBook = {}
      if (books[i].author == author){
        currentBook["isbn"] = i;
        currentBook["title"] = books[i].title;
        currentBook["reviews"] = books[i].reviews;
        matchingBook.push(currentBook);
      }
    } 
    if (matchingBook.length > 0){
      resolve(JSON.stringify(matchingBook,null,4))
    }
  })
  bookPromise.then((message)=>{
    res.send(message)
  })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title
  let bookPromise = new Promise((resolve, reject)=>{
    let matchingBook = []
    let currentBook = {}
    for (let i in books){
      currentBook = {}
      if (books[i].title == title){
        currentBook["isbn"] = i;
        currentBook["author"] = books[i].author;
        currentBook["reviews"] = books[i].reviews;
        matchingBook.push(currentBook);
      }
    } 
    if (matchingBook.length > 0){
      resolve(JSON.stringify(matchingBook,null,4))
    }
  })
  bookPromise.then((message)=>{
    res.send(message)
  })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn
  res.send(books[isbn].reviews)
});

module.exports.general = public_users;
