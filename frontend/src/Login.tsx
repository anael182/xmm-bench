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
            username: "",
            input: ""
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateInput = this.updateInput.bind(this);
    }

    updateInput(e: any){
        this.setState({username: e.target.value});
    }

    handleSubmit(e: any) {
        e.preventDefault();
        this.setState({username: this.state.input});
    }


    handleLogin = (e: any) : void => {
        if (this.state.username !== "") {
            axios({
                method: 'post',
                url: process.env.React_App_URL_API + 'reservation/take',
                data: {username: this.state.username}
            })
                .then(res => res.data.username)
                .catch(err => console.error("ERROR =>" + err));
        }
    }

    handleCurrentUser = (): any => {
        axios.post(process.env.React_App_URL_API + "reservation/release")
            .then( () =>console.log("Token released"))
            .catch(err => console.error("ERROR => " + err));
    }

        render() {
            const isLoggedIn = this.state.username;
            return (
                    <FormControl onSubmit={this.handleSubmit}>
                        <InputLabel required={true} htmlFor="my-input">Username</InputLabel>
                        {/*https://stackoverflow.com/questions/46799872/using-react-form-to-post-to-an-api*/}
                        <Input type="text" name="username" autoFocus={true} onChange={this.updateInput} aria-describedby="my-helper-text"/>
                        {(isLoggedIn === "")
                            ? <div>
                                <Button variant="contained" color="primary" onClick={this.handleLogin.bind(this)}>Take Token</Button>
                            </div>
                            : <div>
                                <Button variant="contained" color="primary" onClick={this.handleLogin.bind(this)}>Take Token</Button>
                                <Button variant="contained" color="primary" onClick={this.handleCurrentUser}>Release Token</Button>
                                <FormHelperText id="my-helper-text"> {this.state.username} connected</FormHelperText>
                            </div>
                        }
                    </FormControl>
            )
        }
}
