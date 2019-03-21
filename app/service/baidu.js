const HEADERS_LIST = require("../utils/headers");
const AKS = require("../utils/baidu_aks");
const ping = require("ping");
const Service = require("egg").Service;

class BaiduService extends Service {

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async getAllPage({
    query,
    bounds,
    page = 0
  }) {
    const {
      ctx
    } = this;
    console.log(
      "开始新类目抓取--------------------------------：",
      query,
      bounds
    );
    let current = {
      page: 0,
      pageMax: -1
    };
    let prePage = page;

    let result = {
      code: 200,
      msg: "请求成功！"
    };
    let pingHOST = "www.baidu.com";
    let tryCount = 0;
    let pingAlive = true;
    let trySleep = 1000;
    while (true) {
      await ping.promise
        .probe(pingHOST)
        .then(async res => {
          if (res.alive) {
            pingAlive = true;
            // await this.sleep(1000);
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

          await this.sleep(trySleep);
          trySleep = trySleep + tryCount * tryCount * 1000;
          tryCount++;
          continue;
        } else {
          console.log(
            "遇到了错误，已停止抓取!!!!!!!!!!!!!!!!!!!!!!!!!",
            query,
            current.page,
            bounds,
            new Date()
          );
          result.code = 500;
          result.msg = "遇到了错误，已停止抓取!!!!!!!!!!!!!!!!!!!!!!!!!";
          break;
        }
      }

      console.log(
        "正在进行页面抓取：",
        query,
        current.page,
        current.pageMax,
        bounds,
        new Date()
      );
      prePage = current.page;
      current = await this.get1Page({
        query,
        page: current.page,
        bounds
      });
      if (current.pageMax === -1) {
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
            query,
            current.page,
            bounds
          );
          result.code = 500;
          result.msg = "遇到了错误，已停止抓取！!!!!!!!!!!!!!!!!!!!!!!!!!";
          break;
        }
      }
      current.page++;
      if (current.page >= current.pageMax) {
        console.log(
          "该类目已结束抓取！",
          query,
          current.page,
          current.pageMax,
          bounds,
          new Date()
        );
        break;
      }
    }
    return result;
  }
  //请求并获取web网站的内容
  async get1Page({
    bounds,
    page,
    query
  }) {
    const {
      ctx,
      logger
    } = this;
    let ak = AKS.get1AK();
    page = parseInt(page);

    let url = "http://api.map.baidu.com/place/v2/search";
    let params = {
      ak,
      bounds,
      page,
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
      page: page,
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
              `请求失败！query:${query},page:${page},bounds:${bounds},${new Date()}`,
              data
            );
            logger.error(
              `请求失败！query:${query},page:${page},bounds:${bounds},${new Date()}`
            );
          }
        } else {
          console.log(
            `请求失败！query:${query},page:${page},bounds:${bounds},${new Date()}`,
            res
          );
          logger.error(
            `请求失败！query:${query},page:${page},bounds:${bounds},${new Date()}`
          );
        }
      })
      .catch(err => {
        console.log("请求失败！", err);
        logger.error(
          `请求失败！query:${query},page:${page},bounds:${bounds},${new Date()}`
        );
      });
    if (pageData.length > 0) {
      for (let item of pageData) {
        if (!item.location.lat || !item.location.lng) {
          continue;
        }
        item["lat"] = item.location.lat;
        item["lng"] = item.location.lng;
        item["query"] = query;
        item["page"] = result.page;
        item["page_count"] = result.pageMax;
        await ctx.model.Baidu.create(item).then(res => {
          console.log("成功插入一批数据!");
        }).catch(err => {
          console.log("插入失败!")
        });
      }
    }
    return result;
  }
  //根据areacode获取其下areacodes及拼音名称
  async getAllBounds(type = 25) {
    const {
      ctx,
      app
    } = this;
    let result = [];
    let sql = `select st_asgeojson(geom) as geojson from "w25" ORDER BY gid`;
    if (type === 5) {
      sql = `select st_asgeojson(geom) as geojson from "w5" ORDER BY gid`;
    }
    let queryData = await app.model.query(sql).catch(err => {
      console.log("数据库查询错误。");
    });
    if (!queryData) {
      return result;
    }
    let datas = queryData[0];
    let coordObj = null;
    for (let item of datas) {
      coordObj = JSON.parse(item.geojson);
      let lower = coordObj.coordinates[0][3],
        upper = coordObj.coordinates[0][1];
      let boundsArr11 = [lower[1], lower[0], lower[1] + 0.5, lower[0] + 0.5];
      let boundsArr12 = [lower[1], lower[0] + 0.5, lower[1] + 0.5, lower[0] + 1];
      let boundsArr13 = [lower[1], lower[0] + 1, lower[1] + 0.5, upper[0]];
      let boundsArr21 = [lower[1] + 0.5, lower[0], upper[1], lower[0] + 0.5];
      let boundsArr22 = [lower[1] + 0.5, lower[0] + 0.5, upper[1], lower[0] + 1];
      let boundsArr23 = [lower[1] + 0.5, lower[0] + 1, upper[1], upper[0]];
      result.push(boundsArr11.join(","));
      result.push(boundsArr12.join(","));
      result.push(boundsArr13.join(","));
      result.push(boundsArr21.join(","));
      result.push(boundsArr22.join(","));
      result.push(boundsArr23.join(","));
    }
    return result;
  }
}

module.exports = BaiduService;