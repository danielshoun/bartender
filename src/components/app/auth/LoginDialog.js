import React, {useState} from 'react';
import {useHistory} from "react-router-dom";
import Checkbox from "@material-ui/core/Checkbox";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import makeStyles from "@material-ui/core/styles/makeStyles";

const axios = require('axios')

const useStyles = makeStyles(theme => ({
    dialogBox: {
        display: "flex",
        width: "100%",
        alignContent: "center",
        justifyContent: "center",
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(2)
    },
    linkText: {
        display: "flex",
        width: "100%",
        alignContent: "center",
        justifyContent: "center",
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
    }
}))

export default function LoginDialog(props) {
    const classes = useStyles()

    const [emailAddress, setEmailAddress] = useState("")
    const [password, setPassword] = useState("")
    const [stayLoggedIn, setStayLoggedIn] = useState(false)
    const [showingForgotPasswordDialog, setShowingForgotPasswordDialog] = useState(false)
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState("")
    const [forgotEmailSent, setForgotEmailSent] = useState(false)
    const [forgotPasswordToken, setForgotPasswordToken] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [passwordChanged, setPasswordChanged] = useState(false)

    const history = useHistory()

    const handleLogin = () => {
        let badForm = false
        const body = {
            emailAddress: emailAddress,
            plainTextPassword: password,
            stayLoggedIn: stayLoggedIn
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
            axios.post("/api/v1/user/login", body).then(resp => {
                props.setIsAuthenticated(true)
                history.push("/app/dashboard")
            }).catch(resp => {
                props.setIsAuthenticated(false)
                history.push("/app/dashboard")
            })
        }
    }

    const handleForgotPassword = () => {
        axios.post("/api/v1/user/forgot?email=" + forgotPasswordEmail).then(resp => {
            setForgotEmailSent(true)
        }).catch(resp => {
            alert("Could not complete your request.")
        })
    }

    const handleNewPassword = () => {
        const body = {
            newPassword: newPassword
        }
        axios.post("/api/v1/user/reset?token=" + forgotPasswordToken, body).then(resp => {
            console.log(resp)
            setPasswordChanged(true)
        })
    }

    return (
        <>
            <FormControl className={classes.dialogBox}>
                <TextField
                    label="Email"
                    variant="filled"
                    onChange={(event) => setEmailAddress(event.target.value)} />
            </FormControl>
            <FormControl className={classes.dialogBox}>
                <TextField
                    label="Password"
                    type="password"
                    variant="filled"
                    onChange={(event) => setPassword(event.target.value)} />
            </FormControl>
            <Box className={classes.linkText}>
                <Link color="textSecondary" style={{cursor: "pointer"}} fontweight="light" onClick={(event) => {setShowingForgotPasswordDialog(true)}}>
                    Forgot your password?
                </Link>
            </Box>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={stayLoggedIn}
                        onChange={(event) => setStayLoggedIn(!stayLoggedIn)}
                        name="stayLoggedIn"
                        color="primary"/>
                }
                label="Stay Logged In"
            />
            <Box className={classes.dialogBox}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={(event) => handleLogin(event)}>
                    Login
                </Button>
            </Box>
            <Box className={classes.linkText}>
                <Link color="textSecondary" style={{cursor: "pointer"}} fontweight="light" onClick={(event) => {history.push("/app/register")}}>
                    Not Registered?
                </Link>
            </Box>
            <Dialog open={showingForgotPasswordDialog} onClose={(event) => {setShowingForgotPasswordDialog(false)}}>
                <DialogTitle>Forgotten Password</DialogTitle>
                {passwordChanged ?
                <>
                    <DialogContent>
                        <DialogContentText>Your password has been changed successfully.</DialogContentText>
                        <DialogActions>
                            <Button onClick={(event) => {setShowingForgotPasswordDialog(false)}} color="primary">Close</Button>
                        </DialogActions>
                    </DialogContent>
                </> : <>
                {forgotEmailSent ?
                <>
                    <DialogContent>
                        <DialogContentText>Please enter your forgotten password token and new password: </DialogContentText>
                        <TextField
                            variant="filled"
                            margin="dense"
                            label="Token"
                            value={forgotPasswordToken}
                            fullWidth
                            onChange={(event) => {setForgotPasswordToken(event.target.value)}}/>
                        <TextField
                            variant="filled"
                            margin="dense"
                            label="New Password"
                            type="password"
                            value={newPassword}
                            fullWidth
                            onChange={(event) => {setNewPassword(event.target.value)}}/>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={(event) => {handleNewPassword()}} color="primary">Okay</Button>
                        <Button onClick={(event) => {setShowingForgotPasswordDialog(false)}} color="primary">Cancel</Button>
                    </DialogActions>
                </> :
                <>
                    <DialogContent>
                        <DialogContentText>Please enter the email address associated with your account. If an account exists, a reset token will be sent to you. Enter it on the next screen.</DialogContentText>
                        <TextField
                            variant="filled"
                            margin="dense"
                            label="Email"
                            value={forgotPasswordEmail}
                            fullWidth
                            onChange={(event) => {setForgotPasswordEmail(event.target.value)}}/>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={(event) => {handleForgotPassword()}} color="primary">Okay</Button>
                        <Button onClick={(event) => {setShowingForgotPasswordDialog(false)}} color="primary">Cancel</Button>
                    </DialogActions>
                </>}</>}
            </Dialog>
        </>
    )
}