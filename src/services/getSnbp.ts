import ky from "ky";
import { SNBP_URL } from "../const";
import { SnbpDocumentData } from "../types/document";
import { firestoreApp } from "../lib/firebase";

// In-memory cache: key → { data, expires }
const cache = new Map<string, { data: SnbpDocumentData; expires: number }>();
const TTL_MS = 60 * 60 * 1000; // 1 hour

export const getSnbp = async (id: string): Promise<SnbpDocumentData> => {
    // 1. Memory cache
    const cached = cache.get(id);
    if (cached && cached.expires > Date.now()) {
        return cached.data;
    }

    // 2. Fetch langsung dari SNBP asli
    const response = await ky.get<SnbpDocumentData['data']>(encodeURIComponent(id), {
        prefixUrl: SNBP_URL + '/static/',
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
    }).json();

    const payload: SnbpDocumentData = {
        id,
        data: response,
        fetched_at: Date.now(),
    };

    // 3. Simpan ke memory cache
    cache.set(id, { data: payload, expires: Date.now() + TTL_MS });

    // 4. Simpan ke Firebase hanya kalau diterima (untuk summary/arsip)
    if (response.ac) {
        firestoreApp.collection('snbp').where('id', '==', id).get().then(docs => {
            if (docs.empty) {
                firestoreApp.collection('snbp').add(payload);
            }
        });
    }

    return payload;
}
