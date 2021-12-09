
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

  let longURL = urlDatabase[req.params.shortURL];
  console.log(longURL)
  const templateVars = { shortURL: req.params.shortURL, longURL: href=urlDatabase[req.params.shortURL]/* What goes here? */ };
  res.render("urls_show", templateVars);
  
});


app.post("/urls", (req, res) => {

  let randomShortUrl = generateRandomString();
  urlDatabase[randomShortUrl] = req.body.longURL;
  res.redirect(`/urls/${randomShortUrl}`);
  // console.log(urlDatabase);  // Log the POST request body to the console
  // res.send("Ok");         // Respond with 'Ok' (we will replace this)
});


app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.editUrl;
  // delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});







app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
