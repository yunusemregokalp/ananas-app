# ANANAS Hizmet Pazaryeri - Kurulum ve Dokümantasyon

ANANAS platformunun MVP (Minimum Viable Product) altyapısı, yatırımcılara ve kullanıcılara premium bir deneyim sunmak üzere tasarlanmıştır.

## 🛠 Kullanılan Teknolojiler
- **Mimarisi:** Next.js 15 (App Router)
- **Veritabanı ORM:** Prisma
- **Veritabanı Motoru:** PostgreSQL
- **UI & Stil:** Tailwind CSS v4, shadcn/ui
- **Auth:** NextAuth (Credentials JWT)
- **Mesajlaşma:** Pusher / Pusher-JS (Kurulum için hazırlandı)

## 🚀 Başlangıç ve Kurulum

### 1. Ortam Değişkenleri
Proje dizininde (ananas-app) bir `.env` dosyası oluşturun:
```env
DATABASE_URL="postgresql://kullanici:sifre@localhost:5432/ananas?schema=public"
NEXTAUTH_SECRET="gizli_anahtar_buraya"
NEXTAUTH_URL="http://localhost:3000"
```

### 2. Bağımlılıkları Yükleme
```bash
npm install
```

### 3. Veritabanı ve Migration
```bash
npx prisma db push   # Veya npx prisma migrate dev
npx prisma generate  # Prisma istemcisini (Client) yenilemek için
```

### 4. Seed İşlemi (Demo Veriler)
Platformu test etmek için demo hesapları ve kategorileri oluşturun:
```bash
npm install -D tsx
npx prisma db seed
```

### 5. Projeyi Ayağa Kaldırma
```bash
npm run dev
```

## 👥 Demo Hesaplar (Seed verisiyle aktifleşir)
- **Süper Admin:** admin@ananas.com (Şifre: admin123)
- **Müşteri** 05551112233 (Şifre: 123456)
- **Hizmet Veren** 05559998877 (Şifre: 123456)

## 📂 Proje Yapısı (Bilgi Mimarisi)
- `src/app`: Next.js sayfaları (Kategoriler, Login, Ana sayfa vb.)
- `src/components/ui`: shadcn/ui premium komponentleri.
- `src/lib/auth.ts`: NextAuth telefon ve mail tabanlı kimlik doğrulama.
- `src/middleware.ts`: Rol tabanlı rota korumaları (Admin, Provider).
- `prisma/schema.prisma`: Sistemin kalbi, tüm veritabanı ilişkileri ( Wallet, Quotes, Requests vs. )

## 📌 Gelir Modelimisi (Teklif Başına Kredi)
Platform, "Kredi Düşme" (Lead modelini) benimsemiştir. Sağlayıcılar önceden cüzdanlarına (Wallet tablosu) bakiye yüklerler ve gelen iş fırsatlarına "Teklif (Quote)" verirken belirtilen miktar kadar (`creditCost`) bakiyeleri düşer.

Bu altyapıda komisyon tutma (Escrow) karmaşası yoktur, böylelikle MVP sıfır riskle ve peşin nakit akışıyla büyümeye hazırdır!
