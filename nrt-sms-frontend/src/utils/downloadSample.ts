export function downloadSampleCSV(filename: string, headers: string[], rows: string[][]) {
  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadSampleContacts() {
  downloadSampleCSV(
    'sample-contacts.csv',
    ['Name', 'Mobile', 'Email', 'Group'],
    [
      ['Rahul Sharma', '9876543210', 'rahul@email.com', 'Customers'],
      ['Priya Patel', '9876543211', 'priya@email.com', 'Customers'],
      ['Amit Singh', '9876543212', 'amit@email.com', 'Employees'],
    ]
  );
}

export function downloadSampleDLT() {
  downloadSampleCSV(
    'sample-dlt-templates.csv',
    ['Template ID', 'Entity ID', 'Header', 'Content'],
    [
      ['TMP001', 'ENT001', 'NRT-SMS', 'Your OTP for verification is {#var#}'],
      ['TMP002', 'ENT001', 'NRT-INFO', 'Dear {#var#}, your order {#var#} has been shipped.'],
    ]
  );
}

export function downloadSampleSenderID() {
  downloadSampleCSV(
    'sample-sender-ids.csv',
    ['Sender ID'],
    [['NRT-SMS'], ['NRT-INFO'], ['NRT-ALERT']]
  );
}

export function downloadReportCSV(rows: Record<string, any>[], filename: string) {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const data = rows.map(r => headers.map(h => String(r[h] ?? '')));
  downloadSampleCSV(filename, headers, data);
}
