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
  
db.connect(err => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL');
});
  
app.use(bodyParser.json());
app.use(cors());
  
app.get('/estudiantes', (req, res) => {
  db.query('SELECT * FROM estudiantes', (err, results) => {
    if (err) {
      res.status(500).send('Error fetching estudiantes');
      return;
    }
    res.json(results);
  });
});

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
  /* EndPoins Curso */
  app.get('/cursos', (req, res) => {
    db.query('SELECT * FROM cursos', (err, results) => {
      if (err) {
        res.status(500).send('Error fetching cursos');
        return;
      }
      res.json(results);
    });
  });
  
  app.post('/cursos/agregar-curso', (req, res) => {
    const { IdCurso,IdProfesor,IdColegio, Nombre} = req.body;
    db.query('INSERT INTO cursos (IdCurso,IdProfesor,IdColegio, Nombre) VALUES (?, ?, ?, ?)', [IdCurso,IdProfesor,IdColegio, Nombre], (err, result) => {
      if (err) {
        res.status(500).send('Error creating curso');
        return;
      }
      const cursoId = result.insertId;
      db.query('SELECT * FROM estudiantes WHERE id = ?', cursoId, (err, result) => {
        if (err) {
          res.status(500).send('Error fetching created cursos');
          return;
        }
        res.status(201).json(result[0]);
      });
    });
  });
    
  app.get('/cursos/:id', (req, res) => {
    const cursoId = req.params.id;
    db.query('SELECT * FROM cursos WHERE id = ?', cursoId, (err, result) => {
      if (err) {
        res.status(500).send('Error fetching estudiante');
        return;
      }
      if (result.length === 0) {
        res.status(404).send('cursos not found');
        return;
      }
      res.json(result[0]);
    });
  });
    
  app.put('/cursos/:id', (req, res) => {
    const cursoId = req.params.id;
    const { IdCurso,IdProfesor,IdColegio, Nombre} = req.body;
    db.query('UPDATE cursos SET IdCurso = ?, IdProfesor = ?, IdColegio = ?, Nombre = ? WHERE id = ?', [IdCurso,IdProfesor,IdColegio, Nombre], err => {
      if (err) {
        res.status(500).send('Error updating estudiante');
        return;
      }
      db.query('SELECT * FROM cursos WHERE id = ?', cursoId, (err, result) => {
        if (err) {
          res.status(500).send('Error fetching updated estudiante');
          return;
        }
        res.json(result[0]);
      });
    });
  });
    
  app.delete('/cursos/:id', (req, res) => {
    const cursoId = req.params.id;
    db.query('DELETE FROM cursos WHERE id = ?', cursoId, err => {
      if (err) {
        res.status(500).send('Error deleting cursos');
        return;
      }
      res.status(200).json({ msg: 'curso deleted successfully' });
    });
  });



/* Start server */
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
