const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const path = require("path");
const session = require('express-session');

const templatepath = path.join(__dirname, "../templates");
app.set("view engine", "hbs");
app.use(session({
    secret: 'your-secret-key', // used to sign the session ID cookie
    resave: false, // forces the session to be saved back to the session store
    saveUninitialized: false // forces a session that is "uninitialized" to be saved to the store
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


app.get("/workout/triceps",(req,res)=>{
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


app.post("/signup", (req, res) => {
    const url = "mongodb://0.0.0.0:27017";
    const client = new MongoClient(url);

    client.connect()
        .then(() => {
            const db = client.db("fit-bit-gym");
            const collection = db.collection("users");
            
            return collection.findOne({ email: req.body.useremail });
        })
        .then(existingUser => {
            if (existingUser) {
                res.render("error_email");
            } else {
                app.get("/:email/home", (req, res) => {
                    const email = req.params.email;
                    console.log(`${email}`)
                    res.render("home", { username: email });
                });

                const db = client.db("fit-bit-gym");
                const collection = db.collection("users");
    
                const data = {
                    name: req.body.username,
                    email: req.body.useremail,
                    password: req.body.userpassword
                };
                res.redirect(`/${req.body.username}/home`);
                console.log("Data inserted successfully");

                return collection.insertOne(data);
    
            }
        })
        .then(() => {
            const nodemailer = require('nodemailer');

// Create transporter with Gmail service
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'param270604@gmail.com',
        pass: 'pmli gtxp xctm ppzj'
    }
});

// Define email options
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

// Send the email
transporter.sendMail(mailOptions)
    .then(info => {
        console.log('Email sent:', info.response);
    })
    .catch(error => {
        console.error('Error:', error);
    });

        })
        .catch(error => {
            console.error("Error signing up:", error);
            res.status(500).send("Error signing up");
        })
        .finally(() => {
            client.close();
        });
});
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
app.post("/login", (req, res) => {
    const url = "mongodb://0.0.0.0:27017";
    const client = new MongoClient(url);

    client.connect()
        .then(() => {
            const db = client.db("fit-bit-gym");
            const collection = db.collection("users");
            
            const query = {
                email: req.body.useremail,
                password: req.body.userpassword
            };
            
            return collection.findOne(query);
        })
        .then(user => {
            if (user) {
                app.get("/:email/home", (req, res) => {
                    const email = req.params.email;
                    res.render("home", { username: email });
                });
                
                res.redirect(`/${user.name}/home`);
            } else {
                res.redirect("/?error=invalid");
            }
        })
        .catch(error => {
            console.error("Error logging in:", error);
            res.status(500).send("Error logging in");
        })
        .finally(() => {
            client.close();
        });
});

app.get("/stories/displaystories", async (req, res) => {
    const url = "mongodb://0.0.0.0:27017";
    const client = new MongoClient(url);

    try {
        await client.connect(); // Connect to MongoDB

        const dbname = client.db("fit-bit-gym");
        const collection = dbname.collection("fitness_stories");

        // Find stories from the database
        const stories = await collection.find({}).toArray();

        // Close the client
        await client.close();

        // Render the display_stories template with the fetched stories
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
            const story = { story: req.body.stories }; // Assuming 'story' is the correct field name for stories

            return collection.insertOne(story); // Insert only the 'story' field
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
