import React, {useState, useEffect} from 'react';
import {forwardRef} from 'react';
import makeStyles from "@material-ui/core/styles/makeStyles";
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import MaterialTable from "material-table";
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import Link from "@material-ui/core/Link";

const axios = require('axios')

const useStyles = makeStyles(theme => ({
    tableContainer: {
        width: "100%",
        display:"flex",
        alignItems: "center",
        justifyContent: "center"
    },
    table: {
        width: "80%"
    },
    addButton: {
        margin: theme.spacing(1)
    },
    leftAddField: {
        marginRight: theme.spacing(2)
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

export default function SchoolManager(props) {
    const classes = useStyles()
    const [schoolData, setSchoolData] = useState(null)
    const [showingAddDialog, setShowingAddDialog] = useState(false)
    const [addSchoolName, setAddSchoolName] = useState("")
    const [addSchoolRefId, setAddSchoolRefId] = useState("")
    const [editSchoolId, setEditSchoolId] = useState(null)
    const [editSchoolName, setEditSchoolName] = useState(null)
    const [editSchoolRefId, setEditSchoolRefId] = useState(null)
    const [showingEditDialog, setShowingEditDialog] = useState(false)
    const [deleteSchoolId, setDeleteSchoolId] = useState(null)
    const [deleteSchoolName, setDeleteSchoolName] = useState(null)
    const [deleteSchoolRefId, setDeleteSchoolRefId] = useState(null)
    const [showingDeleteDialog, setShowingDeleteDialog] = useState(false)

    useEffect(() => {
        axios.get("/api/v1/school/get-all").then(resp => {
            console.log(resp.data)
            setSchoolData(resp.data)
        }).catch(resp => {
            console.log("Failed to get school data.")
        })
    }, [])

    const handleAddSchool = () => {
        let badForm = false
        const body = {
            name: addSchoolName,
            ref: addSchoolRefId
        }
        Object.values(body).forEach((val) => {
            if (val === "") {
                badForm = true
            }
        })
        if (badForm) {
            alert("You must fill in every field.")
        }
        else {
            axios.post("/api/v1/school/add", body).then(resp => {
                console.log(resp)
                axios.get("/api/v1/school/get-all").then(resp => {
                    console.log(resp.data)
                    setSchoolData(resp.data)
                }).catch(resp => {
                    console.log("Failed to get school data.")
                })
                setShowingAddDialog(false)
            }).catch(resp => {
                console.log(resp)
            })
        }
    }

    const startEditing = (schoolId, schoolName, schoolRefId) => {
        setEditSchoolId(schoolId)
        setEditSchoolName(schoolName)
        setEditSchoolRefId(schoolRefId)
        setShowingEditDialog(true)
    }

    const startDeleting = (schoolId, schoolName, schoolRefId) => {
        setDeleteSchoolId(schoolId)
        setDeleteSchoolName(schoolName)
        setDeleteSchoolRefId(schoolRefId)
        setShowingDeleteDialog(true)
    }

    const handleEditSchool = () => {
        let badForm = false
        const body = {
            id: editSchoolId,
            name: editSchoolName,
            ref: editSchoolRefId
        }
        Object.values(body).forEach((val) => {
            if (val === "") {
                badForm = true
            }
        })
        if (badForm) {
            alert("You must fill in every field.")
        }
        else {
            axios.post("/api/v1/school/edit", body).then(resp => {
                console.log(resp)
                axios.get("/api/v1/school/get-all").then(resp => {
                    console.log(resp.data)
                    setSchoolData(resp.data)
                }).catch(resp => {
                    console.log("Failed to get school data.")
                })
                setShowingEditDialog(false)
            }).catch(resp => {
                console.log("Failed to edit school.")
            })
        }
    }

    const handleDeleteSchool = () => {
        axios.post("/api/v1/school/" + deleteSchoolId + "/delete").then(resp => {
            console.log(resp)
            axios.get("/api/v1/school/get-all").then(resp => {
                console.log(resp.data)
                setSchoolData(resp.data)
            }).catch(resp => {
                console.log("Failed to get school data.")
            })
            setShowingDeleteDialog(false)
        }).catch(resp => {
            console.log("Failed to delete school.")
        })
    }

    return (
        <>
            <Box className={classes.tableContainer}>
                <Paper style={{minWidth: "80%"}}>
                    <MaterialTable
                        components={{Container: props => props.children}}
                        icons={tableIcons}
                        title="Schools"
                        columns={[
                        {title: "School", field: "name"},
                        {title: "Ref ID", field: "ref"},
                        {title: "Edit", field: "edit"},
                        {title: "Delete", field:"delete"}
                    ]} data={schoolData == null ? [{}] : schoolData.map(school => {
                        return {name: school.name,
                                ref: school.ref,
                                edit: <Link style={{cursor: "pointer"}} onClick={(event) => {startEditing(school.id, school.name, school.ref)}}><Edit/></Link>,
                                delete: <Link style={{cursor: "pointer"}} onClick={(event) => {startDeleting(school.id, school.name, school.ref)}}><DeleteOutline/></Link>}}
                                )
                    } />
                    <Button
                        className={classes.addButton}
                        color="primary"
                        variant="contained"
                        onClick={(event) => {setShowingAddDialog(true)}}>
                        Add School
                    </Button>
                </Paper>

                <Dialog open={showingAddDialog} onClose={(event) => {setShowingAddDialog(false)}}>
                    <DialogTitle>Add School</DialogTitle>
                    <DialogContent>
                        <DialogContentText>Enter school information: </DialogContentText>
                        <TextField
                            className={classes.leftAddField}
                            variant="filled"
                            margin="dense"
                            id="addSchoolName"
                            label="School Name"
                            onChange={(event) => setAddSchoolName(event.target.value)}/>
                        <TextField
                            variant="filled"
                            margin="dense"
                            id="addSchoolRefId"
                            label="Ref ID"
                            onChange={(event) => setAddSchoolRefId(event.target.value)}/>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={(event) => {setShowingAddDialog(false)}} color="primary">Cancel</Button>
                        <Button onClick={(event) => {handleAddSchool()}} color="primary">Add School</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={showingEditDialog} onClose={(event) => {setShowingEditDialog(false)}}>
                    <DialogTitle>Edit School: {editSchoolName}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>Change school information: </DialogContentText>
                        <TextField
                            className={classes.leftAddField}
                            variant="filled"
                            margin="dense"
                            id="editSchoolName"
                            label="School Name"
                            value={editSchoolName}
                            onChange={(event) => setEditSchoolName(event.target.value)}/>
                        <TextField
                            variant="filled"
                            margin="dense"
                            id="editSchoolRefId"
                            label="Ref ID"
                            value={editSchoolRefId}
                            onChange={(event) => setEditSchoolRefId(event.target.value)}/>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={(event) => {setShowingEditDialog(false)}} color="primary">Cancel</Button>
                        <Button onClick={(event) => {handleEditSchool()}} color="primary">Change School</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={showingDeleteDialog} onClose={(event) => {setShowingDeleteDialog(false)}}>
                    <DialogTitle>Delete School: {deleteSchoolName}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>Are you sure you want to delete {deleteSchoolName}</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={(event) => {handleDeleteSchool()}} color="primary">Yes</Button>
                        <Button onClick={(event) => {setShowingEditDialog(false)}} color="primary">Cancel</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </>
    )
}