import { firestoreApp } from "@/lib/firebase"
import { SnbpDocumentData } from "@/types/document";
import { SnbpSchoolSummary } from "@/types/snbp";
import { generateCountData } from "@/utils/generateCountData";

// In-memory cache: school → { data, expires }
const cache = new Map<string, { data: SnbpSchoolSummary | undefined; expires: number }>();
const TTL_MS = 60 * 60 * 1000; // 1 hour

export const getSnbpSummary = async (school: string) => {
    const key = school.toLowerCase();
    const cached = cache.get(key);
    if (cached && cached.expires > Date.now()) {
        return cached.data;
    }

    const docs = await firestoreApp.collection('snbp').where('data.se', '==', school).get();
    if (docs.empty) {
        cache.set(key, { data: undefined, expires: Date.now() + TTL_MS });
        return undefined;
    }

    const data = docs.docs.map<SnbpDocumentData>(doc => doc.data() as SnbpDocumentData);
    const accepted = data.filter(doc => doc.data.ac);

    const prodiAndUniv = {
        prodi: accepted.map(acc => acc.data.ac!.pr),
        univ: accepted.map(acc => acc.data.ac!.pt),
    }
    const countProdiAndUniv = generateCountData(prodiAndUniv);

    const countData: SnbpSchoolSummary['count'] = {
        prodi: countProdiAndUniv.prodi,
        universities: countProdiAndUniv.univ,
        accepted: accepted.length,
    }

    const result = {
        count: countData,
        members: accepted.map(acc => ({
            name: acc.data.na,
            prodi: acc.data.ac?.pr,
            university: acc.data.ac?.pt,
        })),
        schoolName: school.toUpperCase(),
    } as SnbpSchoolSummary;

    cache.set(key, { data: result, expires: Date.now() + TTL_MS });
    return result;
}