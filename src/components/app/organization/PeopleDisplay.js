import React, {forwardRef, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import MaterialTable from "material-table";
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
import Box from "@material-ui/core/Box";

const axios = require('axios')

const useStyles = makeStyles(theme => ({
    peoplePaper: {
        marginTop: theme.spacing(2)
    },
    unapprovedContainer: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
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


export default function PeopleDisplay(props) {
    const classes = useStyles()
    const {orgId} = useParams()

    const [eventCategories, setEventCategories] = useState(null)
    const [userBarDetails, setUserBarDetails] = useState(null)
    const [unapprovedUsers, setUnapprovedUsers] = useState(null)

    useEffect( () => {
        axios.get("/api/v1/organization/" + orgId + "/categories").then(resp => {
            console.log(resp)
            setEventCategories(resp.data)
        }).catch(resp => {
            console.log(resp)
            setEventCategories([])
        })
    }, [orgId])

    useEffect(() => {
        axios.get("/api/v1/organization/" + orgId + "/users/details").then(resp => {
            console.log("Bar Details:")
            console.log(resp)
            setUserBarDetails(resp.data)
        }).catch(resp => {
            console.log(resp)
            setUserBarDetails([])
        })
    }, [orgId])

    useEffect(() => {
        if(props.selfRole.permissions.includes("SUPERADMIN") || props.selfRole.permissions.includes("canManageUsers")) {
            axios.get("/api/v1/organization/" + orgId + "/users/unapproved").then(resp => {
                console.log("Unapproved Users:")
                console.log(resp)
                setUnapprovedUsers(resp.data)
            }).catch(resp => {
                console.log(resp)
                setUnapprovedUsers([])
            })
        }
        else {
            setUnapprovedUsers([])
        }
    }, [orgId, props.selfRole.permissions])

    const handleApprove = (userId) => {
        axios.post("/api/v1/organization/" + orgId + "/users/" + userId + "/approve").then(resp => {
            console.log(resp)
            axios.get("/api/v1/organization/" + orgId + "/users/unapproved").then(resp => {
                console.log(resp)
                setUnapprovedUsers(resp.data)
            }).catch(resp => {
                console.log(resp)
            })
        }).catch(resp => {
            console.log(resp)
        })
    }

    if (eventCategories === null || userBarDetails === null || unapprovedUsers === null) {
        return (
            <>
            </>
        )
    }

    else {
        return (
            <>
                <Typography variant={"h6"}>People</Typography>
                <Paper className={classes.peoplePaper}>
                    <MaterialTable
                        icons={tableIcons}
                        options={{
                            showTitle: false
                        }}
                        columns={eventCategories.length > 0 ? [
                            {title: "Name", field: "name"},
                            {title: "Bar", field: "score"}
                        ].concat(eventCategories.map((category) => {
                            return category.requiredFor.length === 0 ? {title: category.name, field: category.name} : null
                        }).filter(function(val) {return val !== null})) : [{title: "Name", field: "name"}]}
                        data={userBarDetails.map((barDetails) => {
                            let data = {
                                name: barDetails.user.firstName + " " + barDetails.user.lastName,
                                score: barDetails.score
                            }

                            eventCategories.forEach(category => {
                                barDetails.flags.forEach(flag => {
                                    console.log("Category: " + category.name + ", Flag: " + flag.category.name)
                                    if (flag.category.name === category.name) {
                                        if (flag.completed === true) {
                                            data[category.name] = "Complete"
                                        }
                                        else {
                                            data[category.name] = "Incomplete"
                                        }
                                    }
                                })
                            })

                            return data
                        })}/>
                </Paper>
                {props.selfRole.permissions.includes("SUPERADMIN") || props.selfRole.permissions.includes("canManageUsers")?
                <Box className={classes.unapprovedContainer}>
                    <Typography variant={"h6"}>Unapproved Users</Typography>

                        {unapprovedUsers.length < 1 ?
                        <>
                            <Typography>No unapproved users to show.</Typography>
                        </> :
                        <>
                            <Paper className={classes.peoplePaper}>
                                <MaterialTable
                                    icons={tableIcons}
                                    options={{
                                        showTitle: false
                                    }}
                                    columns={[{title: "Name", field: "name"}, {title:"Actions", field: "actions"}]}
                                    data={unapprovedUsers.map((user) => {
                                        return {
                                            name: user.firstName + " " + user.lastName,
                                            actions: <><Check onClick={(event) => {
                                                handleApprove(user.id)
                                            }}/><DeleteOutline/></>
                                        }
                                    })}/>
                                </Paper>
                        </>}

                </Box>: <></>}
            </>
        )
    }
}