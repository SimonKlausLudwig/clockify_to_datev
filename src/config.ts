const dotenv = require('dotenv');
dotenv.config();

export const APP_CONFIG: { pdfService: string } = {
    pdfService: process.env.PDF_SERVICE as string,

}
