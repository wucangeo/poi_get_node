"use strict";

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get("/", controller.home.index);
  router.get("/dianping", controller.home.dianping);
  router.get("/dianping_page", controller.home.dianpingByPage);
  router.get("/baidu_page", controller.home.baiduByPage);
};
