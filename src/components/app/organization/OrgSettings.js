import React, {forwardRef, useEffect, useState} from 'react';
import makeStyles from "@material-ui/core/styles/makeStyles";
import AddBox from "@material-ui/icons/AddBox";
import Check from "@material-ui/icons/Check";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Edit from "@material-ui/icons/Edit";
import SaveAlt from "@material-ui/icons/SaveAlt";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import Search from "@material-ui/icons/Search";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Remove from "@material-ui/icons/Remove";
import ViewColumn from "@material-ui/icons/ViewColumn";
import {useParams} from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import MaterialTable from "material-table";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

const axios = require('axios')

const useStyles = makeStyles(theme => ({
    peoplePaper: {
        marginTop: theme.spacing(2)
    }
}))

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};


export default function OrgSettings(props) {
    const classes = useStyles()
    const {orgId} = useParams()

    const[categories, setCategories] = useState(null)
    const[roles, setRoles] = useState(null)
    const[showingNewCategoryDialog, setShowingNewCategoryDialog] = useState(false)
    const[newCategoryName, setNewCategoryName] = useState("")
    const[newCategoryPenalty, setNewCategoryPenalty] = useState(0)
    const[newCategoryRequiredForAll, setNewCategoryRequiredForAll] = useState(false)
    const[newCategoryRequiredForChecked, setNewCategoryRequiredForChecked] = useState([])
    const[showingNewRoleDialog, setShowingNewRoleDialog] = useState(false)
    const[newRoleName, setNewRoleName] = useState("")
    const[newRolePermissionsChecked, setNewRolePermissionsChecked] = useState([
        {permission: "canManageEvents", label: "Manage Events", checked: false}
        ])

    useEffect(() => {
        axios.get("/api/v1/organization/" + orgId + "/categories").then(resp => {
            console.log(resp)
            setCategories(resp.data)
        }).catch(resp => {
            console.log(resp)
            setCategories([])
        })
    }, [orgId])

    useEffect(() => {
        axios.get("/api/v1/organization/" + orgId + "/roles").then(resp => {
            console.log(resp)
            setRoles(resp.data)
        }).catch(resp => {
            console.log(resp)
            setRoles([])
        })
    }, [orgId])

    const handleOpenNewCategoryDialog = () => {
        let newCatArray = []
        roles.forEach((role) => {
            role.checked = false
            newCatArray.push(role)
        })
        setNewCategoryRequiredForChecked(newCatArray)
        setShowingNewCategoryDialog(true)
    }

    const handleCloseNewCategoryDialog = () => {
        setNewCategoryRequiredForChecked([])
        setNewCategoryName("")
        setNewCategoryPenalty(0)
        setNewCategoryRequiredForAll(false)
        setShowingNewCategoryDialog(false)
    }

    const isCheckedForRole = (role) => {
        return newCategoryRequiredForChecked.find(arrRole => arrRole === role).checked
    }

    const handleRoleCheck = (role) => {
        let newCatArray = newCategoryRequiredForChecked.slice()
        newCatArray.find(arrRole => arrRole === role)
            .checked = !newCategoryRequiredForChecked.find(arrRole => arrRole === role).checked
        setNewCategoryRequiredForChecked(newCatArray)
    }

    const handleAddEventCategory = () => {
        let requiredFor = newCategoryRequiredForChecked.filter(role => {return role.checked})
        let requiredForIds = []
        requiredFor.forEach(role => {
            requiredForIds.push(role.id)
        })
        const body = {
            name: newCategoryName,
            penalty: newCategoryPenalty,
            requiredForAll: newCategoryRequiredForAll,
            requiredRoleIds: requiredForIds
        }
        axios.post("/api/v1/organization/" + orgId + "/categories/add", body).then(resp => {
            console.log(resp)
        }).catch(resp => {
            console.log(resp)
        })
    }

    const handleOpenNewRoleDialog = () => {
        setShowingNewRoleDialog(true)
    }

    const handleCloseNewRoleDialog = () => {
        setShowingNewRoleDialog(false)
    }

    const isCheckedForPermission = (permission) => {
        return newRolePermissionsChecked.find(arrPerm => arrPerm === permission).checked
    }

    const handlePermissionCheck = (permission) => {
        let newPermArray = newRolePermissionsChecked.slice()
        newPermArray.find(arrPerm => arrPerm === permission)
            .checked = !newRolePermissionsChecked.find(arrPerm => arrPerm === permission).checked
        setNewRolePermissionsChecked(newPermArray)
    }

    const handleAddRole = () => {
        const body = {
            name: newRoleName,
            permissions: newRolePermissionsChecked.filter(permission => permission.checked).map(permission => permission.permission)
        }
        axios.post("/api/v1/organization/" + orgId + "/roles/add", body).then(resp => {
            console.log(resp)
        }).catch(resp => {
            console.log(resp)
        })
    }

    if(categories === null || roles === null){
        return(
            <></>
        )
    }
    else {
        return (
            <>
                <Typography variant={"h6"}>Event Categories</Typography>
                <Button color="primary" variant="contained" onClick={(event) => {handleOpenNewCategoryDialog()}}>Add Category</Button>
                {categories.length < 1 ?
                    <>
                        <Typography>No categories to show.</Typography>
                    </> :
                    <>
                        <Paper className={classes.peoplePaper}>
                            <MaterialTable
                                icons={tableIcons}
                                options={{
                                    showTitle: false
                                }}
                                columns={[
                                    {title: "Name", field: "name"},
                                    {title: "Penalty", field: "penalty"},
                                    {title: "Required For", field: "requiredFor"}]}
                                data={categories.map((category) => {
                                    return {
                                        name: category.name,
                                        penalty: category.penalty,
                                        requiredFor: (category.requiredForAll ? "Everyone" : category.requiredFor.length < 1 ? "None" :
                                        category.requiredFor.map(role => {return role.name}).join(", "))
                                    }
                                })}/>
                        </Paper>
                    </>}

                <Typography variant={"h6"}>Roles</Typography>
                <Button color="primary" variant="contained" onClick={(event) => {handleOpenNewRoleDialog()}}>Add Role</Button>
                {roles.length < 1 ?
                    <>
                        <Typography>No roles to show.</Typography>
                    </> :
                    <>
                        <Paper className={classes.peoplePaper}>
                            <MaterialTable
                                icons={tableIcons}
                                options={{
                                    showTitle: false
                                }}
                                columns={[
                                    {title: "Name", field: "name"},
                                    {title: "Permissions", field: "permissions"}]}
                                data={roles.map((role) => {
                                    return {
                                        name: role.name,
                                        permissions: role.permissions.join(", ")
                                    }
                                })}/>
                        </Paper>
                    </>}

                <Dialog open={showingNewCategoryDialog} onClose={(event) => {handleCloseNewCategoryDialog()}}>
                    <DialogTitle>New Event Category</DialogTitle>
                        <DialogContent>
                            <TextField
                                variant="filled"
                                margin="dense"
                                fullWidth
                                id="newCategoryName"
                                label="Category Name"
                                onChange={(event) => setNewCategoryName(event.target.value)}/>
                            <TextField
                                variant="filled"
                                margin="dense"
                                fullWidth
                                id="newCategoryPenalty"
                                label="Category Penalty"
                                onChange={(event) => setNewCategoryPenalty(parseInt(event.target.value))}/>
                            <DialogContentText>Require For Everyone:</DialogContentText>
                            <RadioGroup value={newCategoryRequiredForAll}>
                                <FormControlLabel value={true} control={<Radio onClick = {(event) => setNewCategoryRequiredForAll(true)}/>} label="Yes"/>
                                <FormControlLabel value={false} control={<Radio onClick = {(event) => setNewCategoryRequiredForAll(false)}/>} label="No"/>
                            </RadioGroup>
                            <DialogContentText>Required Roles:</DialogContentText>
                            {newCategoryRequiredForChecked.map((role) => (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={isCheckedForRole(role)}
                                            onChange={(event) => {
                                                handleRoleCheck(role)
                                            }}/>
                                    }
                                    label={role.name}
                                />
                            ))}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={(event) => {handleCloseNewCategoryDialog()}} color="primary">Cancel</Button>
                            <Button onClick={(event) => {handleAddEventCategory()}} color="primary">Save</Button>
                        </DialogActions>
                </Dialog>
                <Dialog open={showingNewRoleDialog} onClose={(event) => {handleCloseNewRoleDialog()}}>
                    <DialogTitle>New Role</DialogTitle>
                    <DialogContent>
                        <TextField
                            variant="filled"
                            margin="dense"
                            fullWidth
                            id="newRoleName"
                            label="Role Name"
                            onChange={(event) => setNewRoleName(event.target.value)}/>
                        <DialogContentText>Permissions:</DialogContentText>
                        {newRolePermissionsChecked.map(permission => (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={isCheckedForPermission(permission)}
                                        onChange={(event) => {handlePermissionCheck(permission)}}
                                        />
                                }
                                label={permission.label}/>
                        ))}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={(event) => {handleCloseNewRoleDialog()}} color="primary">Cancel</Button>
                        <Button onClick={(event) => {handleAddRole()}} color="primary">Save</Button>
                    </DialogActions>
                </Dialog>
            </>
        )
    }
}