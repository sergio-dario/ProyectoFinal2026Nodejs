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

  const credentialPath = getCredentialPath();

  if (fs.existsSync(credentialPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(credentialPath, "utf8"));
    const app = admin.initializeApp({
      credential: admin.cert(serviceAccount),
      projectId: serviceAccount.project_id || process.env.PROJECT_ID
    });
    return getFirestore(app);
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const app = admin.initializeApp({
      credential: admin.applicationDefault(),
      projectId: process.env.PROJECT_ID
    });
    return getFirestore(app);
  }

  throw new Error(
    "No Firebase credentials found. Add firebase-credentials.json or set GOOGLE_APPLICATION_CREDENTIALS."
  );
}

const db = initializeFirestore();

export { db };
export default db;