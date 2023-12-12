// En tu archivo de servidor (por ejemplo, server.js)
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const port = 43000;

app.use(express.json());

// Configuración del transporte
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'team.asischeck@gmail.com',
    pass: 'stratovarius1985'
  }
});

// Endpoint para enviar correos
app.post('/enviar-correo', (req, res) => {
  const { destinatario, asunto, contenido } = req.body;

  // Opciones del correo electrónico
  const mailOptions = {
    from: 'tu_correo@gmail.com',
    to: destinatario,
    subject: asunto,
    text: contenido
  };

  // Envío del correo electrónico
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error al enviar el correo:', error);
      res.status(500).send('Error al enviar el correo');
    } else {
      console.log('Correo electrónico enviado:', info.response);
      res.status(200).send('Correo electrónico enviado con éxito');
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
  
});
