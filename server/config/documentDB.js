const fs = require('fs');
module.exports = {
    databaseConnection: function (mongoose) {
        try {
            const connection_string = process.env.DB_CONNECTION_STR;
            let option = {
                socketTimeoutMS: 0,
                connectTimeoutMS: 0,
                useNewUrlParser: true,
                useUnifiedTopology: true
            }

            //console.log(option)
            // Mongoose >= 6 removed some options (like useFindAndModify). Keep strictQuery explicit
            // to avoid deprecation warnings when running with newer mongoose versions.
            try {
                mongoose.set('strictQuery', false);
            } catch (e) {
                // ignore if mongoose doesn't support this API in very old versions
            }

            // Basic validation of the connection string so we don't attempt to connect
            // with an obviously incorrect value (for example someone set DB_CONNECTION_STR=1234)
            if (!connection_string || typeof connection_string !== 'string') {
                console.error('DB_CONNECTION_STR is not set or not a string. Skipping mongoose.connect.\n' +
                    'Set DB_CONNECTION_STR to a valid MongoDB URI, for example:\n' +
                    "  mongodb://USER:PASS@host:27017/dbname or\n" +
                    "  mongodb+srv://USER:PASS@cluster0.example.mongodb.net/dbname\n");
                return;
            }

            // Require the URI to start with mongodb:// or mongodb+srv:// — otherwise
            // the DNS SRV lookup can be performed against an invalid hostname (see ENOTFOUND _mongodb._tcp.*)
            if (!/^mongodb(\+srv)?:\/\//i.test(connection_string)) {
                console.error('DB_CONNECTION_STR does not look like a MongoDB URI. Skipping mongoose.connect.\n' +
                    'Make sure it starts with "mongodb://" or "mongodb+srv://".\n' +
                    'Current value: ' + connection_string);
                return;
            }

            // Attempt to connect and catch initial connection errors (including DNS SRV errors)
            mongoose.connect(connection_string, option)
                .then(() => {
                    console.log('Mongoose connect() resolved');
                })
                .catch(err => {
                    console.error('Mongoose connect() error: ' + (err && err.message ? err.message : err));
                    if (err && /ENOTFOUND/i.test(err.message) && /_mongodb\._tcp/i.test(err.message)) {
                        console.error('\nThe error above (querySrv ENOTFOUND _mongodb._tcp.*) usually means the host portion of your ' +
                            'connection string is invalid. Common causes:\n' +
                            "  - You set DB_CONNECTION_STR to a port number or placeholder like '1234' instead of a full URI.\n" +
                            "  - You omitted the 'mongodb+srv://' or 'mongodb://' scheme.\n" +
                            "Fix: set DB_CONNECTION_STR to a valid URI, for example:\n" +
                            "  mongodb://USER:PASS@host:27017/dbname\n" +
                            "  or (for Atlas) mongodb+srv://USER:PASS@cluster0.example.mongodb.net/dbname\n");
                    }
                });

            //console.log(mongoose.connection.readyState);
            // CONNECTION EVENTS
            mongoose.connection.on('connecting', function () {
                console.log('Mongoose default connection');
            });
            // When successfully connected
            mongoose.connection.on('connected', function () {
                console.log('Mongoose default connected');
            });
            // If the connection throws an error
            mongoose.connection.on('error', function (err) {
                console.log('Mongoose default connection error: ' + err);
            });
            // When the connection is disconnected
            mongoose.connection.on('disconnected', function () {
                console.log('Mongoose default connection disconnected');
            });
        } catch (err) {
            console.log("Db Connection File Error ", err)
        }
    }
};
