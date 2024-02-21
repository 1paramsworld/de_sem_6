const express = require('express');
const bodyParser = require('body-parser');
const {MongoClient}=require("mongodb")
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/",(req,res)=>{
    const url="mongodb://0.0.0.0:27017";
    const client=new MongoClient(url);

    client.connect().then(()=>{
        const db=client.db("fit-bit-gym");
        const collection=db.collection("users");
        return collection.findOne({email:"param.sanjay.shah@gmail.com"})
    }).then((data)=>{
        if(data){
            const email=data.email;
            app.get(`/:${email}`,(req,res)=>{
                const email=data.email;
                res.end(`welcome ${email}`)
            })
            res.redirect(`/:${email}`)
        }
        return data;
    }).then((data)=>{
        console.log(data.email)
    })
})

const port = 4000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
