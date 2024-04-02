// Importar las dependencias
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
var openAiCore = require("./core/openAiCore.js");
const OpenAIApi = require('openai');
const fs = require('fs');
const path = require('path');
const openai = new OpenAIApi({
    apiKey: process.env.OPENAI_API_KEY,
});

// Crear una instancia de Express
const app = express();

// Definir el puerto del servidor
const PORT = process.env.PORT || 3000;

// Configurar los middleware
app.use(morgan('dev')); // Mostrar las peticiones HTTP en la consola
app.use(cors()); // Habilitar el intercambio de recursos entre dominios
app.use(express.json()); // Parsear el cuerpo de las peticiones en formato JSON

// Crear las rutas de la API
app.get('/', async (req, res) => {
    res.json({ message: 'Bienvenido a la API REST Chat Bot' });
});

app.get('/convertTextToAudio', async (req, res) => {
    try {
        const model = req.query.model
        const voice = req.query.voice
        const format = req.query.format
        const input = req.query.input
        console.log(model);
        console.log(voice);
        console.log(format);
        console.log(input);
        if (model == "tts-1" || model == "tts-1-hd") {
            if (voice == "alloy"
                || voice == "echo"
                || voice == "fable" || voice == "onyx"
                || voice == "nova"
                || voice == "shimmer") {
                if (format == "mp3"
                    || format == "opus"
                    || format == "aac"
                    || format == "flac"
                    || format == "wav"
                    || format == "pcm") {
                    if (input === null || input === undefined || input.length >= 4096) {
                        res.status(500).json({ error: "La entra de texto no puede estar vacia." });
                    }
                    else {
                        const result = await openAiCore.convertTxtToAudio(model, voice, format, input);
                        if (result) {

                            const filePath = path.resolve("./speech." + format);

                            // Verificar si el archivo existe
                            fs.access(filePath, fs.constants.F_OK, (err) => {
                                if (err) {
                                    console.error(err);
                                    res.status(404).send('Archivo no encontrado');
                                    return;
                                }

                                // Configurar encabezados de respuesta
                                res.set({
                                    'Content-Disposition': 'attachment; filename="audio."' + format
                                });
                                res.sendFile(filePath);
                            });
                        } else {
                            res.status(500).json({ error: "Ha ocurrido un error con la conversion" });
                        }
                    }

                }
                else {
                    res.status(500).json({ error: "Esta formato:" + format + " no es correcto" });
                }
            }
            else {
                res.status(500).json({ error: "Esta voz:" + voice + " no es correcto" });
            }
        }
        else {
            res.status(500).json({ error: "Este modelo:" + model + " no es correcto" });
        }
    } catch(errorTry)
    {
        res.status(500).json({ error: errorTry});
    }

});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log('Servidor escuchando en el puerto ' + PORT);
});