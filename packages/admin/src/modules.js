/* eslint-disable */
export const localeModules = {
  locales: require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  'hello-world': require.context('./modules/hello-world/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  departmentManagement: require.context('./modules/department-management/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  positionManagement: require.context('./modules/position-management/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  userManagement: require.context('./modules/user-management/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  // factoryCompany: require.context('./modules/factory-company/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  // initialAdministrator: require.context('./modules/initial-administrator/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  user: require.context('./modules/user/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  userRole: require.context('./modules/user-role/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  alarmConfiguration: require.context('./modules/alarm-configuration/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  dataAnalysis: require.context('./modules/data-analysis/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  operationLog: require.context('./modules/operation-log/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  loginLog: require.context('./modules/login-log/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  systemSetting: require.context('./modules/system-setting/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  menuManagement: require.context('./modules/menu-management/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  parameterSetting: require.context('./modules/parameter-setting/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  dictManagement: require.context('./modules/dict-management/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  roleManagement: require.context('./modules/role-management/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  onlineUser: require.context('./modules/online-user/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  algorithmConstruction: require.context('./modules/algorithm-construction/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  statePrediction: require.context('./modules/state-prediction/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  dashboardSetting: require.context('./modules/dashboard-setting/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  productManagement: require.context('./modules/product-management/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  transportManagement: require.context('./modules/transport-management/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  workshopManagement: require.context('./modules/workshop-management/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  processManagement: require.context('./modules/process-management/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  machineType: require.context('./modules/machine-type/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  machineAttribute: require.context('./modules/machine-attribute/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  machineList: require.context('./modules/machine-list/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  maintenancePlan: require.context('./modules/maintenance-plan/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  errorRepair: require.context('./modules/error-repair/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  machineTransfer: require.context('./modules/machine-transfer/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  recipeParameter: require.context('./modules/recipe-parameter/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  recipeManagement: require.context('./modules/recipe-management/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  roadmapManagement: require.context('./modules/roadmap-management/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  processParameter: require.context('./modules/process-parameter/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  productTransfer: require.context('./modules/product-transfer/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  transportTask: require.context('./modules/transport-task/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  spotCheckPlan: require.context('./modules/spot-check-plan/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  spotCheckResult: require.context('./modules/spot-check-result/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  alarmRecords: require.context('./modules/alarm-records/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  interfaceLog: require.context('./modules/interface-log/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  eaLog: require.context('./modules/ea-log/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  recipeLog: require.context('./modules/recipe-log/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  progressDetail: require.context('./modules/progress-detail/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  productLaunch: require.context('./modules/product-launch/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  connectionConfiguration: require.context('./modules/connection-configuration/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  machineBom: require.context('./modules/machine-bom/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  partManagement: require.context('./modules/part-management/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  dataSource: require.context('./modules/data-source/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  documentManagement: require.context('./modules/document-management/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  alarmCode: require.context('./modules/alarm-code/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  reportsManagement: require.context('./modules/reports-management/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  alarmMonitor: require.context('./modules/alarm-monitor/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  maintenance: require.context('./modules/maintenance/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  maintenanceTask: require.context('./modules/maintenance-task/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  expertKnowledge: require.context('./modules/expert-knowledge/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  monitorRecord: require.context('./modules/monitor-record/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  eventLog: require.context('./modules/event-log/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
  communicateLog: require.context('./modules/communicate-log/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
};

export const routerModules = {
  'hello-world': require.context('./modules/hello-world', true, /\broutes\b\.js$/),
  departmentManagement: require.context('./modules/department-management', true, /\broutes\b\.js$/),
  positionManagement: require.context('./modules/position-management', true, /\broutes\b\.js$/),
  userManagement: require.context('./modules/user-management', true, /\broutes\b\.js$/),
  // factoryCompany: require.context('./modules/factory-company', true, /\broutes\b\.js$/),
  // initialAdministrator: require.context('./modules/initial-administrator', true, /\broutes\b\.js$/),
  user: require.context('./modules/user', true, /\broutes\b\.js$/),
  userRole: require.context('./modules/user-role', true, /\broutes\b\.js$/),
  alarmConfiguration: require.context('./modules/alarm-configuration', true, /\broutes\b\.js$/),
  dataAnalysis: require.context('./modules/data-analysis', true, /\broutes\b\.js$/),
  operationLog: require.context('./modules/operation-log', true, /\broutes\b\.js$/),
  loginLog: require.context('./modules/login-log', true, /\broutes\b\.js$/),
  systemSetting: require.context('./modules/system-setting', true, /\broutes\b\.js$/),
  menuManagement: require.context('./modules/menu-management', true, /\broutes\b\.js$/),
  parameterSetting: require.context('./modules/parameter-setting', true, /\broutes\b\.js$/),
  dictManagement: require.context('./modules/dict-management', true, /\broutes\b\.js$/),
  roleManagement: require.context('./modules/role-management', true, /\broutes\b\.js$/),
  onlineUser: require.context('./modules/online-user', true, /\broutes\b\.js$/),
  algorithmConstruction: require.context('./modules/algorithm-construction', true, /\broutes\b\.js$/),
  statePrediction: require.context('./modules/state-prediction', true, /\broutes\b\.js$/),
  dashboardSetting: require.context('./modules/dashboard-setting', true, /\broutes\b\.js$/),
  productManagement: require.context('./modules/product-management', true, /\broutes\b\.js$/),
  transportManagement: require.context('./modules/transport-management', true, /\broutes\b\.js$/),
  workshopManagement: require.context('./modules/workshop-management', true, /\broutes\b\.js$/),
  processManagement: require.context('./modules/process-management', true, /\broutes\b\.js$/),
  machineType: require.context('./modules/machine-type', true, /\broutes\b\.js$/),
  machineAttribute: require.context('./modules/machine-attribute', true, /\broutes\b\.js$/),
  machineList: require.context('./modules/machine-list', true, /\broutes\b\.js$/),
  maintenancePlan: require.context('./modules/maintenance-plan', true, /\broutes\b\.js$/),
  errorRepair: require.context('./modules/error-repair', true, /\broutes\b\.js$/),
  machineTransfer: require.context('./modules/machine-transfer', true, /\broutes\b\.js$/),
  recipeParameter: require.context('./modules/recipe-parameter', true, /\broutes\b\.js$/),
  recipeManagement: require.context('./modules/recipe-management', true, /\broutes\b\.js$/),
  roadmapManagement: require.context('./modules/roadmap-management', true, /\broutes\b\.js$/),
  processParameter: require.context('./modules/process-parameter', true, /\broutes\b\.js$/),
  productTransfer: require.context('./modules/product-transfer', true, /\broutes\b\.js$/),
  transportTask: require.context('./modules/transport-task', true, /\broutes\b\.js$/),
  spotCheckPlan: require.context('./modules/spot-check-plan', true, /\broutes\b\.js$/),
  spotCheckResult: require.context('./modules/spot-check-result', true, /\broutes\b\.js$/),
  alarmRecords: require.context('./modules/alarm-records', true, /\broutes\b\.js$/),
  interfaceLog: require.context('./modules/interface-log', true, /\broutes\b\.js$/),
  eaLog: require.context('./modules/ea-log', true, /\broutes\b\.js$/),
  recipeLog: require.context('./modules/recipe-log', true, /\broutes\b\.js$/),
  progressDetail: require.context('./modules/progress-detail', true, /\broutes\b\.js$/),
  productLaunch: require.context('./modules/product-launch', true, /\broutes\b\.js$/),
  connectionConfiguration: require.context('./modules/connection-configuration', true, /\broutes\b\.js$/),
  machineBom: require.context('./modules/machine-bom', true, /\broutes\b\.js$/),
  partManagement: require.context('./modules/part-management', true, /\broutes\b\.js$/),
  dataSource: require.context('./modules/data-source', true, /\broutes\b\.js$/),
  documentManagement: require.context('./modules/document-management', true, /\broutes\b\.js$/),
  alarmCode: require.context('./modules/alarm-code', true, /\broutes\b\.js$/),
  reportsManagement: require.context('./modules/reports-management', true, /\broutes\b\.js$/),
  maintenance: require.context('./modules/maintenance', true, /\broutes\b\.js$/),
  alarmMonitor: require.context('./modules/alarm-monitor', true, /\broutes\b\.js$/),
  maintenanceTask: require.context('./modules/maintenance-task', true, /\broutes\b\.js$/),
  expertKnowledge: require.context('./modules/expert-knowledge', true, /\broutes\b\.js$/),
  monitorRecord: require.context('./modules/monitor-record', true, /\broutes\b\.js$/),
  eventLog: require.context('./modules/event-log', true, /\broutes\b\.js$/),
  communicateLog: require.context('./modules/communicate-log', true, /\broutes\b\.js$/),
};

export const storeModules = {
  store: require.context('./store/modules', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  'hello-world': require.context('./modules/hello-world/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  departmentManagement: require.context('./modules/department-management/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  positionManagement: require.context('./modules/position-management/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  userManagement: require.context('./modules/user-management/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  // factoryCompany: require.context('./modules/factory-company/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  // initialAdministrator: require.context('./modules/initial-administrator/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  userRole: require.context('./modules/user-role/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  alarmConfiguration: require.context('./modules/alarm-configuration/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  dataAnalysis: require.context('./modules/data-analysis/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  operationLog: require.context('./modules/operation-log/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  loginLog: require.context('./modules/login-log/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  systemSetting: require.context('./modules/system-setting/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  menuManagement: require.context('./modules/menu-management/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  parameterSetting: require.context('./modules/parameter-setting/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  dictManagement: require.context('./modules/dict-management/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  roleManagement: require.context('./modules/role-management/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  onlineUser: require.context('./modules/online-user/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  algorithmConstruction: require.context('./modules/algorithm-construction/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  statePrediction: require.context('./modules/state-prediction/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  dashboardSetting: require.context('./modules/dashboard-setting/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  productManagement: require.context('./modules/product-management/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  transportManagement: require.context('./modules/transport-management/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  workshopManagement: require.context('./modules/workshop-management/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  processManagement: require.context('./modules/process-management/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  machineType: require.context('./modules/machine-type/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  machineAttribute: require.context('./modules/machine-attribute/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  machineList: require.context('./modules/machine-list/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  maintenancePlan: require.context('./modules/maintenance-plan/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  errorRepair: require.context('./modules/error-repair/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  machineTransfer: require.context('./modules/machine-transfer/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  recipeParameter: require.context('./modules/recipe-parameter/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  recipeManagement: require.context('./modules/recipe-management/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  roadmapManagement: require.context('./modules/roadmap-management/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  processParameter: require.context('./modules/process-parameter/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  productTransfer: require.context('./modules/product-transfer/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  transportTask: require.context('./modules/transport-task/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  spotCheckPlan: require.context('./modules/spot-check-plan/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  spotCheckResult: require.context('./modules/spot-check-result/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  alarmRecords: require.context('./modules/alarm-records/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  interfaceLog: require.context('./modules/interface-log/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  eaLog: require.context('./modules/ea-log/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  recipeLog: require.context('./modules/recipe-log/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  progressDetail: require.context('./modules/progress-detail/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  productLaunch: require.context('./modules/product-launch/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  connectionConfiguration: require.context('./modules/connection-configuration/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  machineBom: require.context('./modules/machine-bom/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  partManagement: require.context('./modules/part-management/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  dataSource: require.context('./modules/data-source/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  documentManagement: require.context('./modules/document-management/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  alarmCode: require.context('./modules/alarm-code/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  reportsManagement: require.context('./modules/reports-management/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  maintenance: require.context('./modules/maintenance/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  alarmMonitor: require.context('./modules/alarm-monitor/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  maintenanceTask: require.context('./modules/maintenance-task/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  expertKnowledge: require.context('./modules/expert-knowledge/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  monitorRecord: require.context('./modules/monitor-record/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  eventLog: require.context('./modules/event-log/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
  communicateLog: require.context('./modules/communicate-log/store', true, /[A-Za-z0-9-_,\s]+\.js$/i),
};
