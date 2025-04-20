//express framework imported for Api handleing
const express = require("express");
const app = express();
app.use(express.json());

// .env files importing
const dotenv = require("dotenv")
dotenv.config();
const {PORT, DB_PASSWORD, DB_USER} = process.env

//i have put my DB_Pass and DB_User 
// do not access that and do not go to .env, see the working of the api calls kind request

// importing of mongoose
const mongoose = require("mongoose");
const DB_URL = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.nsa02.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
// connecting to the database server
mongoose.connect(DB_URL).then(function(connection){
    console.log("Connection is successfull")  
}).catch(err => {
    console.log(`there is an error ${err}`)
})

// listening to the port 
app.listen(PORT, () => {
    console.log(`server is running on the port ${PORT}`)
})


const UserSchemaDetails = {
    name: {
        type: String,
        required: true 
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        unique: true
    },
    confirmPassword: {
        type: String,
        validate: function () {
            return this.password === this.confirmPassword;
        }
    },
    addedAt:{
        type: Date,
        default: Date.now()
    }
}
const userSchema = new mongoose.Schema(UserSchemaDetails);
const UserModel = mongoose.model("Client_User", userSchema);


// User details API 

app.get("/", async(req, res) => {
    try{
        const userAll_details = await UserModel.find();
        res.status(200).json({
            status: "success",
            message: userAll_details
        })
    }catch(err){
        res.status(500).json({
            status: "failure",
            message: err
        })
    }
})
app.get("/:UserId", async(req, res)=>{
    try{
        const id = req.params.UserId;
        const UserById = await UserModel.findById(id)
        res.status(200).json({
            status: "success",
            message: UserById
        })
    }catch(err){
        res.status(500).json({
            status : "failure",
            message: err
        })
    }
})
app.post("/login", async(req, res) => {
    try{
        const user_details = req.body;
        const detailsPosting = await UserModel.create(user_details);
        res.status(200).json({
            status: "successfully Added a new user",
            message: detailsPosting
        })
    }catch(err){
        res.status(500).json({
            status: "failure",
            message: err
        })
    }
})

app.delete('/delete/:UserId', async(req, res)=> {
    try{
        const id = req.params.UserId;
        const deletedUser = await UserModel.findByIdAndDelete(id)
        res.status(200).json({
            status: "success",
            message: deletedUser
        })
    }catch(err){
        res.status(500).json({
            status: "failure",
            message: err
        })
    }
})