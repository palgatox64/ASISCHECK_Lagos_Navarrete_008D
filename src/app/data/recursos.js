const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 3000;

const corsOptions = {
  origin: 'http://localhost:8100',
};

app.use(cors(corsOptions));

// Configuración de multer para almacenar las imágenes en la carpeta 'uploads'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Recursos de estudio (simulados en un arreglo)
const recursosDeEstudio = [
  // ... (otros recursos)
];

// Ruta para subir una imagen y obtener la URL
app.post('/upload', upload.single('imagen'), (req, res) => {
  if (req.file) {
    const imageUrl = 'http://localhost:3000/uploads/' + req.file.filename;
    res.json({ imageUrl });
  } else {
    res.status(400).json({ error: 'No se pudo subir la imagen' });
  }
});

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
