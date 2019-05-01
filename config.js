var config = {
  dbserver: {},
  app: {
    mode: 'development' //production or development
  }
};

//Database config
config.dbserver.userName = "gozde";
config.dbserver.password = "11061996g";
config.dbserver.dbName = "todolist";
config.dbserver.ip = "ds145486.mlab.com:45486";//ip format is <HOST_IP>:<PORT>

//App config
config.app.host = 'localhost';
config.app.port = 4000;//must be integer

module.exports = config;