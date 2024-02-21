const express = require("express");
const app = express();
const path = require("path");

const templatepath = path.join(__dirname, "../templates");
app.set("view engine", "hbs");
app.set("views", templatepath);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/dharati/:email",(req,res)=>{
    const email=req.params.email
    res.end(`${email}`)
})

app.get("/dharati/:email/display",(req,res)=>{
    const email=req.params.email;
    res.end(`your email is ${email}`)
})
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
