import React from 'react';
import CodeBlock from './CodeBlock';

interface AutomationGuideProps {
  onClose: () => void;
}

const nodeScriptCode = `
// Requisitos:
// 1. Instalar paquetes: npm install @google/genai twitter-api-v2 dotenv
// 2. Crear un archivo .env y añadir tus claves (ver Paso 4 de la guía).
// 3. Este script asume que usas ES Modules en tu package.json ("type": "module").

import { GoogleGenAI } from "@google/genai";
import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';

dotenv.config();

// --- CONFIGURACIÓN ---
const TOPIC = "El futuro de la inteligencia artificial"; // El tema para los tuits
const TONE = "Inspirador"; // Puede ser 'Profesional', 'Casual', 'Divertido', etc.
// --- FIN DE LA CONFIGURACIÓN ---


// 1. Configurar cliente de Gemini
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 2. Configurar cliente de Twitter
const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_KEY_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

const rwClient = twitterClient.readWrite;

// 3. Función para generar un tuit
async function generateTweet(topic, tone) {
  const model = "gemini-2.5-flash";
  const prompt = \`Genera UN solo tuit corto y atractivo para X sobre: "\${topic}".
  El tono debe ser \${tone}.
  Debe tener menos de 280 caracteres e incluir 2-3 hashtags relevantes.
  Responde únicamente con el texto del tuit, sin adornos.\`;

  try {
    const response = await genAI.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generando el tuit:", error);
    throw error;
  }
}

// 4. Función para publicar el tuit
async function postTweet() {
  try {
    console.log("Generando tuit...");
    const tweetText = await generateTweet(TOPIC, TONE);
    
    if (!tweetText) {
      console.log("No se generó texto para el tuit. Abortando.");
      return;
    }

    console.log(\`Tuit generado: "\${tweetText}"\`);
    console.log("Publicando en X...");

    await rwClient.v2.tweet(tweetText);
    console.log("¡Tuit publicado con éxito!");

  } catch (error) {
    console.error("Error en el proceso de publicación:", error);
  }
}

// Ejecutar la función principal
postTweet();
`;

const yamlWorkflowCode = `
# Guarda este archivo en tu repositorio en la ruta: .github/workflows/post-tweet.yml

name: Publicar Tuit Automático

on:
  workflow_dispatch: # Permite ejecutarlo manualmente desde la pestaña Actions de GitHub
  schedule:
    # Se ejecuta cada 6 horas (a las 00:00, 06:00, 12:00, 18:00 UTC)
    # Puedes ajustar el horario usando un generador de cron: https://crontab.guru/
    - cron: '0 */6 * * *'

jobs:
  tweet:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout del código
        uses: actions/checkout@v3

      - name: Configurar Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18' # Usa una versión LTS de Node.js

      - name: Instalar dependencias
        run: npm install

      - name: Ejecutar script para publicar tuit
        run: node ./path/to/your/script.js # <-- Cambia esto a la ruta de tu script
        env:
          GEMINI_API_KEY: \${{ secrets.GEMINI_API_KEY }}
          TWITTER_API_KEY: \${{ secrets.TWITTER_API_KEY }}
          TWITTER_API_KEY_SECRET: \${{ secrets.TWITTER_API_KEY_SECRET }}
          TWITTER_ACCESS_TOKEN: \${{ secrets.TWITTER_ACCESS_TOKEN }}
          TWITTER_ACCESS_TOKEN_SECRET: \${{ secrets.TWITTER_ACCESS_TOKEN_SECRET }}
`;

const AutomationGuide: React.FC<AutomationGuideProps> = ({ onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()} // Evita que el clic dentro del modal lo cierre
      >
        <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
                Automatiza tus Publicaciones
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <p className="text-slate-300 mb-6">
            Sigue estos pasos para configurar un bot que genere y publique tuits automáticamente en tu cuenta de X usando GitHub Actions.
        </p>

        <div className="space-y-8">
            <div>
                <h3 className="text-xl font-semibold text-sky-400 mb-2 border-b-2 border-slate-700 pb-2">Paso 1: Pre-requisitos</h3>
                <ul className="list-disc list-inside space-y-2 text-slate-300">
                    <li>Una cuenta de <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:underline">GitHub</a> y un repositorio para tu proyecto.</li>
                    <li><a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:underline">Node.js</a> instalado en tu máquina para probar el script localmente.</li>
                    <li>Una clave API de Gemini (la que ya usas para esta app).</li>
                    <li>Credenciales de la API de X (<a href="https://developer.twitter.com/en/docs/twitter-api" target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:underline">API Key, API Secret, Access Token, Access Secret</a>) con permisos de escritura.</li>
                </ul>
            </div>
            
            <div>
                <h3 className="text-xl font-semibold text-sky-400 mb-2 border-b-2 border-slate-700 pb-2">Paso 2: El Script de Node.js</h3>
                <p className="text-slate-300 mb-2">
                    Crea un archivo en tu repositorio (p. ej., <code className="bg-slate-900 px-1 rounded">scripts/run.js</code>) y pega el siguiente código. Este script se encargará de generar y publicar el tuit.
                </p>
                <CodeBlock code={nodeScriptCode} language="javascript" />
            </div>

            <div>
                <h3 className="text-xl font-semibold text-sky-400 mb-2 border-b-2 border-slate-700 pb-2">Paso 3: El Workflow de GitHub Actions</h3>
                <p className="text-slate-300 mb-2">
                    En tu repositorio de GitHub, crea la ruta de carpetas <code className="bg-slate-900 px-1 rounded">.github/workflows/</code>. Dentro, crea un archivo llamado <code className="bg-slate-900 px-1 rounded">post-tweet.yml</code> y pega este contenido.
                </p>
                <CodeBlock code={yamlWorkflowCode} language="yaml" />
            </div>

            <div>
                <h3 className="text-xl font-semibold text-sky-400 mb-2 border-b-2 border-slate-700 pb-2">Paso 4: Configurar los "Secrets"</h3>
                 <p className="text-slate-300 mb-4">
                    ¡Nunca publiques tus claves API directamente en el código! Ve a tu repositorio de GitHub, luego a <code className="bg-slate-900 px-1 rounded">Settings &gt; Secrets and variables &gt; Actions</code>. Haz clic en "New repository secret" y añade los siguientes secrets uno por uno:
                </p>
                <ul className="list-none space-y-2 bg-slate-900 p-4 rounded-md">
                    <li className="font-mono text-green-400">GEMINI_API_KEY</li>
                    <li className="font-mono text-green-400">TWITTER_API_KEY</li>
                    <li className="font-mono text-green-400">TWITTER_API_KEY_SECRET</li>
                    <li className="font-mono text-green-400">TWITTER_ACCESS_TOKEN</li>
                    <li className="font-mono text-green-400">TWITTER_ACCESS_TOKEN_SECRET</li>
                </ul>
            </div>
        </div>

        <div className="mt-8 text-center text-slate-400 border-t border-slate-700 pt-4">
            <p>¡Y listo! GitHub Actions ejecutará tu script según el horario definido. Puedes ver los logs de ejecución en la pestaña "Actions" de tu repositorio.</p>
        </div>

      </div>
    </div>
  );
};

export default AutomationGuide;