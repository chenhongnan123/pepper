const algorithmList = [
  {
    group_id: 1,
    name: 'singleValue', // 单值
    realTime: true, // 是否支持实时
    charts: [
      {
        value: 'i_chart',
        name: 'ichart',
        realTime: true,
      },
      {
        value: 'mr_chart',
        name: 'mrchart',
        realTime: true,
      },
      {
        value: 'i-mr_chart',
        name: 'i_mrchart',
        realTime: true,
      },
      {
        value: 'z-mr_chart',
        name: 'z_mrchart',
        realTime: false,
      },
    ],
  },
  {
    group_id: 2,
    name: 'subgroup', // 子组
    realTime: false,
    charts: [
      {
        value: 'xbar-r_chart',
        name: 'xbar_rchart',
        realTime: false,
      },
      {
        value: 'xbar-s_chart',
        name: 'xbar_schart',
        realTime: false,
      },
      {
        value: 'xbar_chart',
        name: 'xbarchart',
        realTime: false,
      },
      {
        value: 's_chart',
        name: 'schart',
        realTime: false,
      },
      {
        value: 'r_chart',
        name: 'rchart',
        realTime: false,
      },
      {
        value: 'zone_chart',
        name: 'zonechart',
        realTime: false,
      },
      {
        value: 'i-mr-rs_chart',
        name: 'imr_r/schart',
        realTime: false,
      },
    ],
  },
  // {
  //   group_id: 3,
  //   name: 'attribute', // 属性
  //   realTime: false,
  //   charts: [
  //     {
  //       value: 'p_chart',
  //       name: 'pchart',
  //       realTime: false,
  //     },
  //     {
  //       value: 'laney-p_chart',
  //       name: 'laney_pchart',
  //       realTime: false,
  //     },
  //     {
  //       value: 'u_chart',
  //       name: 'uchart',
  //       realTime: false,
  //     },
  //     {
  //       value: 'laney-u_chart',
  //       name: 'laney_uchart',
  //       realTime: false,
  //     },
  //     {
  //       value: 'c_chart',
  //       name: 'cchart',
  //       realTime: false,
  //     },
  //     {
  //       value: 'np_chart',
  //       name: 'npchart',
  //       realTime: false,
  //     },
  //   ],
  // },
  // {
  //   group_id: 4,
  //   name: 'timeWeight', // 时间权重
  //   realTime: true,
  //   charts: [
  //     {
  //       value: 'ewma_chart',
  //       name: 'ewmachart',
  //       realTime: true,
  //     },
  //     {
  //       value: 'ma_chart',
  //       name: 'machart',
  //       realTime: true,
  //     },
  //     {
  //       value: 'cumsum_chart',
  //       name: 'cumsumchart',
  //       realTime: true,
  //     },
  //   ],
  // },
  // {
  //   group_id: 5,
  //   name: 'multivariable', // 多变量
  //   realTime: true,
  //   charts: [
  //     {
  //       value: 'tsqrd_chart',
  //       name: 'tsqurdchart',
  //       realTime: true,
  //     },
  //     {
  //       value: 'genvar_chart',
  //       name: 'genvarchart',
  //       realTime: true,
  //     },
  //     {
  //       value: 'tsqrd-gv_chart',
  //       name: 'tsqurdgvchart',
  //       realTime: true,
  //     },
  //   ],
  // },
  {
    group_id: 6,
    name: 'capabilityAnalysis', // 能力分析
    realTime: true,
    charts: [
      {
        value: 'normxpk',
        name: 'normalcpkppk', // 正态, CP/CPK、PP/PPK
        realTime: true,
      },
      {
        value: 'normxmk',
        name: 'normalcmkppk', // 正态, CM/CMK、PP/PPK
        realTime: true,
      },
      // {
      //   value: 'bwxpk',
      //   name: 'bwcpkppk', // 组间组内, CP/CPK、PP/PPK
      //   realTime: true,
      // },
      // {
      //   value: 'nnormxpk',
      //   name: 'nonnormalppk', // 非正态, PP/PPK
      //   realTime: true,
      // },
    ],
  },
];
const parameterList = [
  // group_id=1, 单值算法
  {
    group_id: 1,
    chart_type: 'i_chart',
    parameter: {
      variates: {
        variateOne: {
          show: true,
          required: true,
        },
        variateTwo: {
          show: false,
          required: false,
        },
        variateThree: {
          show: false,
          required: false,
        },
      },
      parameters: {
        // 均值
        meanValue: {
          show: true,
          required: false,
        },
        // 标准差
        standardDeviation: {
          show: true,
          required: false,
        },
      },
      estimated: {
        mrmode: {
          show: true,
          required: true,
        },
        mrLength: {
          show: true,
          required: true,
        },
      },
      options: {},
      tests: {
        onepoint: {
          show: true,
          required: false,
        },
        npointsall: {
          show: true,
          required: false,
        },
        npointssameside: {
          show: true,
          required: false,
        },
        npointsupdown: {
          show: true,
          required: false,
        },
        pointsbiggerthan2: {
          show: true,
          required: false,
        },
        npoints1: {
          show: true,
          required: false,
        },
        pointsbiggerthan1: {
          show: true,
          required: false,
        },
        npointsbiggerthan1: {
          show: true,
          required: false,
        },
      },
      boxcox: {
        show: true,
        required: false,
      },
    },
  },
  {
    group_id: 1,
    chart_type: 'mr_chart',
    parameter: {
      variates: {
        variateOne: {
          show: true,
          required: true,
        },
        variateTwo: {
          show: false,
          required: false,
        },
        variateThree: {
          show: false,
          required: false,
        },
      },
      parameters: {
        // 标准差
        standardDeviation: {
          show: true,
          required: false,
        },
      },
      estimated: {
        mrmode: {
          show: true,
          required: true,
        },
        mrLength: {
          show: true,
          required: true,
        },
      },
      options: {},
      tests: {
        onepoint: {
          show: true,
          required: false,
        },
        npointsall: {
          show: true,
          required: false,
        },
        npointssameside: {
          show: true,
          required: false,
        },
        npointsupdown: {
          show: true,
          required: false,
        },
      },
      boxcox: {
        show: true,
        required: false,
      },
    },
  },
  {
    group_id: 1,
    chart_type: 'i-mr_chart',
    // 参数配置
    parameter: {
      // 变量
      variates: {
        variateOne: {
          show: true,
          required: true,
        },
        variateTwo: {
          show: false,
          required: false,
        },
        variateThree: {
          show: false,
          required: false,
        },
      },
      // 参数
      parameters: {
        // 均值
        meanValue: {
          show: true,
          required: false,
        },
        // 标准差
        standardDeviation: {
          show: true,
          required: false,
        },
      },
      estimated: {
        mrmode: {
          show: true,
          required: true,
        },
        mrLength: {
          show: true,
          required: true,
        },
      },
      options: {},
      tests: {
        // 检验
        onepoint: {
          show: true,
          required: false,
        },
        npointsall: {
          show: true,
          required: false,
        },
        npointssameside: {
          show: true,
          required: false,
        },
        npointsupdown: {
          show: true,
          required: false,
        },
        // pointsbiggerthan2: {
        //   show: true,
        //   required: false,
        // },
        // npoints1: {
        //   show: true,
        //   required: false,
        // },
        // pointsbiggerthan1: {
        //   show: true,
        //   required: false,
        // },
        // npointsbiggerthan1: {
        //   show: true,
        //   required: false,
        // },
      },
      boxcox: {
        show: true,
        required: false,
      },
    },
  },
  {
    group_id: 1,
    chart_type: 'z-mr_chart',
    parameter: {
      // 变量
      variates: {
        partnumber: {
          show: true,
          required: true,
        },
        variateOne: {
          show: true,
          required: true,
        },
        variateTwo: {
          show: false,
          required: false,
        },
        variateThree: {
          show: false,
          required: false,
        },
      },
      // 参数
      parameters: {
        // 均值
        meanValue: {
          show: false, // z-mr算法不按照标签分别填写均值标准差，因此隐藏对应显示
          required: false,
        },
        // 标准差
        standardDeviation: {
          show: false, // z-mr算法不按照标签分别填写均值标准差，因此隐藏对应显示
          required: false,
        },
      },
      estimated: {
        mrmode: {
          show: true,
          required: true,
        },
        mrLength: {
          show: true,
          required: true,
        },
      },
      options: {},
      tests: {
        onepoint: {
          show: true,
          required: false,
        },
        npointsall: {
          show: true,
          required: false,
        },
        npointssameside: {
          show: true,
          required: false,
        },
        npointsupdown: {
          show: true,
          required: false,
        },
        pointsbiggerthan2: {
          show: true,
          required: false,
        },
        npoints1: {
          show: true,
          required: false,
        },
        pointsbiggerthan1: {
          show: true,
          required: false,
        },
        npointsbiggerthan1: {
          show: true,
          required: false,
        },
      },
      boxcox: {
        show: true,
        required: false,
      },
    },
  },
  // group_id=2, 子组算法
  {
    group_id: 2,
    chart_type: 'xbar-r_chart',
    parameter: {
      variates: {
        variateOne: {
          show: true,
          required: true,
        },
        subgroupsizenumber: {
          show: true,
          required: true,
        },
        subgroupsizecolumn: {
          show: true,
          required: true,
        },
        variateTwo: {
          show: false,
          required: false,
        },
        variateThree: {
          show: false,
          required: false,
        },
      },
      parameters: {
        // 均值
        meanValue: {
          show: true,
          required: false,
        },
        // 标准差
        standardDeviation: {
          show: true,
          required: false,
        },
      },
      estimated: {
        standarddeviation: {
          show: true,
          required: true,
        },
        useunbiasingconstant: {
          show: true,
          required: false,
        },
      },
      options: {},
      tests: {
        onepoint: {
          show: true,
          required: false,
        },
        npointsall: {
          show: true,
          required: false,
        },
        npointssameside: {
          show: true,
          required: false,
        },
        npointsupdown: {
          show: true,
          required: false,
        },
        pointsbiggerthan2: {
          show: true,
          required: false,
        },
        npoints1: {
          show: true,
          required: false,
        },
        pointsbiggerthan1: {
          show: true,
          required: false,
        },
        npointsbiggerthan1: {
          show: true,
          required: false,
        },
      },
      boxcox: {
        show: true,
        required: false,
      },
    },
  },
  {
    group_id: 2,
    chart_type: 'xbar-s_chart',
    parameter: {
      variates: {
        variateOne: {
          show: true,
          required: true,
        },
        subgroupsizenumber: {
          show: true,
          required: true,
        },
        subgroupsizecolumn: {
          show: true,
          required: true,
        },
        variateTwo: {
          show: false,
          required: false,
        },
        variateThree: {
          show: false,
          required: false,
        },
      },
      parameters: {
        // 均值
        meanValue: {
          show: true,
          required: false,
        },
        // 标准差
        standardDeviation: {
          show: true,
          required: false,
        },
      },
      estimated: {
        standarddeviation: {
          show: true,
          required: true,
        },
        useunbiasingconstant: {
          show: true,
          required: false,
        },
      },
      options: {},
      tests: {
        onepoint: {
          show: true,
          required: false,
        },
        npointsall: {
          show: true,
          required: false,
        },
        npointssameside: {
          show: true,
          required: false,
        },
        npointsupdown: {
          show: true,
          required: false,
        },
        pointsbiggerthan2: {
          show: true,
          required: false,
        },
        npoints1: {
          show: true,
          required: false,
        },
        pointsbiggerthan1: {
          show: true,
          required: false,
        },
        npointsbiggerthan1: {
          show: true,
          required: false,
        },
      },
      boxcox: {
        show: true,
        required: false,
      },
    },
  },
  {
    group_id: 2,
    chart_type: 'xbar_chart',
    parameter: {
      variates: {
        variateOne: {
          show: true,
          required: true,
        },
        subgroupsizenumber: {
          show: true,
          required: true,
        },
        subgroupsizecolumn: {
          show: true,
          required: true,
        },
        variateTwo: {
          show: false,
          required: false,
        },
        variateThree: {
          show: false,
          required: false,
        },
      },
      parameters: {
        // 均值
        meanValue: {
          show: true,
          required: false,
        },
        // 标准差
        standardDeviation: {
          show: true,
          required: false,
        },
      },
      estimated: {
        standarddeviation: {
          show: true,
          required: true,
        },
        useunbiasingconstant: {
          show: true,
          required: false,
        },
      },
      options: {},
      tests: {
        onepoint: {
          show: true,
          required: false,
        },
        npointsall: {
          show: true,
          required: false,
        },
        npointssameside: {
          show: true,
          required: false,
        },
        npointsupdown: {
          show: true,
          required: false,
        },
        pointsbiggerthan2: {
          show: true,
          required: false,
        },
        npoints1: {
          show: true,
          required: false,
        },
        pointsbiggerthan1: {
          show: true,
          required: false,
        },
        npointsbiggerthan1: {
          show: true,
          required: false,
        },
      },
      boxcox: {
        show: true,
        required: false,
      },
    },
  },
  {
    group_id: 2,
    chart_type: 's_chart',
    parameter: {
      variates: {
        variateOne: {
          show: true,
          required: true,
        },
        subgroupsizenumber: {
          show: true,
          required: true,
        },
        subgroupsizecolumn: {
          show: true,
          required: true,
        },
        variateTwo: {
          show: false,
          required: false,
        },
        variateThree: {
          show: false,
          required: false,
        },
      },
      parameters: {
        // 标准差
        standardDeviation: {
          show: true,
          required: false,
        },
      },
      estimated: {
        standarddeviation: {
          show: true,
          required: true,
        },
        useunbiasingconstant: {
          show: true,
          required: false,
        },
      },
      options: {},
      tests: {
        onepoint: {
          show: true,
          required: false,
        },
        npointsall: {
          show: true,
          required: false,
        },
        npointssameside: {
          show: true,
          required: false,
        },
        npointsupdown: {
          show: true,
          required: false,
        },
      },
      boxcox: {
        show: true,
        required: false,
      },
    },
  },
  {
    group_id: 2,
    chart_type: 'r_chart',
    parameter: {
      variates: {
        variateOne: {
          show: true,
          required: true,
        },
        subgroupsizenumber: {
          show: true,
          required: true,
        },
        subgroupsizecolumn: {
          show: true,
          required: true,
        },
        variateTwo: {
          show: false,
          required: false,
        },
        variateThree: {
          show: false,
          required: false,
        },
      },
      parameters: {
        // 标准差
        standardDeviation: {
          show: true,
          required: false,
        },
      },
      estimated: {
        standarddeviation: {
          show: true,
          required: true,
        },
        useunbiasingconstant: {
          show: true,
          required: false,
        },
      },
      options: {},
      tests: {
        onepoint: {
          show: true,
          required: false,
        },
        npointsall: {
          show: true,
          required: false,
        },
        npointssameside: {
          show: true,
          required: false,
        },
        npointsupdown: {
          show: true,
          required: false,
        },
      },
      boxcox: {
        show: true,
        required: false,
      },
    },
  },
  {
    group_id: 2,
    chart_type: 'zone_chart',
    parameter: {
      variates: {
        variateOne: {
          show: true,
          required: true,
        },
        subgroupsizenumber: {
          show: true,
          required: true,
        },
        subgroupsizecolumn: {
          show: true,
          required: true,
        },
        variateTwo: {
          show: false,
          required: false,
        },
        variateThree: {
          show: false,
          required: false,
        },
      },
      parameters: {
        // 均值
        meanValue: {
          show: true,
          required: false,
        },
        // 标准差
        standardDeviation: {
          show: true,
          required: false,
        },
      },
      estimated: {
        mrmode: {
          show: true,
          required: true,
        },
        mrLength: {
          show: true,
          required: true,
        },
        standarddeviation: {
          show: true,
          required: true,
        },
        useunbiasingconstant: {
          show: true,
          required: false,
        },
      },
      options: {},
      weights: {
        zonea: {
          show: true,
          required: true,
        },
        zoneb: {
          show: true,
          required: true,
        },
        zonec: {
          show: true,
          required: true,
        },
        zoned: {
          show: true,
          required: true,
        },
        reset: {
          show: true,
          required: false,
        },
        zonensigma: {
          show: true,
          required: false,
        },
      },
      tests: {
        onepoint: {
          show: false,
          required: false,
        },
        npointsall: {
          show: false,
          required: false,
        },
        npointssameside: {
          show: false,
          required: false,
        },
        npointsupdown: {
          show: false,
          required: false,
        },
        pointsbiggerthan2: {
          show: false,
          required: false,
        },
        npoints1: {
          show: false,
          required: false,
        },
        pointsbiggerthan1: {
          show: false,
          required: false,
        },
        npointsbiggerthan1: {
          show: false,
          required: false,
        },
      },
      boxcox: {
        show: true,
        required: false,
      },
    },
  },
  {
    group_id: 2,
    chart_type: 'i-mr-rs_chart',
    parameter: {
      variates: {
        variateOne: {
          show: true,
          required: true,
        },
        subgroupsizenumber: {
          show: true,
          required: true,
        },
        subgroupsizecolumn: {
          show: true,
          required: true,
        },
        variateTwo: {
          show: false,
          required: false,
        },
        variateThree: {
          show: false,
          required: false,
        },
      },
      parameters: {
        // 均值
        meanValue: {
          show: true,
          required: false,
        },
        withinSubgroupSD: {
          show: true,
          required: false,
        },
        betweenSubgroupSD: {
          show: true,
          required: false,
        },
      },
      estimated: {
        mrmode: {
          show: true,
          required: true,
        },
        mrLength: {
          show: true,
          required: true,
        },
        standarddeviation: {
          show: true,
          required: true,
        },
        standarddeviation2: {
          show: true,
          required: true,
        },
        useunbiasingconstant: {
          show: true,
          required: false,
        },
      },
      options: {},
      tests: {
        onepoint: {
          show: true,
          required: false,
        },
        npointsall: {
          show: true,
          required: false,
        },
        npointssameside: {
          show: true,
          required: false,
        },
        npointsupdown: {
          show: true,
          required: false,
        },
        pointsbiggerthan2: {
          show: true,
          required: false,
        },
        npoints1: {
          show: true,
          required: false,
        },
        pointsbiggerthan1: {
          show: true,
          required: false,
        },
        npointsbiggerthan1: {
          show: true,
          required: false,
        },
      },
      boxcox: {
        show: true,
        required: false,
      },
    },
  },
  // group_id=3, 属性控制算法
  {
    group_id: 3,
    chart_type: 'p_chart',
    parameter: {
      variates: {
        variateOne: {
          show: true,
          required: true,
        },
        subgroupsizenumber: {
          show: true,
          required: true,
        },
        subgroupsizecolumn: {
          show: true,
          required: true,
        },
        variateTwo: {
          show: false,
          required: false,
        },
        variateThree: {
          show: false,
          required: false,
        },
      },
      parameters: {
        // 比率
        proportion: {
          show: true,
          required: false,
        },
      },
      estimated: {},
      options: {},
      tests: {
        onepoint: {
          show: true,
          required: false,
        },
        npointsall: {
          show: true,
          required: false,
        },
        npointssameside: {
          show: true,
          required: false,
        },
        npointsupdown: {
          show: true,
          required: false,
        },
        pointsbiggerthan2: {
          show: false,
          required: false,
        },
        npoints1: {
          show: false,
          required: false,
        },
        pointsbiggerthan1: {
          show: false,
          required: false,
        },
        npointsbiggerthan1: {
          show: false,
          required: false,
        },
      },
      boxcox: {
        show: false,
        required: false,
      },
    },
  },
  {
    group_id: 3,
    chart_type: 'laney-p_chart',
    parameter: {
      variates: {
        variateOne: {
          show: true,
          required: true,
        },
        subgroupsizenumber: {
          show: true,
          required: true,
        },
        subgroupsizecolumn: {
          show: true,
          required: true,
        },
        variateTwo: {
          show: false,
          required: false,
        },
        variateThree: {
          show: false,
          required: false,
        },
      },
      parameters: {
        // 比率
        proportion: {
          show: true,
          required: false,
        },
      },
      options: {},
      estimated: {},
      tests: {
        onepoint: {
          show: true,
          required: false,
        },
        npointsall: {
          show: true,
          required: false,
        },
        npointssameside: {
          show: true,
          required: false,
        },
        npointsupdown: {
          show: true,
          required: false,
        },
        pointsbiggerthan2: {
          show: false,
          required: false,
        },
        npoints1: {
          show: false,
          required: false,
        },
        pointsbiggerthan1: {
          show: false,
          required: false,
        },
        npointsbiggerthan1: {
          show: false,
          required: false,
        },
      },
      boxcox: {
        show: false,
        required: false,
      },
    },
  },
  {
    group_id: 3,
    chart_type: 'np_chart',
    parameter: {
      variates: {
        variateOne: {
          show: true,
          required: true,
        },
        subgroupsizenumber: {
          show: true,
          required: true,
        },
        subgroupsizecolumn: {
          show: true,
          required: true,
        },
        variateTwo: {
          show: false,
          required: false,
        },
        variateThree: {
          show: false,
          required: false,
        },
      },
      parameters: {
        // 比率
        proportion: {
          show: true,
          required: false,
        },
      },
      estimated: {},
      options: {},
      tests: {
        onepoint: {
          show: true,
          required: false,
        },
        npointsall: {
          show: true,
          required: false,
        },
        npointssameside: {
          show: true,
          required: false,
        },
        npointsupdown: {
          show: true,
          required: false,
        },
        pointsbiggerthan2: {
          show: false,
          required: false,
        },
        npoints1: {
          show: false,
          required: false,
        },
        pointsbiggerthan1: {
          show: false,
          required: false,
        },
        npointsbiggerthan1: {
          show: false,
          required: false,
        },
      },
      boxcox: {
        show: false,
        required: false,
      },
    },
  },
  {
    group_id: 3,
    chart_type: 'u_chart',
    parameter: {
      variates: {
        variateOne: {
          show: true,
          required: true,
        },
        subgroupsizenumber: {
          show: true,
          required: true,
        },
        subgroupsizecolumn: {
          show: true,
          required: true,
        },
        variateTwo: {
          show: false,
          required: false,
        },
        variateThree: {
          show: false,
          required: false,
        },
      },
      parameters: {
        // 均值
        meanValue: {
          show: true,
          required: false,
        },
      },
      estimated: {},
      options: {},
      tests: {
        onepoint: {
          show: true,
          required: false,
        },
        npointsall: {
          show: true,
          required: false,
        },
        npointssameside: {
          show: true,
          required: false,
        },
        npointsupdown: {
          show: true,
          required: false,
        },
        pointsbiggerthan2: {
          show: false,
          required: false,
        },
        npoints1: {
          show: false,
          required: false,
        },
        pointsbiggerthan1: {
          show: false,
          required: false,
        },
        npointsbiggerthan1: {
          show: false,
          required: false,
        },
      },
      boxcox: {
        show: false,
        required: false,
      },
    },
  },
  {
    group_id: 3,
    chart_type: 'laney-u_chart',
    parameter: {
      variates: {
        variateOne: {
          show: true,
          required: true,
        },
        subgroupsizenumber: {
          show: true,
          required: true,
        },
        subgroupsizecolumn: {
          show: true,
          required: true,
        },
        variateTwo: {
          show: false,
          required: false,
        },
        variateThree: {
          show: false,
          required: false,
        },
      },
      parameters: {
        // 均值
        meanValue: {
          show: true,
          required: false,
        },
      },
      estimated: {},
      options: {},
      tests: {
        onepoint: {
          show: true,
          required: false,
        },
        npointsall: {
          show: true,
          required: false,
        },
        npointssameside: {
          show: true,
          required: false,
        },
        npointsupdown: {
          show: true,
          required: false,
        },
        pointsbiggerthan2: {
          show: false,
          required: false,
        },
        npoints1: {
          show: false,
          required: false,
        },
        pointsbiggerthan1: {
          show: false,
          required: false,
        },
        npointsbiggerthan1: {
          show: false,
          required: false,
        },
      },
      boxcox: {
        show: false,
        required: false,
      },
    },
  },
  {
    group_id: 3,
    chart_type: 'c_chart',
    parameter: {
      variates: {
        variateOne: {
          show: true,
          required: true,
        },
        variateTwo: {
          show: false,
          required: false,
        },
        variateThree: {
          show: false,
          required: false,
        },
      },
      parameters: {
        // 均值
        meanValue: {
          show: true,
          required: false,
        },
      },
      options: {},
      estimated: {},
      tests: {
        onepoint: {
          show: true,
          required: false,
        },
        npointsall: {
          show: true,
          required: false,
        },
        npointssameside: {
          show: true,
          required: false,
        },
        npointsupdown: {
          show: true,
          required: false,
        },
        pointsbiggerthan2: {
          show: false,
          required: false,
        },
        npoints1: {
          show: false,
          required: false,
        },
        pointsbiggerthan1: {
          show: false,
          required: false,
        },
        npointsbiggerthan1: {
          show: false,
          required: false,
        },
      },
      boxcox: {
        show: false,
        required: false,
      },
    },
  },
  // group_id=4, 时间加权算法
  {
    group_id: 4,
    chart_type: 'ma_chart',
    parameter: {
      variates: {
        variateOne: {
          show: true,
          required: true,
        },
        subgroupsizenumber: {
          show: true,
          required: true,
        },
        subgroupsizecolumn: {
          show: true,
          required: true,
        },
        movingaveragelength: {
          show: true,
          required: true,
        },
        variateTwo: {
          show: false,
          required: false,
        },
        variateThree: {
          show: false,
          required: false,
        },
      },
      parameters: {
        // 均值
        meanValue: {
          show: true,
          required: false,
        },
        // 标准差
        standardDeviation: {
          show: true,
          required: false,
        },
      },
      estimated: {
        mrmode: {
          show: true,
          required: true,
        },
        mrLength: {
          show: true,
          required: true,
        },
        standarddeviation: {
          show: true,
          required: true,
        },
        useunbiasingconstant: {
          show: true,
          required: false,
        },
      },
      options: {},
      tests: {
        onepoint: {
          show: true,
          required: false,
        },
        npointsall: {
          show: false,
          required: false,
        },
        npointssameside: {
          show: false,
          required: false,
        },
        npointsupdown: {
          show: false,
          required: false,
        },
        pointsbiggerthan2: {
          show: false,
          required: false,
        },
        npoints1: {
          show: false,
          required: false,
        },
        pointsbiggerthan1: {
          show: false,
          required: false,
        },
        npointsbiggerthan1: {
          show: false,
          required: false,
        },
      },
      boxcox: {
        show: true,
        required: false,
      },
    },
  },
  {
    group_id: 4,
    chart_type: 'ewma_chart',
    parameter: {
      variates: {
        variateOne: {
          show: true,
          required: true,
        },
        subgroupsizenumber: {
          show: true,
          required: true,
        },
        subgroupsizecolumn: {
          show: true,
          required: true,
        },
        ewmaweight: {
          show: true,
          required: true,
        },
        variateTwo: {
          show: false,
          required: false,
        },
        variateThree: {
          show: false,
          required: false,
        },
      },
      parameters: {
        // 均值
        meanValue: {
          show: true,
          required: false,
        },
        // 标准差
        standardDeviation: {
          show: true,
          required: false,
        },
      },
      estimated: {
        mrmode: {
          show: true,
          required: true,
        },
        mrLength: {
          show: true,
          required: true,
        },
        standarddeviation: {
          show: true,
          required: true,
        },
        useunbiasingconstant: {
          show: true,
          required: false,
        },
      },
      options: {},
      tests: {
        onepoint: {
          show: true,
          required: false,
        },
        npointsall: {
          show: false,
          required: false,
        },
        npointssameside: {
          show: false,
          required: false,
        },
        npointsupdown: {
          show: false,
          required: false,
        },
        pointsbiggerthan2: {
          show: false,
          required: false,
        },
        npoints1: {
          show: false,
          required: false,
        },
        pointsbiggerthan1: {
          show: false,
          required: false,
        },
        npointsbiggerthan1: {
          show: false,
          required: false,
        },
      },
      boxcox: {
        show: true,
        required: false,
      },
    },
  },
  {
    group_id: 4,
    chart_type: 'cumsum_chart',
    parameter: {
      variates: {
        variateOne: {
          show: true,
          required: true,
        },
        subgroupsizenumber: {
          show: true,
          required: true,
        },
        subgroupsizecolumn: {
          show: true,
          required: true,
        },
        target: {
          show: true,
          required: true,
        },
        variateTwo: {
          show: false,
          required: false,
        },
        variateThree: {
          show: false,
          required: false,
        },
      },
      parameters: {
        // 标准差
        standardDeviation: {
          show: false,
          required: false,
        },
      },
      estimated: {
        mrmode: {
          show: true,
          required: true,
        },
        mrLength: {
          show: true,
          required: true,
        },
        standarddeviation: {
          show: true,
          required: true,
        },
        useunbiasingconstant: {
          show: true,
          required: false,
        },
      },
      options: {},
      planortype: {
        cumsumtype: {
          show: true,
          required: true,
        },
        reset: {
          show: true,
          required: false,
        },
        useFIR: {
          show: true,
          required: false,
        },
        sdnumber: {
          show: true,
          required: false,
        },
        h: {
          show: true,
          required: true,
        },
        k: {
          show: true,
          required: true,
        },
      },
      tests: {
        onepoint: {
          show: false,
          required: false,
        },
        npointsall: {
          show: false,
          required: false,
        },
        npointssameside: {
          show: false,
          required: false,
        },
        npointsupdown: {
          show: false,
          required: false,
        },
        pointsbiggerthan2: {
          show: false,
          required: false,
        },
        npoints1: {
          show: false,
          required: false,
        },
        pointsbiggerthan1: {
          show: false,
          required: false,
        },
        npointsbiggerthan1: {
          show: false,
          required: false,
        },
      },
      boxcox: {
        show: true,
        required: false,
      },
    },
  },
  // group_id=5, 多变量算法
  {
    group_id: 5,
    chart_type: 'tsqrd_chart',
    parameter: {
      variates: {
        variateOne: {
          show: true,
          required: true,
        },
        variateTwo: {
          show: true,
          required: true,
        },
        subgroupsizenumber: {
          show: true,
          required: true,
        },
        subgroupsizecolumn: {
          show: true,
          required: true,
        },
        variateThree: {
          show: false,
          required: false,
        },
      },
      parameters: {
        // 均值
        // meanValue: {
        //   show: false,
        //   required: false,
        // },
      },
      estimated: {},
      options: {},
      tests: {
        onepoint: {
          show: false,
          required: false,
        },
        npointsall: {
          show: false,
          required: false,
        },
        npointssameside: {
          show: false,
          required: false,
        },
        npointsupdown: {
          show: false,
          required: false,
        },
        pointsbiggerthan2: {
          show: false,
          required: false,
        },
        npoints1: {
          show: false,
          required: false,
        },
        pointsbiggerthan1: {
          show: false,
          required: false,
        },
        npointsbiggerthan1: {
          show: false,
          required: false,
        },
      },
      boxcox: {
        show: true,
        required: false,
      },
    },
  },
  {
    group_id: 5,
    chart_type: 'tsqrd-gv_chart',
    parameter: {
      variates: {
        variateOne: {
          show: true,
          required: true,
        },
        variateTwo: {
          show: true,
          required: true,
        },
        subgroupsizenumber: {
          show: true,
          required: true,
        },
        subgroupsizecolumn: {
          show: true,
          required: true,
        },
        variateThree: {
          show: false,
          required: false,
        },
      },
      parameters: {
        // 均值
        // meanValue: {
        //   show: false,
        //   required: false,
        // },
      },
      estimated: {},
      options: {},
      tests: {
        onepoint: {
          show: false,
          required: false,
        },
        npointsall: {
          show: false,
          required: false,
        },
        npointssameside: {
          show: false,
          required: false,
        },
        npointsupdown: {
          show: false,
          required: false,
        },
        pointsbiggerthan2: {
          show: false,
          required: false,
        },
        npoints1: {
          show: false,
          required: false,
        },
        pointsbiggerthan1: {
          show: false,
          required: false,
        },
        npointsbiggerthan1: {
          show: false,
          required: false,
        },
      },
      boxcox: {
        show: true,
        required: false,
      },
    },
  },
  {
    group_id: 5,
    chart_type: 'genvar_chart',
    parameter: {
      variates: {
        variateOne: {
          show: true,
          required: true,
        },
        variateTwo: {
          show: true,
          required: true,
        },
        subgroupsizenumber: {
          show: true,
          required: true,
        },
        subgroupsizecolumn: {
          show: true,
          required: true,
        },
        variateThree: {
          show: false,
          required: false,
        },
      },
      parameters: {},
      estimated: {},
      options: {},
      tests: {
        onepoint: {
          show: false,
          required: false,
        },
        npointsall: {
          show: false,
          required: false,
        },
        npointssameside: {
          show: false,
          required: false,
        },
        npointsupdown: {
          show: false,
          required: false,
        },
        pointsbiggerthan2: {
          show: false,
          required: false,
        },
        npoints1: {
          show: false,
          required: false,
        },
        pointsbiggerthan1: {
          show: false,
          required: false,
        },
        npointsbiggerthan1: {
          show: false,
          required: false,
        },
      },
      boxcox: {
        show: true,
        required: false,
      },
    },
  },
  // group_id=6, 能力分析算法
  {
    group_id: 6,
    chart_type: 'normxpk', // 正态：cpk/ppk
    parameter: {
      variates: {
        variateOne: {
          show: true,
          required: true,
        },
        variateTwo: {
          show: false,
          required: false,
        },
        subgroupsizenumber: {
          show: true,
          required: true,
        },
        subgroupsizecolumn: {
          show: true,
          required: true,
        },
        variateThree: {
          show: false,
          required: false,
        },
      },
      parameters: {
        // 规格上限
        upperLimit: {
          show: true,
          required: false,
        },
        // 规则下限
        lowerLimit: {
          show: true,
          required: false,
        },
        // 历史均值
        meanValue: {
          show: true,
          required: false,
        },
        // 历史标准差
        standardDeviation: {
          show: true,
          required: false,
        },
      },
      estimated: {
        mrmode: {
          show: true,
          required: true,
        },
        mrLength: {
          show: true,
          required: true,
        },
        standarddeviation: {
          show: true,
          required: true,
        },
        useunbiasingconstant: {
          show: true,
          required: false,
        },
        usebiasoverallsd: {
          show: true,
          required: false,
        },
      },
      options: {
        cpmTarget: {
          show: true,
          required: false,
        },
        ksigma: {
          show: true,
          required: false,
        },
        withinSubgroup: {
          show: true,
          required: false,
        },
        overall: {
          show: true,
          required: false,
        },
        display: {
          show: true,
          required: true,
        },
        includeConfidenceIntervals: {
          show: true,
          required: false,
        },
        confidenceLevel: {
          show: true,
          required: false,
        },
        confidenceIntervals: {
          show: true,
          required: false,
        },
      },
      tests: {},
      boxcox: {
        show: true,
        required: false,
      },
    },
  },
  {
    group_id: 6,
    chart_type: 'normxmk', // 正态：cmk/ppk
    parameter: {
      variates: {
        variateOne: {
          show: true,
          required: true,
        },
        variateTwo: {
          show: false,
          required: false,
        },
        subgroupsizenumber: {
          show: false,
          required: false,
        },
        subgroupsizecolumn: {
          show: false,
          required: false,
        },
        variateThree: {
          show: false,
          required: false,
        },
      },
      parameters: {
        // 规格上限
        upperLimit: {
          show: true,
          required: false,
        },
        // 规则下限
        lowerLimit: {
          show: true,
          required: false,
        },
        // 历史均值
        meanValue: {
          show: true,
          required: false,
        },
        // 历史标准差
        standardDeviation: {
          show: true,
          required: false,
        },
      },
      estimated: {
        mrmode: {
          show: true,
          required: true,
        },
        mrLength: {
          show: true,
          required: true,
        },
        standarddeviation: {
          show: true,
          required: true,
        },
        useunbiasingconstant: {
          show: true,
          required: false,
        },
        usebiasoverallsd: {
          show: true,
          required: false,
        },
      },
      options: {
        cpmTarget: {
          show: true,
          required: false,
        },
        ksigma: {
          show: true,
          required: false,
        },
        withinSubgroup: {
          show: true,
          required: false,
        },
        overall: {
          show: true,
          required: false,
        },
        display: {
          show: true,
          required: true,
        },
        includeConfidenceIntervals: {
          show: true,
          required: false,
        },
        confidenceLevel: {
          show: true,
          required: false,
        },
        confidenceIntervals: {
          show: true,
          required: false,
        },
      },
      tests: {},
      boxcox: {
        show: true,
        required: false,
      },
    },
  },
  {
    group_id: 6,
    chart_type: 'bwxpk', // 组间组内: cpk/ppk
    parameter: {
      variates: {
        variateOne: {
          show: true,
          required: true,
        },
        variateTwo: {
          show: false,
          required: false,
        },
        subgroupsizenumber: {
          show: true,
          required: true,
        },
        subgroupsizecolumn: {
          show: true,
          required: true,
        },
        variateThree: {
          show: false,
          required: false,
        },
      },
      parameters: {
        // 规格上限
        upperLimit: {
          show: true,
          required: false,
        },
        // 规则下限
        lowerLimit: {
          show: true,
          required: false,
        },
        // 历史均值
        meanValue: {
          show: true,
          required: false,
        },
        // 使用历史标准差
        useHistorySD: {
          show: true,
          required: false,
        },
        withinSubgroupSD: {
          show: true,
          required: false,
        },
        betweenSubgroupSD: {
          show: true,
          required: false,
        },
      },
      estimated: {
        mrmode: {
          show: true,
          required: true,
        },
        mrLength: {
          show: true,
          required: true,
        },
        standarddeviation: {
          show: true,
          required: true,
        },
        useunbiasingconstant: {
          show: true,
          required: false,
        },
        usebiasoverallsd: {
          show: true,
          required: false,
        },
      },
      options: {
        cpmTarget: {
          show: true,
          required: false,
        },
        ksigma: {
          show: true,
          required: false,
        },
        withinSubgroup: {
          show: true,
          required: false,
        },
        overall: {
          show: true,
          required: false,
        },
        display: {
          show: true,
          required: true,
        },
        includeConfidenceIntervals: {
          show: true,
          required: false,
        },
        confidenceLevel: {
          show: true,
          required: false,
        },
        confidenceIntervals: {
          show: true,
          required: false,
        },
      },
      tests: {},
      boxcox: {
        show: true,
        required: false,
      },
    },
  },
  {
    group_id: 6,
    chart_type: 'nnormxpk', // 非正态: ppk
    parameter: {
      variates: {
        variateOne: {
          show: true,
          required: true,
        },
        variateTwo: {
          show: false,
          required: false,
        },
        subgroupsizenumber: {
          show: false,
          required: false,
        },
        subgroupsizecolumn: {
          show: false,
          required: false,
        },
        variateThree: {
          show: false,
          required: false,
        },
      },
      parameters: {
        // 规格上限
        upperLimit: {
          show: true,
          required: false,
        },
        // 规则下限
        lowerLimit: {
          show: true,
          required: false,
        },
        // 分布拟合
        fitDistribution: {
          show: true,
          required: true,
        },
      },
      estimated: {},
      options: {
        cpmTarget: {
          show: true,
          required: false,
        },
        ksigma: {
          show: true,
          required: false,
        },
        performAnalysis: {
          show: true,
          required: true,
        },
        display: {
          show: true,
          required: true,
        },
      },
      tests: {},
      boxcox: {
        show: true,
        required: false,
      },
    },
  },
];

export {
  algorithmList,
  parameterList,
};
