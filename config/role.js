const { AccessControl } = require("accesscontrol");

const roles = {
  admin: {
    user: {
      "read:any": ["*"],
      "delete:any": ["*"],
    },
    blog: {
      "create:any": ["*"],
      "read:any": ["*"],
      "update:any": ["*"],
      "delete:any": ["*"],
    },
  },
  teacher: {
    user: {
      "read:own": ["*"],
      "update:own": ["*"],
    },
    blog: {
      "create:any": ["*"],
      "read:any": ["*"],
      "update:own": ["*"],
      "delete:own": ["*"],
    },
  },
};

const ac = new AccessControl(roles);
console.log(ac.can("teacher").readAny("blog").granted);
