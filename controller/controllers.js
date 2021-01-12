const bcrypt = require("bcrypt");
const crypto = require("crypto");
const transporter = require("../utils/email.js");
const Users = require("../models/user.js");

// Authentication middleware
const isAuthMiddleware = (req, res, next) => {
    if (req.session.isAuth) {
        next();
    } else {
        res.render("login", { mess: "Not Authorized, Login" });
    }
};

// GET = login page
const getLogin = (req, res, next) => {
    res.render("login", { mess: "" });
};

// POST = login
const postLogin = async (req, res, next) => {
    const { email, password } = req.body;

    const validUser = await Users.find({ email: email });

    if (validUser.length < 1) {
        return res.render("login", {
            mess: "Email not found. Please register",
        });
    }
    const matched = await bcrypt.compare(password, validUser[0].password);
    if (matched) {
        req.session.isAuth = true;
        res.redirect("/dashboard");
    } else {
        res.render("login", { mess: "Password not matched" });
    }
};

// GET = register page
const getRegister = (req, res, next) => {
    res.render("register", { mess: "" });
};

// POST = register
const postRegister = async (req, res, next) => {
    const { name, email, password, cpass } = req.body;
    if (
        name.length < 1 ||
        email.length < 1 ||
        password.length < 1 ||
        password != cpass
    ) {
        return res.render("register", {
            mess: "Invalid Name or Password did not match",
        });
    }
    const alreadyUser = await Users.find({ email: email });
    if (alreadyUser.length > 0) {
        return res.render("login", { mess: "Already registered user, login" });
    }
    const hashPass = await bcrypt.hash(password, 12);
    const newUser = new Users({
        name: name,
        email: email,
        password: hashPass,
        resetToken: "",
        resetTokenExpiration: Date.now(),
    });
    newUser
        .save()
        .then(() => {
            res.render("login", { mess: "Registered successfully, login" });
            const message = {
                to: email,
                from: "ronjazz8796@gmail.com",
                subject: "Registration Complete!",
                html: "<h1>You successfully registered on my App. Thanks:)",
            };

            transporter.sendMail(message, function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Email sent successfully");
                }
            });
        })
        .catch((err) => console.log(err));
};

// GET = dashboard page
const getDashboard = (req, res, next) => {
    res.render("dashboard");
};

// POST = logout
const postLogout = (req, res) => {
    req.session.destroy((err) => console.log(err));
    res.redirect("/");
};

// Password Reset
const getReset = (req, res, next) => {
    res.render("reset", { mess: "" });
};

const postReset = async (req, res, next) => {
    const email = req.body.email;
    let token;
    if (email.length < 0) {
        res.render("reset", { mess: "Email is required" });
    }
    try {
        crypto.randomBytes(32, (err, buffer) => {
            if (err) {
                console.log(err);
                return res.render("reset", { mess: "Please try again later" });
            }
            token = buffer.toString("hex");
        });

        const user = await Users.find({ email: email });
        if (user.length < 1) {
            res.render("reset", { mess: "User with  email not found" });
        }
        // console.log(user[0]);
        // user.resetToken = token;
        // user.resetTokenExpiration = Date.now() + 3600000;
        user[0].resetToken = token;
        user[0].resetTokenExpiration = Date.now() + 3600000;
        const result = await user[0].save();
        // console.log(result);
        // console.log("token reset");
        const message = {
            to: email,
            from: "Rohan Jaiswal <ronjazz8796@gmail.com>",
            subject: "Reset Password!",
            html: `
                    <h4>Set a new Password at <a href="https://rj-node-auth.herokuapp.com/new-password/${token}">this link</a></h4>
                    `,
        };

        transporter.sendMail(message, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                console.log("Email sent successfully");
            }
            res.render("login", {
                mess: "A link to update password is mailed",
            });
        });
    } catch (err) {
        console.log(err);
    }
};

const getNewPassword = (req, res, next) => {
    const token = req.params.token;
    res.render("newpass", { mess: "", token: token });
};

const postNewPassword = async (req, res, next) => {
    const { token, password, cpassword } = req.body;
    if (password !== cpassword) {
        res.render("newpass", { mess: "Password did not match", token: token });
    }
    try {
        const hashPass = await bcrypt.hash(password, 12);
        const user = await Users.find({
            resetToken: token,
        });
        // console.log(user[0]);
        if (user.length < 1) {
            res.render("newpass", {
                mess: "Token Expired or Not Found",
                token: "",
            });
        }
        const result = await Users.updateOne(
            { _id: user[0]._id },
            {
                password: hashPass,
                resetToken: "",
                resetTokenExpiration: Date.now(),
            }
        );
        // console.log(result);
        // console.log("Password updated!");
        res.render("login", { mess: "Login with new password" });
    } catch (err) {
        console.error(err);
        res.render("newpass", {
            mess: "Unable to update at moment",
            token: token,
        });
    }
};
// exports
module.exports = {
    getLogin,
    getRegister,
    postLogin,
    postRegister,
    getDashboard,
    isAuthMiddleware,
    postLogout,
    getReset,
    postReset,
    getNewPassword,
    postNewPassword,
};
