module.exports = app => {
  const { STRING, DATE, INTEGER, JSON, FLOAT, BOOLEAN } = app.Sequelize;
  const Baidu = app.model.define(
    "baidu",
    {
      data_id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: STRING(255),
      lat: FLOAT,
      lng: FLOAT,
      lat_84: FLOAT,
      lng_84: FLOAT,
      address: STRING(255),
      province: STRING(255),
      city: STRING(255),
      area: STRING(255),
      // street_id: STRING(255),
      telephone: STRING(255),
      detail: STRING(255),
      uid: STRING(255),
      query: STRING(255),
      page: STRING(255),
      sheng_code: STRING(255),
      shi_code: STRING(255),
      xian_code: STRING(255)
    },
    {
      timestamps: false,
      underscored: false,
      freezeTableName: true,
      tableName: "baidu"
    }
  );

  return Baidu;
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
