/*
 Navicat Premium Data Transfer

 Source Server         : PG-localhost
 Source Server Type    : PostgreSQL
 Source Server Version : 100007
 Source Host           : localhost:5432
 Source Catalog        : poi_get
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 100007
 File Encoding         : 65001

 Date: 19/03/2019 23:41:37
*/


-- ----------------------------
-- Table structure for baidu
-- ----------------------------
DROP TABLE IF EXISTS "public"."baidu";
CREATE TABLE "public"."baidu" (
  "data_id" serial not null,
  "name" varchar(255) COLLATE "pg_catalog"."default",
  "lat" float8,
  "lng" float8,
  "address" varchar(255) COLLATE "pg_catalog"."default",
  "province" varchar(255) COLLATE "pg_catalog"."default",
  "city" varchar(255) COLLATE "pg_catalog"."default",
  "area" varchar(255) COLLATE "pg_catalog"."default",
  "street_id" varchar(255) COLLATE "pg_catalog"."default",
  "telephone" varchar(100) COLLATE "pg_catalog"."default",
  "detail" varchar(255) COLLATE "pg_catalog"."default",
  "uid" varchar(255) COLLATE "pg_catalog"."default",
  "query" varchar(255) COLLATE "pg_catalog"."default",
  "page" int2,
  "page_count" int2,
  "sheng_code" varchar(255) COLLATE "pg_catalog"."default",
  "shi_code" varchar(255) COLLATE "pg_catalog"."default",
  "xian_code" varchar(255) COLLATE "pg_catalog"."default",
  "created_at" timestamp(6) DEFAULT now(),
  "lat_84" float8,
  "lng_84" float8,
  "geom" "public"."geometry"
)
;
ALTER TABLE "public"."baidu" OWNER TO "postgres";

-- ----------------------------
-- Primary Key structure for table baidu
-- ----------------------------
ALTER TABLE "public"."baidu" ADD CONSTRAINT "baidu_pkey" PRIMARY KEY ("data_id");
