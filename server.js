const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let datosRecibidos = [];

app.post('/datos', (req, res) => {
    const data = req.body;
    datosRecibidos.push(data);
    console.log('📩 Nuevo dato recibido:', data);
    res.json({ mensaje: '✅ Dato recibido y almacenado' });
});

app.get('/ver-datos', (req, res) => {
    let html = '<h1>📄 Datos Recibidos</h1><ul>';
    datosRecibidos.forEach((dato, index) => {
        html += '<li><details><summary>Datos</summary><pre>' + JSON.stringify(dato, null, 2) + '</pre>';

        // Si hay una imagen en base64, mostrarla
        if (dato.photo) {
            html += `<p><strong>Foto capturada:</strong></p><img src="${dato.photo}" alt="Foto capturada" style="max-width:300px; max-height:300px;"/><br>`;
        }

        html += '</details></li>';
    });
    html += '</ul>';
    res.send(html);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
