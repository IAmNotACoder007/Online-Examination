import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AddQuestions from './AddQuestionsPage';
import Departments from './DepartmentPage';
import '../../styles/admin/AdminPage.css'
import UpdateQuestionOptions from './UpdateQuestionsOptions';
import ManageAdmins from '../organization/ManageAdminsPage'


class AdminPage extends Component {
    state = {
        value: 0,
    };
    handleChange = (event, value) => {
        this.setState({ value });
    };
    renderTabContent = () => {
        const { value } = this.state;
        switch (value) {
            case 0:
                return <Departments />
            case 1:
                return <AddQuestions />
            case 2:
                return <UpdateQuestionOptions />
            case 3:
                return <TabContainer>Item four</TabContainer>
            case 4:
                return <ManageAdmins />
            default:
                return (
                    <div>Sorry, page not found</div>
                )
        }

    }

    getTabsWithOrganizationsPermission = () => {
        if (this.props.isOrganization)
            return (<Tab label="Manage Admins" />)
    }
    render() {
        const theme = createMuiTheme({
            palette: {
                primary: {
                    light: '#90CAF9',
                    main: '#2196F3',
                    dark: '#1E88E5',
                    contrastText: '#fff'
                }

            }
        });
        return (
            <content className="admin-page-main-container">
                <div style={{ padding: "25px" }}>
                    <MuiThemeProvider theme={theme}>
                        <Paper>
                            <Tabs
                                value={this.state.value}
                                onChange={this.handleChange}
                                indicatorColor="primary"
                                textColor="primary"
                                centered
                            >
                                <Tab label="Manage Departments" />
                                <Tab label="Add Questions/Options" />
                                <Tab label="Edit/Delete Questions/Options" />
                                <Tab label="Setting" />
                                {this.getTabsWithOrganizationsPermission()}
                            </Tabs>
                        </Paper>
                        {this.renderTabContent()}
                    </MuiThemeProvider>
                </div>
            </content>

        )
    }
}

function TabContainer(props) {
    return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
            {props.children}
        </Typography>
    );
}

export default AdminPage;