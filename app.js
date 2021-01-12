const express = require("express");
const bodyParser =require("body-parser");
const path = require("path");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");
const routes = require("./routes/routes.js");
const mongodbURI = require("./config.js")


const PORT = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), "public")));
app.set("view engine", "ejs");
app.set("views", "views");



const store = new MongoDBStore({
    uri: mongodbURI,
    collection: "mySessions",
});
store.on("error", function (error) {
    console.log(error);
});
app.use(
    session({
        secret: "this is key",
        reSave: false,
        saveUninitialized: false,
        store: store,
    })
);

app.use(routes);

mongoose
    .connect(mongodbURI, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`listening on port ${PORT}`);
        });
    })
    .catch((err) => console.error(err.message));
