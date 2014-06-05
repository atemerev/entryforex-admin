var config = {
    port: process.env.PORT || 5000,

    dbUrl: process.env.DATABASE_URL || 'postgres://sfiqykwdjfxiri:pPXRW0jcE-SY5pJzhbEx9ge3bo@ec2-107-20-191-205.compute-1.amazonaws.com:5432/dcb09gc5aetqgj',

    sessionSecret: 'f!fab5#sOwe,',

    users: {
        admin: {
            password: 'XIzbwxD28'
        }
    }
};

// Local machine config
if( require('fs').existsSync( __dirname + "/config.local.js" ) ) {
    require('lodash').extend(config, require(__dirname + "/config.local.js") );
}

module.exports = config;
