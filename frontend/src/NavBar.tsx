import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import KorysLogo from "./img/KorysLogo.png"
import Grid from '@material-ui/core/Grid';



const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        navbar: {
            width:'auto',
            flexGrow: 1,
        },
        title: {
            flexGrow: 1,
            paddingLeft: 20,
        },
        logo: {
            width:80,
        },
        corpo: {
            marginRight:10,
        }
    }),
);

export default function NavBar() {

    const classes = useStyles();

    return (
        <Grid container className={classes.navbar}>
            <AppBar position="static">
                <Toolbar>
                    <img src={KorysLogo} alt="Logo Korys technologies" className={classes.logo}/>
                    <Typography variant="h6" className={classes.title}>
                        XMM Bench
                    </Typography>
                    <Typography variant="h6" className={classes.corpo}>Korys Technologies</Typography>
            </Toolbar>
            </AppBar>
        </Grid>
    );
}