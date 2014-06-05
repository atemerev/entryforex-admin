var Sequelize = require('sequelize'),
    sequelize = null;

var match = global.config.dbUrl.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);

sequelize = new Sequelize(match[5], match[1], match[2], {
    dialect:  'postgres',
    protocol: 'postgres',
    port:     match[4],
    host:     match[3],
    ssl: true,
    logging:  true //false
});

module.exports = sequelize;
