import { Button, Grid, Typography } from "@mui/material"
import {
  Icon28DoorArrowRightOutline,
  Icon28PaintRollerOutline,
  Icon28PollSquareOutline,
} from "@vkontakte/icons"
import useVKAPI from "../hooks/useVKAPI"

function Settings() {
  const [_, sv, logout] = useVKAPI()
  const settings = [
    {
      name: "Logout",
      action: () => logout(),
      icon: <Icon28DoorArrowRightOutline />,
    },
    {
      name: "Equalizer",
      action: null,
      icon: <Icon28PollSquareOutline />,
    },
    {
      name: "UI",
      action: null,
      icon: <Icon28PaintRollerOutline />,
    },
  ]

  return (
    <Grid container spacing={3}>
      {settings.map((obj, i) => (
        <Grid item xs={4} key={i}>
          <Button
            size="large"
            onClick={obj.action as any}
            startIcon={obj.icon}
            fullWidth
          >
            <Typography variant="h6" sx={{ paddingLeft: "20px" }}>
              {obj.name}
            </Typography>
          </Button>
        </Grid>
      ))}
    </Grid>
  )
}

export default Settings
