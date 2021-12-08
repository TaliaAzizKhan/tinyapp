
const express = require("express");
const app = express();
const PORT = 3000; // default port 8080

app.set("view engine", "ejs");


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


function generateRandomString() {
  return Math.random().toString(36).slice(7);
}


//Routes
// Get
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
});

app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});


app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});


app.get("/urls/:shortURL", (req, res) => {

  let longURL = urlDatabase[req.params.shortURL].longURL;
  const templateVars = { shortURL: req.params.shortURL, longURL: href=urlDatabase[req.params.shortURL].longURL/* What goes here? */ };
  res.render("urls_show", templateVars);
  
});


app.post("/urls", (req, res) => {

  let randomShortUrl = generateRandomString();

  urlDatabase[randomShortUrl] = req.body.longURL;
  res.redirect(req.body.longURL);

  res.redirect(`/urls/${shortURL}`);

  console.log(urlDatabase);  // Log the POST request body to the console
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});










app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});












































































//BU
// const PORT = 8080; // default port 8080
// const express = require("express");

// // body parser
// const bodyParser = require("body-parser");

// const app = express();
// app.set("view engine", "ejs");

// // database

// const urlDatabase = {
//   "b2xVn2": {longURL: "http://www.lighthouselabs.ca", userID:"userRandomID"},
//   "9sm5xK": {longURL:"http://www.google.com", userID:"user2RandomID"}
// };

// //middleware
// app.use(bodyParser.urlencoded({extended: true}));



// // Browse

// app.get("/", (req, res) => {
//   res.send("Hello!");
// });


// app.get("/urls", (req, res) => {
//   const templateVars = { urls: urlDatabase };
//   res.render("urls_index", templateVars);
// });

// // Read

// app.get("/u/:shortURL", (req, res) => {
//   const longURL = urlDatabase[req.params.shortURL].longURL;
//   res.redirect(longURL);
// });



// // new urls

// app.get("/urls/new", (req, res) => {
//   res.render("urls_new");
// });


// // show tiny url

// app.get("/urls/:shortURL", (req, res) => {
//   // const templateVars = { shortURL: req.params.shortURL, longURL: /* What goes here? */ };
//   const templateVars = { shortURL: req.params.shortURL, longURL: "http://www.lighthouselabs.ca" , };
//   res.render("urls_show", templateVars);
// });


// // post 
// // generate new id and store registration informations







// // generate random short url 

// app.post("/urls", (req, res) => {

//   console.log(req.body);  // Log the POST request body to the console
//   res.send("Ok");         // Respond with 'Ok' (we will replace this)
// });






// // app.get("/urls.json", (req, res) => {
// //   res.json(urlDatabase);
// // });


// // app.get("/hello", (req, res) => {
// //   res.send("<html><body>Hello <b>World</b></body></html>\n");
// // });







// // have the web server listen on port

// app.listen(PORT, () => {
//   console.log(`Example app listening on port ${PORT}!`);
// });

