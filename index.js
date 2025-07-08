const express = require('express');
const app = express();
app.use(express.static('./dist'));
const cors = require('cors');
const morgan = require('morgan');
app.use(express.json());
app.use(cors());

let persons = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.use(morgan('tiny'));
app.get('/api/persons', (req, res) => {
  res.send(persons);
});

app.get('/info', (req, res) => {
  const date = new Date();
  res.send(`<h2>phonebook has info for ${persons.length} people</h2><br>
    <h2>${date.toString()}</h2>`);
});

app.get(`/api/persons/:id`, (req, res) => {
  const id = req.params.id;
  const person = persons.find((p) => {
    return p.id === id;
  });
  res.send(person);
});

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  persons = persons.filter((p) => {
    return p.id !== id;
  });
  res.status(200).send(persons);
});

app.post('/api/persons', (req, res) => {
  const person = req.body;
  if (person.name.trim() === '' || person.number.trim() === '') {
    res.status(400).send({ error: 'name or number is missing' });
    return;
  }
  const isExisted = persons
    .map((p) => {
      return p.name;
    })
    .includes(person.name);
  if (isExisted) {
    res.status(400).send({ error: 'the name must be unique' });
  } else {
    const id = Math.trunc(Math.random() * 23413412);
    const newPerson = { ...person, id: id.toString() };
    persons = persons.concat(newPerson);
    res.send(newPerson);
  }
});
const PORT = 3001 || process.env.PORT;
app.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
});
