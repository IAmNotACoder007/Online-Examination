
class Configuration {
    basicConfig() {
        return {
            user: 'sa',
            password: 'admin123',
            server: 'DESKTOP-LR002GL',
        }
    };

    configWithDatabaseName() {
        return {
            user: this.basicConfig().user,
            password: this.basicConfig().password,
            server: this.basicConfig().server,
            database: 'OnlineQuiz'
        }
    };
}

module.exports = Configuration;