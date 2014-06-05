module.exports = function(app) {

    var db = require('../lib/db');

    app.get('/', function(req, res, next) {
        getTotalPnL(function(err, totalPnL) {
            if (err) return next(err);

            getOpenDeals(function(err, openDeals) {
                if (err) return next(err);

                res.render('index.ejs', {
                    totalPnL: totalPnL,
                    openDeals: openDeals
                });
            });
        });
    });

    function getTotalPnL(callback) {
        db.query("SELECT sum(d.profit_loss) from deals d, accounts a WHERE d.account = a.id AND a.password IS NOT NULL")
            .done(function(err, result) {
                if (err) return callback(err);
                return callback(null, parseFloat(result[0].sum));
            });
    }

    function getOpenDeals(callback) {
        db.query("SELECT * FROM positions p INNER JOIN accounts a on a.id = p.account INNER JOIN users u on u.id = a.owner WHERE a.password IS NOT NULL order by p.open_time DESC")
            .done(function(err, result) {
                if (err) return callback(err);
                return callback(null, result);
            });
    }
};
