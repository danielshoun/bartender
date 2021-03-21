import React, {forwardRef, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio"
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import MaterialTable from "material-table";
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

const axios = require('axios')

const useStyles = makeStyles(theme => ({
    peoplePaper: {
        marginTop: theme.spacing(2)
    },
    votingHeaderGrid: {
        width: "100%"
    },
    createPollButtonContainer: {
        alignContent: "right"
    },
    resultsButton: {
        marginRight: theme.spacing(1)
    },
    pollsContainer: {
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

export default function VotingDisplay(props) {
    const {orgId} = useParams()

    const classes = useStyles()

    const [currentPolls, setCurrentPolls] = useState(null)
    const [pastPolls, setPastPolls] = useState(null)
    const [showingPollDialog, setShowingPollDialog] = useState(false)
    const [newPollQuestion, setNewPollQuestion] = useState(null)
    const [newPollNumChoices, setNewPollNumChoices] = useState(4)
    const [newPollTimeLimit, setNewPollTimeLimit] = useState(null)
    const [newPollChoices, setNewPollChoices] = useState(["", "", "", ""])
    const [showingVoteDialog, setShowingVoteDialog] = useState(false)
    const [voteDialogPoll, setVoteDialogPoll] = useState("")
    const [voteDialogChoices, setVoteDialogChoices] = useState([])
    const [voteDialogSelection, setVoteDialogSelection] = useState("")
    const [voteHash, setVoteHash] = useState("")
    const [voteError, setVoteError] = useState(false)
    const [checkPoll, setCheckPoll] = useState("")
    const [showingCheckDialog, setShowingCheckDialog] = useState(false)
    const [checkedAnswer, setCheckedAnswer] = useState("")
    const [showingResultDialog, setShowingResultDialog] = useState(false)
    const [resultPoll, setResultPoll] = useState("")
    const [resultPollWinner, setResultPollWinner] = useState([])

    useEffect(() => {
        axios.get("/api/v1/organization/" + orgId + "/poll/current").then(resp => {
            console.log(resp)
            setCurrentPolls(resp.data)
        }).catch(resp => {
            console.log(resp)
        })
    }, [orgId])

    useEffect(() => {
        axios.get("/api/v1/organization/" + orgId + "/poll/past").then(resp => {
            console.log(resp)
            setPastPolls(resp.data)
        }).catch(resp => {
            console.log(resp)
        })
    }, [orgId])

    const handleAddPoll = () => {
        let badForm = false
        var filteredChoices = newPollChoices.filter(function(el) {
            return el !== ""
        })
        const body = {
            question: newPollQuestion,
            choices: filteredChoices,
            startTime: Date.now(),
            endTime: Date.now() + newPollTimeLimit * 60000
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
            axios.post("/api/v1/organization/" + orgId + "/poll/create", body).then(resp => {
                console.log(resp)
                setShowingPollDialog(false)
                axios.get("/api/v1/organization/" + orgId + "/poll/current").then(resp => {
                    console.log(resp)
                    setCurrentPolls(resp.data)
                }).catch(resp => {
                    console.log(resp)
                })
            }).catch(resp => {
                console.log(resp)
            })
        }
    }

    const handleVoteDialog = (poll) => {
        setVoteDialogPoll(poll)
        axios.get("/api/v1/organization/" + orgId + "/poll/" + poll.id + "/choices").then(resp => {
            console.log(resp)
            setVoteDialogChoices(resp.data)
        }).catch(resp => {
            console.log(resp)
        })
        setShowingVoteDialog(true)
    }

    const handleCloseVoteDialog = () => {
        setVoteDialogPoll("")
        setVoteDialogChoices([])
        setVoteHash("")
        setVoteError(false)
        setShowingVoteDialog(false)
    }

    const handleSelection = (event) => {
        setVoteDialogSelection(parseInt(event.target.value))
        console.log("Vote dialog selection changed to: " + parseInt(event.target.value))
    }

    const handleVote = (event) => {
        axios.post("/api/v1/organization/" + orgId + "/poll/" + voteDialogPoll.id + "/submit?choiceId=" + voteDialogSelection).then(resp => {
            console.log(resp.data)
            setVoteHash(resp.data)
            }).catch(resp => {
                console.log(resp)
            if(resp.response.status === 400) {
                setVoteError(true)
            }
        })
    }

    const handleOpenCheckDialog = (poll) => {
        setCheckPoll(poll)
        setShowingCheckDialog(true)
    }

    const handleCloseCheckDialog = () => {
        setVoteHash("")
        setCheckedAnswer("")
        setCheckPoll("")
        setShowingCheckDialog(false)
    }

    const handleCheck = () => {
        axios.get("/api/v1/organization/" + orgId + "/poll/" + checkPoll.id + "/check?hash=" + voteHash).then(resp => {
            setCheckedAnswer(resp.data)
        }).catch(resp => {
            console.log(resp)
        })
    }

    const handleOpenResultDialog = (poll) => {
        setResultPoll(poll)
        axios.get("/api/v1/organization/" + orgId + "/poll/" + poll.id + "/results").then(resp => {
            console.log(resp)
            setResultPollWinner(resp.data)
            setShowingResultDialog(true)
        }).catch(resp => {
            console.log(resp)
        })
    }

    const handleCloseResultDialog = () => {
        setResultPoll("")
        setResultPollWinner([])
        setShowingResultDialog(false)
    }

    if (currentPolls === null || pastPolls === null) {
        return (
            <>
            </>
        )
    }
    else {
        console.log(resultPollWinner);
        return (
            <>
                <Grid container direction="row" className={classes.votingHeaderGrid}>
                    <Grid item>
                        <Typography variant={"h6"}>Current Polls</Typography>
                    </Grid>
                    {props.selfRole.permissions.includes("SUPERADMIN") || props.selfRole.permissions.includes("canManagePolls")?
                    <Grid item className={classes.createPollButtonContainer}>
                        <Button variant="contained" color="primary" onClick={(event) => setShowingPollDialog(true)}>Create Poll</Button>
                    </Grid> : <></>}
                </Grid>
                <Box className={classes.pollsContainer}>
                {currentPolls.length < 1 ?
                <Typography>There are no open polls at this time. If one has recently opened, you may need to refresh the page.</Typography>
                :
                <>
                    <MaterialTable
                        icons={tableIcons}
                        options={{
                            showTitle: false
                        }}
                        columns={
                            [{title: "Question", field: "question"},
                            {title: "End Time", field: "endTime", defaultSort: "desc"},
                            {title: "Actions", field: "actions"}]
                        } data={currentPolls.map((poll) => {
                            return {
                                question: poll.question,
                                endTime: new Date(poll.endTime).toLocaleString(),
                                actions: <><Button color="primary" variant="contained" onClick={(event) => handleVoteDialog(poll)}>Vote</Button></>
                            }
                    })}/>
                </>}
                </Box>
                <Typography variant={"h6"}>Past Polls</Typography>
                <Box className={classes.pollsContainer}>
                {pastPolls.length < 1 ?
                    <Typography>There are no past polls to display.</Typography>
                    :
                    <>
                        <MaterialTable
                            icons={tableIcons}
                            options={{
                                showTitle: false
                            }}
                            columns={
                                [{title: "Question", field: "question"},
                                    {title: "End Time", field: "endTime", defaultSort: "desc"},
                                    {title: "Actions", field: "actions"}]
                            } data={pastPolls.map((poll) => {
                                return {
                                    question: poll.question,
                                    endTime: new Date(poll.endTime).toLocaleString(),
                                    actions: <>
                                        {props.selfRole.permissions.includes("SUPERADMIN") || props.selfRole.permissions.includes("canManagePolls")?
                                        <Button color="primary" variant="contained" className={classes.resultsButton} onClick={(event) => handleOpenResultDialog(poll)}>Result</Button> : <></>}
                                        <Button color="primary" variant="contained" onClick={(event) => handleOpenCheckDialog(poll)}>Check</Button>
                                    </>
                                }
                        })}/>
                    </>}
                </Box>

                <Dialog open={showingPollDialog} onClose={(event) => {setShowingPollDialog(false)}}>
                    <DialogTitle>Add Poll</DialogTitle>
                    <DialogContent>
                        <DialogContentText>Enter poll question: </DialogContentText>
                        <TextField
                            variant="filled"
                            margin="dense"
                            id="addPollQuestion"
                            label="Poll Question"
                            fullWidth
                            onChange={(event) => setNewPollQuestion(event.target.value)}/>
                        <DialogContentText>Enter poll choices: </DialogContentText>
                        <TextField
                            variant="filled"
                            margin="dense"
                            id="PollChoice1"
                            label="Choice 1"
                            fullWidth
                            onChange={(event) => newPollChoices[0] = event.target.value}/>
                        <TextField
                            variant="filled"
                            margin="dense"
                            id="PollChoice2"
                            label="Choice 2"
                            fullWidth
                            onChange={(event) => newPollChoices[1] = event.target.value}/>
                        <TextField
                            variant="filled"
                            margin="dense"
                            id="PollChoice3"
                            label="Choice 3"
                            fullWidth
                            onChange={(event) => newPollChoices[3] = event.target.value}/>
                        <TextField
                            variant="filled"
                            margin="dense"
                            id="PollChoice4"
                            label="Choice 4"
                            fullWidth
                            onChange={(event) => newPollChoices[4] = event.target.value}/>
                        <DialogContentText>Enter time limit (minutes): </DialogContentText>
                        <TextField
                            variant="filled"
                            margin="dense"
                            id="PollTimeLimit"
                            label="Time Limit (Minutes)"
                            fullWidth
                            onChange={(event) => setNewPollTimeLimit(event.target.value)}/>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={(event) => {setShowingPollDialog(false)}} color="primary">Cancel</Button>
                        <Button onClick={(event) => {handleAddPoll()}} color="primary">Add Poll</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={showingVoteDialog} onClose={(event) => handleCloseVoteDialog()}>
                    <DialogTitle>{voteDialogPoll.question}</DialogTitle>
                    {voteError ?
                    <>
                        <DialogContent>
                            There was a problem casting your vote. This may be because you have already voted or the poll closed before you submitted. If neither of these are the case, please contact your webmaster.
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={(event) => handleCloseVoteDialog()} color="primary">Close</Button>
                        </DialogActions>
                    </> : voteHash === "" ?
                    <>
                        <DialogContent>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Select an option: </FormLabel>
                                <RadioGroup value={voteDialogSelection}>
                                    {voteDialogChoices.map((choice) => {
                                        return <FormControlLabel value={choice.id} control={<Radio onClick = {(event) => handleSelection(event)}/>} label={choice.text}/>
                                    })}
                                </RadioGroup>
                            </FormControl>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={(event) => handleCloseVoteDialog()} color="primary">Cancel</Button>
                            <Button onClick={(event) => handleVote()} color="primary">Submit</Button>
                        </DialogActions>
                    </>:
                    <>
                        <DialogContent>
                            Your voting hash is below. You must save this before closing the window if you wish to verify your vote.<br/><br/>
                            {voteHash}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={(event) => handleCloseVoteDialog()} color="primary">Close</Button>
                        </DialogActions>
                    </>}
                </Dialog>
                <Dialog open={showingCheckDialog} onClose={(event) => handleCloseCheckDialog()}>
                    <DialogTitle>{checkPoll.question}</DialogTitle>
                    {checkedAnswer === "" ?
                    <>
                        <DialogContent>
                            Enter your vote hash:
                            <TextField
                                variant="filled"
                                margin="dense"
                                label="Vote Hash"
                                fullWidth
                                onChange={(event) => setVoteHash(event.target.value)}/>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={(event) => handleCloseCheckDialog()} color="primary">Cancel</Button>
                            <Button onClick={(event) => handleCheck()} color="primary">Submit</Button>
                        </DialogActions>
                    </>:
                    <>
                        <DialogContent>
                            You voted for:<br/><br/>{checkedAnswer.text}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={(event) => handleCloseCheckDialog()} color="primary">Close</Button>
                        </DialogActions>
                    </>}
                </Dialog>
                <Dialog open={showingResultDialog} onClose={(event) => handleCloseResultDialog()}>
                    <DialogTitle>{resultPoll.question}</DialogTitle>
                    <DialogContent>
                        Results:<br/><br/>{
                        resultPollWinner.map((choice) => {
                            return <>{choice.text}: {choice.total} votes<br/></>
                    })}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={(event) => handleCloseResultDialog()} color="primary">Close</Button>
                    </DialogActions>
                </Dialog>
            </>
        )
    }
}