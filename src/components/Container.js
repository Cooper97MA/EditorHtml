import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles/index';
import blue from '@material-ui/core/colors/blue';
import grey from '@material-ui/core/colors/grey';
import green from '@material-ui/core/colors/grey';
import Grid from '@material-ui/core/Grid';
import HtmlEditor from './Editor';
import Template from './Template'

const styles = () => ({
  root: {
    width: '40%',
  },
  editor: {
    width: '400px',
    height: '200px',
    paddingLeft: '50px',
  },

});

class Container extends Component {

  render() {
    const { classes } = this.props
    return (
      <Grid container direction="row">
        <Grid className={classes.editor} item >
          <HtmlEditor />
        </Grid>
        <Grid item >
          <Template />
        </Grid>
      </Grid>
  );
  }
  }
  export default withStyles(styles)(Container);