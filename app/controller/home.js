"use strict";
const types = require("../utils/types");
const bd_wds = require("../utils/baidu_querys")

const Controller = require("egg").Controller;

class HomeController extends Controller {
  async index() {
    const {
      ctx
    } = this;
    ctx.body = "hi, egg";
  }
  async dianping() {
    const {
      ctx,
      service
    } = this;
    let area_code = ctx.query.area_code; //区划代码
    let categoryId = ctx.query.categoryId; //体育类型编号
    let cityList = await service.dianping.getCityListByAreaCode(area_code);
    if (cityList.code != 200) {
      ctx.body = cityList;
      return;
    }
    setTimeout(async function () {
      for (let city of cityList.data) {
        let cityEnName = city.city_en_name,
          cityId = city.city_id,
          sheng_code = city.sheng_code,
          shi_code = city.shi_code,
          xian_code = city.xian_code,
          regionId = city.regionId;
        let categoryIds = types.all;
        if (categoryId && parseInt(categoryId)) {
          categoryIds = [parseInt(categoryId)];
        }
        let is_next_succ = true;
        console.log(
          "开始新城市==================================================",
          cityId,
          cityEnName,
          shi_code
        );
        for (let categoryId of categoryIds) {
          let res_allPage = await service.dianping.getALLPage({
            cityId,
            cityEnName,
            categoryId,
            sheng_code,
            shi_code,
            xian_code,
            regionId
          });
          if (res_allPage.code != 200) {
            is_next_succ = false;
            console.log("错误原因：", res_allPage.msg);
            break;
          }
        }
        if (!is_next_succ) {
          break;
        }
      }
      console.log("已经全部抓取完成！！！！！！！！！！！！！！！");
    }, 100);

    ctx.body = {
      code: 200,
      msg: "执行成功！",
      data: cityList.data
    };
  }
  async dianpingByPage() {
    const {
      ctx,
      service
    } = this;
    let cityEnName = ctx.query.cityEnName,
      cityId = ctx.query.cityId,
      categoryId = ctx.query.categoryId,
      page = ctx.query.page,
      pageMax = ctx.query.pageMax,
      regionId = ctx.query.regionId;
    if (!cityEnName || !cityId || !categoryId) {
      ctx.body = {
        code: 500,
        msg: "缺少必要参数"
      };
      return;
    }
    if (
      !parseInt(cityId) ||
      !parseInt(categoryId) ||
      !parseInt(page) ||
      !parseInt(pageMax)
    ) {
      ctx.body = {
        code: 500,
        msg: "参数错误"
      };
      return;
    }
    cityId = parseInt(cityId);
    categoryId = parseInt(categoryId);
    page = parseInt(page);
    pageMax = parseInt(pageMax);
    regionId = regionId ? parseInt(regionId) : regionId;
    //获取城市信息
    let res_cityInfo = await service.dianping.getCityInfoByCityId(cityId);
    if (res_cityInfo.code != 200) {
      ctx.body = res_cityInfo;
      return;
    }
    //开始获取数据
    setTimeout(async function () {
      let cityInfo = res_cityInfo.data;
      let sheng_code = cityInfo.sheng_code,
        shi_code = cityInfo.shi_code,
        xian_code = cityInfo.xian_code;
      regionId = regionId ? regionId : cityInfo.regionId;
      let res_allPage = await service.dianping.getALLPage({
        cityId,
        cityEnName,
        categoryId,
        page,
        pageMax,
        sheng_code,
        shi_code,
        xian_code,
        regionId
      });
    }, 100);
    ctx.body = {
      code: 200,
      msg: "执行成功！",
      data: {
        cityId,
        cityEnName,
        categoryId,
        page,
        pageMax
      }
    };
  }
  async baidu() {
    const {
      ctx,
      service
    } = this;
    let query = ctx.query.query;
    //获取边框
    let bounds_All = await service.baidu.getAllBounds();
    if (bounds_All.length === 0) {
      console.log("获取bounds_All失败!")
      ctx.body = "请求失败！"
      return;
    }
    setTimeout(async function () {
      for (let wd of bd_wds) {
        for (let bounds of bounds_All) {
          //开始获取数据
          let res_allPage = await service.baidu.getAllPage({
            bounds,
            query: wd
          });
        }
      }
    }, 100);
    ctx.body = {
      code: 200,
      msg: "执行成功！",
      data: {
        bounds,
        page_num,
        query
      }
    };
  }
  async baiduByPage() {
    const {
      ctx,
      service
    } = this;
    let bounds = ctx.query.bounds,
      page_num = ctx.query.page_num,
      query = ctx.query.query;
    if (!bounds || page_num === null || !query) {
      ctx.body = {
        code: 500,
        msg: "缺少必要参数"
      };
      return;
    }
    if (bounds.split(",").length != 4 || isNaN(page_num)) {
      ctx.body = {
        code: 500,
        msg: "参数错误"
      };
      return;
    }
    page_num = parseInt(page_num);
    //开始获取数据
    setTimeout(async function () {
      let res_allPage = await service.baidu.get1Page({
        bounds,
        page: page_num,
        query
      });
    }, 100);
    ctx.body = {
      code: 200,
      msg: "执行成功！",
      data: {
        bounds,
        page_num,
        query
      }
    };
  }
}

module.exports = HomeController;