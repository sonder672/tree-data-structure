const mongoose = require('mongoose');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;

const database = {mongoose, DATABASE_URL};
module.exports = database;