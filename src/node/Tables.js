const sql = require('mssql');

class Tables {
    static getUserInfoTable () {
        const userInfoTable = new sql.Table("user_info");
        userInfoTable.create = true;
        userInfoTable.columns.add('user_id', sql.NVarChar(50), { nullable: false });
        userInfoTable.columns.add('full_name', sql.NVarChar(255), { nullable: false });
        userInfoTable.columns.add('user_name', sql.NVarChar(255), { nullable: false });
        userInfoTable.columns.add('password', sql.NVarChar(255), { nullable: false });
        userInfoTable.columns.add('email_address', sql.NVarChar(255), { nullable: false });
        userInfoTable.columns.add('phone', sql.Decimal(10, 0), { nullable: false });
        userInfoTable.columns.add('dob', sql.DateTime, { nullable: false });
        userInfoTable.columns.add('is_admin', sql.Int, { nullable: false });
        return userInfoTable
    }

    static getQuestionsOptionsTable () {
        const questionsOptionsTable = new sql.Table("questions_options");
        questionsOptionsTable.create = true;
        questionsOptionsTable.columns.add('id', sql.NVarChar(50), { nullable: false });
        questionsOptionsTable.columns.add('questions', sql.NVarChar(255), { nullable: false });
        questionsOptionsTable.columns.add('options', sql.NVarChar(255), { nullable: false });
        questionsOptionsTable.columns.add('department', sql.NVarChar(255), { nullable: false });
        questionsOptionsTable.columns.add('correct_option', sql.NVarChar(255), { nullable: false });
        return questionsOptionsTable;
    }

    static getDepartmentsTable(){
        const departmentsTable = new sql.Table("departments");
        departmentsTable.create = true;
        departmentsTable.columns.add('id', sql.NVarChar(50), { nullable: false });
        departmentsTable.columns.add('department_name', sql.NVarChar(255), { nullable: false });
        return departmentsTable;
    }

}

module.exports=Tables;