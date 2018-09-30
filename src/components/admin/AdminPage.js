import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import AddQuestions from './AddQuestionsPage';
import Departments from './DepartmentPage';
import '../../styles/admin/AdminPage.css'
import UpdateQuestionOptions from './UpdateQuestionsOptions';
import ManageAdmins from '../organization/ManageAdminsPage'
import ExamsDetails from './ExamsDetails';
import Settings from './SettingsPage';
import { subscribeToEvent } from '../../Api';
import Dialog from '../../material_components/Dialog';
import Button from '../../material_components/ActionButton';
import InfoIcon from '@material-ui/icons/InfoOutline';

class AdminPage extends Component {
    constructor(props) {
        super(props);
        subscribeToEvent("themeUpdated", (data) => {
            sessionStorage.setItem('theme', JSON.parse(data).theme);
            this.setState({ reload: true });
        });
    }
    state = {
        value: 0,
        reload: false
    };

    handleChange = (event, value) => {
        this.setState({ value });
    };
    renderTabContent = () => {
        const { value } = this.state;
        switch (value) {
            case 0:
                return <Departments organizationId={this.props.organizationId} />
            case 1:
                return <AddQuestions organizationId={this.props.organizationId} />
            case 2:
                return <UpdateQuestionOptions organizationId={this.props.organizationId} />
            case 3:
                return <Settings organizationId={this.props.organizationId}></Settings>
            case 4:
                return <ExamsDetails organizationId={this.props.organizationId} />
            case 5:
                return <ManageAdmins organizationId={this.props.organizationId} />
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
    closeDialog = () => {
        this.setState({ reload: false });
    }

    reloadPage = () => {
        window.location.reload();
        this.closeDialog();
    }

    getDialogContent() {
        return (

            <div style={{display:'flex',alignItems:'center'}}>
                <InfoIcon style={{ height: "60px", width: '60px' }} color="action"></InfoIcon>
                You portal theme has been changed, do you want to reload the page?
            </div>
        )
    }
    getDialogButtons() {
        return (
            <div>
                <Button text="yes" onClick={this.reloadPage} flatButton={true}></Button>
                <Button text="No" onClick={this.closeDialog} flatButton={true}></Button>
            </div>
        )
    }
    render() {
        const theme = createMuiTheme({
            palette: {
                primary: {
                    ...this.props.theme
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
                                <Tab label="Exams" />
                                {this.getTabsWithOrganizationsPermission()}
                            </Tabs>
                        </Paper>
                        {this.renderTabContent()}
                    </MuiThemeProvider>
                </div>
                <Dialog isAlertDialog={true} isOpen={this.state.reload} dialogButtons={this.getDialogButtons()} dialogContent={this.getDialogContent()}></Dialog>
            </content>

        )
    }

}


export default AdminPage;