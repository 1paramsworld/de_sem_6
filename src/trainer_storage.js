const express = require('express');
const multer = require('multer');
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const url = "mongodb://0.0.0.0:27017";
const dbName = "fit-bit-gym";

app.post("/savephoto", upload.single("userphoto"), async (req, res) => {
    const client = new MongoClient(url, { useUnifiedTopology: true });

    try {
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection("photos");

        if (!req.file) {
            return res.status(400).send("No file uploaded.");
        }

        const imageBuffer = req.file.buffer;

        if (!imageBuffer) {
            return res.status(400).send("Image buffer is undefined.");
        }

        const base64Image = imageBuffer.toString('base64');

        await collection.insertOne({ photo: base64Image });

        res.status(200).send("Image uploaded successfully!");
    } catch (error) {
        console.error("Error saving photo:", error);
        res.status(500).send("Internal Server Error");
    } finally {
        await client.close();
    }
});
app.get("/displayphoto", async (req, res) => {
    const client = new MongoClient(url, { useUnifiedTopology: true });

    try {
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection("photos");

        const photoDocuments = await collection.find().toArray();

        if (!photoDocuments || photoDocuments.length === 0) {
            return res.status(404).send("No photos found.");
        }

        let photoHtml = '';

        photoDocuments.forEach(photoDocument => {
            const base64Image = photoDocument.photo;
            photoHtml += `<img src="data:image/jpeg;base64,${base64Image}" alt="Uploaded Photo"><br>`;
        });

        res.send(photoHtml);
    } catch (error) {
        console.error("Error displaying photos:", error);
        res.status(500).send("Internal Server Error");
    } finally {
        await client.close();
    }
});


app.get("/", (req, res) => {
    res.render(path.join(__dirname,"..", "templates/imageuploader.hbs"));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
