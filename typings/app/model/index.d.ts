// This file is created by egg-ts-helper@1.25.7
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportModules = require('../../../app/model/modules');
import ExportModulesMenus = require('../../../app/model/modules_menus');
import ExportStores = require('../../../app/model/stores');
import ExportStoresModules = require('../../../app/model/stores_modules');
import ExportUsers = require('../../../app/model/users');
import ExportUsersPermissions = require('../../../app/model/users_permissions');
import ExportUsersStores = require('../../../app/model/users_stores');
import ExportUsersToken = require('../../../app/model/users_token');

declare module 'egg' {
  interface IModel {
    Modules: ReturnType<typeof ExportModules>;
    ModulesMenus: ReturnType<typeof ExportModulesMenus>;
    Stores: ReturnType<typeof ExportStores>;
    StoresModules: ReturnType<typeof ExportStoresModules>;
    Users: ReturnType<typeof ExportUsers>;
    UsersPermissions: ReturnType<typeof ExportUsersPermissions>;
    UsersStores: ReturnType<typeof ExportUsersStores>;
    UsersToken: ReturnType<typeof ExportUsersToken>;
  }
}
