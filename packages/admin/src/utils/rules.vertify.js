// import i18n from '@/plugins/i18n';
import store from '@/store';

// const locale = i18n;
function getNameRule(_this) {
  return [
    (v) => !!v || `${_this.$t('verification.isrequired')}`,
    (v) => (v && v.length <= 50) || `${_this.$t('verification.lengthlessthan', { num: 50 })}`,
    // (v) => !new RegExp(
    //   "[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]",
    // ).test(v) || `${_this.$t('verification.incorrectformat')}`,
  ];
}
function getNameRuleBylen(_this, len) {
  return [
    (v) => !!v || `${_this.$t('verification.isrequired')}`,
    (v) => (v && v.length <= len) || `${_this.$t('verification.lengthlessthan', { num: len })}`,
    // (v) => !new RegExp(
    //   "[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]",
    // ).test(v) || `${_this.$t('verification.incorrectformat')}`,
  ];
}

// 非必填长度限制
function getlengthRule(_this, len) {
  return [
    (v) => {
      // 非必填
      if (!v) {
        return true;
      }
      return (v && v.length <= len) || `${_this.$t('verification.lengthlessthan', { num: len })}`;
    },
    // (v) => !new RegExp(
    //   "[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]",
    // ).test(v) || `${_this.$t('verification.incorrectformat')}`,
  ];
}

// 必填项长度限制
function getlengthRuleRequired(_this, len) {
  return [
    (v) => (v && v.length <= len) || `${_this.$t('verification.lengthlessthan', { num: len })}`,
  ];
}

function getNumberRule(_this) {
  return [
    (v) => !!v || `${_this.$t('verification.isrequired')}`,
    (v) => (v && String(v).length <= 20) || `${_this.$t('verification.lengthlessthan', { num: 20 })}`,
    (v) => /^\w+$/.test(v) || `${_this.$t('verification.incorrectformat')}`,
  ];
}

// function getNumberRuleByLen(_this, len) {
//   return [
//     (v) => !!v || `${_this.$t('verification.isrequired')}`,
// eslint-disable-next-line
//     (v) => (v && String(v).length <= len) || `${_this.$t('verification.lengthlessthan', { num: len })}`,
//     (v) => /^\w+$/.test(v) || `${_this.$t('verification.incorrectformat')}`,
//   ];
// }

function getEmailRule(_this) {
  return [
    (v) => !v || /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$/.test(v) || `${_this.$t('verification.incorrectformat')}`,
    (v) => !v || v.length <= 50 || `${_this.$t('verification.lengthlessthan', { num: 50 })}`,
  ];
}

// 正整数
function getInterRule(_this) {
  return [
    (v) => !!v || `${_this.$t('verification.isrequired')}`,
    (v) => !v || /^[0-9]*[1-9][0-9]*$/.test(v)
      || `${_this.$t('verification.isinter')}`,
  ];
}

// 正整数,不是必填
function getNotRequiredInterRule(_this) {
  return [
    (v) => !v || /^[0-9]*[1-9][0-9]*$/.test(v)
      || `${_this.$t('verification.isinter')}`,
  ];
}

// 1-59999正整数
function getDataBlockRule(_this) {
  return [
    (v) => !!v || `${_this.$t('verification.isrequired')}`,
    (v) => !v || /^[0-9]*[1-9][0-9]*$/.test(v)
      || `${_this.$t('verification.isinter')}`,
    (v) => (Number(v) >= 1 && Number(v) <= 59999)
      || `${_this.$t('verification.59999Inter')}`,
  ];
}

// 0-100整数
function getPerRule(_this) {
  return [
    (v) => !!v || v === 0 || `${_this.$t('verification.isrequired')}`,
    (v) => !v || /^[0-9]*[1-9][0-9]*$/.test(v)
      || `${_this.$t('verification.isinter')}`,
    (v) => (Number(v) >= 0 && Number(v) <= 100)
      || `${_this.$t('verification.percentage100Inter')}`,
  ];
}

// 0-100正整数，必填，不包含0和100
function getZeroHundredRule(_this) {
  return [
    (v) => !!v || v === 0 || `${_this.$t('verification.isrequired')}`,
    (v) => !v || /^[0-9]*[1-9][0-9]*$/.test(v)
      || `${_this.$t('verification.isinter')}`,
    (v) => (Number(v) > 0 && Number(v) < 100)
      || `${_this.$t('verification.percentage100Inter')}`,
  ];
}

// 10长度以内字符，非必填
function get10LenRule(_this) {
  return [
    (v) => (String(v).length <= 10 || String(v).length === 0) || `${_this.$t('verification.lengthlessthan', { num: 10 })}`,
  ];
}

// 10长度以内字符，必填
function get10LenRequiredRule(_this) {
  return [
    (v) => !!v || v === 0 || `${_this.$t('verification.isrequired')}`,
    (v) => (String(v).length <= 10) || `${_this.$t('verification.lengthlessthan', { num: 10 })}`,
  ];
}

function get20LenRule(_this) {
  return [
    (v) => (String(v).length <= 20 || String(v).length === 0) || `${_this.$t('verification.lengthlessthan', { num: 20 })}`,
  ];
}

// 20长度以内字符，必填
function get20LenRequiredRule(_this) {
  return [
    (v) => !!v || v === 0 || `${_this.$t('verification.isrequired')}`,
    (v) => (String(v).length <= 20) || `${_this.$t('verification.lengthlessthan', { num: 20 })}`,
  ];
}

// 50长度以内字符，必填
function get50LenRequiredRule(_this) {
  return [
    (v) => !!v || v === 0 || `${_this.$t('verification.isrequired')}`,
    (v) => (String(v).length <= 50) || `${_this.$t('verification.lengthlessthan', { num: 50 })}`,
  ];
}

// 50长度以内字符，非必填
function get50LenRule(_this) {
  return [
    (v) => (String(v).length <= 50) || `${_this.$t('verification.lengthlessthan', { num: 50 })}`,
  ];
}

// 100长度以内字符，非必填
function get100LenRule(_this) {
  return [
    (v) => (String(v).length <= 100) || `${_this.$t('verification.lengthlessthan', { num: 100 })}`,
  ];
}

// 浮点数
function getFloatRule(_this) {
  return [
    (v) => !!v || v === 0 || `${_this.$t('verification.isrequired')}`,
    (v) => !v || /^(-?\d+)(\.\d+)?$/.test(v) || `${_this.$t('verification.isNumber')}`,
  ];
}

// ip地址
function getIpRule(_this) {
  return [
    (v) => !!v || `${_this.$t('verification.isrequired')}`,
    (v) =>
      /^(([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])(\.(?!$)|(?=$))){4}$/.test(v) ||
      `${_this.$t('verification.incorrectformat')}`,
  ];
}

function getNoneNegativeIntegerRule(_this) {
  return [
    (v) => !!v || v === 0 || `${_this.$t('verification.isrequired')}`,
    (v) => !v || /^[0-9]*[0-9][0-9]*$/.test(v)
      || `${_this.$t('verification.isnonnegativeinteger')}`,
  ];
}

// 非负整数
function getNoneNegativeIntegerRuleByLen(_this, len) {
  return [
    (v) => !!v || v === 0 || `${_this.$t('verification.isrequired')}`,
    (v) => !v || /^[0-9]*[0-9][0-9]*$/.test(v)
      || `${_this.$t('verification.isnonnegativeinteger')}`,
    (v) => (v && String(v).length <= len) || `${_this.$t('verification.lengthlessthan', { num: len })}`,
  ];
}

// rack和slot
function getRackAndSlotRule(_this) {
  return [
    (v) => !!v || v === 0 || `${_this.$t('verification.isrequired')}`,
    (v) => /^[0-9]$/.test(v) || `${_this.$t('verification.incorrectformat')}`,
  ];
}

function getPortRule(_this) {
  return [
    (v) => !!v || `${_this.$t('verification.isrequired')}`,
    (v) =>
      (/^\d+$/.test(v) && `${v}`.length >= 2 && `${v}`.length <= 5) ||
      `${_this.$t('verification.incorrectformat')}`,
  ];
}

// 0-200，非必填
function get200Number(_this) {
  return [
    // eslint-disable-next-line
    (v) => !v || /^[0-9]*[1-9][0-9]*$/.test(v)
      || `${_this.$t('dataAnalysis.verification.isinter')}`,
    (v) => (v && Number(v) <= 200 && Number(v) > 0) || `${_this.$t('dataAnalysis.verification.numberrange', { num1: 0, num2: 200 })}`,
  ];
}

function getOver500(_this) {
  return [
    (v) => (String(v).length <= 500 || String(v).length === 0) || `${_this.$t('verification.lengthlessthan', { num: 500 })}`,
  ];
}

// 0-500，必填
function get500NumberRequired(_this) {
  return [
    (v) => !!v || v === 0 || `${_this.$t('verification.isrequired')}`,
    // eslint-disable-next-line
    (v) => /^[0-9]*[1-9][0-9]*$/.test(v)
      || `${_this.$t('spc.verification.isinter')}`,
    (v) => (v && Number(v) <= 500 && Number(v) > 0) || `${_this.$t('spc.verification.numberrange', { num1: 0, num2: 500 })}`,
  ];
}

// 0-1000，非必填
function get1000Number(_this) {
  return [
    // eslint-disable-next-line
    (v) => !v || /^[0-9]*[1-9][0-9]*$/.test(v)
      || `${_this.$t('dataAnalysis.verification.isinter')}`,
    (v) => (v && Number(v) <= 1000 && Number(v) > 0) || `${_this.$t('dataAnalysis.verification.numberrange', { num1: 0, num2: 1000 })}`,
  ];
}

// 0-1之间，不包含0，必填
function getZeroOneRule(_this) {
  return [
    (v) => !!v || v === 0 || `${_this.$t('dataAnalysis.verification.isrequired')}`,
    (v) => (v && Number(v) <= 1 && Number(v) > 0) || `${_this.$t('dataAnalysis.verification.numberrange', { num1: 0, num2: 1 })}`,
  ];
}

// 大于1，必填
function getMoreThanOneRule(_this) {
  return [
    (v) => !!v || v === 0 || `${_this.$t('dataAnalysis.verification.isrequired')}`,
    (v) => (v && Number(v) >= 1) || `${_this.$t('dataAnalysis.verification.numberbiggerthan', { num: 1 })}`,
  ];
}

// 1-100，非必填
function get1To100Rule(_this) {
  return [
    // (v) => !!v || `${this.$t('dataAnalysis.verification.isrequired')}`,
    (v) => !v || /^[0-9]*[1-9][0-9]*$/.test(v)
      || `${_this.$t('dataAnalysis.verification.isinter')}`,
    // eslint-disable-next-line
    (v) => (v && Number(v) <= 100 && Number(v) >= 1) || `${_this.$t('dataAnalysis.verification.numberrange', { num1: 1, num2: 100 })}`,
  ];
}

// 2-100，非必填
function get2To100Rule(_this) {
  return [
    (v) => !v || /^[0-9]*[1-9][0-9]*$/.test(v)
      || `${_this.$t('dataAnalysis.verification.isinter')}`,
    // eslint-disable-next-line
    (v) => (v && Number(v) <= 100 && Number(v) >= 2) || `${_this.$t('dataAnalysis.verification.numberrange', { num1: 2, num2: 100 })}`,
  ];
}

// -5到5，必填
function getNegative5To5Rule(_this) {
  return [
    (v) => !!v || `${_this.$t('dataAnalysis.verification.isrequired')}`,
    (v) => (v && Number(v) <= 5 && Number(v) >= -5) || `${_this.$t('dataAnalysis.verification.numberrange', { num1: -5, num2: 5 })}`,
  ];
}

// >0的整数，必填
function getInterNumberRule(_this) {
  return [
    (v) => !!v || `${_this.$t('dataAnalysis.verification.isrequired')}`,
    (v) => !v || /^[0-9]*[1-9][0-9]*$/.test(v)
      || `${_this.$t('dataAnalysis.verification.isinter')}`,
    (v) => (v && Number(v) > 0) || `${_this.$t('dataAnalysis.verification.numberbiggerthan', { num: 0 })}`,
  ];
}

// >=2的正整数，必填
function get2InterRule(_this) {
  return [
    (v) => !!v || `${_this.$t('dataAnalysis.verification.isrequired')}`,
    // eslint-disable-next-line
    (v) => !v || /^[0-9]*[1-9][0-9]*$/.test(v)
      || `${_this.$t('dataAnalysis.verification.isinter')}`,
    (v) => (v && Number(v) >= 2) || `${_this.$t('dataAnalysis.verification.numberbiggerthan', { num: 2 })}`,
  ];
}

// >1的正整数，非必填
function get1InterRule(_this) {
  return [
    // (v) => !!v || `${this.$t('dataAnalysis.verification.isrequired')}`,
    // eslint-disable-next-line
    (v) => !v || /^[0-9]*[1-9][0-9]*$/.test(v)
      || `${_this.$t('dataAnalysis.verification.isinter')}`,
    (v) => (v && Number(v) > 1) || `${_this.$t('dataAnalysis.verification.numberbiggerthan2', { num: 1 })}`,
  ];
}

// >0的浮点数，必填
function getZeroFloatNumberRule(_this) {
  return [
    (v) => !!v || `${_this.$t('dataAnalysis.verification.isrequired')}`,
    (v) => (v && Number(v) > 0) || `${_this.$t('dataAnalysis.verification.numberbiggerthan', { num: 0 })}`,
  ];
}

// 正整数 带一位小数 非必填
function getPositiveNumberWithOneDecimal(_this) {
  return [
    (v) => !v || (/^\d+(\.\d{1})?$/).test(v) || `${_this.$t('machineAttribute.verification.stayTime')}`,
  ];
}

// 正整数 带一位小数 必填
function getPositiveNumberWithOneDecimalRequire(_this) {
  return [
    (v) => !!v || `${_this.$t('dataAnalysis.verification.isrequired')}`,
    (v) => !v || (/^\d+(\.\d{1})?$/).test(v) || `${_this.$t('machineAttribute.verification.stayTime')}`,
  ];
}

// function getDigitalRule(_this) {
//   return [
//     (v) => !!v || `${_this.$t('verification.isrequired')}`,
//     (v) => !v || /^\d+$/.test(v)
//       || `${_this.$t('verification.isinter')}`,
//   ];
// }

function getRequiredRule(_this) {
  return [
    (v) => !!v || v === 0 || `${_this.$t('verification.isrequired')}`,
  ];
}
class Rules {
  install(Vue) {
    const funcList = [
      'getCommonRules',
      'getOperatorRules',
      'getLoginRules',
      'getFactoryCompanyRules',
      'getInitialAdministratorRules',
      'getPositionRules',
      'getUserRules',
      'getPartRules',
      'getConnectionRules',
      'getAlarmRules',
      'getSpcRules',
      'getMachineRules',
      'getPersonRules',
      'getMaintenanceRules',
      'getDeptRules',
      'getRoleRules',
      'getDictRules',
      'getBasicRuls',
      'getNetworkingRules',
      'getSpotCheckRules',
      'getProgressRules',
      'getDataSourceRules',
      'getReportRules',
    ];
    for (let i = 0; i < funcList.length; i += 1) {
      Vue.prototype[`$${funcList[i]}`] = this[funcList[i]];
      store[`$${funcList[i]}`] = this[funcList[i]];
    }
  }

  // 通用校验
  getCommonRules() {
    return {
      isRequired: getRequiredRule(this),
      name: getNameRule(this),
      number: getNumberRule(this),
      isInter: getInterRule(this),
    };
  }

  getOperatorRules() {
    return {
      name: getNameRule(this),
      nameIn20: getNameRuleBylen(this, 20),
      number: getNumberRule(this),
      badgenumber: [
        (v) => !!v || `${this.$t('verification.isrequired')}`,
        (v) => (v && v.length <= 50)
          || `${this.$t('verification.lengthlessthan', { num: 50 })}`,
        (v) => /^\w+$/.test(v) || `${this.$t('verification.incorrectformat')}`,
      ],
      position: [(v) => !!v || `${this.$t('verification.isrequired')}`],
      department: [(v) => !!v || `${this.$t('verification.isrequired')}`],
      password: [(v) => !!v || `${this.$t('verification.isrequired')}`],
      email: getEmailRule(this),
      tag: getRequiredRule(this),
      isrequired: getRequiredRule(this),
      // 百分比 0～100
      percentage: [
        (v) => !!v || `${this.$t('verification.isrequired')}`,
        (v) => !v || (Number(v) >= 0 && Number(v) <= 100) || `${this.$t('verification.incorrectformat')}`,
      ],
      // >=50 && <=100
      percentage50: [
        (v) => !!v || `${this.$t('verification.isrequired')}`,
        (v) => !v || (Number(v) >= 50 && Number(v) <= 100) || `${this.$t('verification.incorrectformat')}`,
      ],
      // percentage50 inter 50 - 100之间的整数
      percentage50Inter: [
        (v) => !!v || `${this.$t('verification.isrequired')}`,
        (v) => !v || (Number(v) >= 50 && Number(v) <= 100) || `${this.$t('verification.percentage50Inter')}`,
        (v) => !v || /^[0-9]*[1-9][0-9]*$/.test(v) || `${this.$t('verification.isinter')}`,
      ],
      // 0和正整数
      inter: getInterRule(this),
      // 非0正整数
      nonZeroInter: [
        (v) => !!v || `${this.$t('verification.isrequired')}`,
        (v) => !v || /^[1-9]\d*$/.test(v) || `${this.$t('verification.isinter')}`,
      ],
      // 浮点数
      float: [
        (v) => {
          // console.log(v, typeof (v), 'v float 浮点数 可以输入负数 和 0', !!v);
          if (!!v || v === 0) {
            return true;
          }
          return `${this.$t('verification.isrequired')}`;
        },
        (v) => !v || /^(-?\d+)(\.\d+)?$/.test(v) || `${this.$t('verification.isNumber')}`,
      ],
      // 只能是 '0' 或者 '1'
      stringBoolean: [
        (v) => !!v || `${this.$t('verification.isrequired')}`,
        (v) => !v || v === '0' || v === '1' || `${this.$t('verification.only0or1')}`,
      ],
      // 10位字符
      isOverTen: get10LenRequiredRule(this),
      // 20位字符
      isOver20: get20LenRequiredRule(this),
    };
  }

  // 登录校验
  getLoginRules() {
    return {
      account: [(v) => !!v || `${this.$t('login.accountRequired')}`],
      password: [(v) => !!v || `${this.$t('login.passwordRequired')}`],
    };
  }

  // 公司和工厂页面校验
  getFactoryCompanyRules() {
    return {
      name: getNameRule(this),
      lastName: [(v) => (!v || String(v).length <= 50) || `${this.$t('verification.lengthlessthan', { num: 50 })}`],
      firstName: [(v) => (!v || String(v).length <= 50) || `${this.$t('verification.lengthlessthan', { num: 50 })}`],
      telephone: [(v) => !v || /^[0-9]*$/.test(v) || `${this.$t('verification.incorrectformat')}`],
      postalCode: [
        (v) => !v || /^[0-9]*$/.test(v) || `${this.$t('verification.incorrectformat')}`,
        (v) => !v || (String(v).length <= 6) || `${this.$t('verification.lengthlessthan', { num: 6 })}`,
      ],
      email: getEmailRule(this),
    };
  }

  // 初始管理员页面校验
  getInitialAdministratorRules() {
    return {
      account: getNameRule(this),
      password: [
        (v) => !!v || `${this.$t('verification.isrequired')}`,
        (v) => (String(v).length >= 6) || `${this.$t('verification.lengthmorethan', { num: 6 })}`,
        (v) => !/[%'"’‘”“]/.test(v) || `${this.$t('verification.passwordError')}`,
      ],
      lastName: [(v) => (!v || String(v).length <= 50) || `${this.$t('verification.lengthlessthan', { num: 50 })}`],
      firstName: [(v) => (!v || String(v).length <= 50) || `${this.$t('verification.lengthlessthan', { num: 50 })}`],
      telephone: [(v) => !v || /^[0-9]*$/.test(v) || `${this.$t('verification.incorrectformat')}`],
      postalCode: [
        (v) => !v || /^[0-9]*$/.test(v) || `${this.$t('verification.incorrectformat')}`,
        (v) => !v || (String(v).length <= 6) || `${this.$t('verification.lengthlessthan', { num: 6 })}`,
      ],
      email: getEmailRule(this),
      isRequired: getRequiredRule(this),
    };
  }

  // 岗位管理页面校验
  getPositionRules() {
    return {
      name: getNameRule(this),
      number: getNumberRule(this),
      isRequired: getRequiredRule(this),
      sort: getInterRule(this),
    };
  }

  // 用户管理页面校验
  getUserRules() {
    return {
      isRequired: getRequiredRule(this),
      name: getNameRuleBylen(this, 30),
      account: [
        (v) => !!v || `${this.$t('verification.isrequired')}`,
        (v) => (v && v.length >= 2 && v.length <= 20) || `${this.$t('verification.lengthBetween', { num1: 2, num2: 20 })}`,
      ],
      password: [
        (v) => !!v || `${this.$t('verification.isrequired')}`,
        (v) => (v && v.length >= 5 && v.length <= 20) || `${this.$t('verification.lengthBetween', { num1: 5, num2: 20 })}`,
      ],
      phone: [
        (v) => !v || /^[0-9]*$/.test(v) || `${this.$t('verification.incorrectformat')}`,
        (v) => !v || (v && v.length === 11) || `${this.$t('verification.lengthEqual', { num: 11 })}`,
      ],
      email: getEmailRule(this),
      len20: get20LenRule(this),
    };
  }

  // 零件管理页面校验
  getPartRules() {
    return {
      name: getNameRule(this),
      number: getNumberRule(this),
      limit50: get50LenRule(this), // 限制50非必填
      isRequired: getRequiredRule(this),
      over500: getOver500(this),
    };
  }

  // 通讯配置界面校验
  getConnectionRules() {
    return {
      name: getNameRule(this),
      paramNumber: [
        (v) => !!v || `${this.$t('verification.isrequired')}`,
        (v) => (v && String(v).length <= 100) || `${this.$t('verification.lengthlessthan', { num: 100 })}`,
        (v) => !v || /^[^.]*$/.test(v) || `${this.$t('verification.incorrectformat')}`,
      ],
      number: getNumberRule(this),
      description: getlengthRule(this, 500),
      ip: getIpRule(this),
      rackandslot: getRackAndSlotRule(this),
      port: getPortRule(this),
      datablock: getDataBlockRule(this),
      isInter: getInterRule(this),
      interge: getNoneNegativeIntegerRule(this),
      isOverTen: get10LenRequiredRule(this),
      isRequired: getRequiredRule(this),
      prefix: getlengthRuleRequired(this, 100),
    };
  }

  // 报警配置页面校验
  getAlarmRules() {
    return {
      name: getNameRule(this),
      number: getNumberRule(this),
      isInter: getInterRule(this),
      interge: getNoneNegativeIntegerRule(this),
      isRequired: getRequiredRule(this),
    };
  }

  // spc页面校验
  getSpcRules() {
    return {
      name: getNameRule(this),
      number: getNumberRule(this),
      isrequired: getRequiredRule(this),
      over500: getOver500(this),
      // 数据量校验(0-200)
      dataquantity: get200Number(this),
      // 数据量校验(0-1000)
      dataquantity2: get1000Number(this),
      // 数据量校验(0-500) 且必填
      dataquantity3: get500NumberRequired(this),
      // 比率校验
      propnumber: getZeroOneRule(this),
      // 移动平均长度校验（MA算法）
      lengthnumber: getMoreThanOneRule(this),
      // EWMA权重校验
      weightnumber: getZeroOneRule(this),
      // 子组大小校验（1-100）
      subgroupsize: get1To100Rule(this),
      // 子组大小校验（2-100）
      subgroupsize2: get2To100Rule(this),
      // boxcox数字校验
      boxnumber: getNegative5To5Rule(this),
      // N倍标准差校验
      nstandarddeviation: getInterNumberRule(this),
      // 移动极差长度校验（大于2的正整数）
      movingrangelength: get2InterRule(this),
      // 区域算法nsigma校验（大于1）
      zonensigma: get1InterRule(this),
      // 校验项nsigma（N倍标准差）
      onepoint: getZeroFloatNumberRule(this),
      // 校验项num_kos
      npointssameside: getInterNumberRule(this),
      // 校验项num_kid
      npointsall: getInterNumberRule(this),
      // 校验项num_kud
      npointsupdown: getInterNumberRule(this),
      // 校验项num_os2std
      pointsbiggerthan2: get2InterRule(this),
      // 校验项num_os1std
      pointsbiggerthan1: get2InterRule(this),
      // 校验项num_kin1std
      npoints1: get2InterRule(this),
      // 校验项num_koo1std
      npointsbiggerthan1: get2InterRule(this),
      // 正整数
      isInter: getInterRule(this),
      // 非必填正整数
      notRequiredInter: getNotRequiredInterRule(this),
      // 0-100必填整数
      zeroHundred: getZeroHundredRule(this),
      interge: getNoneNegativeIntegerRule(this),
    };
  }

  // 设备页面校验
  getMachineRules() {
    return {
      name: getNameRule(this),
      number: getNumberRule(this),
      isRequired: getRequiredRule(this),
      isInter: getInterRule(this),
      isPercent: getPerRule(this),
      over10: get10LenRule(this),
      ip: getIpRule(this),
      port: getPortRule(this),
      thoroughfare: getNoneNegativeIntegerRule(this),
    };
  }

  // 人员页面校验
  getPersonRules() {
    return {
      name: getNameRule(this),
      number: getNumberRule(this),
      isRequired: getRequiredRule(this),
    };
  }

  // 维保校验
  getMaintenanceRules() {
    return {
      name: getNameRule(this),
      nameIn20: getNameRuleBylen(this, 20),
      number: getNumberRule(this),
      isRequired: getRequiredRule(this),
      limit: getFloatRule(this),
      interge: getNoneNegativeIntegerRule(this),
      interge6: getNoneNegativeIntegerRuleByLen(this, 6),
      percentage: getPerRule(this),
      over500: getOver500(this),
    };
  }

  // 部门校验
  getDeptRules() {
    return {
      name: getNameRuleBylen(this, 30),
      number: getNumberRule(this),
      isRequired: getRequiredRule(this),
      sort: getNoneNegativeIntegerRule(this),
      leader: [
        (v) => !v || v.length <= 20 || `${this.$t('verification.lengthlessthan', { num: 20 })}`,
      ],
      phone: [
        (v) => !v || /^[0-9]*$/.test(v) || `${this.$t('verification.incorrectformat')}`,
        (v) => !v || v.length <= 11 || `${this.$t('verification.lengthlessthan', { num: 11 })}`,
      ],
      email: getEmailRule(this),
    };
  }

  // 角色校验
  getRoleRules() {
    return {
      name: getNameRuleBylen(this, 30),
      number: getNumberRule(this),
      isRequired: getRequiredRule(this),
      sort: getNoneNegativeIntegerRule(this),
      leader: [
        (v) => !v || v.length <= 20 || `${this.$t('verification.lengthlessthan', { num: 20 })}`,
      ],
      phone: [
        (v) => !v || /^[0-9]*$/.test(v) || `${this.$t('verification.incorrectformat')}`,
        (v) => !v || v.length <= 11 || `${this.$t('verification.lengthlessthan', { num: 11 })}`,
      ],
      email: getEmailRule(this),
    };
  }

  // 字典校验
  getDictRules() {
    return {
      dictType: [
        (v) => !!v || `${this.$t('verification.isrequired')}`,
        (v) => !v || /^[a-z][a-z0-9_]*$/.test(v) || `${this.$t('dictManagement.verification.dictTypeError')}`,
      ],
      dictName: [(v) => !!v || `${this.$t('verification.isrequired')}`],
      dictSort: getNotRequiredInterRule(this),
      dictValue: [(v) => !!v || `${this.$t('verification.isrequired')}`],
      dictLabel: [(v) => !!v || `${this.$t('verification.isrequired')}`],
    };
  }

  // 生成报表校验
  getReportRules() {
    return {
      menuName: get50LenRequiredRule(this),
    };
  }

  // 基础资料 校验
  getBasicRuls() {
    return {
      limit20LenStrRequire: get20LenRequiredRule(this),
      limit50LenStrRequire: get50LenRequiredRule(this),
      limit50LenStr: get50LenRule(this),
      limit100LenStr: get100LenRule(this),
      isRequired: getRequiredRule(this),
    };
  }

  // 设备联网页面
  getNetworkingRules() {
    return {
      isRequired: getRequiredRule(this),
      numberWithOneDecimal: getPositiveNumberWithOneDecimal(this),
      limit50LenStrRequire: get50LenRequiredRule(this),
      limit50LenStr: get50LenRule(this),
    };
  }

  // 自动点检
  getSpotCheckRules() {
    return {
      limit50LenStrRequire: get50LenRequiredRule(this),
      isRequired: getRequiredRule(this),
      numberWithOneDecimal: getPositiveNumberWithOneDecimalRequire(this),
      // 纯数字
      lowerAndUpperlimit: [
        (v) => !!v || `${this.$t('verification.isrequired')}`,
        (v) => !v || /^-?\d*\.?\d+$/.test(v) || `${this.$t('spotCheckPlan.verification.limitError')}`,
      ],
    };
  }

  // 在制品明细
  getProgressRules() {
    return {
      interge: getNoneNegativeIntegerRule(this),
    };
  }

  // 数据源
  getDataSourceRules() {
    return {
      name: getNameRule(this),
      number: getNumberRule(this),
      isRequired: getRequiredRule(this),
      interge: getNoneNegativeIntegerRule(this),
    };
  }
}
export default new Rules();
