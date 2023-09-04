const express = require("express");
const fs = require("fs");
const shortId = require("shortid");
const app = express();
app.use(express.json());

app.get("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
    const entry = data.find((entry) => entry.shortId == id);

    if (!entry) {
      return res.status(404).json({ err: "shortId not found" });
    }
    res.redirect(entry.longUrl);
  } catch (err) {
    return err;
  }
});

app.post("/add", (req, res) => {
  try {
    const jsonData = JSON.parse(fs.readFileSync("./db.json", "utf-8"));

    const existingIndex = jsonData.findIndex(
      (obj) => obj.shortId === req.body.shortId
    );

    if (existingIndex !== -1) {
      jsonData[existingIndex] = req.body;
    } else {
      jsonData.push(req.body);
    }

    fs.writeFileSync("./db.json", JSON.stringify(jsonData, null, 2));

    res.status(200).json({ message: "Data added or updated successfully" });
  } catch (error) {
    console.error("Error adding or updating data:", error);
    res.status(500).json({ error: "Unable to add or update data" });
  }
});

app.listen(8080, () => {
  console.log("server running at 8080");
});
