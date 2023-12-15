class PepperConfig {
  getAdminMenu() {
    return [
      {
        header: 'systemInitialization',
        icon: 'mdi-atom-variant',
        children: [
          {
            id: 1001,
            icon: 'mdi-home-city',
            to: 'factory-company',
            title: 'factoryAndCompany',
            description: 'factoryAndCompany',
            external: false,
            http: false,
          },
          {
            id: 1002,
            icon: 'mdi-account-cog-outline',
            to: 'initial-administrator',
            title: 'initialAdministrator',
            description: 'initialAdministrator',
            external: false,
            http: false,
          },
        ],
      },
      {
        header: 'productService',
        icon: 'mdi-cube-outline',
        children: [
          {
            id: 2001,
            icon: 'mdi-apps',
            to: 'application-management',
            title: 'applicationManagement',
            description: 'applicationManagement',
            external: false,
            http: false,
          },
        ],
      },
    ];
  }

  // for test
  getMenuByType() {
    return [
      {
        type: 'zhHans',
        menuVoList: [
          {
            id: 1,
            parentId: 0,
            sort: 1,
            component: null,
            menuType: 'm',
            visible: '0',
            status: '0',
            perms: 'test',
            icon: 'mdi-link',
            remark: null,
            languageType: 'en',
            menuName: '看板',
            enable: false,
            childMenuVo: [
              {
                id: 3,
                parentId: 1,
                sort: 2,
                component: null,
                menuType: 'm',
                visible: '0',
                status: '0',
                perms: null,
                icon: 'mdi-view-grid-outline',
                remark: null,
                languageType: 'en',
                menuName: '看板',
                enable: false,
                childMenuVo: [
                  {
                    id: 4,
                    parentId: 3,
                    sort: 2,
                    component: 'initialAdministrator',
                    menuType: 'c',
                    visible: '0',
                    status: '0',
                    perms: null,
                    icon: null,
                    remark: null,
                    childMenuVo: null,
                    languageType: 'en',
                    menuName: '过程看板',
                    enable: true,
                  },
                  {
                    id: 5,
                    parentId: 3,
                    sort: 2,
                    component: 'applicationManagement',
                    menuType: 'c',
                    visible: '0',
                    status: '0',
                    perms: null,
                    icon: null,
                    remark: null,
                    childMenuVo: null,
                    languageType: 'en',
                    menuName: '储柜看板',
                    enable: false,
                  },
                ],
              },
            ],
          },
          {
            id: 2,
            parentId: 0,
            sort: 1,
            component: null,
            menuType: 'm',
            visible: '0',
            status: '0',
            perms: 'test',
            icon: 'mdi-atom-variant',
            remark: null,
            languageType: 'en',
            menuName: '大概是基础配置',
            enable: false,
            childMenuVo: [
              {
                id: 6,
                parentId: 2,
                sort: 2,
                component: null,
                menuType: 'm',
                visible: '0',
                status: '0',
                perms: null,
                icon: 'mdi-information-outline',
                remark: null,
                languageType: 'en',
                menuName: '基础配置',
                enable: false,
                childMenuVo: [
                  {
                    id: 7,
                    parentId: 3,
                    sort: 2,
                    component: 'initialAdministrator',
                    menuType: 'c',
                    visible: '0',
                    status: '0',
                    perms: null,
                    icon: null,
                    remark: null,
                    languageType: 'en',
                    menuName: '通讯配置',
                    enable: false,
                    childMenuVo: [
                      {
                        id: 71,
                        parentId: 0,
                        sort: 1,
                        component: 'userRole',
                        menuType: 's',
                        visible: '1',
                        status: '0',
                        perms: 'test',
                        icon: 'mdi-apple-keyboard-command',
                        remark: null,
                        languageType: 'en',
                        menuName: '用户',
                        enable: false,
                        childMenuVo: [
                          {
                            id: 711,
                            parentId: 71,
                            parentMenuType: 's',
                            sort: 1,
                            component: 'userRole',
                            menuType: 'B',
                            visible: '1',
                            status: '0',
                            perms: 'test',
                            icon: 'mdi-apple-keyboard-command',
                            remark: null,
                            languageType: 'en',
                            menuName: '按钮1',
                            enable: true,
                            childMenuVo: null,
                          },
                          {
                            id: 712,
                            parentId: 0,
                            parentMenuType: 's',
                            sort: 1,
                            component: 'userRole',
                            menuType: 'B',
                            visible: '1',
                            status: '0',
                            perms: 'test',
                            icon: 'mdi-apple-keyboard-command',
                            remark: null,
                            languageType: 'en',
                            menuName: '按钮2',
                            enable: false,
                            childMenuVo: null,
                          },
                        ],
                      },
                      {
                        id: 72,
                        parentId: 0,
                        sort: 1,
                        component: 'userRole',
                        menuType: 's',
                        visible: '1',
                        status: '0',
                        perms: 'test',
                        icon: 'mdi-apple-keyboard-command',
                        remark: null,
                        languageType: 'en',
                        menuName: '角色',
                        enable: false,
                        childMenuVo: [
                          {
                            id: 721,
                            parentId: 0,
                            parentMenuType: 's',
                            sort: 1,
                            component: 'userRole',
                            menuType: 'b',
                            visible: '1',
                            status: '0',
                            perms: 'test',
                            icon: 'mdi-apple-keyboard-command',
                            remark: null,
                            languageType: 'en',
                            menuName: '按3',
                            enable: false,
                            childMenuVo: null,
                          },
                        ],
                      },
                      {
                        id: 73,
                        parentId: 0,
                        sort: 1,
                        parentMenuType: 'c',
                        component: 'userRole',
                        menuType: 'b',
                        visible: '1',
                        status: '0',
                        perms: 'test',
                        icon: 'mdi-apple-keyboard-command',
                        remark: null,
                        languageType: 'en',
                        menuName: '按钮4',
                        enable: false,
                        childMenuVo: null,
                      },
                    ],
                  },
                  {
                    id: 8,
                    parentId: 3,
                    sort: 2,
                    component: 'applicationManagement',
                    menuType: 'c',
                    visible: '0',
                    status: '0',
                    perms: null,
                    icon: null,
                    remark: null,
                    childMenuVo: null,
                    languageType: 'en',
                    menuName: '生产布局',
                    enable: false,
                  },
                  {
                    id: 9,
                    parentId: 3,
                    sort: 2,
                    component: 'initialAdministrator',
                    menuType: 'c',
                    visible: '0',
                    status: '0',
                    perms: null,
                    icon: null,
                    remark: null,
                    childMenuVo: null,
                    languageType: 'en',
                    menuName: '储柜管理',
                    enable: false,
                  },
                  {
                    id: 10,
                    parentId: 3,
                    sort: 2,
                    component: 'applicationManagement',
                    menuType: 'c',
                    visible: '0',
                    status: '0',
                    perms: null,
                    icon: null,
                    remark: null,
                    childMenuVo: null,
                    languageType: 'en',
                    menuName: '工序配置',
                    enable: false,
                  },
                  {
                    id: 11,
                    parentId: 3,
                    sort: 2,
                    component: 'initialAdministrator',
                    menuType: 'c',
                    visible: '0',
                    status: '0',
                    perms: null,
                    icon: null,
                    remark: null,
                    childMenuVo: null,
                    languageType: 'en',
                    menuName: '开机自检',
                    enable: false,
                  },
                  {
                    id: 12,
                    parentId: 3,
                    sort: 2,
                    component: 'applicationManagement',
                    menuType: 'c',
                    visible: '0',
                    status: '0',
                    perms: null,
                    icon: null,
                    remark: null,
                    childMenuVo: null,
                    languageType: 'en',
                    menuName: '参数校验',
                    enable: false,
                  },
                ],
              },
              {
                id: 13,
                parentId: 1,
                sort: 2,
                component: null,
                menuType: 'm',
                visible: '0',
                status: '0',
                perms: null,
                icon: 'mdi-file-document-outline',
                remark: null,
                childMenuVo: [
                  {
                    id: 14,
                    parentId: 13,
                    sort: 2,
                    component: 'initialAdministrator',
                    menuType: 'c',
                    visible: '0',
                    status: '0',
                    perms: null,
                    icon: null,
                    remark: null,
                    childMenuVo: null,
                    languageType: 'en',
                    menuName: '通讯日志',
                    enable: false,
                  },
                  {
                    id: 15,
                    parentId: 13,
                    sort: 2,
                    component: 'applicationManagement',
                    menuType: 'c',
                    visible: '0',
                    status: '0',
                    perms: null,
                    icon: null,
                    remark: null,
                    childMenuVo: null,
                    languageType: 'en',
                    menuName: '事件日志',
                    enable: false,
                  },
                  {
                    id: 16,
                    parentId: 13,
                    sort: 2,
                    component: 'initialAdministrator',
                    menuType: 'c',
                    visible: '0',
                    status: '0',
                    perms: null,
                    icon: null,
                    remark: null,
                    childMenuVo: null,
                    languageType: 'en',
                    menuName: '工单日志',
                    enable: false,
                  },
                  {
                    id: 17,
                    parentId: 13,
                    sort: 2,
                    component: 'applicationManagement',
                    menuType: 'c',
                    visible: '0',
                    status: '0',
                    perms: null,
                    icon: null,
                    remark: null,
                    childMenuVo: null,
                    languageType: 'en',
                    menuName: '操作日志',
                    enable: false,
                  },
                ],
                languageType: 'en',
                menuName: '日志',
                enable: false,
              },
            ],
          },
          {
            id: 18,
            parentId: 0,
            sort: 1,
            component: 'userRole',
            menuType: 'c',
            visible: '1',
            status: '0',
            perms: 'test',
            icon: 'mdi-apple-keyboard-command',
            remark: null,
            languageType: 'en',
            menuName: '用户与权限',
            enable: true,
            childMenuVo: [
              {
                id: 181,
                parentId: 0,
                sort: 1,
                component: 'userRole',
                menuType: 's',
                visible: '1',
                status: '0',
                perms: 'test',
                icon: 'mdi-apple-keyboard-command',
                remark: null,
                languageType: 'en',
                menuName: '用户',
                enable: false,
                childMenuVo: [
                  {
                    id: 1811,
                    parentId: 0,
                    sort: 1,
                    component: 'userRole',
                    menuType: 'B',
                    visible: '1',
                    status: '0',
                    perms: 'test',
                    icon: 'mdi-apple-keyboard-command',
                    remark: null,
                    languageType: 'en',
                    menuName: '按钮1',
                    enable: false,
                    childMenuVo: null,
                  },
                  {
                    id: 1812,
                    parentId: 0,
                    sort: 1,
                    component: 'userRole',
                    menuType: 'B',
                    visible: '1',
                    status: '0',
                    perms: 'test',
                    icon: 'mdi-apple-keyboard-command',
                    remark: null,
                    languageType: 'en',
                    menuName: '按钮2',
                    enable: false,
                    childMenuVo: null,
                  },
                ],
              },
              {
                id: 182,
                parentId: 0,
                sort: 1,
                component: 'userRole',
                menuType: 's',
                visible: '1',
                status: '0',
                perms: 'test',
                icon: 'mdi-apple-keyboard-command',
                remark: null,
                languageType: 'en',
                menuName: '角色',
                enable: false,
                childMenuVo: [
                  {
                    id: 1821,
                    parentId: 0,
                    sort: 1,
                    component: 'userRole',
                    menuType: 'b',
                    visible: '1',
                    status: '0',
                    perms: 'test',
                    icon: 'mdi-apple-keyboard-command',
                    remark: null,
                    languageType: 'en',
                    menuName: '按3',
                    enable: false,
                    childMenuVo: null,
                  },
                ],
              },
              {
                id: 183,
                parentId: 0,
                sort: 1,
                component: 'userRole',
                menuType: 'b',
                visible: '1',
                status: '0',
                perms: 'test',
                icon: 'mdi-apple-keyboard-command',
                remark: null,
                languageType: 'en',
                menuName: '按钮4',
                enable: true,
                childMenuVo: null,
              },
            ],
          },
          {
            id: 19,
            parentId: 0,
            sort: 1,
            component: 'userRole1',
            menuType: 'c',
            visible: '1',
            status: '0',
            perms: 'test',
            icon: 'mdi-apple-keyboard-command',
            remark: null,
            languageType: 'en',
            menuName: '测试',
            enable: true,
            childMenuVo: null,
          },
        ],
      },
    ];
  }
}

export default new PepperConfig();