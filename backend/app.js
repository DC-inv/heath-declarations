
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());

let healthDeclarations = [];
let nextId = 1;

app.get('/api/health-declarations', (req, res) => {
  res.json(healthDeclarations);
});

app.post('/api/health-declarations', (req, res) => {
  const { name, temperature, symptoms, covidContact } = req.body;
  
  if (!name || !temperature) {
    return res.status(400).json({ error: 'Name and temperature are required' });
  }
  
  const declaration = {
    id: nextId++,
    name,
    temperature: parseFloat(temperature),
    symptoms: symptoms || false,
    covidContact: covidContact || false,
    submittedAt: new Date().toISOString(),
  };
  
  healthDeclarations.push(declaration);
  res.status(201).json(declaration);
});

app.delete('/api/health-declarations/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = healthDeclarations.findIndex(declaration => declaration.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Declaration not found' });
  }
  
  healthDeclarations.splice(index, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});