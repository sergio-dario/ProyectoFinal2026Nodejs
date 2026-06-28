import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import { initializeApp, getApps, cert, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function getCredentialPath() {
  return process.env.FIREBASE_CREDENTIALS_PATH
    ? path.resolve(process.cwd(), process.env.FIREBASE_CREDENTIALS_PATH)
    : path.join(process.cwd(), "firebase-credentials.json");
}

function initializeFirestore() {
  // Guardamos las apps inicializadas de forma segura usando el método oficial getApps()
  const apps = getApps();
  
  if (apps.length > 0) {
    return getFirestore(apps[0]);
  }

  // --- OPCIÓN LOCAL: Si existe el archivo JSON físico ---
  const credentialPath = getCredentialPath();
  if (fs.existsSync(credentialPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(credentialPath, "utf8"));
    const app = initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id || process.env.PROJECT_ID
    });
    return getFirestore(app);
  }

  // --- OPCIÓN VERCEL: Si no hay archivo pero están las variables obligatorias ---
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    
    const formattedPrivateKey = process.env.FIREBASE_PRIVATE_KEY
      .replace(/^"|"$/g, '')          // Limpia comillas externas
      .replace(/\\n/g, '\n');         // Repara saltos de línea escritos como texto

    const app = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: formattedPrivateKey,
      }),
      projectId: process.env.FIREBASE_PROJECT_ID
    });
    return getFirestore(app);
  }

  // --- OPCIÓN DE RESPALDO: Google Application Default ---
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const app = initializeApp({
      credential: applicationDefault(),
      projectId: process.env.PROJECT_ID
    });
    return getFirestore(app);
  }

  throw new Error(
    "No Firebase credentials found. Add firebase-credentials.json or set FIREBASE_* environment variables."
  );
}

const db = initializeFirestore();

export { db };
export default db;