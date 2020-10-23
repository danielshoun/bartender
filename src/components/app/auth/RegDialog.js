import React, {useState} from 'react';
import {useHistory} from "react-router-dom";
import makeStyles from "@material-ui/core/styles/makeStyles";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import {KeyboardDatePicker} from "@material-ui/pickers"

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
        alignContent: "center",
        justifyContent: "center",
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
    }
}))

export default function RegDialog() {
    const classes = useStyles()
    const history = useHistory()

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [dateOfBirth, setDateOfBirth] = useState(null)
    const [showingSuccessDialog, setShowingSuccessDialog] = useState(false)
    const [showingErrorDialog, setShowingErrorDialog] = useState(false)
    const [errorDialogText, setErrorDialogText] = useState("")

    const handleRegister = () => {
        let badForm = false
        const body = {
            firstName: firstName,
            lastName: lastName,
            emailAddress: email,
            plainTextPassword: password,
            dateOfBirth: dateOfBirth
        }
        Object.values(body).forEach((val) => {
            if (val === "" || val === null) {
                badForm = true
            }})
        if (badForm === true) {
            setErrorDialogText("You must fill in every field.")
            setShowingErrorDialog(true)
        }
        else if (email.search("@") === -1) {
            setErrorDialogText("You must enter a valid email address.")
            setShowingErrorDialog(true)
        }
        else {
            axios.post("/api/v1/user/register", body).then(resp => {
                setShowingSuccessDialog(true)
            }).catch(resp => {
                setErrorDialogText(resp.data)
                setShowingErrorDialog(true)
            })
        }
    }

    return (
        <>
            <FormControl className={classes.dialogBox}>
                <TextField color="#f1f1f1"
                           label="First Name"
                           variant="filled"
                           onChange = { (event) => setFirstName(event.target.value) }/>
            </FormControl>
            <FormControl className={classes.dialogBox}>
                <TextField color="#f1f1f1"
                           label="Last Name"
                           variant="filled"
                           onChange = { (event) => setLastName(event.target.value) }/>
            </FormControl>
            <FormControl className={classes.dialogBox}>
                <TextField color="#f1f1f1"
                           label="Email"
                           variant="filled"
                           onChange = { (event) => setEmail(event.target.value) }/>
            </FormControl>
            <FormControl className={classes.dialogBox}>
                <TextField color="#f1f1f1"
                           type="password"
                           label="Password"
                           variant="filled"
                           onChange = { (event) => setPassword(event.target.value) }/>
            </FormControl>
            <FormControl className={classes.dialogBox}
                         variant="filled">
                <KeyboardDatePicker
                    disableFuture
                    openTo="year"
                    inputVariant="filled"
                    format="MM/dd/yyyy"
                    placeholder="__/__/____"
                    label="Date of Birth"
                    views={["year", "month", "date"]}
                    value={dateOfBirth}
                    onChange={setDateOfBirth}
                />
            </FormControl>
            <Box className={classes.dialogBox}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick = { (event) => handleRegister(event) }>
                    Register
                </Button>
            </Box>
            <Box className={classes.linkText}>
                <Link color="textSecondary" style={{cursor: "pointer"}} fontweight="light" onClick={(event) => {history.push("/app/login")}}>
                    Already Registered?
                </Link>
            </Box>
            <Dialog open={showingSuccessDialog} onClose={(event) => {history.push("/app/login")}}>
                <DialogTitle>Registration Complete</DialogTitle>
                <DialogContent>
                    <DialogContentText>Your account has been created, but you must verify your email before you will be able to log in.
                    Please check {email} and click the link you received to verify your email. You will be redirected to the login page
                        after closing this dialog box.</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={(event) => {history.push("/app/login")}} color="primary">Okay</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={showingErrorDialog} onClose={(event) => {setShowingErrorDialog(false)}}>
                <DialogTitle>Error</DialogTitle>
                <DialogContent>
                    <DialogContentText>{errorDialogText}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={(event) => {setShowingErrorDialog(false)}} color="primary">Okay</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}