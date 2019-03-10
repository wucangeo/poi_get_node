"use strict";

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  static: {
    enable: false
  },
  security: {
    xframe: {
      enable: false
    },
    csrf: {
      // 判断是否需要 ignore 的方法，请求上下文 context 作为第一个参数
      ignore: ctx => isInnerIp(ctx.ip)
    },
    enable: true
  },
  sequelize: {
    enable: true,
    package: "egg-sequelize"
  }
};
