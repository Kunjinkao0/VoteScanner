require("dotenv").config();

const DB_NAME = process.env.DB_NAME;
const USE_TRUSTED_DEVICES = !!process.env.USE_TRUSTED_DEVICES;
const VOTE_SCORE = +process.env.VOTE_SCORE || 1;
const VOTE_ADMIN_UP_SCORE = +process.env.VOTE_ADMIN_UP_SCORE || 1;
const VOTE_ADMIN_DOWN_SCORE = +process.env.VOTE_ADMIN_DOWN_SCORE || -2;

module.exports = {
  DB_NAME,
  USE_TRUSTED_DEVICES,
  VOTE_SCORE,
  VOTE_ADMIN_UP_SCORE,
  VOTE_ADMIN_DOWN_SCORE,
};
