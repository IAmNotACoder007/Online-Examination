import React, { Component } from 'react';
import PaperSheet from '../../material_components/PaperSheet';
import '../../styles/admin/DepartmentPageStyle.css';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import MaterialDialog from '../../material_components/Dialog';
import TextBox from '../../material_components/TextBox';
import ActionButton from '../../material_components/ActionButton';
import { subscribeToEvent, emitEvent } from '../../Api';
import { NotificationManager } from 'react-notifications';
import '../../../node_modules/react-notifications/dist/react-notifications.css';
import Tooltip from '@material-ui/core/Tooltip';

class Department extends Component {
    state = {
        hasDepartments: true,
        departments: [],
        isDialogOpen: false,
        hasValidation: false
    };
    constructor(props) {
        super(props);
        this.dialogButtons = {};
        this.dialogStyleClass = "department-dialog";
        this.dialogTitle = undefined;
        this.errorMessage = "Department name must be specified";
        this.openedDialog = undefined;
        this.currentlyEditingDepartment = undefined;
        this.isAlertDialog = false;

        this.getDialogButtons = (onSaveClick, saveButtonName = "Save") => {
            return (
                <div className="edit-dialog-buttons">
                    <ActionButton color="primary" text={saveButtonName} onClick={onSaveClick} flatButton={true} />
                    <ActionButton color="primary" text="Cancel" onClick={this.closeDialog} flatButton={true} />
                </div>
            )
        }

        this.getDialogContent = () => {
            switch (this.openedDialog) {
                case "Edit":
                    return (
                        <TextBox onChange={this.handleChange} defaultValue={this.currentlyEditingDepartment} errorMessage={this.errorMessage} error={this.state.hasValidation} required={true} id="departmentName" fieldName="departmentName" placeholder="Department Name" label="Department Name" />
                    )
                case "Add":
                    return (
                        <TextBox onChange={this.handleChange} rows="5" multiline={true} fullWidth={true} errorMessage={this.errorMessage} error={this.state.hasValidation} required={true} id="departmentName" fieldName="departmentName" placeholder="Put One Department Name Per Line" label="Department Name" />
                    )
                case "Delete":
                    return (
                        "Are you sure you want to delete this department?"
                    )

                default:
                    return (
                        <div>Content not found</div>
                    )
            }

        }

        this.closeDialog = () => {
            this.setState({ isDialogOpen: false, hasValidation: false });
        }

        this.editDepartment = (id, name) => {
            this.dialogButtons = this.getDialogButtons(() => {
                const departmentName = document.getElementById("departmentName").value.trim();
                if (this.hasValidMembers(departmentName)) {
                    emitEvent("saveDepartment", { id: id, department: departmentName });
                    subscribeToEvent("departmentSaved", (departments) => {
                        this.updateDepartments(JSON.parse(departments));
                        this.setState({ isDialogOpen: false });
                        NotificationManager.success('Department Saved.', 'Success');
                    });
                }
            });
            this.dialogTitle = "Edit Department";
            this.isAlertDialog = false;
            this.dialogStyleClass = "department-dialog edit-dialog";
            this.setState({ isDialogOpen: true });
            this.currentlyEditingDepartment = name;
            this.openedDialog = "Edit";
        }

        this.deleteDepartment = (id) => {
            this.dialogButtons = this.getDialogButtons(() => {
                emitEvent("deleteDepartment", { id: id });
                subscribeToEvent("departmentDeleted", (departments) => {
                    this.updateDepartments(JSON.parse(departments));
                    this.setState({ isDialogOpen: false });
                    NotificationManager.success('Department Deleted.', 'Success');
                });
            }, "Delete");
            this.dialogTitle = "Delete Department";
            this.isAlertDialog = true;
            this.dialogStyleClass = "department-dialog delete-dialog";
            this.setState({ isDialogOpen: true });
            this.openedDialog = "Delete";
        }

        this.addDepartment = () => {
            this.dialogButtons = this.getDialogButtons(() => {
                let departmentsName = document.getElementById("departmentName").value.trim();
                departmentsName = departmentsName ? departmentsName.split(/\n/) : undefined;
                if (this.hasValidMembers(departmentsName)) {
                    emitEvent("addNewDepartments", { departments: departmentsName, organizationId: this.props.organizationId });
                    subscribeToEvent("newDepartmentsAdded", (departments) => {
                        this.updateDepartments(JSON.parse(departments));
                        this.setState({ isDialogOpen: false });
                        NotificationManager.success('New Department Added.');
                    });
                }
            });
            this.dialogTitle = "Add Department";
            this.openedDialog = "Add";
            this.dialogStyleClass = "department-dialog add-dialog";
            this.isAlertDialog = false;
            this.setState({ isDialogOpen: true });
        }

        this.hasValidMembers = (members) => {
            if (!members || !members.length) {
                this.errorMessage = "Department name must be specified";
                this.setState({ hasValidation: true });
                return false;
            }
            var memberArr = members;
            if (!Array.isArray(memberArr)) {
                memberArr = [];
                memberArr.push(members);
            }
            const hasDuplicateMembers = memberArr.some((member, i) => {
                return memberArr.indexOf(member) !== i
            });

            if (hasDuplicateMembers) {
                this.errorMessage = "Department names must be unique";
                this.setState({ hasValidation: true });
                return false;
            }
            const existingDepartments = this.state.departments.map((department) => {
                return department.department_name
            })
            let departmentsAlreadyExist = memberArr.map((val) => {
                if (existingDepartments.includes(val)) return val;
            });
            departmentsAlreadyExist = departmentsAlreadyExist.filter(val => val)
            if (departmentsAlreadyExist.length) {
                this.errorMessage = `'${departmentsAlreadyExist.join(',')}' departments already exists`;
                this.setState({ hasValidation: true });
                return false;
            }
            return true;
        }

        this.handleChange = (fieldName, val) => {
            if (val && val.trim()) {
                this.setState({ hasValidation: false });
            }
        }

        this.getDepartmentsJsx = () => {
            if (this.state.hasDepartments) {
                return (
                    <div style={{ padding: '5px', paddingTop: '0' }}>{this.state.departments.map((department) => {
                        return (<div className="department" id={department.id} key={department.id}>
                            <text>{department.department_name}</text>
                            <IconButton onClick={() => { this.editDepartment(department.id, department.department_name) }}>
                                <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => { this.deleteDepartment(department.id) }}>
                                <DeleteIcon />
                            </IconButton></div>)
                    })}</div>
                )
            } else {
                return (
                    <div className="no-data-found">No Departments Found</div>
                )
            }
        }

        this.getDepartmentPaperContent = () => {
            return (
                <div className="department-content">
                    <main>
                        {this.getDepartmentsJsx()}
                    </main>
                    <footer>
                        <div className="add-button">
                            <Tooltip title="Add New Departments">
                                <Button onClick={this.addDepartment} variant="fab" color="primary" aria-label="add">
                                    <AddIcon />
                                </Button>
                            </Tooltip>
                        </div>
                    </footer>
                </div>
            )
        }

        this.updateDepartments = (departments) => {
            if (departments != null && departments.length > 0) {
                this.setState({ departments: departments });
            } else {
                this.setState({ hasDepartments: false });
            }
        }
    }

    render() {
        return (
            <div className="department-container" >
                <PaperSheet classes="department-page-paper" content={this.getDepartmentPaperContent()} />
                <MaterialDialog isAlertDialog={this.isAlertDialog} dialogTitle={this.dialogTitle} styleClass={this.dialogStyleClass} dialogContent={this.getDialogContent()} dialogButtons={this.dialogButtons} isOpen={this.state.isDialogOpen} />
            </div>
        )
    }

    componentWillMount() {
        fetch(`http://localhost:8080/getDepartments?organizationId=${this.props.organizationId}`)
            .then(res => res.json())
            .then((departments) => {
                this.updateDepartments(departments);
            });
    }
}

export default Department