module.exports = function init() {
  const User = require("./models/User.js");
  const Category = require("./models/Category.js");
  const Content = require("./models/Content.js");
  
  User.belongsToMany(Content, { through: "UserContents" });
  Content.belongsToMany(User, { through: "UserContents" });

  Category.belongsToMany(Content, { through: "ContentCategory" });
  Content.belongsToMany(Category, { through: "ContentCategory" });

};
