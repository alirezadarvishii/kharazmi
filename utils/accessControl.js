const { AccessControl } = require("accesscontrol");

// Defin all grant and permissions.
const grants = {
  admin: {
    user: {
      "read:any": ["*"],
      "update:any": ["*"],
      "delete:any": ["*"],
    },
    blog: {
      "create:any": ["*"],
      "read:any": ["*"],
      "delete:any": ["*"],
      "update:any": ["*"],
    },
    comment: {
      "create:any": ["*"],
      "update:own": ["*"],
      "delete:any": ["*"],
    },
  },
  teacher: {
    user: {
      "read:any": ["*"],
      "update:own": ["*"],
    },
    blog: {
      "update:own": ["*"],
      "delete:own": ["*"],
    },
    comment: {
      "create:own": ["*"],
      "update:own": ["*"],
      "delete:own": ["*"],
    },
  },
  user: {
    user: {
      "update:own": ["*"],
    },
    blog: {
      "read:any": ["*"],
    },
    comment: {
      "update:own": ["*"],
      "delete:own": ["*"],
    },
  },
};

module.exports = new AccessControl(grants);
