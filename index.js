const express=require("express");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const dotenv=require("dotenv");

const app=express();
dotenv.config();
const port=process.env.PORT ||3000;

const username=process.env.MONGODB_USERNAME;
const password=process.env.MONGODB_PASSWORD;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.qndkrsf.mongodb.net/registrationFormDB`)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
// mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.qndkrsf.mongodb.net/registrationFormDB` ,{
//     useNewUrlParser :true,
//     useUnifiedTopology:true,
// });

const registrationSchema=new mongoose.Schema({
    name:String,
    emil:String,
    password :String
});

const Registration= mongoose.model("Registration", registrationSchema);
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const path = require('path');

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});
app.post("/register",async(req,res)=>{
    try {
        const{name,email,password}=req.body; 
        const existingUser= await Registration.findOne({email : email});
        if(!existingUser){
            const registrationData=new  Registration({
                name,
                email,
                password,
            });
             await registrationData.save(); 
             res.redirect("/success");
        }
        else{
            console.log("User already exist");
            res.redirect("/error");
        }
        // const registrationData=new  Registration({
        //     name,
        //     email,
        //     password,
        // });
        //  await registrationData.save(); 
        //  res.redirect("/success");
        
    } catch(error) {
        console.log(error);
        res.redirect("/error");

        
    }
})

app.get("/success",(req,res)=>{
    res.sendFile(path.join(__dirname, "sucess.html"));

})
app.get("/error",(req,res)=>{
    res.sendFile(path.join(__dirname, "error.html"));

})

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
} )