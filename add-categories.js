const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres:ananas_pw_123@173.249.23.10:5432/ananas' });

async function addCategories() {
  const categories = [
    { name: 'Boya Badana', slug: 'boya-badana', description: 'İç ve dış cephe boya badana hizmeti.' },
    { name: 'Tadilat & Dekorasyon', slug: 'tadilat', description: 'Ev ve ofis tadilat, dekorasyon ve yenileme.' },
    { name: 'Özel Ders', slug: 'ozel-ders', description: 'Matematik, İngilizce, müzik ve daha fazlası.' },
    { name: 'Web Tasarım', slug: 'web-tasarim', description: 'Profesyonel web sitesi tasarım ve geliştirme.' },
    { name: 'Elektrik Tesisatı', slug: 'elektrik', description: 'Ev ve işyeri elektrik tesisatı.' },
    { name: 'Tesisat & Su Tesisatı', slug: 'tesisat', description: 'Su tesisatı tamiri ve yenileme.' },
    { name: 'Klima Servisi', slug: 'klima-servisi', description: 'Klima montaj, bakım ve tamir.' },
    { name: 'Fotoğrafçılık', slug: 'fotografcilik', description: 'Düğün, ürün ve portre fotoğrafçılığı.' },
    { name: 'Bahçe Bakımı', slug: 'bahce-bakimi', description: 'Bahçe düzenleme, çim biçme ve peyzaj.' },
    { name: 'Pest Kontrol', slug: 'pest-kontrol', description: 'Böcek ve haşere ilaçlama hizmeti.' },
  ];

  for (const cat of categories) {
    const exists = await pool.query('SELECT id FROM "ServiceCategory" WHERE slug = $1', [cat.slug]);
    if (exists.rows.length === 0) {
      await pool.query(
        `INSERT INTO "ServiceCategory" (id, name, slug, description, "isActive", "createdAt", "updatedAt")
         VALUES (gen_random_uuid(), $1, $2, $3, true, NOW(), NOW())`,
        [cat.name, cat.slug, cat.description]
      );
      console.log('✅ Eklendi:', cat.name);
    } else {
      console.log('⏩ Zaten mevcut:', cat.name);
    }
  }

  await pool.end();
  console.log('\nKategoriler tamamlandı!');
}

addCategories().catch(console.error);
