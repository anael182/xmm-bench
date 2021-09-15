import React, {useEffect, useState} from 'react';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import KorysLogo from './img/KorysLogo.png'
import axios from "axios";



const useStyles = makeStyles(() =>
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

    const [board, setBoard] = useState<string>('');

    const getBoardName = async (): Promise<void> => {
        const result = await axios(process.env.React_App_URL_API + "board");
        setBoard(result.data.board_name);

    }

    useEffect((): void => {
            getBoardName()
        }
        , [board]
    )

    return (
        <Grid container className={classes.navbar}>
            <AppBar position="static">
                <Toolbar>
                    <img src={KorysLogo} alt="Logo Korys technologies" className={classes.logo}/>
                    <Typography variant="h6" className={classes.title}>
                        {board}
                    </Typography>
                    <Typography variant="h6" className={classes.corpo}>Korys Technologies</Typography>
            </Toolbar>
            </AppBar>
        </Grid>
    );
}