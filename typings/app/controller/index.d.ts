// This file is created by egg-ts-helper@1.25.7
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportModules = require('../../../app/controller/modules');
import ExportStores = require('../../../app/controller/stores');
import ExportUsers = require('../../../app/controller/users');
import ExportUsersPermissions = require('../../../app/controller/usersPermissions');
import ExportUsersStores = require('../../../app/controller/usersStores');
import ExportWebhooks = require('../../../app/controller/webhooks');

declare module 'egg' {
  interface IController {
    modules: ExportModules;
    stores: ExportStores;
    users: ExportUsers;
    usersPermissions: ExportUsersPermissions;
    usersStores: ExportUsersStores;
    webhooks: ExportWebhooks;
  }
}
