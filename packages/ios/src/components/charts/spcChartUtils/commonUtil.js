// 数值数组获取最小值
export const getMin = (arr) => Math.min.apply(null, arr);

// 数值数组获取最大值
export const getMax = (arr) => Math.max.apply(null, arr);

// 判断是否为数组
export const isArr = (arr) => Array.isArray(arr);

// 判断是否为对象
export const isObject = (obj) => Object.prototype.toString.call(obj) === '[object Object]';

// 判断是否为number类型
export const isNum = (val) => typeof (val) === 'number';

// 判断是否为String类型
export const isString = (val) => typeof (val) === 'string';

// 对象数组根据tag属性去重
export const removeDuplicateObj = (arr, tag) => {
  const obj = {};
  arr = arr.reduce((newArr, next) => {
    if (!obj[next[tag]]) {
      obj[next[tag]] = true && newArr.push(next);
    }
    return newArr;
  }, []);
  return arr;
};

// 数值数组冒泡排序
export const bubbleSort = (arr) => {
  const len = arr.length;
  if (len < 2) {
    return arr;
  }
  for (let i = 0; i < len; i += 1) {
    for (let j = 0; j < i; j += 1) {
      if (arr[j] > arr[i]) {
        const temp = arr[j];
        arr[j] = arr[i];
        arr[i] = temp;
      }
    }
  }
  return arr;
};

// 判断两个对象是否相同
export const objectIsEqual = (oldData, newData) => {
  if (oldData === newData) {
    return true;
  }
  if (typeof oldData !== 'object' || typeof newData !== 'object'
    || oldData === null || newData === null) {
    return false;
  }
  const keys1 = Object.keys(oldData);
  const keys2 = Object.keys(newData);
  if (keys1.length !== keys2.length) {
    return false;
  }
  // eslint-disable-next-line
  for (const key of keys1) {
    if (!objectIsEqual(oldData[key], newData[key])) {
      return false;
    }
  }
  return true;
};
