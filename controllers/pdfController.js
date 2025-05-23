import { savePdf } from '../models/pdfModel.js';
import html2pdf from 'html2pdf.js';

const generateAndSavePdf = (req, res) => {
  const { codigo, htmlContent } = req.body;

  const pdf = html2pdf().from(htmlContent).toPdf().get('pdf');

  pdf.then((pdfDoc) => {
    const pdfBuffer = pdfDoc.internal.stream.bytes;

    savePdf(codigo, pdfBuffer, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao salvar PDF no banco de dados' });
      }
      res.status(200).json({ message: 'PDF gerado e salvo com sucesso', result });
    });
  });
};

export { generateAndSavePdf };
