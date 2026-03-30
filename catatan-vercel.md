# Deploy snbp-mirror ke Vercel

## Kenapa Vercel?
- Next.js di PM2 lokal TTFB ~8s (lambat)
- Vercel edge network jauh lebih cepat untuk Next.js
- SSL otomatis, tidak perlu certbot
- Free tier cukup untuk project ini

## Langkah Deploy

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Deploy
```bash
cd ~/snbp-mirror
vercel
```
Ikuti wizard: login, set project name, framework Next.js (auto-detect).

### 3. Set Environment Variables
Bisa via CLI:
```bash
vercel env add APP_URL        # https://snbp.sman81.sch.id
vercel env add project_id     # snbp-e462b
vercel env add client_email   # firebase-adminsdk-fbsvc@snbp-e462b.iam.gserviceaccount.com
vercel env add private_key    # (isi dari .env.local)
```

Atau via Dashboard: vercel.com → project → Settings → Environment Variables

### 4. Custom Domain
- Vercel Dashboard → project → Domains → tambahkan `snbp.sman81.sch.id`
- Update DNS di Rumahweb:
  - Hapus A record `snbp` yang lama (116.254.114.219)
  - Tambahkan CNAME `snbp` → `cname.vercel-dns.com`
- SSL otomatis dihandle Vercel (tidak perlu certbot)

### 5. Re-deploy setelah env di-set
```bash
vercel --prod
```

## Catatan Teknis
- Firebase credentials ada di `.env.local` (sudah di .gitignore, aman push ke GitHub)
- Firebase project: snbp-e462b
- client_email: firebase-adminsdk-fbsvc@snbp-e462b.iam.gserviceaccount.com
- private_key: lihat file .env.local (jangan commit)

## Setelah DNS ke Vercel
- Nginx config di server untuk snbp.sman81.sch.id bisa dihapus
- PM2 snbp-mirror bisa di-stop: `pm2 stop snbp-mirror && pm2 save`
- Port 3001 bisa ditutup di UFW: `sudo ufw delete allow 3001`
