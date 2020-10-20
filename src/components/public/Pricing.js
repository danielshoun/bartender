import React from 'react';
import {useHistory} from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Box from "@material-ui/core/Box"
import Link from "@material-ui/core/Link";

const useStyles = makeStyles(theme => ({
    headingContainer: {
        marginLeft: theme.spacing(4),
        marginRight: theme.spacing(4),
        width: "80%"
    },
    headingText: {
    },
    bodyText: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(4) + 2,
        marginBottom: theme.spacing(6),
        width: "80%"
    }
}))

export default function Pricing() {
    const classes = useStyles()

    const history = useHistory()

    return (
        <>
            <Box className={classes.headingContainer} borderColor={"grey.400"} border={1} borderTop={0} borderRight={0} borderLeft={0}>
                <Typography className={classes.headingText} variant={"h4"}>
                    Beta Participation
                </Typography>
            </Box>
            <Typography className={classes.bodyText}>Bartendr is freely available to student organizations at the University of South Florida College of Pharmacy
            as part of a beta test. Pricing and availability for organizations at other schools will be determined closer to release. Bartendr will be available
            to select schools at a reduced price in the first half of 2021. If you would like your school to be a part of this phase, please contact us
            on <Link style={{cursor: "pointer"}} onClick={(event) => history.push("/contact")}>this page</Link>.</Typography>
        </>
    )
}