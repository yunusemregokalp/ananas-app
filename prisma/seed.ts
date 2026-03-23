import { PrismaClient } from '@prisma/client'
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from 'bcryptjs'

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool as any)

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding veritabanı başlatılıyor...')

  // Demo Kullanıcıları
  const adminPassword = await bcrypt.hash('admin123', 10)
  const providerPassword = await bcrypt.hash('123456', 10)
  const customerPassword = await bcrypt.hash('123456', 10)

  // 1. Super Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ananas.com' },
    update: {},
    create: {
      email: 'admin@ananas.com',
      name: 'Super Admin',
      password: adminPassword,
      role: 'SUPER_ADMIN',
    },
  })

  // 2. Demo Müşteri
  const customer = await prisma.user.upsert({
    where: { phone: '05551112233' },
    update: {},
    create: {
      phone: '05551112233',
      name: 'Müşteri Ayşe',
      password: customerPassword,
      role: 'CUSTOMER',
      customerProfile: {
        create: {
          city: 'İstanbul',
          district: 'Kadıköy',
        }
      }
    },
  })

  // 3. Demo Hizmet Veren
  const provider = await prisma.user.upsert({
    where: { phone: '05559998877' },
    update: {},
    create: {
      phone: '05559998877',
      name: 'Usta Mehmet',
      password: providerPassword,
      role: 'PROVIDER',
      providerProfile: {
        create: {
          companyName: 'Mehmet Yapı',
          bio: '20 yıllık tecrübemle kaliteli işler yapıyorum.',
          city: 'İstanbul',
          districts: ['Kadıköy', 'Üsküdar', 'Ataşehir'],
          status: 'APPROVED',
          averageRating: 4.8,
          totalReviews: 12,
        }
      },
      wallet: {
        create: {
          balance: 1000 // 1000 Kredi hediye
        }
      }
    },
  })

  // 4. Hizmet Kategorileri ve Sorular
  const catTemizlik = await prisma.serviceCategory.upsert({
    where: { slug: 'ev-temizligi' },
    update: {},
    create: {
      name: 'Ev Temizliği',
      slug: 'ev-temizligi',
      description: 'Profesyonel ev temizliği hizmeti.',
      questions: {
        create: [
          {
            questionText: 'Eviniz kaç metrekare?',
            questionType: 'NUMBER',
            order: 1,
          },
          {
            questionText: 'Evinizde hayvan besliyor musunuz?',
            questionType: 'SELECT',
            order: 2,
            options: {
              create: [
                { label: 'Evet', value: 'EVET' },
                { label: 'Hayır', value: 'HAYIR' },
              ]
            }
          }
        ]
      }
    }
  })

  const catNakliyat = await prisma.serviceCategory.upsert({
    where: { slug: 'nakliyat' },
    update: {},
    create: {
      name: 'Nakliyat',
      slug: 'nakliyat',
      description: 'Şehir içi ve şehirler arası güvenli nakliyat.',
    }
  })

  console.log('Seed tamamlandı!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
