import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Hidden } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    marginBottom: '85px',
    backgroundColor: 'grey'
  },
  header : {
    display:'flex',
    justifyContent:'space-between'
  },
  color: {
    backgroundColor: '#317FFB'
  },
  label: {
    width: 'auto',
    color: '#fff',
    fontSize: '1.4rem',
    fontWeight: 'bold',
    marginLeft: '10px',
    paddingLeft: '10px'
  },
}));

export default function Header(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar
        classes={{ root: classes.color }}
        position="fixed"
      >
        <Toolbar classes={{ root: classes.header }}>
          <Hidden xsDown>
            <Typography className={classes.label}>
              {'Autonomous Mobile Robot (AMR)'}
            </Typography>
            <Typography className={classes.label}>
              {'Melih KORKMAZ'}
            </Typography>
          </Hidden>
        </Toolbar>
      </AppBar>
    </div>
  );
}
