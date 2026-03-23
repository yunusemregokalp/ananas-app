const { Pool } = require('pg');
const connectionString = 'postgresql://postgres:ananas_pw_123@173.249.23.10:5432/ananas';
console.log("Baglaniliyor:", connectionString);

const pool = new Pool({ connectionString });
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('HATA:', err);
    } else {
        console.log('BAŞARILI:', res.rows);
    }
    pool.end();
});
