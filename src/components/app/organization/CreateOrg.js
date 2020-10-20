import React, {useState} from 'react';
import {useHistory} from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Paper from "@material-ui/core/Paper"
import makeStyles from "@material-ui/core/styles/makeStyles";

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
        marginBottom: theme.spacing(-2),
        width: "80%"
    },
    headingText: {},
    contentContainer: {
        display: "flex",
        marginLeft: theme.spacing(4),
        marginRight: theme.spacing(4),
        width: "80%",
        justifyContent: "center",
        alignContent: "center"
    },
    createOrgPaper: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        marginTop: theme.spacing(6),
        padding: theme.spacing(1),
        width: theme.spacing(32)
    },
    leftTextField: {
        width: "40%",
        marginTop: theme.spacing(2),
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        marginBottom: theme.spacing(2)
    },
    dialogBox: {
        display: "flex",
        width: "100%",
        alignContent: "center",
        justifyContent: "center",
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(2)
    }
}))

export default function CreateOrg(props){
    const classes = useStyles()
    const history = useHistory()

    const [orgName, setOrgName] = useState("")
    const [orgRefId, setOrgRefId] = useState("")
    const [orgSecret, setOrgSecret] = useState("")

    const handleCreateOrg = () => {
        let badForm = false
        const body = {
            name: orgName,
            ref: orgRefId,
            secret: orgSecret
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
            axios.post("/api/v1/organization/add", body).then(resp => {
                console.log(resp)
                axios.get("/api/v1/user/self").then(resp => {
                    props.setUserData(resp.data)
                }).catch(resp => {
                    console.log(resp)
                })
                history.push("/app/dashboard")
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
                            New Organization
                        </Typography>
                    </Box>
                </Grid>
                <Grid item>
                    <Box className={classes.contentContainer}>
                        <Paper className={classes.createOrgPaper}>
                            <FormControl className={classes.dialogBox}>
                                <TextField
                                    variant="filled"
                                    label="Name"
                                    onChange={(event) => {setOrgName(event.target.value)}}/>
                            </FormControl>
                            <FormControl className={classes.dialogBox}>
                                <TextField
                                    variant="filled"
                                    label="Ref ID"
                                    onChange={(event) => {setOrgRefId(event.target.value)}}/>
                            </FormControl>
                            <FormControl className={classes.dialogBox}>
                                <TextField
                                    variant="filled"
                                    type="password"
                                    label="Secret"
                                    onChange={(event) => {setOrgSecret(event.target.value)}}/>
                            </FormControl>
                            <Box className={classes.dialogBox}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={(event) => handleCreateOrg(event)}>
                                    Submit
                                </Button>
                            </Box>
                        </Paper>
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}