const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
  const {username,password} = req.body;
  if (username && password) {
    if (!users.some(user => user.username === username)){
      users.push({"username" : username, "password" : password });
      return res.status(200).json({message: "User successfully registered"});
    } else {
      return res.status(404).json({message: "User already exists"});
    }
  } else {
    return res.status(404).json({message: "Unable to register user"});
  }
});

public_users.get('/books', (req, res) => {
  res.status(200).json(books);
})

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/books');
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching books:", error.message);
    return res.status(500).json({message: "Error fetching Books"});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  if(books[isbn]) {
    res.send(JSON.stringify(books[isbn], null, 4));
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async(req, res) => {
  let isbn = req.params.isbn;
  
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author.toLowerCase();
  let match_books = Object.values(books).filter(book => book.author.toLowerCase() === author); 
  res.send(JSON.stringify(match_books, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title.toLowerCase();
  const match_titles = Object.values(books).filter(book => book.title.toLowerCase() === title);
  res.json(match_titles);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let reviews = books[isbn].reviews;
  res.send(JSON.stringify(reviews, null, 4));
});

module.exports.general = public_users;
