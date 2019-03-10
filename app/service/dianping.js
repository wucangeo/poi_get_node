const HEADERS_LIST = require("../utils/headers");
const ping = require("ping");
const Service = require("egg").Service;

class DianpingService extends Service {
  //根据areacode获取其下areacodes及拼音名称
  async getCityListByAreaCode(area_code = "") {
    const { ctx, app } = this;
    let result = {
      code: 500,
      msg: "请求错误",
      data: null
    };
    if (!area_code) {
      result.msg = "area_code为空";
      return result;
    }
    if (!parseInt(area_code)) {
      result.msg = "area_code参数有误！";
      return result;
    }
    let sql = "";
    if (area_code.length === 2) {
      sql = `SELECT city_id,city_en_name,sheng_code,shi_code,xian_code,"regionId"  FROM dianping_city_list WHERE sheng_code = '${area_code}' ORDER BY shi_code,city_id,"regionId";`;
    } else if (area_code.length === 4) {
      sql = `SELECT city_id,city_en_name,sheng_code,shi_code,xian_code,"regionId"  FROM dianping_city_list WHERE shi_code = '${area_code}' ORDER BY shi_code,city_id,"regionId";`;
    } else if (area_code.length === 6) {
      sql = `SELECT city_id,city_en_name,sheng_code,shi_code,xian_code,"regionId"  FROM dianping_city_list WHERE xian_code = '${area_code}' ORDER BY shi_code,city_id,"regionId";`;
    } else {
      result.msg = "area_code参数有误";
      return result;
    }
    let queryData = await app.model.query(sql).catch(err => {
      result.code = 0;
      result.msg = "数据库查询错误。";
      result.data = err;
    });
    if (!queryData) {
      return result;
    }

    result.data = queryData[0];
    result.code = 200;
    result.msg = "查询成果！";
    return result;
  }
  async getCityInfoByCityId(city_id) {
    const { ctx, app } = this;
    let result = {
      code: 500,
      msg: "请求错误",
      data: null
    };
    if (!city_id) {
      result.msg = "area_code为空";
      return result;
    }
    if (!parseInt(city_id)) {
      result.msg = "area_code参数有误！";
      return result;
    }
    let sql = `SELECT city_id,city_en_name,sheng_code,shi_code,xian_code,"regionId" FROM dianping_city_list WHERE city_id = '${city_id}';`;
    let queryData = await app.model.query(sql).catch(err => {
      result.code = 0;
      result.msg = "数据库查询错误。";
      result.data = err;
    });
    if (!queryData || !queryData[0] || queryData[0][0].length === 0) {
      return result;
    }

    result.data = queryData[0][0];
    result.code = 200;
    result.msg = "查询成果！";
    return result;
  }
  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async getALLPage({
    cityId,
    cityEnName,
    categoryId,
    page = 1,
    pageMax = 50,
    sheng_code,
    shi_code,
    xian_code,
    regionId = 0
  }) {
    const { ctx } = this;
    console.log(
      "开始新类目抓取--------------------------------：",
      cityId,
      cityEnName,
      categoryId
    );
    let current = { page, pageMax };
    let prePage = page;
    cityId = parseInt(cityId);

    let result = {
      code: 200,
      msg: "请求成功！"
    };
    if (!current.page || !current.pageMax) {
      result.code = 500;
      result.msg = "页码出现问题！";
      return result;
    }
    let pingHOST = "www.baidu.com";
    let tryCount = 0;
    let pingAlive = true;
    while (true) {
      await ping.promise
        .probe(pingHOST)
        .then(async res => {
          if (res.alive) {
            pingAlive = true;
            await this.sleep(5000);
          } else {
            pingAlive = false;
          }
        })
        .catch(async err => {
          pingAlive = false;
        });
      if (!pingAlive) {
        if (tryCount <= 100000) {
          console.log(
            "无法ping通，正在尝试第：",
            tryCount,
            "次！共尝试100000次。"
          );
          await this.sleep(11000);
          tryCount++;
          continue;
        } else {
          console.log(
            "遇到了错误，已停止抓取！!!!!!!!!!!!!!!!!!!!!!!!!!",
            cityId,
            cityEnName,
            categoryId,
            prePage,
            new Date()
          );
          result.code = 500;
          result.msg = "遇到了错误，已停止抓取！!!!!!!!!!!!!!!!!!!!!!!!!!";
          break;
        }
      }

      console.log(
        "正在进行页面抓取：",
        cityId,
        cityEnName,
        regionId,
        categoryId,
        current.page,
        new Date()
      );
      prePage = current.page;
      current = await this.get1Page({
        cityId,
        cityEnName,
        categoryId,
        page: current.page,
        sheng_code,
        shi_code,
        xian_code,
        regionId
      });
      if (current.pageMax === -1 && current.page === -1) {
        current.page = prePage;
        console.log("遇到了错误，正在尝试重试！！！", new Date());
        if (tryCount <= 100000) {
          console.log("正在尝试第：", tryCount, "次！共尝试100000次。");
          await this.sleep(11000);
          tryCount++;
          continue;
        } else {
          console.log(
            "遇到了错误，已停止抓取！!!!!!!!!!!!!!!!!!!!!!!!!!",
            cityId,
            cityEnName,
            categoryId,
            prePage
          );
          result.code = 500;
          result.msg = "遇到了错误，已停止抓取！!!!!!!!!!!!!!!!!!!!!!!!!!";
          break;
        }
      }
      current.page++;
      if (current.page > current.pageMax || current.page > pageMax) {
        console.log(
          "该类目已结束抓取！",
          cityId,
          cityEnName,
          categoryId,
          new Date()
        );
        break;
      }
    }
    return result;
  }
  //请求并获取web网站的内容
  async get1Page({
    cityId = 1,
    cityEnName = "shanghai",
    promoId = 0,
    shopType = 45,
    categoryId = 156,
    regionId = 0,
    sortMode = 2,
    shopSortItem = 0,
    keyword = null,
    searchType = 1,
    branchGroupId = 0,
    aroundShopId = 0,
    shippingTypeFilterValue = 0,
    page = 1,
    sheng_code,
    shi_code,
    xian_code
  }) {
    const { ctx, logger } = this;
    let headers = HEADERS_LIST[Math.floor(HEADERS_LIST.length * Math.random())];
    headers["Accept"] = "application/json, text/javascript";
    headers["Accept-Encoding"] = "gzip, deflate";
    headers["Accept-Language"] = "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7,nb;q=0.6";
    headers["Cache-Control"] = "no-cache";
    headers["Connection"] = "keep-alive";
    headers["Content-Length"] = "187";
    headers["DNT"] = "1";
    headers["Pragma"] = "no-cache";
    headers["X-Request"] = "JSON";
    headers["X-Requested-With"] = "XMLHttpRequest";
    headers["Host"] = "www.dianping.com";
    headers["Origin"] = "http://www.dianping.com";
    headers["Content-Type"] =
      "application/x-www-form-urlencoded;charset=UTF-8;";
    headers[
      "Referer"
    ] = `http://www.dianping.com/search/map/category/${cityId}/45/g${categoryId}`;

    let url = "http://www.dianping.com/search/map/ajax/json";
    cityId = parseInt(cityId);
    categoryId = parseInt(categoryId);
    page = parseInt(page);
    let options = {
      method: "POST",
      timeout: 30000,
      headers,
      data: {
        cityId,
        cityEnName,
        promoId,
        shopType,
        categoryId,
        regionId,
        sortMode,
        shopSortItem,
        keyword,
        searchType,
        branchGroupId,
        aroundShopId,
        shippingTypeFilterValue,
        page
      }
    };
    let result = {
      page: -1,
      pageMax: -1
    };
    let pageData = [];
    await ctx
      .curl(url, options)
      .then(res => {
        if (res.status === 200) {
          let data = JSON.parse(res.data.toString());
          if (data.code === 200) {
            result.page = data.page;
            result.pageMax = data.pageCount > 50 ? 50 : data.pageCount;
            pageData = data.shopRecordBeanList;
          } else {
            console.log("请求失败！", res, data);
            logger.error(
              `请求失败！cityID: ${cityId}, CityName: ${cityEnName}, categoryId: ${categoryId}, page: ${page}`
            );
          }
        } else {
          console.log("请求失败！", res);
          logger.error(
            `请求失败！cityID: ${cityId}, CityName: ${cityEnName}, categoryId: ${categoryId}, page: ${page}`
          );
        }
      })
      .catch(err => {
        console.log("请求失败！", err);
        logger.error(
          `请求失败！cityID: ${cityId}, CityName: ${cityEnName}, categoryId: ${categoryId}, page: ${page}`
        );
      });
    if (pageData.length > 0) {
      for (let item of pageData) {
        item["city_id"] = cityId;
        item["city_en_name"] = cityEnName;
        item["categoryId"] = categoryId;
        item["page"] = result.page;
        item["page_count"] = result.pageMax;
        item["sheng_code"] = sheng_code;
        item["shi_code"] = shi_code;
        item["xian_code"] = xian_code;
      }
      await ctx.model.Dianping.bulkCreate(pageData).then(res => {
        console.log("成功插入一批数据!");
      });
    }
    return result;
  }
}

module.exports = DianpingService;
