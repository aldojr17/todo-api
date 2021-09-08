let accountModel = (db) => {
  // get tables name
  const tables = require("../../config/tables.json");
  const moment = require("moment");
  const now = moment().format("YYYY-MM-DD HH:mm:ss");

  const fn = {};

  // get all account
  fn.getAllUsers = async (id) => {
    return new Promise((resolve, reject) => {
      // prepare query
      let sql = "SELECT * FROM " + tables.account;

      // run query
      db.query(sql, [id], function (err, res) {
        if (err) return reject(err);
        return resolve(res);
      });
    });
  };

  fn.getUser = async (id) => {
    return new Promise((resolve, reject) => {
      // prepare query
      let sql = "SELECT * FROM " + tables.account + " WHERE u_id = ?";

      // run query
      db.query(sql, [parseInt(id)], (err, res) => {
        if (err) return reject(err);
        return resolve(res[0]);
      });
    });
  };

  fn.getUserEmail = async (email) => {
    return new Promise((resolve, reject) => {
      // prepare query
      let sql = "SELECT * FROM " + tables.account + " WHERE u_email = ?";

      // run query
      db.query(sql, [email], (err, res) => {
        if (err) return reject(err);
        return resolve(res[0]);
      });
    });
  };

  fn.insertUser = (data) => {
    return new Promise((resolve, reject) => {
      // prepare query
      let sql =
        "INSERT INTO " +
        tables.account +
        "(u_email, u_password, u_name, u_role, u_created_at) VALUES (?)";

      // run query
      db.query(sql, [data], (err, res) => {
        if (err) return reject(err);
        return resolve({ status: 200, message: "Success" });
      });
    });
  };

  fn.updateUser = async (id, data) => {
    return new Promise((resolve, reject) => {
      // prepare query
      let sql =
        "UPDATE " + tables.account + " SET u_last_login = ? WHERE u_id = ?";

      // run query
      db.query(sql, [data, id], function (err, res) {
        if (err) return reject(false);
        return resolve(true);
      });
    });
  };

  fn.updateLogout = async (id, data) => {
    return new Promise((resolve, reject) => {
      // prepare query
      let sql =
        "UPDATE " + tables.account + " SET u_last_logout = ? WHERE u_id = ?";

      // run query
      db.query(sql, [data, id], function (err, res) {
        if (err) return reject(false);
        return resolve(true);
      });
    });
  };

  fn.login = async (data) => {
    const { detailUser, objToken } = data;
    let auth = require("../models/auth")(db);

    try {
      await auth.updateToken(detailUser.u_id, now, objToken.atoken_id);
      await fn.updateUser(detailUser.u_id, now);
      return true;
    } catch (e) {
      return false;
    }
  };

  return fn;
};

module.exports = accountModel;
