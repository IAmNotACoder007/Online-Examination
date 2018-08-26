const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const Config = require('./config');
const sql = require('mssql');
const config = new Config();
const uniqueId = require('uuid/v4');
const Deferred = require('node-defer');
const Tables = require('./Tables');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json()
// our localhost port
const port = 8080;

const app = express();

// our server instance
const server = http.createServer(app);

// This creates our socket using the instance of the server
const io = socketIO(server);
let webSocket = undefined;

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/getDepartments', (req, res) => {
    const query = "select* from departments";
    executeQuery(query).then((record) => {
        res.send(JSON.stringify(record));
    }).catch((err) => {
        res.send(JSON.stringify({}));
    });
});
app.get('/getQuestionsOptionsForDepartments', (req, res) => {
    const departmentName = req.query.departmentName;
    if (!departmentName) res.send(null);
    const query = `select* from questions_options where department='${departmentName}'`;
    executeQuery(query).then((record) => {
        res.send(JSON.stringify(record));
    }).catch((err) => {
        res.send(JSON.stringify({}));
    });
});

app.post('/registerOrganization', jsonParser, (req, res) => {
    makeSureDatabaseExits();
    if (!req.body) {
        console.log("Organization info not found in the request.");
        return;
    }
    verifyOrganizationExists(req.body.email).then(() => {
        let table = Tables.getOrganizationsTable();
        table.rows.add(`${uniqueId()}`, `${req.body.name}`, `${req.body.email}`, req.body.phone, `${req.body.password}`);
        connectSql().then((request) => {
            request.bulk(table, (err, result) => {
                sql.close();
                if (err)
                    notifyClient("operationFailed", { message: "Unable to register organization" });
                else
                    notifyClient("operationSuccessful", { message: "Organization registered successfully" });
                res.end(JSON.stringify({ isAlreadyExists: false }));
            })
        })
    }).catch((err) => {
        res.end(JSON.stringify({ isAlreadyExists: true }));
    });
});


io.on('connection', socket => {
    console.log('User connected');
    webSocket = socket;


    socket.on('disconnect', () => {
        console.log('user disconnected');
        webSocket = undefined;
    });

    socket.on('doLogin', (data) => {
        console.log(`Got a login request from user with data ${data.userId} and ${data.password}`);
        makeSureDatabaseExits();
        connectSql().then((request) => {
            request.bulk(Tables.getUserInfoTable(), (err, result) => {
                sql.close();
                if (err) {
                    console.log(err)
                    notifyClient("operationFailed");
                } else {
                    const selectQuery = `select* from user_info where user_name='${data.userId}' and password='${data.password}'`;
                    executeQuery(selectQuery).then((record) => {
                        if (record && record.length > 0)
                            notifyClient("loginSuccessful", record);
                        else
                            notifyClient("userNotRegister", record);
                    }).catch((err) => {
                        notifyClient("operationFailed");
                        console.log(err)
                    });

                }
            });
        });
    });

    socket.on('doOrganizationLogin', (data) => {
        console.log(`Got a Organization login request from user with data ${data.userId} and ${data.password}`);
        makeSureDatabaseExits();
        connectSql().then((request) => {
            request.bulk(Tables.getOrganizationsTable(), (err, result) => {
                sql.close();
                if (err) {
                    console.log(err)
                    notifyClient("operationFailed");
                } else {
                    const selectQuery = `select* from organizations where organization_email='${data.userId}' and organization_password='${data.password}'`;
                    executeQuery(selectQuery).then((record) => {
                        if (record && record.length > 0)
                            notifyClient("organizationLoginSuccessful", record);
                        else
                            notifyClient("userNotRegister", record);
                    }).catch((err) => {
                        notifyClient("operationFailed");
                        console.log(err)
                    });

                }
            });
        });
    });


    socket.on("addNewUser", (userInfo) => {
        makeSureDatabaseExits();
        if (!userInfo) {
            console.log("user info not found in the request.");
            return;
        }
        let table = Tables.getUserInfoTable();
        const dob = new Date(userInfo.dateOfBirth);
        table.rows.add(`${uniqueId()}`, `${userInfo.fullName}`, `${userInfo.userName}`, `${userInfo.password}`, `${userInfo.emailAddress}`, userInfo.mobileNumber, dob, userInfo.isAdmin);
        connectSql().then((request) => {
            request.bulk(table, (err, result) => {
                sql.close();
                if (err)
                    notifyClient("operationFailed", { message: "Unable to add user" });
                else
                    notifyClient("operationSuccessful", { message: "User added successfully" });
            })
        })
    });

    socket.on("addNewDepartments", (data) => {
        let table = Tables.getDepartmentsTable();
        data.departments.forEach(department => {
            table.rows.add(`${uniqueId()}`, department);
        });
        connectSql().then((request) => {
            request.bulk(table, (err, result) => {
                sql.close();
                if (err) {
                    console.log(err)
                    socket.emit("departmentUpdatingFailed")
                } else {
                    const selectQuery = "select* from departments";
                    executeQuery(selectQuery).then((record) => {
                        notifyClient("newDepartmentsAdded", record)
                    }).catch((err) => {
                        notifyClient("operationFailed");
                        console.log(err)
                    });

                }
            });
        });
    });

    socket.on("addQuestionAndOptions", (data) => {
        let table = Tables.getQuestionsOptionsTable();
        for (let i = 0; i < data.questions.length; i++) {
            table.rows.add(`${uniqueId()}`, data.questions[i], data.options[i], data.department, data.correctOptions[i]);
        }
        connectSql().then((request) => {
            request.bulk(table, (err, result) => {
                sql.close();
                if (err) {
                    console.log(err)
                    notifyClient("operationFailed");
                } else {
                    notifyClient("questionsAddedSuccessfully");
                }
            });
        });
    });

    socket.on("saveDepartment", (data) => {
        const id = data.id;
        const departmentName = data.department;
        if (!id || !departmentName) {
            console.log(`Invalid data id: '${id}' and departmentName: '${departmentName}'`);
            return;
        } else {
            const query = `update departments set department_name='${departmentName}' where id='${id}'`;
            executeQuery(query).then(() => {
                const selectQuery = "select* from departments";
                executeQuery(selectQuery).then((record) => {
                    notifyClient("departmentSaved", record);
                }).catch((err) => {
                    notifyClient("operationFailed");
                    console.log(err)
                });
            }).catch((err) => {
                notifyClient("operationFailed");
                console.log(err);
            })
        }
    });

    socket.on("deleteDepartment", (data) => {
        const id = data.id;
        if (!id) {
            console.log(`Invalid Data id: '${id}'`);
            return
        } else {
            const deleteQuery = `delete from departments where id='${id}'`;
            executeQuery(deleteQuery).then(() => {
                const selectQuery = "select* from departments";
                executeQuery(selectQuery).then((record) => {
                    notifyClient("departmentDeleted", record);
                }).catch((err) => {
                    notifyClient("operationFailed");
                    console.log(err)
                });
            }).catch(() => {
                notifyClient("operationFailed");
                console.log(err);
            })
        }
    });

    socket.on("updateQuestionOptions", (data) => {
        if (!data.id) {
            console.log("id not found in data");
            notifyClient("operationFailed");
        } else {
            const updateQuery = `update questions_options set questions='${data.question}', options='${data.options}' where id='${data.id}'`;
            executeQuery(updateQuery).then(() => {
                const query = `select* from questions_options where department='${data.departmentName}'`;
                notifyClient("operationSuccessful", { message: "Question and Options updated successfully" });
                executeQuery(query).then((record) => {
                    notifyClient("refreshQuestionOption", (record));
                });
            }).catch((err) => {
                notifyClient("operationFailed");
                console.log(err)
            });
        }
    });

    socket.on("deleteQuestion", (data) => {
        if (!data.id) {
            console.log("id not found in data");
            notifyClient("operationFailed");
        } else {
            const deleteQuery = `delete from questions_options where id='${data.id}'`;

            executeQuery(deleteQuery).then(() => {
                const query = `select* from questions_options where department='${data.departmentName}'`;
                notifyClient("operationSuccessful", { message: "Question deleted successfully" });
                executeQuery(query).then((record) => {
                    notifyClient("refreshQuestionOption", (record));
                });
            }).catch((err) => {
                notifyClient("operationFailed");
                console.log(err)
            });
        }
    })

});

const notifyClient = (eventName, data) => {
    if (webSocket)
        webSocket.emit(eventName, JSON.stringify(data));
}

const verifyOrganizationExists = (email) => {
    const def = new Deferred();
    const selectQuery = `select * from organizations where organization_email='${email}'`;
    executeQuery(selectQuery).then((data) => {
        if (data && data.length)
            def.reject(data);
        else
            def.resolve()
    }).catch(() => {
        def.resolve()
    })
    return def
}

const connectSql = (conf) => {
    sql.close();
    const sqlDef = new Deferred();
    sql.connect(conf || config.configWithDatabaseName(), function (err) {
        if (err) {
            console.log(err);
            sqlDef.reject();
        }
        else {
            console.log("connected to mssql.");
            // create Request object
            const request = new sql.Request();
            sqlDef.resolve(request);
        }
    });
    return sqlDef;
}



const executeQuery = (query, conf) => {
    const def = new Deferred();
    //close any existing connection.
    sql.close();
    connectSql(conf).then((request) => {
        request.query(query, function (err, recordSet) {
            sql.close();
            if (err) {
                console.log(err);
                def.reject(err);
            }
            else {
                def.resolve(recordSet.recordset)
            }
        });
    });
    return def;
}

const makeSureDatabaseExits = () => {
    executeQuery(`
             IF  NOT EXISTS (SELECT * FROM sys.databases WHERE name = N'OnlineQuiz')
                 BEGIN
                     CREATE DATABASE [OnlineQuiz]
                END;                             
             `, config.basicConfig());
}


server.listen(port, () => console.log(`Listening on port ${port}`))