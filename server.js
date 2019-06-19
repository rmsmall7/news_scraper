var express = require("express");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var logger = require("morgan");

var PORT = process.env.PORT || 8080;

var app = express();


// app will use morgan to log request
app.use(logger("dev"));

app.use(express.urlencoded({ extended: true}));

app.use(express.json());

app.use(express.static("public"));

// setting up handlebars
app.set('views', './views')
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

require('./routes/apiRoutes')(app);

app.listen(PORT, function() {
  console.log("listening on port: " + PORT);
});


