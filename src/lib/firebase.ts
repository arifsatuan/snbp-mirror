import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

export const firebaseApp = getApps().length === 0 ? initializeApp({
    credential: cert({
        clientEmail: process.env.client_email,
        // Mengubah teks \n menjadi karakter baris baru (newline) yang sebenarnya
        privateKey: process.env.private_key ? process.env.private_key.replace(/\\n/g, '\n') : undefined,
        
        projectId: process.env.project_id,
    })
}) : getApps()[0];

export const firestoreApp = getFirestore(firebaseApp);