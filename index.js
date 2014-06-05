var
    config = global.config = require('./config'),
    express = require('express'),
    bodyParser = require('body-parser'),
    fs = require('fs');

var app = express();

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/pages');

app.use(bodyParser());

require('./lib/auth')(app);

// And now we load all the routes from 'routes' folder
// into 'api' application.
function initRoutes(path) {
    var files = fs.readdirSync(path);
    files.forEach(function(file) {
        var curPath = path + "/" + file;
        if (fs.statSync(curPath).isDirectory()) {
            initRoutes(curPath);
        } else {
            if (curPath.match(/\.js/)) {
                require(curPath)(app);
            }
        }
    });
}
initRoutes(__dirname + "/routes");

app.all('*', function(req, res) {
    res.status(404);
    res.json({
        error: "Not found"
    });
});

app.use(function(err, req, res, next) {
    if (err) {
        console.log(err.stack || err);

        res.status(err.status || 500);
        res.json({error: err.message});
    } else {
        next();
    }
});

app.listen(config.port, function(err) {
    if (err) console.log(err);

    console.log("Listening at localhost:" + config.port);
});
