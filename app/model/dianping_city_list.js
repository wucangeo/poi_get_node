module.exports = app => {
  const { STRING, DATE, INTEGER, JSON, FLOAT, BOOLEAN } = app.Sequelize;
  const Dianping = app.model.define(
    "dianping_city_list",
    {
      city_id: {
        type: INTEGER,
        primaryKey: true
      },
      active_city: STRING(255),
      app_hot_level: STRING(255),
      city_abbr_code: STRING(255),
      city_area_code: STRING(255),
      city_en_name: STRING(255),
      city_level: STRING(255),
      city_name: STRING(255),
      city_order_id: STRING(255),
      city_py_name: STRING(255),
      direct_url: STRING(255),
      g_lat: STRING(255),
      g_lng: STRING(255),
      overseas_city: STRING(255),
      parent_city_id: STRING(255),
      province_id: STRING(255),
      scenery: STRING(255),
      tuan_gou_flag: STRING(255),
      sheng_code: STRING(255),
      shi_code: STRING(255),
      xian_code: STRING(255)
    },
    {
      timestamps: false,
      underscored: false,
      freezeTableName: true,
      tableName: "dianping_city_list"
    }
  );

  return Dianping;
};

// const Sequelize = require("sequelize");
// module.exports = app => {
//   const { ctx, config } = app;
//   const Config = config.sequelize;
//   let sequelize = new Sequelize(
//     Config.database,
//     Config.username,
//     Config.password,
//     {
//       host: Config.host,
//       port: Config.port,
//       dialect: Config.dialect,
//       pool: Config.pool,
//       define: Config.define,
//       logging: Config.logging
//     }
//   );

//   app["gcSequelize"] = sequelize;
// };
