import React from "react";
import {Button, FormControl, FormHelperText, Input, InputLabel} from '@material-ui/core';
/*import {createStyles, Theme, withStyles} from '@material-ui/core/styles';*/
import axios from "axios";


// Création du CSS des boutons sur Material UI

/*const useStyles = withStyles((theme: Theme) =>
    createStyles({
        root: {
            '& > *': {
                marginTop: theme.spacing(5),
                paddingTop: theme.spacing(1)
            },
        },
    }),
);*/

export default class Login extends React.Component <any, any>{

    constructor(props: any){
        super(props);
        this.state={
            username: "Personne n'"
        }
    }


    handleChange(e: any){
        this.setState({username: e.target.value});
    }


    handleLogin = () : void => {
        axios({method: 'post', url: process.env.React_App_URL_API + 'reservation/take', data: {username: this.state.username}})
            .then(res => console.log(res))
            .catch(err => console.error("ERROR =>" + err));
    }

    handleCurrentUser = (): any => {
        const data = axios.get(process.env.React_App_URL_API + "reservation/state")
            .then(res => res.data.token.username);
        this.setState({username: data});
    }

        render() {
            return (
                <div>
                    <FormControl>
                        <InputLabel required={true} htmlFor="my-input">Username</InputLabel>
                        {/*https://stackoverflow.com/questions/46799872/using-react-form-to-post-to-an-api*/}
                        <Input id="username" name="username" autoFocus={true} onSubmit={this.handleChange.bind(this)} aria-describedby="my-helper-text"/>
                        <Button variant="contained" color="primary" onClick={this.handleLogin.bind(this)}>Take Token</Button>
                        <FormHelperText id="my-helper-text"> {this.state.username} est actuellement connecté </FormHelperText>
                    </FormControl>
                </div>
            )
        }
}
