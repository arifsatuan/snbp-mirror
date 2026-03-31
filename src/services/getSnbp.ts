import ky from "ky";
import { SNBP_URL, CAPTURE_API_URL, CAPTURE_API_SECRET } from "../const";
import { SnbpDocumentData } from "../types/document";

export const getSnbp = async (id: string): Promise<SnbpDocumentData> => {
    // Fetch langsung dari SNBP — tidak ada cache
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

    // Lapor ke CI4 backend (fire-and-forget, tidak block response)
    if (CAPTURE_API_URL && CAPTURE_API_SECRET) {
        fetch(CAPTURE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CAPTURE_API_SECRET}`,
            },
            body: JSON.stringify({ key: id, na: response.na, ac: response.ac ?? null }),
        }).catch(() => { /* abaikan error jaringan */ });
    }

    return payload;
}
