'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      firstName: 'Đặng', 
      lastName: 'Đức Chính', 
      email: 'chinh22082001@gmail.com',
      password: 'zalo12345',
      address: 'Số 1 Ngõ 421 Hoàng Quốc Việt',
      gender: 1, 
      roleId: 'ROLE',
      image: 'images/12345',
      positionId : '1' , 
      phoneNumber : '0326436724',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);p
  },
  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
