import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material"

const CaptchaHandler = ({ value, url, valSetter, onSubmit, onCancel }) => (
  <Dialog maxWidth="xs" open={url.length > 0}>
    <DialogTitle>Captcha required</DialogTitle>
    <DialogContent>
      <Grid container alignItems="center" spacing={3}>
        <Grid item xs={12}>
          <img src={url} alt="captcha" width={"100%"} />
        </Grid>
        <Grid item xs={12}>
          <TextField
            placeholder="Captcha"
            variant="outlined"
            fullWidth
            value={value}
            onChange={(e) => valSetter(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            fullWidth
            disabled={value.length === 0}
            onClick={onSubmit}
          >
            Submit
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" fullWidth onClick={onCancel}>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </DialogContent>
  </Dialog>
)

export default CaptchaHandler
