import store from '@/store';
import moment from 'moment';

class Format {
  install(Vue) {
    const funcList = [
      'getFormatBool',
      'getFormatNumber',
      'getFormatDate',
      'getUniqueArray',
      'encryptPwd',
      'getTimeout',
    ];
    for (let i = 0; i < funcList.length; i += 1) {
      Vue.prototype[`$${funcList[i]}`] = this[funcList[i]];
      store[`$${funcList[i]}`] = this[funcList[i]];
    }
  }

  getFormatBool(param) {
    return param ? 'Yes' : 'No';
  }

  getFormatNumber(param) {
    return param ? '1' : '0';
  }

  getFormatDate(date, format) {
    return moment(date).format(format);
  }

  // 数组去重
  getUniqueArray(array) {
    return array.filter((all, index, arr) => arr.indexOf(all) === index);
  }

  encryptPwd(password) {
    // 判断字符串是否为数字 ，判断正整数用/^[1-9]+[0-9]*]*$/
    const checkNum = /^[0-9]+.?[0-9]*$/;
    // 判断字符串是否为英文
    const checkEng = /^[A-Za-z]+$/;
    // 英文是否大写
    const upperCase = /^[A-Z]+$/;
    // 1.传回来的字符串转换成数组-2.新建一个数组length与上面的相等-3.遍历数组给每一个位置赋值
    // 规则：数字（偶数+2 ：奇数+1 ：9变为0）字母（向后一位：z变为a）符号不变
    const pswArr = [...password]; // 传回来的字符串转换成数组
    const newArr = new Array(pswArr.length); // 新建一个数组length与上面的相等
    for (let i = 0; i < pswArr.length; i += 1) { // 遍历数组给每一个位置赋值
      let a = pswArr[i];
      if (checkNum.test(a)) { // 先判断是否是数字
        a = Number(a) + 1;
        if (Number(a) === 10) {
          newArr[i] = 2;
        } else if (Number(a) % 2 === 0) { // 偶数
          newArr[i] = Number(a) + 2;
          // 加密7会变成10，导致后台解密成2个数字，其它数字加密后1-9都被占用，只剩0了，与后台约定7加密后为0 lishuo 2021-10-08
          if (newArr[i] === 10) {
            newArr[i] = 0;
          }
        } else { // 奇数
          newArr[i] = Number(a);
        }
      } else if (checkEng.test(a)) { // 字母
        if (upperCase.test(a)) { // 大写字母
          if (a === 'Z') {
            newArr[i] = 'A';
          } else {
            newArr[i] = String.fromCharCode(a.toLowerCase().charCodeAt(0) + 1).toUpperCase();
          }
        } else if (a === 'z') {
          newArr[i] = 'a';
        } else {
          newArr[i] = String.fromCharCode(a.charCodeAt(0) + 1);
        }
      } else {
        newArr[i] = a;
      }
    }
    return newArr.join(''); // 返回一个字符串
  }

  // 设置延时器
  async getTimeout(time) {
    let timeout = null;
    await new Promise((resolve) => { timeout = setTimeout(resolve, time); });
    clearTimeout(timeout);
    timeout = null;
    return true;
  }
}
export default new Format();
