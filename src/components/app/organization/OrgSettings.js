import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box"
import Paper from "@material-ui/core/Paper"
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import makeStyles from "@material-ui/core/styles/makeStyles";
import MaterialTable from "material-table";

const axios = require('axios')

const useStyles = makeStyles(theme => ({
    settingsContainer: {
        display:"flex",
        marginTop: theme.spacing(2),
        justifyContent: "center"
    },
    settingsPaper: {
        width:"60%",
        padding: theme.spacing(3)
    }
}))

export default function OrgSettings() {
    const classes = useStyles()
    const {orgId} = useParams()

    const [eventCategories, setEventCategories] = useState(null)
    const [roles, setRoles] = useState([])
    const [showingAddCategoryDialog, setShowingAddCategoryDialog] = useState(false)
    const [addCategoryName, setAddCategoryName] = useState("")
    const [addCategoryPenalty, setAddCategoryPenalty] = useState(0)
    const [addRequiredForChecked, setAddRequiredForChecked] = useState([])

    useEffect(() => {
        axios.get("/api/v1/organization/" + orgId + "/categories").then(resp => {
            console.log(resp)
            setEventCategories(resp.data)
        }).catch(resp => {
            console.log(resp)
        })
        axios.get("/api/v1/organization/" + orgId + "/roles").then(resp => {
            console.log(resp)
            setRoles(resp.data)

        }).catch(resp => {
            console.log(resp)
        })
    }, [orgId])

    useEffect(() => {
        setAddRequiredForChecked(roles.map((role) => (
            {role: role, checked: false}
        )))
    }, [roles])

    const isCheckedForRole = (role) => {
        console.log("Add Required for Checked:")
        console.log(addRequiredForChecked)
        return addRequiredForChecked.filter(arrRole => arrRole.role === role).checked
    }

    const handleRequiredForCheck = (role) => {
        console.log("Add Required for Checked:")
        console.log(addRequiredForChecked)
        addRequiredForChecked.find(arrRole => arrRole.role === role)
            .checked = !addRequiredForChecked.find(arrRole => arrRole.role === role).checked
    }

    const handleAddCategory = () => {
        let badForm = false

        let requiredRoleIds = []
        addRequiredForChecked.forEach(obj => {
            if (obj.checked) {
                requiredRoleIds.push(obj.role.id)
            }
        })
        const body = {
            name: addCategoryName,
            penalty: addCategoryPenalty,
            requiredRoleIds: requiredRoleIds
        }
        Object.values(body).forEach((val) => {
            if (val === "") {
                badForm = true
            }
        })
        if (badForm) {
            alert("You must fill in every field.")
        }
        axios.post("/api/v1/organization/"+ orgId + "/categories/add", body).then(resp => {
            console.log(resp)
            axios.get("/api/v1/organization/" + orgId + "/categories").then(resp => {
                console.log(resp)
                setEventCategories(resp.data)
            }).catch(resp => {
                console.log(resp)
            })
            setShowingAddCategoryDialog(false)
        }).catch(resp => {
            console.log(resp)
        })
    }

    return (
        <>
            <Typography variant={"h6"}>Organization Settings</Typography>
            <Box className={classes.settingsContainer}>
                <Paper className={classes.settingsPaper}>
                    <i>Event Categories</i>
                    <MaterialTable
                        components={{Container: props => props.children}}
                        options={{
                            search: false,
                            paging: false,
                            showTitle: false,
                            toolbar: false
                        }}
                        columns={[
                            {title: "Category", field: "name"},
                            {title: "Penalty", field: "penalty"},
                            {title: "Required For", field: "requiredFor"}
                        ]}
                        data={eventCategories === null ? [{}] : eventCategories.map(eventCategory => {
                            return {
                                name: eventCategory.name,
                                penalty: eventCategory.penalty,
                                requiredFor: eventCategory.requiredFor.map(e => e.name).join(", ")
                            }
                        })}/>
                    <Button variant="contained" color="primary"
                            onClick={(event) => setShowingAddCategoryDialog(true)}>Add Category</Button>
                    <br/><i>Roles</i>
                    <MaterialTable
                        components={{Container: props => props.children}}
                        options={{
                            search: false,
                            paging: false,
                            showTitle: false,
                            toolbar: false
                        }}
                        columns={[
                            {title: "Role", field: "name"},
                            {title: "Permissions", field: "permissions"},
                            {title: "Actions", field: "actions"}
                        ]}
                        data={eventCategories === null ? [{}] : roles.map(role => {
                            return {
                                name: role.name,
                                permissions: role.permissions.join(", "),
                                actions: ""
                            }
                        })}/>
                </Paper>
            </Box>
            <Dialog open={showingAddCategoryDialog} onClose={(event) => {
                setShowingAddCategoryDialog(false)
            }}>
                <DialogTitle>New Event Category</DialogTitle>
                <DialogContent>
                    <Box>
                        <TextField
                            variant="filled"
                            margin="dense"
                            id="addCategoryName"
                            label="Name"
                            value={addCategoryName}
                            onChange={(event) => {
                                setAddCategoryName(event.target.value)
                            }}/>
                    </Box>
                    <Box>
                        <TextField
                            variant="filled"
                            margin="dense"
                            id="addCategoryPenalty"
                            label="Penalty"
                            type="number"
                            value={addCategoryPenalty}
                            onChange={(event) => {
                                setAddCategoryPenalty(event.target.value)
                            }}/>
                    </Box>
                    <Box>
                        Required for:<br/>
                        {roles.map((role) => (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={isCheckedForRole(role)}
                                        onChange={(event) => {
                                            handleRequiredForCheck(role)
                                        }}/>
                                }
                                label={role.name}
                            />
                        ))}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={(event) => {setShowingAddCategoryDialog(false)}} color="primary">Cancel</Button>
                    <Button onClick={(event) => {handleAddCategory()}} color="primary">Add</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}