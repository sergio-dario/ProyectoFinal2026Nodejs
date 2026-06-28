import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

function getCredentialPath() {
  return process.env.FIREBASE_CREDENTIALS_PATH
    ? path.resolve(process.cwd(), process.env.FIREBASE_CREDENTIALS_PATH)
    : path.join(process.cwd(), "firebase-credentials.json");
}

function initializeFirestore() {
  if (admin.apps?.length) {
    return getFirestore(admin.app());
  }

  // --- OPCIÓN LOCAL: Si existe el archivo JSON físico ---
  const credentialPath = getCredentialPath();
  if (fs.existsSync(credentialPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(credentialPath, "utf8"));
    const app = admin.initializeApp({
      credential: admin.cert(serviceAccount),
      projectId: serviceAccount.project_id || process.env.PROJECT_ID
    });
    return getFirestore(app);
  }

  // --- OPCIÓN VERCEL: Simplificada a las 3 variables obligatorias ---
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    
    // Limpiamos comillas extra y reparamos los saltos de línea de la clave
    const formattedPrivateKey = process.env.FIREBASE_PRIVATE_KEY
      .replace(/^"|"$/g, '')          // Elimina comillas al principio o al final si existen
      .replace(/\\n/g, '\n');         // Convierte el texto "\n" en saltos reales

    const app = admin.initializeApp({
      credential: admin.cert({
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
    const app = admin.initializeApp({
      credential: admin.applicationDefault(),
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