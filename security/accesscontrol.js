const { AccessControl } = require("accesscontrol");

const ac = new AccessControl();

// GRANT: User
ac.grant("user")
  .deleteOwn("comment")
  // GRANT: Teachers
  .grant("teacher")
  // Blog
  .create("blog")
  .updateOwn("blog")
  .deleteOwn("blog")
  // User
  .updateOwn("user")
  // GRANT: admins
  .grant("admin")
  // Blog
  .create("blog")
  .deleteAny("blog")
  .updateAny("blog")
  // Users
  .updateAny("user")
  // Gallery
  .create("galleryImage")
  .delete("galleryImage")
  .update("galleryImage")
  .read("galleryImage")
  // Events
  .create("event")
  .read("event")
  .update("event")
  .delete("event")
  .deleteAny("comment");

module.exports = ac;
