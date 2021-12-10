
const express = require("express");
const {generateRandomString, AlreadyExistingUser, AuthenticateUser, ReturnUserId, UserUrls} = require('./helpers');
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const methodOverride = require('method-override');
const bcrypt = require('bcrypt');
const salt = 10;

//===============================================================================================================================
const app = express();
const PORT = 5000;
//===============================================================================================================================

app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));
app.use(methodOverride('_method'));
app.set("view engine", "ejs");

//===============================================================================================================================

//Global url Database
const urlDatabase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca", userID:"userRandomID"},
  "9sm5xK": {longURL:"http://www.google.ca", userID:"user2RandomID"}
};

//Global object for Users
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", salt)
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", salt)
  }
};

//================================================================================================================================

// GENERAL ROUTES
// GET ROUTES:

app.get("/", (req, res) => {
  let currentUser = users[req.session["user_id"]];
  if (currentUser) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

//-------------------------------------------------------------------------------------------------------------------------------

app.get("/urls", (req, res) => {
  let currentUser = users[req.session["user_id"]];
  if (currentUser) {
    let userSpecificURLs = UserUrls(urlDatabase, currentUser["id"]);
    const templateVars = {
      user: currentUser,
      urls: userSpecificURLs
    };
    res.render("urls_index", templateVars);
  } else {
    const templateVars = {
      user: false 
    };
    res.render("urls_index", templateVars);
  }
});

//-------------------------------------------------------------------------------------------------------------------------------

app.get("/urls/new", (req, res) => {
  let currentUser = users[req.session["user_id"]];
  const templateVars = {
    user: currentUser
  };
  
  if (!currentUser) {
    res.redirect("/login");
  } else {
    res.render("urls_new", templateVars);
  }
});

//-------------------------------------------------------------------------------------------------------------------------------

app.get("/register", (req, res) => {
  let currentUser = users[req.session["user_id"]];
  const templateVars = {
    user: currentUser,
    error: null 
  };
  res.render("register", templateVars);
});

//-------------------------------------------------------------------------------------------------------------------------------

app.get("/login", (req, res) => {
  let currentUser = users[req.session["user_id"]];
  const templateVars = {
    user: currentUser,
    error: null 
  };

  res.render("login", templateVars);
});

//-------------------------------------------------------------------------------------------------------------------------------

app.get("/urls/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL].longURL;
  let currentUser = users[req.session["user_id"]];
  let display;
  
  if (currentUser) {
    if (UserUrls(urlDatabase, currentUser.id)[req.params.shortURL]) {
      display = true; 
    } else {
      display = false; 
    }
    
    if (longURL) {
      const templateVars = {
        user: currentUser,
        shortURL: req.params.shortURL,
        longURL: longURL,
        display
      };
      res.render("urls_shows", templateVars);
    } else {
      res.send("URL does not exist.");
    }
  } else {
    res.status(403).redirect("/login");
  }
});

//-------------------------------------------------------------------------------------------------------------------------------

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

//================================================================================================================================

// POST ROUTE:

app.post("/urls", (req, res) => {
  let currentUser = users[req.session["user_id"]];
  let id = generateRandomString();
  urlDatabase[id] = {longURL: req.body.longURL, userID: currentUser.id};
  res.redirect(`/urls/${id}`);
});

//================================================================================================================================

// DELETE ROUTE:

app.delete("/urls/:shortURL", (req, res) => {
  let currentUser = users[req.session["user_id"]];
  
  if (currentUser) {
    if (UserUrls(urlDatabase, currentUser.id)[req.params.shortURL]) {
      delete urlDatabase[req.params.shortURL];
      res.redirect("/urls");
    }
  } else {
    //send error if not present in th list
    res.status(403).redirect("/login");
  }
});

//================================================================================================================================

// PUT ROUTE:

//Update a long URL
app.put("/urls/:shortURL", (req, res) => {
  let currentUser = users[req.session["user_id"]];

  
  if (UserUrls(urlDatabase, currentUser.id)[req.params.shortURL]) {
    let newURL = req.body.newURL;

    //update new URL to Database
    urlDatabase[req.params.shortURL].longURL = newURL;
    res.redirect("/urls");
  }
});

//================================================================================================================================

// POST ROUTES:

app.post("/login", (req, res) => {
  let userEmail = req.body.email;
  let userPassword = req.body.password;
  let userID = ReturnUserId(users, userEmail);
  
  
  if (AuthenticateUser(users, userEmail, userPassword)) {

    req.session['user_id'] = userID;
    res.redirect("/urls");
  } else {
    const templateVars = {
      error: "Error in credentials",
      user: null
    };
    res.render("login", templateVars);
  }
});

//-------------------------------------------------------------------------------------------------------------------------------

app.post("/logout", (req, res) => {
  delete req.session['user_id'];
  res.redirect("/urls");
});

//-------------------------------------------------------------------------------------------------------------------------------

app.post("/register", (req, res) => {
  let newId = generateRandomString();
  let newEmail = req.body.email;
  let newPassword = req.body.password;

  if (!newEmail || !newPassword) {
    const templateVars = {
      user: null,
      error: "Email or Password input error!"
    };
    res.render("register", templateVars);
  } else if (AlreadyExistingUser(users, newEmail)) {
    const templateVars = {
      user: null,
      error: "Email already exists as user!"
    };
    res.render("register", templateVars);
  } else {
    
    // a new user can be created if the above conditions have not been met
    const newUser = {
      id: newId,
      email: newEmail,
      password: bcrypt.hashSync(newPassword, salt),
    };
    //Add new user to Database
    users[newId] = newUser;
    //add encrypted cookies
    req.session['user_id'] = newId; 
    res.redirect("/urls");
  }
});

//================================================================================================================================

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//================================================================================================================================
