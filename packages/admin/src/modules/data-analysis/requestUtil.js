// 获取检验项传参键值
export const getTestsParamName = (isValue, name) => {
  switch (name) {
    case 'onepoint':
      return isValue ? 'nsigma' : 'vr_oocl';
    case 'npointssameside':
      return isValue ? 'num_kos' : 'vr_kos';
    case 'npointsall':
      return isValue ? 'num_kid' : 'vr_kid';
    case 'npointsupdown':
      return isValue ? 'num_kud' : 'vr_kud';
    case 'pointsbiggerthan2':
      return isValue ? 'num_os2std' : 'vr_os2std';
    case 'pointsbiggerthan1':
      return isValue ? 'num_os1std' : 'vr_os1std';
    case 'npoints1':
      return isValue ? 'num_kin1std' : 'vr_kin1std';
    case 'npointsbiggerthan1':
      return isValue ? 'num_koo1std' : 'vr_koo1std';
    default:
      return isValue ? 'nsigma' : 'vr_oocl';
  }
};

// 获取权重&重置传参键值
export const getWeightsParamName = (param) => {
  switch (param) {
    case 'zonea':
      return 'za';
    case 'zoneb':
      return 'zb';
    case 'zonec':
      return 'zc';
    case 'zoned':
      return 'zd';
    case 'reset':
      return 'reset';
    case 'zonensigma':
      return 'zone';
    default:
      return 'zone';
  }
};

// 判断当前算法是否需要在payload中加入指定字段参数
export const checkParamExists = (category, name) => category[name] && category[name].show;

// 校验权重选项卡中区域得分
export const checkWeightsZone = (weights) => {
  const {
    zonea,
    zoneb,
    zonec,
    zoned,
  } = weights;
  if ((zonea === null && zoneb === null && zonec === null && zoned === null)
    || (zonea === '' && zoneb === '' && zonec === '' && zoned === '')) {
    return true;
  }
  if (zonea !== null && zoneb !== null && zonec !== null && zoned !== null) {
    if (Number(zonea) < Number(zoneb)
      && Number(zoneb) < Number(zonec)
      && Number(zonec) < Number(zoned)) {
      return true;
    }
  }
  return false;
};

// 筛选非空数组
export const filteredTableData = (source, tag) => source.filter((item) => item[tag] !== ''
&& item[tag] !== null && item[tag] !== undefined && item[tag] !== 'null' && item[tag] !== 'undefined');

// 筛选查询得到的源数据，去除值为null和''的数据
export const filterEmptyTableData = (source, columnlist) => {
  // columnlist可以包含数据列和标签列
  let result = source.concat();
  if (columnlist && columnlist.length > 0) {
    for (let i = 0; i < columnlist.length; i += 1) {
      const col = columnlist[i];
      const temparr = filteredTableData(result, col);
      result = temparr.map((item) => {
        const obj = {
          ...item,
        };
        return obj;
      });
    }
    return result;
  }
  return result;
};
