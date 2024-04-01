const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
  
const app = express();
const port = 3000;
  
/* MySQL Connection */
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Fabi1912',
  database: 'node_express_mysql_afimetrix'
});
  
/* Connect to MySQL */
db.connect(err => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL');
});
  
/* Middleware */
app.use(bodyParser.json());
app.use(cors());
  
/* Routes */
/* List all estudiantes */
app.get('/estudiantes', (req, res) => {
  db.query('SELECT * FROM estudiantes', (err, results) => {
    if (err) {
      res.status(500).send('Error fetching estudiantes');
      return;
    }
    res.json(results);
  });
});
   
/* Create a new estudiante */
app.post('/estudiantes/me-agregar-estudiante', (req, res) => {
  const { IdEstudiante, Nombre, FechaNacimiento, Sexo } = req.body;
  db.query('INSERT INTO estudiantes (IdEstudiante, Nombre, FechaNacimiento, Sexo) VALUES (?, ?, ?, ?)', [IdEstudiante, Nombre, FechaNacimiento, Sexo], (err, result) => {
    if (err) {
      res.status(500).send('Error creating estudiante');
      return;
    }
    const estudianteId = result.insertId;
    db.query('SELECT * FROM estudiantes WHERE id = ?', estudianteId, (err, result) => {
      if (err) {
        res.status(500).send('Error fetching created estudiante');
        return;
      }
      res.status(201).json(result[0]);
    });
  });
});
  
/* Get a specific estudiante */
app.get('/estudiantes/:id', (req, res) => {
  const estudianteId = req.params.id;
  db.query('SELECT * FROM estudiantes WHERE id = ?', estudianteId, (err, result) => {
    if (err) {
      res.status(500).send('Error fetching estudiante');
      return;
    }
    if (result.length === 0) {
      res.status(404).send('Estudiante not found');
      return;
    }
    res.json(result[0]);
  });
});
  
/* Update an estudiante */
app.put('/estudiantes/:id', (req, res) => {
  const estudianteId = req.params.id;
  const { IdEstudiante, Nombre, FechaNacimiento, Sexo } = req.body;
  db.query('UPDATE estudiantes SET IdEstudiante = ?, Nombre = ?, FechaNacimiento = ?, Sexo = ? WHERE id = ?', [IdEstudiante, Nombre, FechaNacimiento, Sexo, estudianteId], err => {
    if (err) {
      res.status(500).send('Error updating estudiante');
      return;
    }
    db.query('SELECT * FROM estudiantes WHERE id = ?', estudianteId, (err, result) => {
      if (err) {
        res.status(500).send('Error fetching updated estudiante');
        return;
      }
      res.json(result[0]);
    });
  });
});
  
/* Delete an estudiante */
app.delete('/estudiantes/:id', (req, res) => {
  const estudianteId = req.params.id;
  db.query('DELETE FROM estudiantes WHERE id = ?', estudianteId, err => {
    if (err) {
      res.status(500).send('Error deleting estudiante');
      return;
    }
    res.status(200).json({ msg: 'Estudiante deleted successfully' });
  });
});
  
/* Start server */
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
