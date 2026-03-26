const fs = require('fs');

async function test() {
  const payload = {
    workTitle: 'Test',
    studentName: 'Nafiz',
    studentId: '123'
  };

  const res = await fetch('http://localhost:3000/api/pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const buffer = await res.arrayBuffer();
  fs.writeFileSync('test.pdf', Buffer.from(buffer));
  console.log('Saved test.pdf, size:', buffer.byteLength);
}

test();
