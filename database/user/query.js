const { UserModel, UserRegistrationLogModel } = require('../../models/user');

const emailExists = async (email) => {
    const user = await UserModel.findOne({ email });

    if (!user) return false;

    return true;
};

const getUserByEmail = async(email) => {
    const user = await UserModel
        .findOne({ email })
        .lean();

    return user;
};

const getUserById = async(id) => {
    const user = await UserModel
        .findById(id)
        .lean();

    return user;
};

const getNumberRegisteredUsersToday = async() => {
    const currentDate = new Date().toISOString();
    const todayDate = currentDate.split('T')[0];
    const query = {
        createdAt: {
          $gte: new Date(todayDate), //? Mayor o igual a la fecha de inicio del día actual
          $lt: new Date(new Date(todayDate).getTime() + 24 * 60 * 60 * 1000) //? Menor que la fecha de inicio del día siguiente
        }
      };
  
      const count = await UserRegistrationLogModel.countDocuments(query);
      
      return count;
};

module.exports = { emailExists, getUserByEmail, getUserById, getNumberRegisteredUsersToday };