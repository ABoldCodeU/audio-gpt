
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

module.exports = {


    convertTxtToAudio: async function (model, voice, format, input) {
        try {
            const speechFile = path.resolve("./speech."+format);

            const mp3 = await openai.audio.speech.create({
                model: model, //tipo de modelo One of the available TTS models: tts-1 or tts-1-hd
                voice: voice, //The voice to use when generating the audio. Supported voices are alloy, echo, fable, onyx, nova, and shimmer. Previews of the voices are available in the Text to speech guide.
                response_format: format, //The format to audio in. Supported formats are mp3, opus, aac, flac, wav, and pcm.
                /*The maximum length is
                 4096 characters.*/
                input: input,
            });
            console.log(speechFile);
            const buffer = Buffer.from(await mp3.arrayBuffer());
            await fs.promises.writeFile(speechFile, buffer);
            console.log("Completed");
            return true
        }

        catch (error) {
            console.log(error.message)
            return false;
        }
    }


};