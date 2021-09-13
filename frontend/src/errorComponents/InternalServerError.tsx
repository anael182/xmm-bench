import {ReactElement} from 'react';
import Typography from '@material-ui/core/Typography';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginTop: '25%',
        },
    }),
);


export default function InternalServerError(): ReactElement {

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Typography variant="h2" align={'center'} color={'error'}> 503 Service Unavailable </Typography>
            <Typography variant="h5" align={'center'} color={'textPrimary'}> Can't reach backend server</Typography>
        </div>
    )
}