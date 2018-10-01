
class Configuration {
    basicConfig() {
        return {
            user: 'sa',
            password: 'YourPassword',
            server: 'localhost',
        }
    };

    configWithDatabaseName() {
        return {
            user: this.basicConfig().user,
            password: this.basicConfig().password,
            server: this.basicConfig().server,
            database: 'OnlineQuiz',
        }
    };

    mailConfig() {
        return {
            service: 'Gmail',
            auth: {
                user: 'YourEmail',
                pass: 'YourPassword'
            },
            tls: {
                rejectUnauthorized: false
            }
        }
    }
}

module.exports = Configuration;