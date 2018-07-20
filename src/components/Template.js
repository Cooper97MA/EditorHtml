import React, { Component } from 'react';
import DraggableWord from './DraggableWord'

class Template extends Component {
  state = {
    tempalte:
      [
        "Drag me!",
        "Dear Coherent",
        "Hello World!",
        "Take Me !!!"
      ]
  }

  render() {
    return (
      <div>
        {
          this.state.tempalte.map((word) => (
            <DraggableWord key={word} word={word} />
          ))
        }
      </div>
    );
  }
}

export default Template;