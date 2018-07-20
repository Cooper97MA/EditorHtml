import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import blue from "@material-ui/core/colors/blue";
import grey from "@material-ui/core/colors/grey";

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '&:hover': {
      color: blue[500],
      shadowOffsetX: '5px',
      shadowOffsetY: '5px',
      shadowColor: grey[700],
    },
  },
  chip: {
    margin: theme.spacing.unit,

  },
});

class DraggableWord extends Component {
  render() {
    const { classes, word } = this.props;
    return (
      <div className={classes.root}>
        <Chip
          className={classes.chip}
          onClick={()=>{}}
          onDragStart={(e) => {
            e.dataTransfer.setData("Text", '{{'+word + '}}');
            //e.dataTransfer.setData("Text", word  );
          }}
          draggable="true"
          label={word}
        >
        </Chip>
      </div>
    );
  }
}

export default withStyles(styles)(DraggableWord);