"use strict";

import { UserTypeEnum } from "../../constants/enum";
import { Sequelize } from "sequelize"; // Corrected import statement

module.exports = {
  async up(queryInterface: any, Sequelize: any) {
    return queryInterface.bulkInsert("users", [
      {
        firstName: "abdul",
        lastName: "hai",
        email: "admin@mail.com",
        role: UserTypeEnum.Admin,
        password:
          "$2a$05$oQyxb1XHx1awGVLwf/7f3emoLV.deo5tyigEeMzRCDjhAOHMbLy5C", //test
        // emailVerifiedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface: any, Sequelize: any) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
