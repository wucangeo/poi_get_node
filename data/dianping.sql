/*
 Navicat Premium Data Transfer

 Source Server         : PG-localhost
 Source Server Type    : PostgreSQL
 Source Server Version : 100007
 Source Host           : localhost:5432
 Source Catalog        : tycd_add
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 100007
 File Encoding         : 65001

 Date: 03/03/2019 22:35:43
*/


-- ----------------------------
-- Table structure for dianping
-- ----------------------------
DROP TABLE IF EXISTS "public"."dianping";
CREATE TABLE "public"."dianping" (
  "data_id" serial not null,
  "address" varchar(255) COLLATE "pg_catalog"."default",
  "avgPrice" int4,
  "bookingSetting" bool,
  "branchUrl" varchar(255) COLLATE "pg_catalog"."default",
  "defaultPic" varchar(255) COLLATE "pg_catalog"."default",
  "dishTag" varchar(50) COLLATE "pg_catalog"."default",
  "expand" int4,
  "geoLat" float4,
  "geoLng" float4,
  "hasSceneryOrder" bool,
  "memberCardId" int2,
  "phoneNo" varchar(50) COLLATE "pg_catalog"."default",
  "poi" varchar(50) COLLATE "pg_catalog"."default",
  "promoId" int4,
  "regionList" json,
  "shopDealId" int8,
  "shopId" int8,
  "shopName" varchar(255) COLLATE "pg_catalog"."default",
  "shopPower" varchar(255) COLLATE "pg_catalog"."default",
  "shopPowerTitle" varchar(255) COLLATE "pg_catalog"."default",
  "enable" bool,
  "created_at" timestamp(6) DEFAULT now(),
  "city_id" int4,
  "city_en_name" varchar(255) COLLATE "pg_catalog"."default",
  "categoryId" int4,
  "page" int2,
  "page_count" int2,
  "sheng_code" varchar(255) COLLATE "pg_catalog"."default",
  "shi_code" varchar(255) COLLATE "pg_catalog"."default",
  "xian_code" varchar(255) COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Primary Key structure for table dianping
-- ----------------------------
ALTER TABLE "public"."dianping" ADD CONSTRAINT "dianping_pkey" PRIMARY KEY ("data_id");
