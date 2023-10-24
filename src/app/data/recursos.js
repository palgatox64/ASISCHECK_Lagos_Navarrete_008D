const express = require('express');
const cors = require('cors'); // Agrega esta línea
const app = express();
const port = 3000;

const corsOptions = {
  origin: 'http://localhost:8100',  
};

app.use(cors(corsOptions));

// Recursos de estudio (simulados en un arreglo)
const recursosDeEstudio = [
  { id: 1, titulo: 'Getting Started with Python', tipo: 'PDF', enlace: 'https://www.ciscolive.com/c/dam/r/ciscolive/emea/docs/2020/pdf/DEVNET-1893d.pdf', imagen: 'https://i.imgur.com/aOL57Mp.png' },
  { id: 2, titulo: 'The Oxford 3000', tipo: 'PDF', enlace: 'https://www.oxfordlearnersdictionaries.com/external/pdf/wordlists/oxford-3000-5000/American_Oxford_3000.pdf', imagen: 'https://i.imgur.com/IaDTO3j.png' },

];

// Ruta para obtener todos los recursos de estudio
app.get('/recursos', (req, res) => {
  res.json(recursosDeEstudio);
});

// Ruta para obtener un recurso específico por ID
app.get('/recursos/:id', (req, res) => {
  const resourceId = parseInt(req.params.id);
  const recurso = recursosDeEstudio.find((r) => r.id === resourceId);
  if (recurso) {
    res.json(recurso);
  } else {
    res.status(404).json({ error: 'Recurso no encontrado' });
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
