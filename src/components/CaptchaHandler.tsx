import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material"

const CaptchaHandler = ( props: { value: string, url: string, valSetter: any, onSubmit: any, onCancel: any }) => (
  <Dialog maxWidth="xs" open={props.url.length > 0}>
    <DialogTitle>Captcha required</DialogTitle>
    <DialogContent>
      <Grid container alignItems="center" spacing={3}>
        <Grid item xs={12}>
          <img src={props.url} alt="captcha" width={"100%"} />
        </Grid>
        <Grid item xs={12}>
          <TextField
            placeholder="Captcha"
            variant="outlined"
            fullWidth
            value={props.value}
            onChange={(e) => props.valSetter(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            fullWidth
            disabled={props.value.length === 0}
            onClick={props.onSubmit}
          >
            Submit
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" fullWidth onClick={props.onCancel}>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </DialogContent>
  </Dialog>
)

export default CaptchaHandler
