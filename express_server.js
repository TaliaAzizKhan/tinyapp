const express = require("express");
var cookieParser = require('cookie-parser')
const app = express();
app.use(cookieParser())

// app.get('/', function (req, res) {
//   // Cookies that have not been signed
//   console.log('Cookies: ', req.cookies)

//   // Cookies that have been signed
//   console.log('Signed Cookies: ', req.signedCookies)
// })

const PORT = 3000; // default port 8080

app.set("view engine", "ejs");


const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

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
  const templateVars = {  
    username: req.cookies["username"],
    urls: urlDatabase };
  res.render("urls_index", templateVars);
});


app.get("/urls/new", (req, res) => {
  const templateVars = {  
    username: req.cookies["username"],
    };
    res.render("urls_new", templateVars);
});


app.get("/urls/:shortURL", (req, res) => {

  let longURL = urlDatabase[req.params.shortURL];
  console.log(longURL)
  const templateVars = {  
    username: req.cookies["username"],
    shortURL: req.params.shortURL, 
    longURL: href=urlDatabase[req.params.shortURL]
  };
  res.render("urls_show", templateVars);
  
});


app.post("/urls", (req, res) => {

  let randomShortUrl = generateRandomString();
  urlDatabase[randomShortUrl] = req.body.longURL;
  res.redirect(`/urls/${randomShortUrl}`);
});


app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});


app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.editUrl;
  res.redirect("/urls");
});

app.get("/login", (req, res) => {
  res.cookie('username', req.body.username);
    res.redirect("/urls");
});


app.post("/login", (req, res) => {
  res.cookie('username', req.body.username);
    res.redirect("/urls");
});


app.post("/logout", (req, res) => {
  res.clearCookie('username');
    res.redirect("/urls");
});








app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
