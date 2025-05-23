import con from '../utils/db.js';

const savePdf = (codigo, pdfBuffer, callback) => {
  const query = 'INSERT INTO certificados (codigo, pdf) VALUES (?, ?)';
  con.query(query, [codigo, pdfBuffer], callback);
};

export { savePdf };
