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


export default function EventDisplay(props) {
    const classes = useStyles()
    const {orgId} = useParams()

    const[openEvents, setOpenEvents] = useState(null)
    const[upcomingEvents, setUpcomingEvents] = useState(null)
    const[pastEvents, setPastEvents] = useState(null)
    const[showingSignInDialog, setShowingSignInDialog] = useState(false)
    const[signInEvent, setSignInEvent] = useState("")
    const[signInSecret, setSignInSecret] = useState("")
    const[signInSuccess, setSignInSuccess] = useState(false)
    const[signInError, setSignInError] = useState(false)
    const[signInErrorText, setSignInErrorText] = useState("")
    const[showingAttendanceDialog, setShowingAttendanceDialog] = useState(false)
    const[attendanceEvent, setAttendanceEvent] = useState({name: "", attended: [], notAttended: []})
    const[attendanceChecked, setAttendanceChecked] = useState([])

    useEffect(() => {
        axios.get("/api/v1/organization/" + orgId + "/events/open").then(resp => {
            console.log(resp)
            setOpenEvents(resp.data)
        }).catch(resp => {
            console.log(resp)
            setOpenEvents([])
        })
    }, [props.selfRole, orgId])

    useEffect(() => {
        axios.get("/api/v1/organization/" + orgId + "/events/upcoming").then(resp => {
            console.log(resp)
            setUpcomingEvents(resp.data)
        }).catch(resp => {
            console.log(resp)
            setUpcomingEvents([])
        })
    }, [props.selfRole, orgId])

    useEffect(() => {
        axios.get("/api/v1/organization/" + orgId + "/events/past").then(resp => {
            console.log(resp)
            setPastEvents(resp.data)
        }).catch(resp => {
            console.log(resp)
            setPastEvents([])
        })
    }, [props.selfRole, orgId])

    const handleOpenSignInDialog = (ev) => {
        setSignInEvent(ev)
        setShowingSignInDialog(true)
    }
    const handleCloseSignInDialog = () => {
        setSignInEvent("")
        setSignInSecret("")
        setSignInError(false)
        setSignInSuccess(false)
        setSignInErrorText("")
        setShowingSignInDialog(false)
    }

    const handleSignIn = () => {
        axios.post("/api/v1/organization/" + orgId + "/events/" + signInEvent.id + "/sign-in?secret=" + signInSecret).then(resp => {
            console.log(resp)
            setSignInSuccess(true)
        }).catch(resp => {
            console.log(resp)
            setSignInError(true)
            setSignInErrorText(resp.response.statusText)
        })
    }

    const handleApprove = (evId) => {
        axios.post("/api/v1/organization/" + orgId + "/events/" + evId + "/approve").then(resp => {
            axios.get("/api/v1/organization/" + orgId + "/events/upcoming").then(resp => {
                console.log(resp)
                setUpcomingEvents(resp.data)
            }).catch(resp => {
                console.log(resp)
                setUpcomingEvents([])
            })}).catch(resp => {
                console.log(resp)
            })
    }

    const handleDeny = (evId) => {
        axios.post("/api/v1/organization/" + orgId + "/events/" + evId + "/deny").then(resp => {
            axios.get("/api/v1/organization/" + orgId + "/events/upcoming").then(resp => {
                console.log(resp)
                setUpcomingEvents(resp.data)
            }).catch(resp => {
                console.log(resp)
                setUpcomingEvents([])
            })}).catch(resp => {
            console.log(resp)
        })
    }

    const handleOpenAttendanceDialog = (ev) => {
        setAttendanceEvent(ev)
        ev.attended.forEach((user) => {
            user.checked = true
            attendanceChecked.push(user)
        })
        ev.notAttended.forEach((user) => {
            user.checked = false
            attendanceChecked.push(user)
        })
        setShowingAttendanceDialog(true)
    }

    const handleCloseAttendanceDialog = () => {
        setAttendanceEvent({name: "", attended: [], notAttended: []})
        setAttendanceChecked([])
        setShowingAttendanceDialog(false)
    }

    const isCheckedForUser = (user) => {
        console.log("Is checked for " + user.lastName + ": " + attendanceChecked.find(arrUser => arrUser === user).checked)
        return attendanceChecked.find(arrUser => arrUser === user).checked
    }

    const handleAttendanceCheck = (user) => {
        let newAttendanceChecked = attendanceChecked.slice()
        newAttendanceChecked.find(arrUser => arrUser === user)
            .checked = !attendanceChecked.find(arrUser => arrUser === user).checked
        setAttendanceChecked(newAttendanceChecked)
    }

    const handleEditAttendance = () => {
        const attendedUsers = attendanceChecked.filter(user => {
            return user.checked
        })
        const attendedIds = []
        attendedUsers.forEach(user => {
            attendedIds.push(user.id)
        })
        const notAttendedUsers = attendanceChecked.filter(user => {
            return !user.checked
        })
        const notAttendedIds = []
        notAttendedUsers.forEach(user => {
            notAttendedIds.push(user.id)
        })

        const body = {
            attendedIds: attendedIds,
            notAttendedIds: notAttendedIds
        }
        axios.post("/api/v1/organization/" + orgId + "/events/" + attendanceEvent.id + "/edit-attendance", body).then(resp => {
            console.log(resp)
        }).catch(resp => {
            console.log(resp)
        })
    }

    if(openEvents === null || upcomingEvents === null || pastEvents === null){
        return(
            <></>
        )
    }
    else {
        return (
            <>
                <Typography variant={"h6"}>Open Events</Typography>
                {openEvents.length < 1 ?
                    <>
                        <Typography>No open events to show.</Typography>
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
                                    {title: "Category", field: "category"},
                                    {title: "Points", field: "points"},
                                    {title: "Close Time", field: "closeTime", defaultSort: "asc"}].concat(
                                    props.selfRole.permissions.includes("SUPERADMIN") || props.selfRole.permissions.includes("canManangeEvents")? [{title: "Secret", field: "secret"}]:[]
                                ).concat([{title: "Actions", field: "actions"}])}
                                data={openEvents.map((ev) => {
                                    return {
                                        name: ev.name,
                                        category: ev.category.name,
                                        points: ev.value,
                                        closeTime: new Date(ev.closeTime).toLocaleString(),
                                        secret: ev.secret,
                                        actions: <Button color="primary" variant="contained" onClick={(event) => {handleOpenSignInDialog(ev)}}>Sign In</Button>
                                    }
                                })}/>
                        </Paper>
                    </>}
                    <Typography variant={"h6"}>Upcoming Events</Typography>
                    {upcomingEvents.length < 1 ?
                        <>
                            <Typography>No upcoming events to show.</Typography>
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
                                        {title: "Category", field: "category"},
                                        {title: "Points", field: "points"},
                                        {title: "Start Time", field: "startTime", defaultSort: "asc"},
                                        {title: "Approved", field: "approved"}].concat(
                                        props.selfRole.permissions.includes("SUPERADMIN") || props.selfRole.permissions.includes("canManangeEvents")? [{title: "Secret", field: "secret"}, {title: "Actions", field: "actions"}]:[]
                                    )}
                                    data={upcomingEvents.map((ev) => {
                                        return {
                                            name: ev.name,
                                            category: ev.category.name,
                                            points: ev.value,
                                            startTime: new Date(ev.startTime).toLocaleString(),
                                            approved: ev.approvedBy === null ? "No" : "Yes",
                                            secret: ev.secret,
                                            actions: ev.approvedBy === null ? <><Check onClick={(event) => {
                                                handleApprove(ev.id)
                                            }}/><DeleteOutline onClick={(event) => {handleDeny(ev.id)}}/><Edit/></> : <><Edit/></>
                                        }
                                    })}/>
                            </Paper>
                        </>}
                <Typography variant={"h6"}>Past Events</Typography>
                {pastEvents.length < 1 ?
                    <>
                        <Typography>No past events to show.</Typography>
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
                                    {title: "Category", field: "category"},
                                    {title: "Points", field: "points"},
                                    {title: "Start Time", field: "startTime", defaultSort: "desc"},
                                    {title: "Close Time", field: "closeTime"}].concat(
                                    props.selfRole.permissions.includes("SUPERADMIN") || props.selfRole.permissions.includes("canManangeEvents")? [{title: "Actions", field: "actions"}]:[]
                                )}
                                data={pastEvents.map((ev) => {
                                    return {
                                        name: ev.name,
                                        category: ev.category.name,
                                        points: ev.value,
                                        startTime: new Date(ev.startTime).toLocaleString(),
                                        closeTime: new Date(ev.closeTime).toLocaleString(),
                                        actions: <Button color="primary" variant="contained" onClick={(event) => {handleOpenAttendanceDialog(ev)}}>Attendance</Button>
                                    }
                                })}/>
                        </Paper>
                    </>}


                    <Dialog open={showingSignInDialog} onClose={(event) => {handleCloseSignInDialog()}}>
                        <DialogTitle>{signInEvent.name}</DialogTitle>
                        {signInSuccess ?
                            <>
                                <DialogContent>
                                    <DialogContentText>Success!</DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={(event) => {handleCloseSignInDialog()}} color="primary">Close</Button>
                                </DialogActions>
                            </> : signInError ?
                            <>
                                <DialogContent>
                                    <DialogContentText>Error:<br/><br/>{signInErrorText}</DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={(event) => {handleCloseSignInDialog()}} color="primary">Close</Button>
                                </DialogActions>
                            </> :
                            <>
                                <DialogContent>
                                    <DialogContentText>Enter secret:</DialogContentText>
                                    <TextField
                                        variant="filled"
                                        margin="dense"
                                        id="secret"
                                        label="Secret"
                                        onCheck={(event) => setSignInSecret(event.target.value)}/>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={(event) => {handleCloseSignInDialog()}} color="primary">Cancel</Button>
                                    <Button onClick={(event) => {handleSignIn()}} color="primary">Submit</Button>
                                </DialogActions>
                            </>}
                    </Dialog>
                    <Dialog open={showingAttendanceDialog} onClose={(event) => {handleCloseAttendanceDialog()}}>
                        <DialogTitle>{attendanceEvent.name}</DialogTitle>
                        {props.selfRole.permissions.includes("SUPERADMIN") || props.selfRole.permissions.includes("canManangeEvents")?
                            <>
                                <DialogContent>
                                    {attendanceEvent.attended.concat(attendanceEvent.notAttended).sort(function(x, y) {
                                        if(x.lastName < y.lastName) {
                                            return -1
                                        }
                                        if(x.lastName > y.lastName) {
                                            return 1
                                        }
                                        return 0
                                    }).map((user) => (
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={isCheckedForUser(user)}
                                                    onChange={(event) => {
                                                        console.log(event.target.checked)
                                                        handleAttendanceCheck(user)
                                                        event.target.checked = !event.target.checked
                                                    }}/>
                                            }
                                            label={user.firstName + " " + user.lastName}
                                        />
                                    ))}
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={(event) => {handleCloseAttendanceDialog()}} color="primary">Cancel</Button>
                                    <Button onClick={(event) => {handleEditAttendance()}} color="primary">Save</Button>
                                </DialogActions>
                            </>:
                            <>
                            </>}
                    </Dialog>
            </>
        )
    }
}