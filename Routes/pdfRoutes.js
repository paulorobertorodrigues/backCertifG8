import express from 'express';
import { generateAndSavePdf } from '../controllers/pdfController.js';

const router = express.Router();

router.post('/generate-pdf', generateAndSavePdf);

export { router as pdfRouter };
