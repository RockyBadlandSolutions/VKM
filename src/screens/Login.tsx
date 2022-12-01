import React, { useState } from "react"
import { LoadingButton } from "@mui/lab"
import {
  Alert,
  Container,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material"
import useVKAPI from "../hooks/useVKAPI"


function Login() {
  const [userUrl, setUserUrl] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [_, update] = useVKAPI()

  const onClick = () => {
    const url = new URL(userUrl.replace("#", "?"))
    if (url.search === "") {
      setError("Invalid URL")
      return
    }
    if (url.searchParams.get("access_token") === null) {
      setError("Invalid URL")
      return
    }
    const token = url.searchParams.get("access_token")
    update(token as string)
  }
  return (
    <Container component={"main"} maxWidth="xs" sx={{ paddingTop: 8 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h5" component="h1">
            Sign in
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="caption">
            {"Copy url from \"Auth URL\" field and open it in browser"} <br/>
            {"After authenting, copy url from browser and paste it in \"Your URL\" field"}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Auth URL"
            value={"https://oauth.vk.com/authorize?client_id=5776857&scope=1073737727&redirect_uri=https://oauth.vk.com/blank.html&display=page&response_type=token&revoke=1"}
            onChange={undefined}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Your URL"
            value={userUrl}
            onChange={(e) => setUserUrl(e.target.value)}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <LoadingButton fullWidth onClick={onClick}>
            Sign in
          </LoadingButton>
        </Grid>
      </Grid>
      <Snackbar
        open={error !== null}
        message={error}
        onClose={() => setError("")}
        autoHideDuration={3000}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </Container>
  )
}

export default Login
