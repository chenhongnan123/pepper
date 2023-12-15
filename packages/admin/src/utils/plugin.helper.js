import xlsx from 'xlsx';
import pdfjsLib from 'pdfjs-dist';

pdfjsLib.disableWorker = true;
pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.js';

export const exportXlsxData = (data, filename) => {
  const sheet1 = xlsx.utils.json_to_sheet(data);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, sheet1, 'sheet1');
  xlsx.writeFile(wb, filename);
};

// 导出多个sheet
export const exportXlsxDataV2 = (sheetlist, data, filename) => {
  if (sheetlist.length) {
    const wb = xlsx.utils.book_new();
    sheetlist.forEach((sheet, i) => {
      const sheetdata = xlsx.utils.json_to_sheet(data[i]);
      xlsx.utils.book_append_sheet(wb, sheetdata, sheet);
    });
    xlsx.writeFile(wb, filename);
  }
};

export const importXlsxData = (data) => {
  const wb = xlsx.read(data, { type: 'binary' });
  return xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '', raw: false });
};

export const getPDF = (url) => pdfjsLib.getDocument(url);
