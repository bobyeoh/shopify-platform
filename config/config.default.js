/* eslint valid-jsdoc: "off" */


/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  config.shopify_api = '2020-04';
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1585906551001_681';
  // add your middleware config here
  config.middleware = [];
  config.sequelize = {
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    database: 'rb-platform',
  };
  config.security = {
    csrf: {
      enable: false,
    },
  };
  config.cors = {
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    credentials: true,
    origin: ctx => ctx.get('origin'),
  };
  // config.cluster = {
  //   listen: {
  //     port: 443
  //   },
  //   https: {
  //     key: '/etc/letsencrypt/live/001.gs/privkey.pem',
  //     cert: '/etc/letsencrypt/live/001.gs/fullchain.pem',
  //     port: 443
  //   }
  // };
  // add your user config here
  const userConfig = {
    myAppName: 'rb-platform',
  };

  return {
    ...config,
    ...userConfig,
  };
};
