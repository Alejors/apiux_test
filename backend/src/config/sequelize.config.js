require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DOCKER_DB_PORT) ?? 5432,
    dialect: "postgres",
  },
  test: {
    use_env_variable: false,
    username: "root",
    password: "",
    database: "test_db",
    host: "localhost",
    dialect: "sqlite",
    storage: ":memory:",
  },
};
