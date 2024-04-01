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
  /* EndPoins Profesor */
  app.get('/profesores', (req, res) => {
    db.query('SELECT * FROM profesores', (err, results) => {
      if (err) {
        res.status(500).send('Error fetching profesores');
        return;
      }
      res.json(results);
    });
  });
  
  app.post('/profesores/mp-agregar-profesor', (req, res) => {
    const { idProfesor, Nombre, Clave} = req.body;
    db.query('INSERT INTO profesores (idProfesor, Nombre, Clave) VALUES (?, ?, ?)', [idProfesor, Nombre, Clave], (err, result) => {
      if (err) {
        res.status(500).send('Error creating curso');
        return;
      }
      const profesorId = result.insertId;
      db.query('SELECT * FROM profesores WHERE id = ?', profesorId, (err, result) => {
        if (err) {
          res.status(500).send('Error fetching created profesores');
          return;
        }
        res.status(201).json(result[0]);
      });
    });
  });
    
  app.get('/profesores/:id', (req, res) => {
    const profesorId = req.params.id;
    db.query('SELECT * FROM profesores WHERE id = ?', profesorId, (err, result) => {
      if (err) {
        res.status(500).send('Error fetching profesores');
        return;
      }
      if (result.length === 0) {
        res.status(404).send('cursos not found');
        return;
      }
      res.json(result[0]);
    });
  });
    
  app.put('/profesores/:id', (req, res) => {
    const profesorId = req.params.id;
    const { idProfesor, Nombre, Clave } = req.body;
    db.query('UPDATE profesores SET idProfesor = ?, Nombre = ?, Clave = ?, WHERE id = ?', [idProfesor, Nombre, Clave], err => {
      if (err) {
        res.status(500).send('Error updating profesores');
        return;
      }
      db.query('SELECT * FROM profesores WHERE id = ?', idProfesor, (err, result) => {
        if (err) {
          res.status(500).send('Error fetching updated profesores');
          return;
        }
        res.json(result[0]);
      });
    });
  });
    
  app.delete('/profesores/:id', (req, res) => {
    const cursoId = req.params.id;
    db.query('DELETE FROM profesores WHERE id = ?', cursoId, err => {
      if (err) {
        res.status(500).send('Error deleting profesores');
        return;
      }
      res.status(200).json({ msg: 'profesores deleted successfully' });
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
      db.query('SELECT * FROM cursos WHERE id = ?', cursoId, (err, result) => {
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

  /* EndPoins Colegio */
  app.get('/colegios', (req, res) => {
    db.query('SELECT * FROM colegios', (err, results) => {
      if (err) {
        res.status(500).send('Error fetching colegios');
        return;
      }
      res.json(results);
    });
  });
  
  app.post('/colegios/agregar-colegios', (req, res) => {
    const { idColegio, Nombre, idFundacion, idCiudad } = req.body;
    db.query('INSERT INTO colegios (idColegio, Nombre, idCiudad, idFundacion) VALUES (?, ?, ?, ?)', [idColegio, Nombre, idFundacion, idCiudad], (err, result) => {
      if (err) {
        res.status(500).send('Error creating colegio');
        return;
      }
      const colegioId = result.insertId;
      db.query('SELECT * FROM colegios WHERE id = ?', colegioId, (err, result) => {
        if (err) {
          res.status(500).send('Error fetching created colegio');
          return;
        }
        res.status(201).json(result[0]);
      });
    });
  });
  
  app.get('/colegios/:id', (req, res) => {
    const colegioId = req.params.id;
    db.query('SELECT * FROM colegios WHERE id = ?', colegioId, (err, result) => {
      if (err) {
        res.status(500).send('Error fetching colegio');
        return;
      }
      if (result.length === 0) {
        res.status(404).send('Colegio not found');
        return;
      }
      res.json(result[0]);
    });
  });
  
  app.put('/colegios/:id', (req, res) => {
    const colegioId = req.params.id;
    const { idColegio, Nombre, idCiudad, idFundacion } = req.body;
    db.query('UPDATE colegios SET idColegio = ?, Nombre = ?, idCiudad = ?, idFundacion = ? WHERE id = ?', [idColegio, Nombre, idCiudad, idFundacion, colegioId], err => {
      if (err) {
        res.status(500).send('Error updating colegio');
        return;
      }
      db.query('SELECT * FROM colegios WHERE id = ?', colegioId, (err, result) => {
        if (err) {
          res.status(500).send('Error fetching updated colegio');
          return;
        }
        res.json(result[0]);
      });
    });
  });
  
  app.delete('/colegios/:id', (req, res) => {
    const colegioId = req.params.id;
    db.query('DELETE FROM colegios WHERE id = ?', colegioId, err => {
      if (err) {
        res.status(500).send('Error deleting colegio');
        return;
      }
      res.status(200).json({ msg: 'Colegio deleted successfully' });
    });
  });
  

/* Start server */
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
