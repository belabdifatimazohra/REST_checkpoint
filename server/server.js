// Import express, mongoose and dotenv
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

// create the server app
const app = express();
const PORT = process.env.PORT || 2500;
// JSON to get the content us an js
app.use(express.json());
// connect to the database
mongoose.connect(process.env.MONGODB_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;

db.once("open", () => {
    console.log("connected to database");
});



// ----------------- Routes ------------------------ //
const User = require("./models/user");

// fixes for the deprecation warnings
// Replace update() with updateOne(), updateMany(), or replaceOne()
// Replace remove() with deleteOne() or deleteMany().
// Replace count() with countDocuments(), unless you want to count how many documents are in the whole collection(no filter).
// In the latter case, use estimatedDocumentCount().
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);


// GET :  RETURN ALL USERS 
app.get("/user", async (req, res, next) => {
    try {
        // find all user using find() and send the response
        const user = await User.find({});
        res.send(user);
    } catch (error) {
        console.log("error")
    }
});


// POST: ADD A NEW USER TO THE DATABASE 
app.post("/user", async (req, res, next) => {
    // get the inputs from request body
    const { name, age, email } = req.body;
    const user = new User({
        name,
        email,
        age,
    });
    try {
        // if the user doesn't exist add it
        const findUser = await User.findOne({ email: email });
        if (findUser) {
            res.status(400);
            res.send({ message: "the email you are adding already exist" });
        }
        else {
            await user.save();
            res.send(user);
        }
    } catch (error) {
        console.log("error");
    }
});


//   PUT : EDIT A USER BY ID 
app.put("/user", async (req, res, next) => {
    // get the id and the age to edit
    const { id, age } = req.body;
    try {
        // find user by the id requested
        const user = await User.findByIdAndUpdate(
            id,
            {
                age,
            },
            { new: true }
        ); // to return the updated user use { new: true } as third parms
        await user.save();
        res.send(user);
    } catch (error) { console.log("error") }
});


//  DELETE : REMOVE A USER BY ID 
app.delete("/user", async (req, res, next) => {
    const { id } = req.body;
    try {
        const user = await User.findByIdAndDelete(id);
        res.send(user);
    } catch (error) { }
});


app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});
