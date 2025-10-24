  const express = require('express');
  const jwt = require('jsonwebtoken');
  let books = require("./booksdb.js");
  const regd_users = express.Router();

  let users = [];

  const isValid = (username)=>{ //returns boolean
  //write code to check is the username is valid
  }

  const authenticatedUser = (username,password)=>{ 
    return users.some(user => user.username === username && user.password === password);
  }

  //only registered users can login
  regd_users.post("/login", (req,res) => {
    const {username, password } = req.body;

    if (username && password) {
      if (authenticatedUser(username, password)){
        let accessToken = jwt.sign(
        {data:password},
        "access",
        {expiresIn: 60*60})
        req.session.authorization = {
          accessToken, username
        };
        res.status(200).json({message: "User successfully logged in"});
      } else {
        res.status(404).json({message: "Invalid login. Check username and password"});
      }
    } else {
      res.status(404).json({message: "Unable to login"});
    }
  });

  // Add a book review
  regd_users.put("/auth/review/:isbn", (req, res) => {
    const review = req.query.review;
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    if (books[isbn] && review && username){
      books[isbn].reviews[username] = review;
      res.status(200).json({message: "Review added", reviews: books[isbn].reviews});
    } else {
      res.status(404).json({message: "Invalid isbn or review. Review not added."})
    }
  });

  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    if (books[isbn] && username){
      delete books[isbn].reviews[username];
      res.status(200).json({message: "Review deleted", reviews: books[isbn].reviews});
    } else {
      res.status(404).json({message: "Invalid ISBN. Review not deleted."});
    }
  })

  module.exports.authenticated = regd_users;
  module.exports.isValid = isValid;
  module.exports.users = users;
