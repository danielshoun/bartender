import React, {useEffect, useState} from 'react';
import {Route, Switch, Redirect, useHistory, useParams} from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import makeStyles from "@material-ui/core/styles/makeStyles";
import PeopleDisplay from "./PeopleDisplay";
import OrgSettings from "./OrgSettings";
import VotingDisplay from "./VotingDisplay";

const axios = require('axios')

const useStyles = makeStyles(theme => ({
    content: {
        flexGrow: 1,
        display: "flex"
    },
    headingContainer: {
        marginLeft: theme.spacing(4),
        marginRight: theme.spacing(4),
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(4),
        width: "80%"
    },
    headingText: {},
    tabContainer: {
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        width: "80%"
    },
    contentContainer: {
        marginLeft: theme.spacing(4),
        marginRight: theme.spacing(4),
        width: "80%"
    }
}))

export default function OrganizationMain(props) {
    const classes = useStyles()
    const history = useHistory()

    const {orgId} = useParams()
    const [orgData, setOrgData] = useState(null)
    const [selfRole, setSelfRole] = useState(null)

    useEffect(() => {
        axios.get("/api/v1/organization/" + orgId).then(resp => {
            console.log(resp)
            setOrgData(resp.data)
        }).catch(resp => {
            console.log(resp)
        })
        axios.get("/api/v1/organization/" + orgId + "/role-self").then(resp => {
            console.log(resp)
            setSelfRole(resp.data)
        }).catch(resp => {
            console.log(resp)
        })
    }, [orgId])

    if(orgData === null || selfRole === null) {
        return (
            <></>
        )
    }

    if (selfRole.permissions.includes("UNAPPROVED")) {
        return (
            <>
            <Grid container direction="column">
                <Grid item>
                    <Box className={classes.headingContainer} borderColor={"grey.400"} border={1} borderTop={0} borderRight={0} borderLeft={0}>
                        <Typography className={classes.headingText} variant={"h4"}>
                            {orgData.name}
                        </Typography>
                    </Box>
                </Grid>
                <Grid item>
                    <Typography className={classes.contentContainer}>You have not been approved as a member of this organization yet.</Typography>
                </Grid>
            </Grid>
            </>
        )
    }

    return (
        <>
            <Grid container direction="column">
                <Grid item>
                    <Box className={classes.headingContainer} borderColor={"grey.400"} border={1} borderTop={0} borderRight={0} borderLeft={0}>
                        <Typography className={classes.headingText} variant={"h4"}>
                            {orgData.name}
                        </Typography>
                    </Box>
                </Grid>
                <Grid item className={classes.tabContainer}>
                    <Tabs>
                        <Tab label="People" onClick={(event) => {history.push("/app/organization/" + orgId + "/people")}}/>
                        <Tab label="Events" onClick={(event) => {history.push("/app/organization/" + orgId + "/events")}}/>
                        <Tab label="Sign In" onClick={(event) => {history.push("/app/organization/" + orgId + "/sign-in")}}/>
                        <Tab label="Voting" onClick={(event) => {history.push("/app/organization/" + orgId + "/voting")}}/>
                        {selfRole.permissions.includes("SUPERADMIN") ? <Tab label="Settings" onClick={(event) => {history.push("/app/organization/" + orgId + "/settings")}}/> : <></>}
                    </Tabs>
                </Grid>
                <Grid item className={classes.contentContainer}>
                    <Switch>
                        <Route exact path="/app/organization/:orgId">
                            <Redirect to={"/app/organization/" + orgId + "/people"}/>
                        </Route>
                        <Route exact path="/app/organization/:orgId/people">
                            <PeopleDisplay selfRole = {selfRole}/>
                        </Route>
                        <Route exact path="/app/organization/:orgId/events">

                        </Route>
                        <Route exact path="/app/organization/:orgId/sign-in">

                        </Route>
                        <Route exact path="/app/organization/:orgId/voting">
                            <VotingDisplay selfRole = {selfRole}/>
                        </Route>
                        <Route exact path="/app/organization/:orgId/settings">
                            {selfRole.permissions.includes("SUPERADMIN") ? <OrgSettings/> : <Redirect to={"/app/organization/" + orgId}/>}
                        </Route>
                    </Switch>
                </Grid>
            </Grid>
        </>
    )
}