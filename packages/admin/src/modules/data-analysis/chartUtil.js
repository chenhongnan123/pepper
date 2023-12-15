import {
  isArr,
  isObject,
} from './commonUtil';

// 格式化违规点数据对象（转换成数组）
export const formatVioPoints = (pointsObj) => {
  const result = [];
  let count = 1;
  // eslint-disable-next-line
  for (let key in pointsObj) {
    // 排除包含@type的key值
    if (!key.includes('@type')) {
      // 筛选有违规点的检验项并写入数组
      if (pointsObj[key].length > 0) {
        const obj = {
          name: key,
          num: count, // 违规检验项编号，从1开始
          values: pointsObj[key],
        };
        result.push(obj);
        count += 1;
      }
    }
  }
  return result;
};

// 判断是否为移动极差控制图
export const isMRChart = (chartData, isfirst, issecond) => {
  const charttype = chartData.chart_type;
  if (charttype === 'mr_chart'
    || (charttype === 'i-mr_chart' && !isfirst && issecond)
    || (charttype === 'z-mr_chart' && !isfirst && issecond)
    || (charttype === 'i-mr-rs_chart' && !isfirst && issecond)) {
    return true;
  }
  return false;
};

// 判断是否为包含移动极差控制图的算法
export const isHasMRChart = (chartData) => {
  const charttype = chartData.chart_type;
  // 以下算法均包含移动极差控制图
  if (charttype === 'mr_chart' || charttype === 'i-mr_chart'
    || charttype === 'z-mr_chart' || charttype === 'i-mr-rs_chart') {
    return true;
  }
  return false;
};

// 获取标签列对应标签，显示在控制图tooltip中
export const getLabelTextFromIndex = (key, arr) => {
  const index = Number(key);
  return arr[index];
};

// 获取数据点违规检验项编号
export const getTestsTag = (x, mr, pointsObj, chartData, isfirst, issecond) => {
  const tagArr = [];
  let index = Number(x);
  // 检验项返回的是index，若为MR控制图，则需要x轴坐标-mr后与检验项的index对应
  if (isMRChart(chartData, isfirst, issecond)) {
    index = Number(x - mr);
  } else {
    // 非MR控制图则x轴坐标-1与之对应
    index = Number(x - 1);
  }
  const pointsArr = formatVioPoints(pointsObj);
  for (let i = 0; i < pointsArr.length; i += 1) {
    const { values, num } = pointsArr[i];
    if (values.includes(index)) {
      tagArr.push(num);
    }
  }
  // 若不存在违规检验项则返回空串
  return tagArr.length ? tagArr.toString() : '';
};

// 判断是否为违规数据点，用作数据点标记颜色
export const isViolatePoint = (index, viopoints) => {
  // 传入的违规数据若为数组则直接判断（多变量算法会传入数组）
  if (isArr(viopoints)) {
    if (viopoints.includes(index)) {
      return true;
    }
  }
  // 其他包含检验项的算法，会传入一个对象
  if (isObject(viopoints)) {
    // eslint-disable-next-line
    for (let i in viopoints) {
      const arr = viopoints[i];
      if (arr.includes(index)) {
        return true;
      }
    }
  }
  return false;
};

export const getMaxOrMin = (type, limit, value) => {
  if (type === 'max') {
    // 上限值向上取整
    return limit > value ? limit.toFixed(2) : value.toFixed(2);
  }
  // 下限值向下取整
  return limit < value ? limit.toFixed(2) : value.toFixed(2);
};

// 上下限中线显示数字格式化处理
export const formatPointValue = (value, charttype) => {
  if (value.toString().indexOf('.') > -1) {
    // zone_chart中线值保留3位小数
    if (charttype === 'zone_chart') {
      return Number(value).toFixed(3);
    }
    return Number(value).toFixed(2);
  }
  return value;
};

// 获取控制图中线文本垂直偏移像素
export const centerlineLabely = (chartdata, isfirst) => {
  const charttype = chartdata.chart_type;
  if ((charttype === 'z-mr_chart' && isfirst) || (charttype === 'cumsum_chart' && isfirst)
    || charttype === 'tsqrd_chart' || charttype === 'genvar_chart' || charttype === 'tsqrd-gv_chart') {
    return 8;
  }
  if ((charttype === 'z-mr_chart' && !isfirst) || charttype === 'xbar-r_chart') {
    return -6;
  }
  return -8;
};

// 获取控制图中线文本水平偏移像素
export const centerlineLabelx = (value, chartdata, isfirst, issecond) => {
  const charttype = chartdata.chart_type;
  const valueText = `${formatPointValue(Number(value), charttype)}`;
  if (charttype === 'zone_chart' && isfirst) {
    return 40 + valueText.toString().length * 8;
  }
  if (charttype === 'cumsum_chart' && Number(value) === 0) {
    return 30;
  }
  if (charttype === 'i_chart' || (charttype === 'i-mr_chart' && isfirst)
  || charttype === 'mr_chart' || (charttype === 'i-mr_chart' && !isfirst)
  || (charttype === 'i-mr-rs_chart' && !isfirst && issecond)) {
    if (charttype === 'i_chart' || (charttype === 'i-mr_chart' && isfirst)) {
      return 30 + valueText.toString().length * 8;
    }
    if (charttype === 'mr_chart' || (charttype === 'i-mr_chart' && !isfirst)) {
      return 42 + valueText.toString().length * 8;
    }
    return 76;
  }
  if (charttype === 'np_chart' && isfirst) {
    return 80;
  }
  if (charttype === 'tsqrd_chart' || charttype === 'genvar_chart' || charttype === 'tsqrd-gv_chart') {
    return 43 + valueText.toString().length * 8;
  }
  return 30 + valueText.toString().length * 8;
};

// 获取控制图上下限线文本水平偏移像素
export const ulllLabelx = (value, chartdata) => {
  const charttype = chartdata.chart_type;
  const valueText = `${formatPointValue(Number(value), charttype)}`;
  const len = valueText.length + 4;
  if (charttype === 'tsqrd_chart' || charttype === 'genvar_chart' || charttype === 'tsqrd-gv_chart') {
    if (len >= 10) {
      return 22 + len * 8;
    }
  }
  return 20 + len * 8;
};

// 中线文本显示处理
export const centerlineLableText = (cl, chartdata, isfirst, issecond, isDark) => {
  const charttype = chartdata.chart_type;
  const chartUsed = chartdata.chart_used;
  const value = formatPointValue(cl, charttype);
  switch (charttype) {
    // 单值
    case 'i_chart':
      return `<span style="color:${isDark ? '#fff' : '#000'}">_<br/>X=${value}</span>`;
    case 'mr_chart':
      return `<span style="color:${isDark ? '#fff' : '#000'}">___<br/>MR=${value}</span>`;
    case 'z-mr_chart':
      return isfirst ? `<span style="color:${isDark ? '#fff' : '#000'}">${value}</span>`
        : `<span style="color:${isDark ? '#fff' : '#000'}">___<br/>MR=${value}</span>`;
    case 'i-mr_chart':
      return isfirst ? `<span style="color:${isDark ? '#fff' : '#000'}">_<br/>X=${value}</span>`
        : `<span style="color:${isDark ? '#fff' : '#000'}">___<br/>MR=${value}</span>`;
    // 子组
    case 'xbar-r_chart':
      return isfirst ? `<span style="color:${isDark ? '#fff' : '#000'}">=<br/>X=${value}</span>`
        : `<span style="color:${isDark ? '#fff' : '#000'}">_<br/>R=${value}</span>`;
    case 'xbar-s_chart':
      return isfirst ? `<span style="color:${isDark ? '#fff' : '#000'}">=<br/>X=${value}</span>`
        : `<span style="color:${isDark ? '#fff' : '#000'}">_<br/>S=${value}</span>`;
    case 'xbar_chart':
      return `<span style="color:${isDark ? '#fff' : '#000'}">=<br/>X=${value}</span>`;
    case 's_chart':
      return `<span style="color:${isDark ? '#fff' : '#000'}">_<br/>S=${value}</span>`;
    case 'r_chart':
      return `<span style="color:${isDark ? '#fff' : '#000'}">_<br/>R=${value}</span>`;
    // zone控制图
    case 'zone_chart':
      return `<span style="color:${isDark ? '#fff' : '#000'}">=<br/>X=${value}</span>`;
    // 仅i-mr-r/s算法有三张图
    case 'i-mr-rs_chart':
      // 通过chart_used字段判断，是S控制图还是R控制图
      // eslint-disable-next-line
      return isfirst ? `<span style="color:${isDark ? '#fff' : '#000'}">_<br/>X=${value}</span>`
        // eslint-disable-next-line
        : (issecond ? `<span style="color:${isDark ? '#fff' : '#000'}">___<br/>MR=${value}</span>`
        // eslint-disable-next-line
        : (chartUsed === 'r_chart' ? `<span style="color:${isDark ? '#fff' : '#000'}">_<br/>R=${value}</span>`
          // eslint-disable-next-line
          : `<span style="color:${isDark ? '#fff' : '#000'}">_<br/>S=${value}</span>`));
    // 属性
    case 'p_chart':
      return `<span style="color:${isDark ? '#fff' : '#000'}">_<br/>P=${value}</span>`;
    case 'laney-p_chart':
      return `<span style="color:${isDark ? '#fff' : '#000'}">_<br/>P=${value}</span>`;
    case 'u_chart':
      return `<span style="color:${isDark ? '#fff' : '#000'}">_<br/>U=${value}</span>`;
    case 'laney-u_chart':
      return `<span style="color:${isDark ? '#fff' : '#000'}">_<br/>U=${value}</span>`;
    case 'c_chart':
      return `<span style="color:${isDark ? '#fff' : '#000'}">_<br/>C=${value}</span>`;
    case 'np_chart':
      return `<span style="color:${isDark ? '#fff' : '#000'}">___<br/>NP=${value}</span>`;
    // 时间加权
    case 'ewma_chart':
      return `<span style="color:${isDark ? '#fff' : '#000'}">=<br/>X=${value}</span>`;
    case 'ma_chart':
      return `<span style="color:${isDark ? '#fff' : '#000'}">=<br/>X=${value}</span>`;
    case 'cumsum_chart':
      return `<span style="color:${isDark ? '#fff' : '#000'}">${value}</span>`;
    // 多变量
    case 'tsqrd_chart':
      return `<span style="color:${isDark ? '#fff' : '#000'}">|S|=${value}</span>`;
    case 'genvar_chart':
      return `<span style="color:${isDark ? '#fff' : '#000'}">|S|=${value}</span>`;
    case 'tsqrd-gv_chart':
      return `<span style="color:${isDark ? '#fff' : '#000'}">|S|=${value}</span>`;
    default:
      return `<span style="color:${isDark ? '#fff' : '#000'}">${value}</span>`;
  }
};

// 获取上下限中线折线数据
export const getLimitSeries = (type, arr, chartData, isfirst, issecond, isDark) => {
  const yseries = arr.map((item) => {
    const value = Number(item);
    const obj = {
      y: value,
      lineWidth: 1,
      zIndex: 1,
      marker: {
        enabled: false, // 不显示数据点，只显示折线
        states: {
          hover: {
            enabled: false,
          },
        },
      },
      dataLabels: {
        enabled: false, // 上下限线不显示数据点标签，改为使用透明坐标线标签
        useHTML: true,
        style: {
          fontSize: '10px',
        },
        formatter() {
          let text = '';
          const len = this.series.data.length;
          if (type === 'cl') {
            // eslint-disable-next-line
            text = (this.x === this.series.data[len - 1].category ? centerlineLableText(this.y, chartData, isfirst, issecond, isDark) : '');
          }
          if (type === 'ul') {
            text = (this.x === this.series.data[len - 1].category ? `<span style="color:${isDark ? '#fff' : '#000'}">UCL=${formatPointValue(this.y)}</span>` : '');
          }
          if (type === 'll') {
            text = (this.x === this.series.data[len - 1].category ? `<span style="color:${isDark ? '#fff' : '#000'}">LCL=${formatPointValue(this.y)}</span>` : '');
          }
          return text;
        },
        align: 'right',
        x: 0,
        y: 2,
      },
    };
    return obj;
  });
  const series = {
    // eslint-disable-next-line
    name: '',
    data: yseries,
    color: type === 'cl' ? 'green' : 'red',
  };
  return series;
};

// 获取图表源数据、上下限、中线、违规校验点
export const getLineLimits = (sourcedata, datatype, isfirst, issecond, groupname) => {
  const algorithm = sourcedata.chart_type;
  // chart_used用于判断i-mr-r/s第三张图为r或s
  const chartUsed = sourcedata.chart_used;
  switch (algorithm) {
    // 单值、移动极差、z-mr、i-mr控制图极限值和中线值均为数值，不会返回数组
    // 单值
    case 'i_chart':
      if (datatype === 'group') {
        return groupname ? sourcedata.i[groupname] : sourcedata.i;
      }
      if (datatype === 'ucl') {
        return groupname ? sourcedata.iUCL[groupname] : sourcedata.iUCL;
      }
      if (datatype === 'lcl') {
        return groupname ? sourcedata.iLCL[groupname] : sourcedata.iLCL;
      }
      if (datatype === 'cl') {
        return groupname ? sourcedata.iCL[groupname] : sourcedata.iCL;
      }
      if (datatype === 'vio_points') {
        return groupname ? sourcedata.vio_points_I[groupname] : sourcedata.vio_points_I;
      }
      return {};
    case 'mr_chart':
      if (datatype === 'group') {
        return groupname ? sourcedata.mr[groupname] : sourcedata.mr;
      }
      if (datatype === 'ucl') {
        return groupname ? sourcedata.mrUCL[groupname] : sourcedata.mrUCL;
      }
      if (datatype === 'lcl') {
        return groupname ? sourcedata.mrLCL[groupname] : sourcedata.mrLCL;
      }
      if (datatype === 'cl') {
        return groupname ? sourcedata.mrCL[groupname] : sourcedata.mrCL;
      }
      if (datatype === 'vio_points') {
        return groupname ? sourcedata.vio_points_MR[groupname] : sourcedata.vio_points_MR;
      }
      return {};
    // z-mr
    case 'z-mr_chart':
      if (datatype === 'group') {
        // eslint-disable-next-line
        return groupname ? (isfirst ? sourcedata.z[groupname] : sourcedata.mr[groupname])
          : (isfirst ? sourcedata.z : sourcedata.mr);
      }
      if (datatype === 'ucl') {
        // eslint-disable-next-line
        return groupname ? (isfirst ? sourcedata.zUCL[groupname] : sourcedata.mrUCL[groupname])
          : (isfirst ? sourcedata.zUCL : sourcedata.mrUCL);
      }
      if (datatype === 'lcl') {
        // eslint-disable-next-line
        return groupname ? (isfirst ? sourcedata.zLCL[groupname] : sourcedata.mrLCL[groupname])
          : (isfirst ? sourcedata.zLCL : sourcedata.mrLCL);
      }
      if (datatype === 'cl') {
        // eslint-disable-next-line
        return groupname ? (isfirst ? sourcedata.zCL[groupname] : sourcedata.mrCL[groupname])
          : (isfirst ? sourcedata.zCL : sourcedata.mrCL);
      }
      if (datatype === 'vio_points') {
        // eslint-disable-next-line
        return groupname ? (isfirst ? sourcedata.vio_points_Z[groupname] : sourcedata.vio_points_ZMR[groupname])
          : (isfirst ? sourcedata.vio_points_Z : sourcedata.vio_points_ZMR);
      }
      return {};
    case 'i-mr_chart':
      if (datatype === 'group') {
        // eslint-disable-next-line
        return groupname ? (isfirst ? sourcedata.i[groupname] : sourcedata.mr[groupname])
          : (isfirst ? sourcedata.i : sourcedata.mr);
      }
      if (datatype === 'ucl') {
        // eslint-disable-next-line
        return groupname ? (isfirst ? sourcedata.iUCL[groupname] : sourcedata.mrUCL[groupname])
          : (isfirst ? sourcedata.iUCL : sourcedata.mrUCL);
      }
      if (datatype === 'lcl') {
        // eslint-disable-next-line
        return groupname ? (isfirst ? sourcedata.iLCL[groupname] : sourcedata.mrLCL[groupname])
          : (isfirst ? sourcedata.iLCL : sourcedata.mrLCL);
      }
      if (datatype === 'cl') {
        // eslint-disable-next-line
        return groupname ? (isfirst ? sourcedata.iCL [groupname]: sourcedata.mrCL[groupname])
          : (isfirst ? sourcedata.iCL : sourcedata.mrCL);
      }
      if (datatype === 'vio_points') {
        // eslint-disable-next-line
        return groupname ? (isfirst ? sourcedata.vio_points_I[groupname] : sourcedata.vio_points_MR[groupname])
          : (isfirst ? sourcedata.vio_points_I : sourcedata.vio_points_MR);
      }
      return {};
    // 子组
    case 'xbar-r_chart':
      if (datatype === 'group') {
        // eslint-disable-next-line
        return groupname ? (isfirst ? sourcedata.x[groupname] : sourcedata.r[groupname])
          : (isfirst ? sourcedata.x : sourcedata.r);
      }
      if (datatype === 'ucl') {
        // eslint-disable-next-line
        return groupname ? (isfirst ? sourcedata.xUCL[groupname] : sourcedata.rUCL[groupname])
          : (isfirst ? sourcedata.xUCL : sourcedata.rUCL);
      }
      if (datatype === 'lcl') {
        // eslint-disable-next-line
        return groupname ? (isfirst ? sourcedata.xLCL[groupname] : sourcedata.rLCL[groupname])
          : (isfirst ? sourcedata.xLCL : sourcedata.rLCL);
      }
      if (datatype === 'cl') {
        // eslint-disable-next-line
        return groupname ? (isfirst ? sourcedata.xCL[groupname] : sourcedata.rCL[groupname])
          : (isfirst ? sourcedata.xCL : sourcedata.rCL);
      }
      if (datatype === 'vio_points') {
        // eslint-disable-next-line
        return groupname ? (isfirst ? sourcedata.vio_points_Xbar[groupname] : sourcedata.vio_points_R[groupname])
          : (isfirst ? sourcedata.vio_points_Xbar : sourcedata.vio_points_R);
      }
      return {};
    case 'xbar-s_chart':
      if (datatype === 'group') {
        // eslint-disable-next-line
        return groupname ? (isfirst ? sourcedata.x[groupname] : sourcedata.s[groupname])
          : (isfirst ? sourcedata.x : sourcedata.s);
      }
      if (datatype === 'ucl') {
        // eslint-disable-next-line
        return groupname ? (isfirst ? sourcedata.xUCL[groupname] : sourcedata.sUCL[groupname])
          : (isfirst ? sourcedata.xUCL : sourcedata.sUCL);
      }
      if (datatype === 'lcl') {
        // eslint-disable-next-line
        return groupname ? (isfirst ? sourcedata.xLCL[groupname] : sourcedata.sLCL[groupname])
          : (isfirst ? sourcedata.xLCL : sourcedata.sLCL);
      }
      if (datatype === 'cl') {
        // eslint-disable-next-line
        return groupname ? (isfirst ? sourcedata.xCL[groupname] : sourcedata.sCL[groupname])
          : (isfirst ? sourcedata.xCL : sourcedata.sCL);
      }
      if (datatype === 'vio_points') {
        // eslint-disable-next-line
        return groupname ? (isfirst ? sourcedata.vio_points_Xbar[groupname] : sourcedata.vio_points_S[groupname])
          : (isfirst ? sourcedata.vio_points_Xbar : sourcedata.vio_points_S);
      }
      return {};
    case 'xbar_chart':
      if (datatype === 'group') {
        return (groupname ? sourcedata.x[groupname] : sourcedata.x);
      }
      if (datatype === 'ucl') {
        return (groupname ? sourcedata.xUCL[groupname] : sourcedata.xUCL);
      }
      if (datatype === 'lcl') {
        return (groupname ? sourcedata.xLCL[groupname] : sourcedata.xLCL);
      }
      if (datatype === 'cl') {
        return (groupname ? sourcedata.xCL[groupname] : sourcedata.xCL);
      }
      if (datatype === 'vio_points') {
        // eslint-disable-next-line
        return (groupname ? sourcedata.vio_points_Xbar[groupname] : sourcedata.vio_points_Xbar);
      }
      return {};
    case 's_chart':
      if (datatype === 'group') {
        return (groupname ? sourcedata.s[groupname] : sourcedata.s);
      }
      if (datatype === 'ucl') {
        return (groupname ? sourcedata.sUCL[groupname] : sourcedata.sUCL);
      }
      if (datatype === 'lcl') {
        return (groupname ? sourcedata.sLCL[groupname] : sourcedata.sLCL);
      }
      if (datatype === 'cl') {
        return (groupname ? sourcedata.sCL[groupname] : sourcedata.sCL);
      }
      if (datatype === 'vio_points') {
        // eslint-disable-next-line
        return (groupname ? sourcedata.vio_points_S[groupname] : sourcedata.vio_points_S);
      }
      return {};
    case 'r_chart':
      if (datatype === 'group') {
        return (groupname ? sourcedata.r[groupname] : sourcedata.r);
      }
      if (datatype === 'ucl') {
        return (groupname ? sourcedata.rUCL[groupname] : sourcedata.rUCL);
      }
      if (datatype === 'lcl') {
        return (groupname ? sourcedata.rLCL[groupname] : sourcedata.rLCL);
      }
      if (datatype === 'cl') {
        return (groupname ? sourcedata.rCL[groupname] : sourcedata.rCL);
      }
      if (datatype === 'vio_points') {
        return (groupname ? sourcedata.vio_points_R[groupname] : sourcedata.vio_points_R);
      }
      return {};
    // zone_chart
    case 'zone_chart':
      if (datatype === 'group') {
        return (groupname ? sourcedata.x[groupname] : sourcedata.x);
      }
      // x散点对应的累积分数
      if (datatype === 'zone_scores') {
        return (groupname ? sourcedata.zone_scores[groupname] : sourcedata.zone_scores);
      }
      if (datatype === 'zones') {
        return (groupname ? sourcedata.zones[groupname] : sourcedata.zones);
      }
      if (datatype === 'weights') {
        return (groupname ? sourcedata.weights[groupname] : sourcedata.weights) || [];
      }
      if (datatype === 'cl') {
        return (groupname ? sourcedata.xCL[groupname] : sourcedata.xCL);
      }
      if (datatype === 'vio_points') {
        return (groupname ? sourcedata.vio_points[groupname] : sourcedata.vio_points);
      }
      return {};
    // 仅i-mr-r/s算法有三张图
    case 'i-mr-rs_chart':
      if (datatype === 'group') {
        if (groupname) {
          // eslint-disable-next-line
          return (isfirst ? sourcedata.i[groupname] : (issecond ? sourcedata.mr[groupname]
            // eslint-disable-next-line
            : chartUsed === 'r_chart' ? sourcedata.r[groupname] : sourcedata.s[groupname]));
        }
        // eslint-disable-next-line
        return (isfirst ? sourcedata.i : (issecond ? sourcedata.mr
          // eslint-disable-next-line
          : chartUsed === 'r_chart' ? sourcedata.r : sourcedata.s));
      }
      if (datatype === 'ucl') {
        if (groupname) {
          // eslint-disable-next-line
          return (isfirst ? sourcedata.iUCL[groupname] : (issecond ? sourcedata.mrUCL[groupname]
            // eslint-disable-next-line
            : chartUsed === 'r_chart' ? sourcedata.rUCL[groupname] : sourcedata.sUCL[groupname]));
        }
        // eslint-disable-next-line
        return (isfirst ? sourcedata.iUCL : (issecond ? sourcedata.mrUCL
          // eslint-disable-next-line
          : chartUsed === 'r_chart' ? sourcedata.rUCL : sourcedata.sUCL));
      }
      if (datatype === 'lcl') {
        if (groupname) {
          // eslint-disable-next-line
          return (isfirst ? sourcedata.iLCL[groupname] : (issecond ? sourcedata.mrLCL[groupname]
            // eslint-disable-next-line
            : chartUsed === 'r_chart' ? sourcedata.rLCL[groupname] : sourcedata.sLCL[groupname]));
        }
        // eslint-disable-next-line
        return (isfirst ? sourcedata.iLCL : (issecond ? sourcedata.mrLCL
          // eslint-disable-next-line
          : chartUsed === 'r_chart' ? sourcedata.rLCL : sourcedata.sLCL));
      }
      if (datatype === 'cl') {
        if (groupname) {
          // eslint-disable-next-line
          return (isfirst ? sourcedata.iCL[groupname] : (issecond ? sourcedata.mrCL[groupname]
            // eslint-disable-next-line
            : chartUsed === 'r_chart' ? sourcedata.rCL[groupname] : sourcedata.sCL[groupname]));
        }
        // eslint-disable-next-line
        return (isfirst ? sourcedata.iCL : (issecond ? sourcedata.mrCL
          // eslint-disable-next-line
          : chartUsed === 'r_chart' ? sourcedata.rCL : sourcedata.sCL));
      }
      if (datatype === 'vio_points') {
        if (groupname) {
          // eslint-disable-next-line
          return (isfirst ? sourcedata.vio_points_I[groupname] : (issecond ? sourcedata.vio_points_MR[groupname]
            // eslint-disable-next-line
            : chartUsed === 'r_chart' ? sourcedata.vio_points_R[groupname] : sourcedata.vio_points_S[groupname]));
        }
        // eslint-disable-next-line
        return (isfirst ? sourcedata.vio_points_I : (issecond ? sourcedata.vio_points_MR
          // eslint-disable-next-line
          : chartUsed === 'r_chart' ? sourcedata.vio_points_R : sourcedata.vio_points_S));
      }
      if (datatype === 'between') {
        return groupname ? sourcedata.sigma_bw[groupname] : sourcedata.sigma_bw;
      }
      if (datatype === 'combined') {
        // eslint-disable-next-line
        return groupname ? sourcedata.sigma_combined[groupname] : sourcedata.sigma_combined;
      }
      if (datatype === 'within') {
        return groupname ? sourcedata.sigma_wi[groupname] : sourcedata.sigma_wi;
      }
      return {};
    // 属性
    case 'p_chart':
      if (datatype === 'group') {
        return (groupname ? sourcedata.p[groupname] : sourcedata.p);
      }
      if (datatype === 'ucl') {
        return (groupname ? sourcedata.pUCL[groupname] : sourcedata.pUCL);
      }
      if (datatype === 'lcl') {
        return (groupname ? sourcedata.pLCL[groupname] : sourcedata.pLCL);
      }
      if (datatype === 'cl') {
        return (groupname ? sourcedata.pCL[groupname] : sourcedata.pCL);
      }
      if (datatype === 'vio_points') {
        return (groupname ? sourcedata.vio_points[groupname] : sourcedata.vio_points);
      }
      return {};
    case 'laney-p_chart':
      if (datatype === 'group') {
        return (groupname ? sourcedata.p[groupname] : sourcedata.p);
      }
      if (datatype === 'ucl') {
        return (groupname ? sourcedata.pUCL[groupname] : sourcedata.pUCL);
      }
      if (datatype === 'lcl') {
        return (groupname ? sourcedata.pLCL[groupname] : sourcedata.pLCL);
      }
      if (datatype === 'cl') {
        return (groupname ? sourcedata.pCL[groupname] : sourcedata.pCL);
      }
      if (datatype === 'vio_points') {
        return (groupname ? sourcedata.vio_points[groupname] : sourcedata.vio_points);
      }
      return {};
    case 'u_chart':
      if (datatype === 'group') {
        return (groupname ? sourcedata.u[groupname] : sourcedata.u);
      }
      if (datatype === 'ucl') {
        return (groupname ? sourcedata.uUCL[groupname] : sourcedata.uUCL);
      }
      if (datatype === 'lcl') {
        return (groupname ? sourcedata.uLCL[groupname] : sourcedata.uLCL);
      }
      if (datatype === 'cl') {
        return (groupname ? sourcedata.uCL[groupname] : sourcedata.uCL);
      }
      if (datatype === 'vio_points') {
        return (groupname ? sourcedata.vio_points[groupname] : sourcedata.vio_points);
      }
      return {};
    case 'laney-u_chart':
      if (datatype === 'group') {
        return (groupname ? sourcedata.u[groupname] : sourcedata.u);
      }
      if (datatype === 'ucl') {
        return (groupname ? sourcedata.uUCL[groupname] : sourcedata.uUCL);
      }
      if (datatype === 'lcl') {
        return (groupname ? sourcedata.uLCL[groupname] : sourcedata.uLCL);
      }
      if (datatype === 'cl') {
        return (groupname ? sourcedata.uCL[groupname] : sourcedata.uCL);
      }
      if (datatype === 'vio_points') {
        return (groupname ? sourcedata.vio_points[groupname] : sourcedata.vio_points);
      }
      return {};
    case 'c_chart':
      if (datatype === 'group') {
        return (groupname ? sourcedata.c[groupname] : sourcedata.c);
      }
      if (datatype === 'ucl') {
        return (groupname ? sourcedata.cUCL[groupname] : sourcedata.cUCL);
      }
      if (datatype === 'lcl') {
        return (groupname ? sourcedata.cLCL[groupname] : sourcedata.cLCL);
      }
      if (datatype === 'cl') {
        return (groupname ? sourcedata.cCL[groupname] : sourcedata.cCL);
      }
      if (datatype === 'vio_points') {
        return (groupname ? sourcedata.vio_points[groupname] : sourcedata.vio_points);
      }
      return {};
    case 'np_chart':
      if (datatype === 'group') {
        return (groupname ? sourcedata.np[groupname] : sourcedata.np);
      }
      if (datatype === 'ucl') {
        return (groupname ? sourcedata.npUCL[groupname] : sourcedata.npUCL);
      }
      if (datatype === 'lcl') {
        return (groupname ? sourcedata.npLCL[groupname] : sourcedata.npLCL);
      }
      if (datatype === 'cl') {
        return (groupname ? sourcedata.npCL[groupname] : sourcedata.npCL);
      }
      if (datatype === 'vio_points') {
        return (groupname ? sourcedata.vio_points[groupname] : sourcedata.vio_points);
      }
      return {};
    // 时间加权
    case 'ewma_chart':
      if (datatype === 'group') {
        return (groupname ? sourcedata.x[groupname] : sourcedata.x);
      }
      if (datatype === 'ucl') {
        return (groupname ? sourcedata.xUCL[groupname] : sourcedata.xUCL);
      }
      if (datatype === 'lcl') {
        return (groupname ? sourcedata.xLCL[groupname] : sourcedata.xLCL);
      }
      if (datatype === 'cl') {
        return (groupname ? sourcedata.xCL[groupname] : sourcedata.xCL);
      }
      if (datatype === 'vio_points') {
        return (groupname ? sourcedata.vio_points[groupname] : sourcedata.vio_points);
      }
      return {};
    case 'ma_chart':
      if (datatype === 'group') {
        return (groupname ? sourcedata.x[groupname] : sourcedata.x);
      }
      if (datatype === 'ucl') {
        return (groupname ? sourcedata.xUCL[groupname] : sourcedata.xUCL);
      }
      if (datatype === 'lcl') {
        return (groupname ? sourcedata.xLCL[groupname] : sourcedata.xLCL);
      }
      if (datatype === 'cl') {
        return (groupname ? sourcedata.xCL[groupname] : sourcedata.xCL);
      }
      if (datatype === 'vio_points') {
        return (groupname ? sourcedata.vio_points[groupname] : sourcedata.vio_points);
      }
      return {};
    case 'cumsum_chart':
      // 累积和控制图包含两条折线，数据点在xL和xU
      if (datatype === 'ucl') {
        return (groupname ? sourcedata.xUCL[groupname] : sourcedata.xUCL);
      }
      // 高线数据点
      if (datatype === 'xu') {
        return (groupname ? sourcedata.xU[groupname] : sourcedata.xU);
      }
      if (datatype === 'lcl') {
        return (groupname ? sourcedata.xLCL[groupname] : sourcedata.xLCL);
      }
      // 低线数据点
      if (datatype === 'xl') {
        return (groupname ? sourcedata.xL[groupname] : sourcedata.xL);
      }
      if (datatype === 'cl') {
        return (groupname ? sourcedata.xCL[groupname] : sourcedata.xCL);
      }
      // 低线超出下限的数据点index
      if (datatype === 'vio_lowerline') {
        // eslint-disable-next-line
        return (groupname ? sourcedata.vio_lowerLine[groupname] : sourcedata.vio_lowerLine);
      }
      // 高线超出上限的数据点index
      if (datatype === 'vio_upperline') {
        // eslint-disable-next-line
        return (groupname ? sourcedata.vio_upperLine[groupname] : sourcedata.vio_upperLine);
      }
      return {};
    // 多变量
    case 'tsqrd_chart':
      if (datatype === 'group') {
        return (groupname ? sourcedata.t2[groupname] : sourcedata.t2);
      }
      if (datatype === 'ucl') {
        return (groupname ? sourcedata.t2UCL[groupname] : sourcedata.t2UCL);
      }
      // T^2-chart没有下限，返回必为null
      if (datatype === 'lcl') {
        return (groupname ? sourcedata.t2LCL[groupname] : sourcedata.t2LCL);
      }
      if (datatype === 'cl') {
        return (groupname ? sourcedata.t2CL[groupname] : sourcedata.t2CL);
      }
      if (datatype === 'vio_points') {
        // eslint-disable-next-line
        return (groupname ? sourcedata.vio_points_T2[groupname] : sourcedata.vio_points_T2);
      }
      return {};
    case 'genvar_chart':
      if (datatype === 'group') {
        return (groupname ? sourcedata.gv[groupname] : sourcedata.gv);
      }
      if (datatype === 'ucl') {
        return (groupname ? sourcedata.gvUCL[groupname] : sourcedata.gvUCL);
      }
      if (datatype === 'lcl') {
        return (groupname ? sourcedata.gvLCL[groupname] : sourcedata.gvLCL);
      }
      if (datatype === 'cl') {
        return (groupname ? sourcedata.gvCL[groupname] : sourcedata.gvCL);
      }
      if (datatype === 'vio_points') {
        // eslint-disable-next-line
        return (groupname ? sourcedata.vio_points_GV[groupname] : sourcedata.vio_points_GV);
      }
      return {};
    case 'tsqrd-gv_chart':
      if (datatype === 'group') {
        if (groupname) {
          return (isfirst ? sourcedata.t2[groupname] : sourcedata.gv[groupname]);
        }
        return (isfirst ? sourcedata.t2 : sourcedata.gv);
      }
      if (datatype === 'ucl') {
        if (groupname) {
          return (isfirst ? sourcedata.t2UCL[groupname] : sourcedata.gvUCL[groupname]);
        }
        return (isfirst ? sourcedata.t2UCL : sourcedata.gvUCL);
      }
      // T^2-chart没有下限，返回必为空null
      if (datatype === 'lcl') {
        if (groupname) {
          // eslint-disable-next-line
          return (isfirst ? sourcedata.t2LCL[groupname] : sourcedata.gvLCL[groupname]);
        }
        return (isfirst ? sourcedata.t2LCL : sourcedata.gvLCL);
      }
      if (datatype === 'cl') {
        if (groupname) {
          return (isfirst ? sourcedata.t2CL[groupname] : sourcedata.gvCL[groupname]);
        }
        return (isfirst ? sourcedata.t2CL : sourcedata.gvCL);
      }
      if (datatype === 'vio_points') {
        if (groupname) {
          // eslint-disable-next-line
          return (isfirst ? sourcedata.vio_points_T2[groupname] : sourcedata.vio_points_GV[groupname]);
        }
        return (isfirst ? sourcedata.vio_points_T2 : sourcedata.vio_points_GV);
      }
      return {};
    default:
      return {};
  }
};

// 获取index对应分区key
export const getZonesLabel = (index, positive) => {
  switch (index) {
    case 0:
      return positive ? { from: 'za', to: 'z0' } : { from: '-za', to: 'z0' };
    case 1:
      return positive ? { from: 'za', to: 'zb' } : { from: '-za', to: '-zb' };
    case 2:
      return positive ? { from: 'zb', to: 'zc' } : { from: '-zb', to: '-zc' };
    case 3:
      return positive ? { from: 'zc', to: 'zd' } : { from: '-zc', to: '-zd' };
    default:
      return { from: '', to: '' };
  }
};

// 获取zone_chart纵坐标分区数据
export const getZoneChartPlotBands = (weights, zones) => {
  const plotBands = [];
  for (let i = 0; i < weights.length; i += 1) {
    const posKey = getZonesLabel(i, true);
    const unposKey = getZonesLabel(i, false);
    const obj1 = {
      from: zones[posKey.from],
      to: zones[posKey.to],
      label: {
        text: weights[i].toString(),
        align: 'left',
      },
      color: 'white',
      borderColor: 'red',
      zIndex: -1,
    };
    plotBands.push(obj1);
    const obj2 = {
      from: zones[unposKey.from],
      to: zones[unposKey.to],
      label: {
        text: weights[i].toString(),
        align: 'left',
      },
      color: 'white',
      borderColor: 'red',
      zIndex: -1,
    };
    plotBands.push(obj2);
  }
  return plotBands;
};

// 根据分区标签获取y轴坐标文本
export const getZoneChartYAxisText = (label) => {
  switch (label) {
    case 'za':
      return '+1';
    case 'zb':
      return '+2';
    case 'zc':
      return '+3';
    // case 'zd':
    //   return '+4';
    case '-za':
      return '-1';
    case '-zb':
      return '-2';
    case '-zc':
      return '-3';
    // case '-zd':
    //   return '-4';
    default:
      return '';
  }
};

// 获取zone_chart纵坐标自定义标签
export const getZoneChartyAxisLabel = (val, zones) => {
  // eslint-disable-next-line
  for (const i in zones) {
    if (zones[i].toFixed(3) === Number(val).toFixed(3)) {
      return `${getZoneChartYAxisText(i)} StDev=${val}`;
    }
  }
  return '';
};

// 获取自定义y轴线
export const getYAxisLines = (type, val, chartData, isfirst, issecond, isDark) => {
  if (type === 'cl' || type === 'tran-cl') {
    const obj = {
      color: type === 'cl' ? 'green' : 'transparent', // 中线绿色，若为中线曲线，坐标线透明，仅保留标签
      dashStyle: 'solid',
      value: Number(val),
      label: {
        useHTML: true,
        text: centerlineLableText(val, chartData, isfirst, issecond, isDark),
        align: 'right',
        x: centerlineLabelx(val, chartData, isfirst, issecond),
        y: centerlineLabely(chartData, isfirst), // 垂直偏移像素
      },
      width: 1,
      zIndex: 2,
    };
    return obj;
  }
  let labelText = '<span></span>';
  if (type === 'ul' || type === 'tran-ul' || type === 'll' || type === 'tran-ll') {
    labelText = `<span>${(type === 'ul' || type === 'tran-ul') ? 'UCL' : 'LCL'}=${formatPointValue(val)}</span>`;
  }
  const obj = {
    // 若为上下线曲线，坐标线透明，仅保留标签(区域算法type='zone')
    color: (type === 'ul' || type === 'll' || type === 'zone') ? 'red' : 'transparent', // 上下限红色
    dashStyle: 'solid',
    value: Number(val),
    label: {
      useHTML: true,
      text: labelText,
      align: 'right',
      x: ulllLabelx(val, chartData),
      y: 6,
      color: isDark ? '#fff' : '#000',
    },
    width: 1,
    zIndex: 2,
  };
  return obj;
};
