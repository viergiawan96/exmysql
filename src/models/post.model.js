module.exports = (sequelize, Sequelize) => {
  const post = sequelize.define("post", {
    title: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.TEXT,
    },
    author: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
  return post;
};
