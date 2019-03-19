const HEADERS_LIST = require("../utils/headers");
const AKS = require("../utils/baidu_aks");
const ping = require("ping");
const Service = require("egg").Service;

class BaiduService extends Service {
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
  async get1Page({ bounds, page_num, query }) {
    const { ctx, logger } = this;
    let ak = AKS.get1AK();
    page_num = parseInt(page_num);

    let url = "http://api.map.baidu.com/place/v2/search";
    let params = {
      ak,
      bounds,
      page_num,
      page_size: 20,
      query,
      output: "json"
    };
    let options = {
      method: "GET",
      timeout: 30000,
      data: params
    };
    let result = {
      page: page_num,
      pageMax: -1
    };
    let pageData = [];
    await ctx
      .curl(url, options)
      .then(res => {
        if (res.status === 200) {
          let data = JSON.parse(res.data.toString());
          if (data.status === 0) {
            result.pageMax = Math.ceil(data.total / 20);
            pageData = data.results;
          } else {
            console.log(
              `请求失败！query:${query},page_num:${page_num},bounds:${bounds},${new Date()}`,
              data
            );
            logger.error(
              `请求失败！query:${query},page_num:${page_num},bounds:${bounds},${new Date()}`
            );
          }
        } else {
          console.log(
            `请求失败！query:${query},page_num:${page_num},bounds:${bounds},${new Date()}`,
            res
          );
          logger.error(
            `请求失败！query:${query},page_num:${page_num},bounds:${bounds},${new Date()}`
          );
        }
      })
      .catch(err => {
        console.log("请求失败！", err);
        logger.error(
          `请求失败！query:${query},page_num:${page_num},bounds:${bounds},${new Date()}`
        );
      });
    if (pageData.length > 0) {
      for (let item of pageData) {
        item["lat"] = item.location.lat;
        item["lng"] = item.location.lng;
        item["query"] = query;
        item["page"] = result.page;
        item["page_count"] = result.pageMax;
      }
      await ctx.model.Baidu.bulkCreate(pageData).then(res => {
        console.log("成功插入一批数据!");
      });
    }
    return result;
  }
}

module.exports = BaiduService;
