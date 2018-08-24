
class Configuration {
    basicConfig() {
        return {
            user: 'sa',
            password: 'admin123',
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
}

module.exports = Configuration;