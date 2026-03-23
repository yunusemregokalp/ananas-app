const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({ connectionString: 'postgresql://postgres:ananas_pw_123@173.249.23.10:5432/ananas' });

async function run() {
  console.log('Kullanıcılar kontrol ediliyor...');
  
  const existing = await pool.query('SELECT id, email, phone, role FROM "User" LIMIT 20');
  console.log('Mevcut kullanıcılar:', existing.rows);

  if (existing.rows.length === 0) {
    console.log('\nHiç kullanıcı yok! Manuel ekleniyor...');
    
    const adminHash = await bcrypt.hash('admin123', 10);
    const userHash = await bcrypt.hash('123456', 10);
    
    // Admin
    await pool.query(`
      INSERT INTO "User" (id, email, phone, name, password, role, "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), 'admin@ananas.com', NULL, 'Super Admin', $1, 'SUPER_ADMIN', NOW(), NOW())
      ON CONFLICT (email) DO NOTHING
    `, [adminHash]);
    
    // Müşteri
    await pool.query(`
      INSERT INTO "User" (id, email, phone, name, password, role, "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), NULL, '05551112233', 'Müşteri Ayşe', $1, 'CUSTOMER', NOW(), NOW())
      ON CONFLICT (phone) DO NOTHING
    `, [userHash]);
    
    // Provider
    await pool.query(`
      INSERT INTO "User" (id, email, phone, name, password, role, "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), NULL, '05559998877', 'Usta Mehmet', $1, 'PROVIDER', NOW(), NOW())
      ON CONFLICT (phone) DO NOTHING
    `, [userHash]);

    console.log('Kullanıcılar eklendi!');
    
    const check = await pool.query('SELECT id, email, phone, role FROM "User"');
    console.log('Yeni durum:', check.rows);
  } else {
    console.log('Kullanıcılar zaten mevcut.');
    
    // Şifreleri sıfırlayalım (her ihtimale karşı)
    const userHash = await bcrypt.hash('123456', 10);
    const adminHash = await bcrypt.hash('admin123', 10);
    
    await pool.query(`UPDATE "User" SET password=$1 WHERE role='CUSTOMER' OR role='PROVIDER'`, [userHash]);
    await pool.query(`UPDATE "User" SET password=$1 WHERE role='SUPER_ADMIN' OR role='ADMIN'`, [adminHash]);
    console.log('Şifreler sıfırlandı.');
  }
  
  await pool.end();
}

run().catch(e => { console.error(e); process.exit(1); });
