const sql = require('mssql');

class Tables {
    static getUserInfoTable() {
        const userInfoTable = new sql.Table("user_info");
        userInfoTable.create = true;
        userInfoTable.columns.add('organization_id', sql.NVarChar(50), { nullable: false });
        userInfoTable.columns.add('user_id', sql.NVarChar(50), { nullable: false });
        userInfoTable.columns.add('full_name', sql.NVarChar(255), { nullable: false });
        userInfoTable.columns.add('password', sql.NVarChar(255), { nullable: false });
        userInfoTable.columns.add('email_address', sql.NVarChar(255), { nullable: false });
        userInfoTable.columns.add('phone', sql.Decimal(10, 0), { nullable: false });
        userInfoTable.columns.add('is_admin', sql.Int, { nullable: false });
        userInfoTable.columns.add('is_suspended', sql.Int, { nullable: false });
        return userInfoTable
    }

    static getQuestionsOptionsTable() {
        const questionsOptionsTable = new sql.Table("questions_options");
        questionsOptionsTable.create = true;
        questionsOptionsTable.columns.add('organization_id', sql.NVarChar(50), { nullable: false });
        questionsOptionsTable.columns.add('id', sql.NVarChar(50), { nullable: false });
        questionsOptionsTable.columns.add('questions', sql.NVarChar(255), { nullable: false });
        questionsOptionsTable.columns.add('options', sql.NVarChar(255), { nullable: false });
        questionsOptionsTable.columns.add('department', sql.NVarChar(255), { nullable: false });
        questionsOptionsTable.columns.add('correct_option', sql.NVarChar(255), { nullable: false });
        return questionsOptionsTable;
    }

    static getDepartmentsTable() {
        const departmentsTable = new sql.Table("departments");
        departmentsTable.create = true;
        departmentsTable.columns.add('organization_id', sql.NVarChar(50), { nullable: false });
        departmentsTable.columns.add('id', sql.NVarChar(50), { nullable: false });
        departmentsTable.columns.add('department_name', sql.NVarChar(255), { nullable: false });
        return departmentsTable;
    }

    static getOrganizationsTable() {
        const organizationTable = new sql.Table("organizations");
        organizationTable.create = true;
        organizationTable.columns.add('organization_id', sql.NVarChar(50), { nullable: false });
        organizationTable.columns.add('organization_name', sql.NVarChar(255), { nullable: false });
        organizationTable.columns.add('organization_email', sql.NVarChar(255), { nullable: false });
        organizationTable.columns.add('organization_phone', sql.NVarChar(255), { nullable: false });
        organizationTable.columns.add('organization_password', sql.NVarChar(255), { nullable: false });
        return organizationTable;
    }

    static getResultsTable() {
        const examsResultTable = new sql.Table("exams_result");
        examsResultTable.create = true;
        examsResultTable.columns.add('id', sql.NVarChar(50), { nullable: false });
        examsResultTable.columns.add('organization_id', sql.NVarChar(50), { nullable: false });
        examsResultTable.columns.add('student_id', sql.NVarChar(255), { nullable: false });
        examsResultTable.columns.add('student_name', sql.NVarChar(255), { nullable: false });
        examsResultTable.columns.add('department_name', sql.NVarChar(255), { nullable: false });
        examsResultTable.columns.add('total_marks', sql.Numeric, { nullable: false });
        examsResultTable.columns.add('out_of', sql.Numeric, { nullable: false });
        examsResultTable.columns.add('exam_date', sql.NVarChar(255), { nullable: false });
        return examsResultTable;
    }

    static getThemesTable() {
        const userThemes = new sql.Table("users_theme");
        userThemes.create = true;
        userThemes.columns.add('id', sql.NVarChar(50), { nullable: false });
        userThemes.columns.add('user_id', sql.NVarChar(50), { nullable: false });
        userThemes.columns.add('theme_color', sql.NVarChar(50), { nullable: false });
        return userThemes;
    }

}

module.exports = Tables;