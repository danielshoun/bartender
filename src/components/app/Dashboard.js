import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid"
import Card from "@material-ui/core/Card"
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent"
import {Link} from "@material-ui/core";

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
    headingText: {
    },
    contentContainer: {
        marginLeft: theme.spacing(4),
        marginRight: theme.spacing(4),
        width: "80%"
    },
    joinOrgButton: {
        marginTop: theme.spacing(4),
        marginRight: theme.spacing(2)
    },
    createOrgButton: {
        marginTop: theme.spacing(4)
    },
    leftJoinField: {
        marginRight: theme.spacing(2)
    },
    orgCardGrid: {
        width:"100%"
    },
    orgCardContainer: {
        minWidth: "30%",
        height: "256px",
        marginTop: theme.spacing(2),
        marginRight: theme.spacing(2)
    },
    orgCard: {
        width:"100%",
        height:"100%"
    }
}))

export default function Dashboard(props) {
    const classes = useStyles()
    const history = useHistory()

    const [showingJoinSchoolDialog, setShowingJoinSchoolDialog] = useState(false)
    const [joinSchoolRefId, setJoinSchoolRefId] = useState("")
    const [showingJoinOrgDialog, setShowingJoinOrgDialog] = useState(false)
    const [joinOrgRefId, setJoinOrgRefId] = useState("")
    const [joinOrgSecret, setJoinOrgSecret] = useState("")

    useEffect(() => {
        if (props.userData.school === null) {
            setShowingJoinSchoolDialog(true)
        }}, [props.userData.school])

    const handleJoinSchool = () => {
        axios.post("/api/v1/school/join?ref=" + joinSchoolRefId).then(resp => {
            axios.get("/api/v1/user/self").then(resp => {
                props.setUserData(resp.data)
            })
            setShowingJoinSchoolDialog(false)
        }).catch(resp => {
        })
    }

    const handleJoinOrg = () => {
        let badForm = false
        const body = {
            ref: joinOrgRefId,
            secret: joinOrgSecret
        }
        Object.values(body).forEach((val) => {
            if (val === "") {
                badForm = true
            }
        })
        if (badForm) {

        }
        else {
            axios.post("/api/v1/organization/join", body).then(resp => {
                console.log(resp)
                axios.get("/api/v1/user/self").then(resp => {
                    props.setUserData(resp.data)
                })
                setShowingJoinOrgDialog(false)
            }).catch(resp => {
                console.log(resp)
            })
        }
    }

    return (
        <>
            <Grid container direction="column">
                <Grid item>
                    <Box className={classes.headingContainer} borderColor={"grey.400"} border={1} borderTop={0} borderRight={0} borderLeft={0}>
                        <Typography className={classes.headingText} variant={"h4"}>
                            Dashboard
                        </Typography>
                    </Box>
                </Grid>
                <Grid item>
                    <Box className={classes.contentContainer}>
                        {props.userData.organizations.length === 0 ?
                            <>
                                <Typography>You are not a member of any organizations yet. Use the buttons below to join or create one!</Typography>
                                <Button
                                    className={classes.joinOrgButton}
                                    variant="contained"
                                    color="primary"
                                    onClick={(event) => {setShowingJoinOrgDialog(true)}}>Join Organization</Button>
                                <Button
                                    className={classes.createOrgButton}
                                    variant="contained"
                                    color="primary"
                                    onClick={(event) => {history.push("/app/create")}}>Create Organization</Button>
                            </>:
                            <>
                                <Typography variant={"h6"}>
                                    Your Organizations
                                </Typography>
                                <Grid container className={classes.orgCardGrid}>
                                    {props.userData.organizations.map((organization) => (
                                        <Grid item className={classes.orgCardContainer}>
                                            <Link onClick={(event) => {history.push("/app/organization/" + organization.id)}}>
                                            <Card className={classes.orgCard}>
                                                <CardHeader title={organization.name} />
                                                <CardContent><b>Announcements</b><br/><br/><i>No announcements to show.</i></CardContent>
                                            </Card>
                                            </Link>
                                        </Grid>
                                        ))}
                                </Grid>
                            </>}
                    </Box>
                </Grid>
            </Grid>

            <Dialog open={showingJoinSchoolDialog} onClose={(event) => {setShowingJoinSchoolDialog(false)}}>
                <DialogTitle>Join School</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Before you can being joining or creating organizations, you will need to join a school. Please enter a school reference ID:
                    </DialogContentText>
                    <TextField
                        variant="filled"
                        margin="dense"
                        label="Ref ID"
                        value={joinSchoolRefId}
                        onChange={(event) => {setJoinSchoolRefId(event.target.value)}}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={(event) => {handleJoinSchool()}} color="primary">Okay</Button>
                    <Button onClick={(event) => {setShowingJoinSchoolDialog(false)}} color="primary">Cancel</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={showingJoinOrgDialog} onClose={(event) => {setShowingJoinOrgDialog(false)}}>
                <DialogTitle>Join Organization</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter the reference ID and secret of the organization you wish to join.<br/>
                        <b>NOTE:</b> You may only join organizations at your own school.
                    </DialogContentText>
                    <TextField
                        className={classes.leftJoinField}
                        variant="filled"
                        margin="dense"
                        label="Ref ID"
                        value={joinOrgRefId}
                        onChange={(event) => {setJoinOrgRefId(event.target.value)}}/>
                    <TextField
                        variant="filled"
                        type="password"
                        margin="dense"
                        label="Secret"
                        value={joinOrgSecret}
                        onChange={(event) => {setJoinOrgSecret(event.target.value)}}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={(event) => {handleJoinOrg()}} color="primary">Okay</Button>
                    <Button onClick={(event) => {setShowingJoinOrgDialog(false)}} color="primary">Cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}