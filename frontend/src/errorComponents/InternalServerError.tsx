import {ReactElement} from 'react';
import Typography from '@material-ui/core/Typography';
import {createStyles, makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() =>
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
            <Typography variant="h2" align={'center'} color={'error'}> Can't reach backend server </Typography>
        </div>
    )
}