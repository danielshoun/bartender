import React, {useEffect, useState} from 'react';
import {Route, Switch, Redirect, useHistory} from "react-router-dom";
import Dashboard from "./Dashboard";
import Drawer from "@material-ui/core/Drawer"
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import GroupIcon from '@material-ui/icons/Group';
import makeStyles from "@material-ui/core/styles/makeStyles";
import DashboardIcon from "@material-ui/icons/Dashboard";
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import HelpIcon from '@material-ui/icons/Help';
import FeedbackIcon from '@material-ui/icons/Feedback';
import logo from "../../images/logo-white-border.png";
import Box from "@material-ui/core/Box"
import CreateOrg from "./organization/CreateOrg";
import OrganizationMain from "./organization/OrganizationMain";

const drawerWidth = 200

const axios = require('axios')

const useStyles = makeStyles(theme => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        marginRight: theme.spacing(3)
    },
    drawerPaper: {
        width: drawerWidth,
        backgroundColor: theme.palette.primary.main
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        display: "flex"
    },
    navLogoContainer: {
        display: "flex",
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        justifyContent: "center",
        alignContent: "center"
    },
    navLogo: {
        height: "auto",
        width: "25%",
    },
    menuDivider: {
        background: "white"
    }
}))

export default function PrivateMain(props) {
    const classes = useStyles()
    const history = useHistory()

    const [userData, setUserData] = useState(null)

    useEffect(() => {
        axios.get("/api/v1/user/self").then(resp => {
            console.log(resp.data)
            setUserData(resp.data)
        }).catch(resp => {
        })
    }, [])

    if (userData === null && props.isAuthenticated) {
        return (
            <>
            </>
        )
    }

    return (
        <div style={{display: "flex"}}>
            <Drawer
                className={classes.drawer}
                classes={{paper: classes.drawerPaper}}
                variant="permanent"
                anchor="left">
                <Box className={classes.navLogoContainer}>
                    <img src={logo}  alt="Bartender logo" className={classes.navLogo}/>
                </Box>
                <Divider className={classes.menuDivider} light variant="middle"/>
                <List>
                    {[
                        {text: "Dashboard", action: history.push, dest: "/app/dashboard"},
                        {text: "Organizations", action: history.push, dest: "/app/organizations"},
                        {text: "Calendar", action: history.push, dest: "/app/calendar"},
                        {text: "Account", action: history.push, dest: "/app/account"},
                        {text: "Help", action: history.push, dest: "/app/help"},
                        {text: "Feedback", action: history.push, dest: "/app/feedback"}]
                        .map((object, index) => (
                        <ListItem button key={object.text} onClick={(event) => {object.action(object.dest)}}>
                            <ListItemIcon>
                                {index === 0 ? <DashboardIcon style={{color: "white"}}/> :
                                    index === 1 ? <GroupIcon style={{color: "white"}}/> :
                                        index === 2 ?  <CalendarTodayIcon style={{color: "white"}}/> :
                                            index === 3 ? <AccountCircleIcon style={{color: "white"}}/> :
                                                index === 4 ? <HelpIcon style={{color: "white"}} /> :
                                                    <FeedbackIcon style={{color: "white"}}/>}
                            </ListItemIcon>
                            <ListItemText primary={object.text} style={{color: "white"}}/>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <div className={classes.content}>
                <Switch>
                    <Route exact path="/app">
                        <Redirect to="/app/dashboard" />
                    </Route>
                    <Route exact path="/app/create">
                        {props.isAuthenticated ? <CreateOrg setUserData={setUserData}/> : <Redirect to="/app/login"/>}
                    </Route>
                    <Route path="/app/organization/:orgId">
                        {props.isAuthenticated ? <OrganizationMain userData={userData} /> : <Redirect to="/app/login"/>}
                    </Route>
                    <Route exact path="/app/dashboard">
                        {props.isAuthenticated ? <Dashboard userData={userData} setUserData={setUserData}/> : <Redirect to="/app/login" />}
                    </Route>
                </Switch>
            </div>
        </div>
    )
}