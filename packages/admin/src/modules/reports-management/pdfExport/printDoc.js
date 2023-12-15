// import pdfMake from 'pdfmake/build/pdfmake';
/* eslint-disable-file */
import pdfMake from './pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';
/* eslint-disable-file */
import pdfFonts from './vfs_fonts';

import getDocDefinition from './docDefinition';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

pdfMake.fonts = {
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: '../Roboto-Italic.ttf',
    bolditalics: '../Roboto-Italic.ttf',
  },
  Hyzh: {
    normal: 'hyzjh_zh.ttf',
    bold: 'hylxt_bold.ttf',
    italics: 'hyzjh_zh.ttf',
    bolditalics: 'hylxt_bold.ttf',
  },
};
function printDoc(printParams, fileName, gridApi, columnApi, agChartId) {
  const docDefinition = getDocDefinition(
    printParams,
    gridApi,
    columnApi,
    agChartId,
  );
  pdfMake.createPdf(docDefinition).download(fileName);
}

export default printDoc;
