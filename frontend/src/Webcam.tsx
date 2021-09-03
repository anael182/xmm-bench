import {Grid} from "@material-ui/core";

export default function RelayButtons() {

    return (
        <Grid container justifyContent = "center">
        <img src={process.env.React_App_URL_API+'webcam'} alt="webcam"/>
        </Grid>
    )
}