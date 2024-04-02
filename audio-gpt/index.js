
/*import pkg from 'dotenv';
import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';
pkg.config();
import ffmpeg from "fluent-ffmpeg";*/

const dotenv = require('dotenv');
dotenv.config();
const path = require('path');
const OpenAIApi = require('openai');
const fs = require('fs');
const openai = new OpenAIApi({
    apiKey: process.env.OPENAI_API_KEY,
});


const threadByUser = {}; // Store thread IDs by user


async function myFunction() {
    const speechFile = path.resolve("./speech.wav");

    const mp3 = await openai.audio.speech.create({
        model: "tts-1", //tipo de modelo One of the available TTS models: tts-1 or tts-1-hd
        voice: "alloy", //The voice to use when generating the audio. Supported voices are alloy, echo, fable, onyx, nova, and shimmer. Previews of the voices are available in the Text to speech guide.
        response_format: "wav", //The format to audio in. Supported formats are mp3, opus, aac, flac, wav, and pcm.
        /*The maximum length is
         4096 characters.*/
         input: "El Button de .NET Multi-platform App UI (.NET MAUI) muestra texto y responde a una pulsación o un clic que dirige la aplicación para llevar a cabo una tarea. Un Button normalmente muestra una cadena de texto corta que indica un comando, pero también puede mostrar una imagen de mapa de bits o una combinación de texto y una imagen. Cuando se presiona Button con un dedo o se hace clic con un ratón, inicia ese comando.",
    });
    console.log(speechFile);
    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(speechFile, buffer);
    console.log("Completed");
    
}

myFunction();