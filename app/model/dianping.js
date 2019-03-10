module.exports = app => {
  const { STRING, DATE, INTEGER, JSON, FLOAT, BOOLEAN } = app.Sequelize;
  const Dianping = app.model.define(
    "dianping",
    {
      data_id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      address: STRING(255),
      avgPrice: INTEGER,
      bookingSetting: BOOLEAN,
      branchUrl: STRING(255),
      defaultPic: STRING(255),
      dishTag: STRING(255),
      expand: STRING(255),
      geoLat: FLOAT,
      geoLng: FLOAT,
      hasSceneryOrder: BOOLEAN,
      memberCardId: INTEGER,
      phoneNo: STRING(255),
      poi: STRING(255),
      promoId: INTEGER,
      regionList: JSON,
      shopDealId: INTEGER,
      shopId: INTEGER,
      shopName: STRING(255),
      shopPower: INTEGER,
      shopPowerTitle: STRING(255),
      created_at: DATE,
      city_id: INTEGER,
      city_en_name: STRING(255),
      categoryId: INTEGER,
      page: INTEGER,
      page_count: INTEGER,
      sheng_code: STRING(255),
      shi_code: STRING(255),
      xian_code: STRING(255)
    },
    {
      timestamps: false,
      underscored: true,
      freezeTableName: true,
      tableName: "dianping"
    }
  );

  return Dianping;
};
