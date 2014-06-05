/*
Authentication for express.

Users stored in config (global.config.users)
*/
module.exports = function(app) {

    var
        passport = require('passport'),
        cookieParser = require('cookie-parser'),
        cookieSession = require('cookie-session'),
        LocalStrategy = require('passport-local').Strategy;

    app.use(cookieParser());

    app.use(cookieSession({
        secret: global.config.sessionSecret,
        cookie: {
            maxAge: 1000 * 86400 * 365 * 5 // 5 years
        }
    }));

    app.use(passport.initialize());

    app.use(passport.session());

    passport.use(new LocalStrategy(
        function(username, password, done) {
            if (global.config.users[username] && global.config.users[username].password === password) {
                return done(null, username);
            } else {
                return done(null, false, { message: 'Incorrect username or password' });
            }
        }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(id, done) {
        done(null, id);
    });

    app.get('/login', function(req, res) {
        res.render("login.ejs", {failure: req.param('failure')});
    });
    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/login');
    });

    app.post('/login', passport.authenticate('local', { failureRedirect: '/login?failure=1'}), function(req, res) {
        res.redirect('/');
    });

    app.all('*', function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        if (req.url.match(/^\/api/)) {
            res.json({"error": "not authenticated"});
        } else {
            res.redirect('/login');
        }
    });
};
