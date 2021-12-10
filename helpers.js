//helper functions for express_server.js

const bcrypt = require('bcrypt');


//==============================================================================================================================

//Function to generate random alpha-numeric string of 6 characters

function generateRandomString() {
  return Math.random().toString(36).slice(7);
}


//==============================================================================================================================

//function to check if user is present in database
const AlreadyExistingUser = function(userDatabase, email) {
  for (let user in userDatabase) {
    if (userDatabase[user].email === email) {
      return true;
    }
  }
  return false;
};

//==============================================================================================================================

// function to check whether the email exists and then match the password with the email provided

const AuthenticateUser = function(userDatabase, email, password) {
  for (let user in userDatabase) {
    if (userDatabase[user].email === email) {
      if (bcrypt.compareSync(password, userDatabase[user].password)) {
        return true;
      }
    }
  }
  return false;
};

//==============================================================================================================================

// function for returning userID
const ReturnUserId = function(userDatabase, email) {
  for (let user in userDatabase) {
    if (userDatabase[user].email === email) {
      let userID = userDatabase[user].id;
      return userID;
    }
  }
};

//==============================================================================================================================

//function to return URLs if UserId is same as of the user currently logged in.

const urlsForUser = function(urlDatabase, userID) {
  let userSpecificURLS = {};

  for (let key in urlDatabase) {
    if (userID === urlDatabase[key].userID) {
      userSpecificURLS[key] = urlDatabase[key];
    }
  }
  return userSpecificURLS;
};

const getUserByEmail = function(email, userDatabase) {
  for (let user in userDatabase) {
    if (userDatabase[user].email === email) {
      return user;
    }
  }
};

//==============================================================================================================================

module.exports = {generateRandomString, AlreadyExistingUser, AuthenticateUser, ReturnUserId, urlsForUser, getUserByEmail};

