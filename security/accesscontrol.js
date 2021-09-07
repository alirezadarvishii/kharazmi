const { AccessControl } = require("accesscontrol");

const ac = new AccessControl();

// Teachers
ac.grant("teacher")
  // Blog
  .createOwn("blog")
  .updateOwn("blog")
  .deleteOwn("blog")
  //   User
  .updateOwn("user")
  // admins
  .grant("admin")
  //   Blog
  .deleteAny("blog")
  .updateAny("blog")
  //   Users
  .updateAny("user")
  //   Gallery
  .create("galleryImage")
  .delete("galleryImage")
  .update("galleryImage")
  .read("galleryImage")
  //   Events
  .create("event")
  .read("event")
  .update("event")
  .delete("event");

module.exports = ac;
