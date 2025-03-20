"use strict";

const express = require("express"); // imports express
const app = express(); // initializes the express application
//const cors = require("cors");
const path = require("path"); // imports path module
const axios = require("axios");
const PORT = 4000;

//app.use(cors());
app.use(express.static(path.join(__dirname, "public"))); // serves static files from the public directory
app.use(express.json()); // parses incoming JSON requests

// Serves the main HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "ColorPalette.html")); // serves index.html

});

// Endpoint for fetching the color palette
app.post("/api/colors", async (req, res) => {
    console.log("POST /api/colors route called");
    console.log("Request body received", req.body);

    const { colorName, schemeType } = req.body;

    try {
        
       const colorInfoResponse = await axios.get (`https://www.thecolorapi.com/id?hex=ff0000`);
       const seedColor = colorInfoResponse.data.hex.value;
       console.log("seed color:", seedColor);
        console.log("Color details fetched:", colorInfoResponse.data);
       const paletteResponse = await axios.get(`https://www.thecolorapi.com/scheme?hex=${seedColor.replace("#", "")}&mode=${schemeType}&count=5`);
        console.log("Color palette fetched:", paletteResponse.data);
       
        res.status(200).json({
        colorInfo: colorInfoResponse.data,
        palette: paletteResponse.data.colors,
        });
        console.log("repsonse sent to client successfully");      
    

} catch (error) {
    console.error("error while fetching color data", error.message);
    res.status(500).send("An error occured while processing please try again!");
}
});



app.listen(PORT, () => console.log(`server running on http://localhost:${PORT}`));