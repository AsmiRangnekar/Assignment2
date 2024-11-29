const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/persons', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

// Create a Person schema
const personSchema = new mongoose.Schema({
    name: String,
    age: Number,
    gender: String,
    mobile: String
});

// Create a Person model
const Person = mongoose.model('Person', personSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// GET /person: Display a list of people
app.get('/person', async (req, res) => {
    const people = await Person.find();
    res.json(people);  // You can render an HTML table if desired
});

// POST /person: Display a form to create a single person
app.post('/person', async (req, res) => {
    const { name, age, gender, mobile } = req.body;

    const newPerson = new Person({
        name,
        age,
        gender,
        mobile
    });

    await newPerson.save();
    res.redirect('/person'); // After saving, redirect to the list
});

// PUT /person/{id}: Display a form to edit a person by id
app.put('/person/:id', async (req, res) => {
    const { id } = req.params;
    const { name, age, gender, mobile } = req.body;

    const updatedPerson = await Person.findByIdAndUpdate(
        id,
        { name, age, gender, mobile },
        { new: true }
    );

    res.json(updatedPerson);  // You can render a form with the person's current data for editing
});

// DELETE /person/{id}: Delete a person by id
app.delete('/person/:id', async (req, res) => {
    const { id } = req.params;
    await Person.findByIdAndDelete(id);
    res.redirect('/person'); // Redirect to the list after deletion
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
