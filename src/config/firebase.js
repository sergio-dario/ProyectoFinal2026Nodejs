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

  // --- OPCIÓN VERCEL: Si no hay archivo pero están las variables de entorno individuales ---
  if (process.env.FIREBASE_TYPE && process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {
    const app = admin.initializeApp({
      credential: admin.cert({
        type: process.env.FIREBASE_TYPE,
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
        // Limpiamos los saltos de línea de la clave
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        clientId: process.env.FIREBASE_CLIENT_ID,
        authUri: process.env.FIREBASE_AUTH_URI,
        tokenUri: process.env.FIREBASE_TOKEN_URI,
        authProviderX509CertUrl: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
        clientX509CertUrl: process.env.FIREBASE_CLIENT_X509_CERT_URL,
        universeDomain: process.env.FIREBASE_UNIVERSE_DOMAIN
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