/* eslint valid-jsdoc: "off" */

"use strict";

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_1550988408438_3323";

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    myAppName: "poi_get_node",
    security: {
      domainWhiteList: ["http://localhost:7001"],
      csrf: {
        enable: false
      }
    },
    sequelize: {
      dialect: "postgres",
      delegate: "model",
      baseDir: "model",
      logging(...args) {},
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "postgres",
      database: "poi_get",
      benchmark: true,
      define: {
        freezeTableName: false,
        underscored: true
      }
    }
  };

  return {
    ...config,
    ...userConfig
  };
};
