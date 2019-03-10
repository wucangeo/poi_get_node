# poi_get_node POI 数据抓取

## 简介

> 大众点评数据抓取
>
> - 支持按省份抓取
> - 支持按城市抓取
> - 支持按区县抓取（部分）
> - 支持[自定义抓取类型](https://github.com/wucangeo/poi_get_node/blob/master/app/utils/types.js)
> - 理论上，可抓取大众点评所有数据
> - 可[设置抓取频率](https://github.com/wucangeo/poi_get_node/blob/master/app/service/dianping.js#L77)
> - 仅抓取商铺的名称、地址、坐标信息，不抓取评价、团购等信息
>
> 支持功能
>
> - 支持[设置请求 headers](https://github.com/wucangeo/poi_get_node/blob/master/app/utils/headers.js)，包括 cookie、agent 等信息
> - 支持遇到错误后自动等待重试
> - 可配合[自动定时拨号工具](https://github.com/qiqi125/huanIP/releases)自动换 IP 抓取
> - 若没有宽带拨号环境，可在某宝购买服务器进行，关键词：[动态 IP 服务器](https://s.taobao.com/search?q=%E5%8A%A8%E6%80%81IP%E6%9C%8D%E5%8A%A1%E5%99%A8)

## 快速入门

<!-- add docs here for user -->

```bash
$ git clone https://github.com/wucangeo/poi_get_node.git
$ # 安装MySQL或 **PostgreSQL数据库** （建议），新建数据库poi_get，导入data目录中SQL文件创建表。
$ # 使用VSCode或命令行打开本工程
$ npm i
$ npm run dev
$ 浏览器打开 http://localhost:7001/
$ #按地区抓取大众点评POI
$ # @area_code：区域代码，必填，支持省编码2位，市编码4位，区县编码6位，可在数据库中查看
$ # @categoryId：[大众点评抓取类型ID](https://github.com/wucangeo/poi_get_node/blob/master/app/utils/types.js)，选填。
$ 浏览器打开 http://localhost:7001/dianping&area_code=11
```

### 部署

```bash
$ npm start
$ npm stop
```

[egg]: https://eggjs.org
