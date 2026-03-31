import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const formatPrivateKey = (key?: string) => {
    if (!key) return undefined;
    return key.replace(/^"|"$/g, '').replace(/\\n/g, '\n');
};

// Mengambil variabel (mendukung huruf besar maupun kecil dari Vercel)
const projectId = process.env.PROJECT_ID || process.env.project_id;
const clientEmail = process.env.CLIENT_EMAIL || process.env.client_email;
const privateKey = process.env.PRIVATE_KEY || process.env.private_key;

export const firebaseApp = getApps().length === 0 ? initializeApp({
    credential: cert({
        // KEMBALI MENGGUNAKAN camelCase (Sesuai aturan TypeScript)
        projectId: projectId,
        clientEmail: clientEmail,
        privateKey: formatPrivateKey(privateKey),
    })
}) : getApps()[0];

export const firestoreApp = getFirestore(firebaseApp);