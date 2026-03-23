import { prisma } from './src/lib/prisma'
import bcrypt from 'bcryptjs'

async function check() {
  console.log("--- TEST BAŞLIYOR ---")
  
  try {
    const users = await prisma.user.findMany();
    console.log("TOPLAM KULLANICI SAYISI:", users.length);
    console.log("KULLANICILAR:", users.map(u => ({ id: u.id, email: u.email, phone: u.phone, role: u.role })));
    
    // Müşteri testini yapalım:
    const customer = await prisma.user.findFirst({
      where: {
        OR: [
          { email: '05551112233' },
          { phone: '05551112233' }
        ]
      }
    });

    console.log("\n05551112233 SORGUSU:", customer ? "BULUNDU" : "BULUNAMADI");

    if (customer) {
      const valid = await bcrypt.compare('123456', customer.password || '');
      console.log("CUSTOMER '123456' ŞİFRE DOĞRULAMASI:", valid);
    }
    
    // Admin testi
    const admin = await prisma.user.findFirst({
      where: { email: 'admin@ananas.com' }
    });
    console.log("\nADMIN SORGUSU:", admin ? "BULUNDU" : "BULUNAMADI");
    if (admin) {
        const valid = await bcrypt.compare('admin123', admin.password || '');
        console.log("ADMIN 'admin123' ŞİFRE DOĞRULAMASI:", valid);
    }

  } catch (err) {
    console.error("VERİTABANI HATASI:", err);
  }
}

check().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); })
