import store from '@/store';
import xlsx from 'xlsx';

class File {
  install(Vue) {
    const funcList = [
      'downloadByUrl',
      'importXlsxData',
    ];
    for (let i = 0; i < funcList.length; i += 1) {
      Vue.prototype[`$${funcList[i]}`] = this[funcList[i]];
      store[`$${funcList[i]}`] = this[funcList[i]];
    }
  }

  // 下载文件
  downloadByUrl(url, filename) {
    // eslint-disable-next-line no-return-await
    fetch(url).then(async (res) => await res.blob()).then((blob) => {
      // 创建隐藏的可下载链接
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = URL.createObjectURL(blob);
      // 保存下来的文件名
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      // 移除元素
      document.body.removeChild(a);
    });
  }

  // 导入excel文件
  importXlsxData = (file, callback) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const wb = xlsx.read(e.target.result, { type: 'binary' });
      const excelData = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 'A' });
      callback(excelData);
    };
    reader.readAsBinaryString(file);
  };
}
export default new File();
