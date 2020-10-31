import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet-async';
import Typography from '@material-ui/core/Typography';
import { BackgroundImage } from '../BackgroundImage/BackgroundImage';
import cover from './cover.jpg';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
// import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
// import WorkOutlineOutlinedIcon from '@material-ui/icons/WorkOutlineOutlined';
import Grid from '@material-ui/core/Grid';
import { GitHubRibbon } from '../GitHubRibbon/GitHubRibbon';
import { Link } from 'react-router-dom';
import { useStyles } from './styles';

import MapIcon from '@material-ui/icons/Map';
import Fade from '@material-ui/core/Fade';
export const IndexPage: React.FunctionComponent = () => {
  const classes = useStyles();
  return (
    <Fragment>
      <Helmet>
        <title>GR-20</title>
      </Helmet>
      <BackgroundImage imageUrl={cover}>
        <GitHubRibbon />
        <Fade in timeout={600}>
          <Box
            component="main"
            role="main"
            justifyContent="center"
            flexDirection="column"
            textAlign="center"
            className={classes.main}
            display="flex"
            ml={5}
            mr={5}
          >
            <Typography
              variant="h1"
              component="h1"
              gutterBottom
              className={classes.heading}
            >
              GR-20
            </Typography>
            <Typography
              variant="subtitle1"
              component="p"
              gutterBottom
              className={classes.summary}
            >
              The GR 20 is a GR footpath that crosses the Mediterranean island
              of Corsica running approximately north-south, described by the
              outdoor writer Paddy Dillon as "one of the top trails in the
              world".
            </Typography>
            <Box mt={4}>
              <Grid container spacing={2} justify="center" direction="row">
                <Grid item>
                  <Button
                    color="primary"
                    variant="contained"
                    size="large"
                    startIcon={<MapIcon />}
                    component={Link}
                    to="/map/"
                  >
                    View Map
                  </Button>
                </Grid>
                {/* <Grid item>
                  <Button
                    color="primary"
                    variant="contained"
                    size="large"
                    startIcon={<WorkOutlineOutlinedIcon />}
                    component={Link}
                    to="/kit/"
                  >
                    View Kit
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    color="primary"
                    variant="contained"
                    size="large"
                    startIcon={<InfoOutlinedIcon />}
                    component={Link}
                    to="/about/"
                  >
                    About
                  </Button>
                </Grid> */}
              </Grid>
            </Box>
          </Box>
        </Fade>
      </BackgroundImage>
    </Fragment>
  );
};
