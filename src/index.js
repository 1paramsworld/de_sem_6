const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const path = require("path");
const session = require('express-session');
const templatepath = path.join(__dirname, "../templates");
app.set("view engine", "hbs");
app.use(session({
    secret: 'your-secret-key', 
    resave: false, 
    saveUninitialized: false 
  }));
const requirelogin=(req,res,next)=>{
    if(req.session.user){
        next()
    }
    else{
        res.redirect("/")
    }
}
app.set("views", templatepath);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/backhome",(req,res)=>{
    res.redirect("/")
})
app.post("/about",(req,res)=>{
    res.redirect("/about")
})
app.get("/workout/back",(req,res)=>{
    res.render("back")
})
app.post("/back",(req,res)=>{
    res.redirect("/workout/back")
})
app.get("/workout/cardio",(req,res)=>{
    res.render("cardio")
})
app.post("/cardio",(req,res)=>{
    res.redirect("/workout/cardio")
})
app.get("/workout/biceps",(req,res)=>{
    res.render("biceps")
})
app.post("/biceps",(req,res)=>{
    res.redirect("/workout/biceps")
})
app.post("/triceps",(req,res)=>{
    res.render("triceps")
})
app.post("/back",(req,res)=>{
    res.redirect("/workout/triceps")
})
app.get("/workout/shoulders",(req,res)=>{
    res.render("shoulders")
})
app.post("/shoulders",(req,res)=>{
    res.redirect("/workout/shoulders")
})
app.get("/workout/chest",(req,res)=>{
    res.render("chest")
})
app.post("/chest",(req,res)=>{
    res.redirect("/workout/chest")
})
app.post("/back",(req,res)=>{
    res.redirect("/workout/back")
})
app.get("/", (req, res) => {
    res.render("login");
});
app.get("/signup", (req, res) => {
    res.render("signup");
});
app.post("/stories",(req,res)=>{
    res.render("stories")
})

app.post("/signup", async (req, res) => {
    const url = "mongodb://0.0.0.0:27017";
    const client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db("fit-bit-gym");
        const collection = db.collection("users");
        
        const existingUser = await collection.findOne({ email: req.body.useremail });
        
        if (existingUser) {
            res.render("error_email");
            console.log("User already exists");
            return; // Exit the function if user exists
        } else {
            app.get("/:email/home", (req, res) => {
                const email = req.params.email;
                console.log(`${email}`)
                res.render("home", { username: email });
            });

            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1; 
            const currentDay = currentDate.getDate();
            const currentHour = currentDate.getHours();
            const currentMinute = currentDate.getMinutes();
            const currentSecond = currentDate.getSeconds();
            const padZero = (num) => (num < 10 ? `0${num}` : num); 

            const dateTimeString = `${currentDay}:${padZero(currentMonth)}:${padZero(currentYear)} ${padZero(currentHour)}:${padZero(currentMinute)}:${padZero(currentSecond)}`;

            const data = {
                name: req.body.username,
                email: req.body.useremail,
                password: req.body.userpassword,
                visits: 1,
                lastvisit: dateTimeString,
                Account_creation: dateTimeString,
            };

            res.redirect(`/${req.body.username}/home`);
            console.log("Data inserted successfully");

            await collection.insertOne(data);

            // Send email only if a new user is created
            const nodemailer = require('nodemailer');

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'param270604@gmail.com',
                    pass: 'pmli gtxp xctm ppzj'
                }
            });

            const mailOptions = {
                from: 'param270604@gmail.com',
                to: req.body.useremail,
                subject: 'Welcome to Fit Bit Gym', 
                html: `
                    <h1>Welcome to Fit Bit Gym!</h1>
                    <p>Thank you for signing up. Here are your account details:</p>
                    <ul>
                        <li><strong>Email:</strong> ${req.body.useremail}</li>
                        <li><strong>Password:</strong> ${req.body.userpassword}</li>
                    </ul>
                    <p>We're excited to have you onboard. Enjoy your fitness journey with Fit Bit Gym!</p>
                `
            };

            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent:', info.response);
        }
    } catch (error) {
        console.error("Error signing up:", error);
        res.status(500).send("Error signing up");
    } finally {
        client.close();
    }
});

app.post("/showusers",async(req,res)=>{
    try {
        const url = "mongodb://0.0.0.0:27017";
        const client = new MongoClient(url);
        await client.connect()
        const db=client.db("fit-bit-gym");
        const collection=db.collection("users")
        let data=await collection.find({}).toArray();
        res.render("adminusers",{data})
    } catch (error) {
        console.log(error)
    }
})
app.post("/stories",(req,res)=>{
    res.render("stories")
})

app.get("/stories", (req, res) => {
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Login Page</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #333; /* Dark background color */
                    margin: 0;
                    padding: 0;
                    color: #fff; /* White text color */
                    height: 100vh;
                }
                .container {
                    text-align: left; /* Align text to the left */
                    padding: 20px;
                    margin-top: 20px; /* Add margin to the top for space */
                }
                h1 {
                    color: #fff; /* White text color for the heading */
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>This page is not accessible until you login</h1>
            </div>
        </body>
        </html>
    `;
    res.end(htmlContent);
});

app.post("/logout",(req,res)=>{
    app.get("/",(req,res)=>{
        res.render("login")
    })
    res.redirect("/")
})

app.get("/about",(req,res)=>{
    res.render("aboutus")
})

app.post("/aboutus",(req,res)=>{
    let a=1;
    if(a==1){
        req.session.user=a;
        res.redirect("about")
    }
})
app.get("/admin",(req,res)=>{
    res.render("admin")
})
app.post("/login", async (req, res) => {
    try {
        const url = "mongodb://0.0.0.0:27017";
        const client = new MongoClient(url);
        await client.connect();

        const db = client.db("fit-bit-gym");
        const collection = db.collection("users");




        const query = {
            email: req.body.useremail,
            password: req.body.userpassword
        };
        if(query.email=="admin@123" && query.password=="11223344"){
            res.render("admin")
            return
        }
        console.log(query)

        const user = await collection.findOne(query);


        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1; 
        const currentDay = currentDate.getDate();
        const currentHour = currentDate.getHours();
        const currentMinute = currentDate.getMinutes();
        const currentSecond = currentDate.getSeconds();
        const padZero = (num) => (num < 10 ? `0${num}` : num); 

        const dateTimeString = `${currentDay}:${padZero(currentMonth)}:${padZero(currentYear)} ${padZero(currentHour)}:${padZero(currentMinute)}:${padZero(currentSecond)}`;

        if (user) {
            if(user.email=="admin@123" && user.password=="11223344"){
                res.redirect("/admin")
                return 
            }
            console.log("hey user")
            const updatedUser = await collection.updateOne(
                { _id: user._id },
                {
                    $set: {
                        visits: user.visits + 1,
                        lastvisit: dateTimeString
                    }
                }
            ); 

            app.get("/:email/home", (req, res) => {
                const email = req.params.email;
                res.render("home", { username: email });
            });
            res.redirect(`/${user.name}/home`);
        } 
        else {
            res.redirect("/?error=invalid");
        }

        client.close();
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).send("Error logging in");
    }
});


app.post("/showvisits", async (req, res) => {
    const url = "mongodb://0.0.0.0:27017";
    const client = new MongoClient(url);

    try {
        await client.connect();

        const db = client.db("fit-bit-gym");
        const collection = db.collection("users");

        const visits = await collection.aggregate([
            { $group: { _id: "custid", totalvisits: { $sum: "$visits" } } }
        ]).toArray();

        const totalVisits = visits[0].totalvisits; 
        const htmlResponse = `Visits:${totalVisits}`;

        res.send(htmlResponse); 
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    } finally {
        await client.close(); 
    }
});
app.post("/Gopremium", async (req, res) => {
    res.render("gopremium1");
});

app.post("/add",async(req,res)=>{
    const url = "mongodb://0.0.0.0:27017";
    const client = new MongoClient(url);

    try {
        await client.connect(); 

        const dbname = client.db("fit-bit-gym");
        const collection = dbname.collection("users");
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1; 
        const currentDay = currentDate.getDate();
        const currentHour = currentDate.getHours();
        const currentMinute = currentDate.getMinutes();
        const currentSecond = currentDate.getSeconds();
        const padZero = (num) => (num < 10 ? `0${num}` : num); 

        const dateTimeString = `${currentDay}:${padZero(currentMonth)}:${padZero(currentYear)} ${padZero(currentHour)}:${padZero(currentMinute)}:${padZero(currentSecond)}`;


        const data={
            name:req.body.username,
            email:req.body.useremail,
            password:req.body.userpassword,
            visits:0,
            lastvisit:dateTimeString,
            Account_creation:dateTimeString
        }
        let insert=await collection.insertOne(data)
        if(insert){
            res.end("data inserted")
        }
    } catch (error) {
        console.log(error)
    }
})
app.post("/showtrainers", async (req, res) => {
    try {
        const url = "mongodb://0.0.0.0:27017";
        const client = new MongoClient(url);
        await client.connect()
        const db=client.db("fit-bit-gym");
        const collection=db.collection("photos")
        let data=await collection.find({}).toArray();
        res.render("trainersdata",{data})

    } catch (error) {
        console.log(error)
    }
});

app.post("/remove",async(req,res)=>{
    const url = "mongodb://0.0.0.0:27017";
    const client = new MongoClient(url);

    try {
        await client.connect(); 

        const dbname = client.db("fit-bit-gym");
        const collection = dbname.collection("users");

        const email=req.body.useremail;
        let data=await collection.findOne({email:email});
        console.log(data)
        if(data){
            await collection.deleteOne(data)
            res.end("user deleted")
        }
        else{
            res.end("no user found")
        }


    } catch (error) {
        console.log(error)
    }
})

app.get("/stories/displaystories", async (req, res) => {
    const url = "mongodb://0.0.0.0:27017";
    const client = new MongoClient(url);

    try {
        await client.connect(); 

        const dbname = client.db("fit-bit-gym");
        const collection = dbname.collection("fitness_stories");

        const stories = await collection.find({}).toArray();

        await client.close();

        res.render("display_stories", { stories: stories });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error occurred while fetching stories.");
    }
});

app.post("/addstory", (req, res) => {
    const url = "mongodb://0.0.0.0:27017";
    const client = new MongoClient(url);

    client.connect()
        .then(() => {
            const dbname = client.db("fit-bit-gym");
            const collection = dbname.collection("fitness_stories");
            const story = { story: req.body.stories };

            return collection.insertOne(story); 
        })
        .then(() => {
            res.redirect("/stories/displaystories");
        })
        .catch(err => {
            console.error("Error occurred while adding story:", err);
            res.status(500).send("Error occurred while adding story.");
        })
        .finally(() => {
            client.close(); // Ensure to close the MongoDB client connection
        });
});

app.post("/displaystories",(req,res)=>{
    res.redirect("/stories/displaystories")
})

app.get("/diet",(req,res)=>{
    res.render("diet.hbs")
});

app.post("/diet",(req,res)=>{
    res.redirect("/diet")
})

app.get("/diet/bodybuilding",(req,res)=>{
    res.render("bodybuilding")
})
app.post("/bodybuilding",(req,res)=>{
    res.redirect("/diet/bodybuilding")
})

app.get("/diet/affordable_diet",(req,res)=>{
    res.render("affordable")
})
app.post("/Affordable",(req,res)=>{
    res.redirect("/diet/affordable_diet")
})

app.get("/diet/veg",(req,res)=>{
    res.render("veg")
})
app.post("/veg",(req,res)=>{
    res.redirect("/diet/veg")
})
app.get("/diet/Weightloss",(req,res)=>{
    res.render("weight_loss")
})
app.post("/Weightloss",(req,res)=>{
    res.redirect("/diet/Weightloss")
})

app.get("/workout",(req,res)=>{
    res.render("workout")
})
app.post("/workout",(req,res)=>{
    let a=1;
    if(a==1){
        req.session.user=a;
        res.redirect("/workout")
    }
})


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
