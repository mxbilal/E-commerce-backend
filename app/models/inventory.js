module.exports = (sequelize, Sequelize) => {
  const inventory = sequelize.define("inventory", {
    name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    price: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    stock: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    category: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    isDeleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  });
  return inventory;
};
