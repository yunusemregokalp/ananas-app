const net = require('net');
console.log('173.249.23.10:5432 portuna baglaniliyor...');
const client = new net.Socket();
client.setTimeout(3000);
client.connect(5432, '173.249.23.10', function() {
    console.log('PORT 5432 AÇIK VE YANIT VERIYOR');
    client.destroy();
});
client.on('error', function(err) {
    console.log('BAĞLANTI HATASI:', err.message);
});
client.on('timeout', function() {
    console.log('ZAMAN AŞIMI (TIMEOUT) - PORT KAPALI OLABILIR');
    client.destroy();
});
