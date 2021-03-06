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
const jsonParser = bodyParser.json();
const nodemailer = require('nodemailer');
var otpGenerator = require('otp-generator')
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
    if (!req.query.organizationId) {
        console.log("organizationId is not found in the request");
        res.send(JSON.stringify({}));
    } else {
        const query = `select* from departments where organization_id='${req.query.organizationId}'`;
        executeQuery(query).then((record) => {
            res.send(JSON.stringify(record));
        }).catch(() => {
            res.send(JSON.stringify({}));
        });
    }
});
app.get('/getQuestionsOptionsForDepartments', (req, res) => {
    const departmentName = req.query.departmentName;
    if (!departmentName) res.send(null);
    const query = `select* from questions_options where department='${departmentName}'`;
    executeQuery(query).then((record) => {
        res.send(JSON.stringify(record));
    }).catch(() => {
        res.send(JSON.stringify({}));
    });
});

app.get('/getAdminsForOrganization', (req, res) => {
    const organizationId = req.query.organizationId;
    if (!organizationId) res.send(JSON.stringify({}));
    const query = `select* from user_info where organization_id='${organizationId}' and is_admin=1`;
    executeQuery(query).then((record) => {
        res.send(JSON.stringify(record));
    }).catch(() => {
        res.send(JSON.stringify({}));
    });
});

app.get("/getStudentsResultForOrganization", (req, res) => {
    const organizationId = req.query.organizationId;
    const departmentName = req.query.departmentName;
    if (!organizationId || !departmentName) {
        console.log("DepartmentName or OrganizationId is not fount in the request");
        res.send(JSON.stringify({}));
    } else {
        const selectQuery = `select* from exams_result where organization_id='${organizationId}' and department_name='${departmentName}'`;
        executeQuery(selectQuery).then((record) => {
            res.send(JSON.stringify(record));
        }).catch(() => {
            res.send(JSON.stringify({}));
        });
    }
});

app.get("/getUserTheme", (req, res) => {
    const userId = req.query.userId;
    if (!userId) {
        console.log("userId is not fount in the request");
        res.send(JSON.stringify({}));
    } else {
        const selectQuery = `select* from users_theme where user_id='${userId}'`;
        executeQuery(selectQuery).then((record) => {
            res.send(JSON.stringify(record));
        }).catch(() => {
            res.send(JSON.stringify({}));
        });
    }
})


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
            request.bulk(table, (err) => {
                sql.close();
                if (err)
                    notifyClient("operationFailed", { message: "Unable to register organization" });
                else
                    notifyClient("operationSuccessful", { message: "Organization registered successfully" });
                res.end(JSON.stringify({ isAlreadyExists: false }));
            })
        })
    }).catch(() => {
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
        console.log(`Got a login request from user with data ${data.userName} and ${data.password}`);
        makeSureDatabaseExits();
        connectSql().then((request) => {
            request.bulk(Tables.getUserInfoTable(), (err) => {
                sql.close();
                if (err) {
                    console.log(err)
                    notifyClient("operationFailed");
                } else {
                    const selectQuery = `select* from user_info where email_address='${data.userName}' and password='${data.password}'`;
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

    socket.on('generatePassword', (data) => {
        if (!data.email) {
            console.log("Email not found in the request");
            notifyClient("operationFailed");
            return;
        } else {
            const newPassword = otpGenerator.generate(6, { upperCase: false, specialChars: true });
            let selectQuery = `select* from user_info where email_address='${data.email}'`;
            let updateQuery = `update user_info set password='${newPassword}' where email_address='${data.email}'`;
            if (data.isOrganization) {
                selectQuery = `select* from organizations where organization_email='${data.email}'`;
                let updateQuery = `update organizations set organization_password='${newPassword}' where organization_email='${data.email}'`;
            }
            executeQuery(selectQuery).then((record) => {
                if (record && record.length > 0) {

                    sendEmail(data.email, "Passworg", `Your new password is ${newPassword}`).then(() => {
                        executeQuery(updateQuery).then((record) => {
                            notifyClient("passwordGeneratedSuccessfully");
                            notifyClient("operationSuccessful", { message: "New password has been send on your email" });
                        });
                    });
                } else {
                    notifyClient("emailNotFound");
                }
            })
        }
    });

    socket.on('doOrganizationLogin', (data) => {
        console.log(`Got a Organization login request from user with data ${data.userId} and ${data.password}`);
        makeSureDatabaseExits();
        connectSql().then((request) => {
            request.bulk(Tables.getOrganizationsTable(), (err) => {
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
        if (!userInfo || !userInfo.organizationId) {
            console.log("user info or organizationId not found in the request.");
            notifyClient("operationFailed")
            return;
        }
        isUserAlreadyExists(userInfo.emailAddress).then(() => {
            let table = Tables.getUserInfoTable();
            table.rows.add(`${userInfo.organizationId}`, `${uniqueId()}`, `${userInfo.fullName}`, `${userInfo.password}`, `${userInfo.emailAddress}`, userInfo.mobileNumber, userInfo.isAdmin, false);
            connectSql().then((request) => {
                request.bulk(table, (err) => {
                    sql.close();
                    if (err) {
                        notifyClient("operationFailed", { message: "Unable to add user" });
                    }
                    else {
                        notifyClient("operationSuccessful", { message: "User added successfully" });
                        if (userInfo.isAdmin)
                            sendAdminUpdationEventToClient(userInfo.organizationId);
                    }
                })
            })
        }).catch(() => {
            notifyClient("userAlreadyExist");
        });
    });

    socket.on("addNewDepartments", (data) => {
        let table = Tables.getDepartmentsTable();
        data.departments.forEach(department => {
            table.rows.add(`${data.organizationId}`, `${uniqueId()}`, department);
        });
        connectSql().then((request) => {
            request.bulk(table, (err) => {
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
            table.rows.add(`${data.organizationId}`, `${uniqueId()}`, data.questions[i], data.options[i], data.department, data.correctOptions[i]);
        }
        connectSql().then((request) => {
            request.bulk(table, (err) => {
                sql.close();
                if (err) {
                    console.log(err)
                    notifyClient("operationFailed");
                } else {
                    notifyClient("operationSuccessful", { message: "Question saved successfully" });
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

    socket.on("updateAdminInfos", (data) => {
        if (!data.userId) {
            console.log("admin_id not found in data");
            notifyClient("operationFailed");
        } else {
            const updateQuery = `update user_info set full_name='${data.name}',email_address='${data.email}',phone=${data.phone},is_suspended=${data.isSuspended} where user_id='${data.userId}'`;
            executeQuery(updateQuery).then(() => {
                notifyClient("operationSuccessful", { message: "Admin info updated successfully" });
                sendAdminUpdationEventToClient(data.organizationId);
            }).catch((err) => {
                notifyClient("operationFailed");
                console.log(err)
            });
        }
    });

    socket.on("deleteAdmin", (data) => {
        if (!data.userId) {
            console.log("admin_id not found in data");
            notifyClient("operationFailed");
        } else {
            const updateQuery = `delete from user_info where user_id='${data.userId}'`;
            executeQuery(updateQuery).then(() => {
                notifyClient("operationSuccessful", { message: "Admin deleted successfully" });
                sendAdminUpdationEventToClient(data.organizationId);
            }).catch((err) => {
                notifyClient("operationFailed");
                console.log(err)
            });
        }
    });

    socket.on("updateResult", (data) => {
        if (!data.organizationId || !data.studentId) {
            console.log("studentId or organizationId is not found in data");
            return;
        }
        const selectQuery = `select full_name from user_info where user_id='${data.studentId}'`;
        executeQuery(selectQuery).then((studDetail) => {
            let table = Tables.getResultsTable();
            table.rows.add(`${uniqueId()}`, `${data.organizationId}`, `${data.studentId}`, `${studDetail[0].full_name}`, `${data.departmentName}`, data.totalMarks,
                data.outOf, `${data.examDate}`);
            connectSql().then((request) => {
                request.bulk(table, (err) => {
                    sql.close();
                    if (err) {
                        console.log(err);
                        notifyClient("resultUpdationFailed");
                    }
                    else {
                        notifyClient("resultUpdated");
                    }
                })
            });
        }).catch((err) => {
            console.log(err)
        });
    });

    socket.on("saveTheme", (data) => {
        if (!data.userId) {
            console.log("userId is not present in the data");
            notifyClient("operationFailed");
            return
        }
        const table = Tables.getThemesTable();
        const updateQuery = `update users_theme set theme_color='${data.theme}' where user_id='${data.userId}'
                   IF @@ROWCOUNT=0
                   insert into users_theme values('${uniqueId()}','${data.userId}','${data.theme}');`
        connectSql().then((request) => {
            request.bulk(table, (err) => {
                sql.close();
                if (err) {
                    console.log(err);
                    notifyClient("operationFailed");
                } else {
                    executeQuery(updateQuery).then(() => {
                        notifyClient("operationSuccessful", { message: "Theme updated successfully" });
                        notifyClient("themeUpdated", { theme: data.theme });
                    }).catch((err) => {
                        notifyClient("operationFailed");
                        console.log(err)
                    });
                }
            });
        });
    })

});

const notifyClient = (eventName, data) => {
    if (webSocket)
        webSocket.emit(eventName, JSON.stringify(data));
}

const sendAdminUpdationEventToClient = (organizationId) => {
    if (organizationId) {
        const query = `select* from user_info where organization_id='${organizationId}' and is_admin=1`;
        executeQuery(query).then((record) => {
            notifyClient("updateAdminInfo", record);
        });
    } else {
        console.log("oreganizationId is not found in the data");
    }
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

const isUserAlreadyExists = (email) => {
    const def = new Deferred();
    const selectQuery = `select * from user_info where email_address='${email}'`;
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

const sendEmail = (email, subject, text) => {
    const def = new Deferred();
    const transporter = nodemailer.createTransport({
        ...config.mailConfig()
    });


    const mailOptions = {
        from: `${config.mailConfig().auth.user}`,
        to: `${email}`,
        subject: `${subject}`,
        text: `${text}`
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            notifyClient("operationFailed");
            def.reject();
            return console.log(error);
        } else {
            def.resolve();
        }

    });
    return def;
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