// @flow
import React, { Component } from 'react';
import { EditorState, convertToRaw, Modifier } from 'draft-js';
import { getSelectedBlock, getSelectionText } from 'draftjs-utils'
import { Editor } from 'react-draft-wysiwyg';
import Chip from '@material-ui/core/Chip';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'draft-js/dist/Draft.css'

// define rendering styles
const styles = {
  root: {
    fontFamily: '\'Helvetica\', sans-serif',
    padding: 20,
    width: 600,
  },
  editor: {
    border: '1px solid #ddd',
    cursor: 'text',
    fontSize: 16,
    minHeight: 40,
    padding: 10,
  },
  button: {
    marginTop: 10,
    textAlign: 'center',
  },
  handle: {
    '&:hover':{
      pointerEvents: 'none,\'!important\'',
      backgroundColor: 'rgba(0, 10, 254, 1.0)'
    },
    '&:active': {
      pointerEvents: 'none',
      backgroundColor: 'rgba(0, 10, 254, 1.0)'
    },
    pointerEvents: 'none,\'!important\'',
    color: 'rgba(98, 177, 254, 1.0)',
    direction: 'ltr',
    unicodeBidi: 'bidi-override',
  },

  immutable: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: '2px 0',
  },
  mutable: {
    backgroundColor: 'rgba(204, 204, 255, 1.0)',
    padding: '2px 0',
  },
  segmented: {
    backgroundColor: 'rgba(248, 222, 126, 1.0)',
    padding: '2px 0',
  },
};

//find online regex tester beforehand
const CUSTOM_REGEX =
  { //regular expression to match {{ ... }}
    regex: /(?:{{){1}[^{}]*(?:}}){1}/g,
    type: 'custom',
  }

const customStrategy = (contentBlock, callback, contentState) => {
  // console.log not removed to provide function on how to get text
  console.log(contentState.getBlockForKey(contentBlock.key).getText())
  return findWithRegex(CUSTOM_REGEX, contentBlock, callback, contentState);
}

const findWithRegex = (regex, contentBlock, callback) => {
  const text = contentBlock.getText();
  let matchArr, start;
  while ((matchArr = regex.regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[ 0 ].length);
  }
}
const CustomSpan = (props) => {
  const { length } = props.children[0].props.text
  const showText = props.children[0].props.text.slice(2,length-2)
  return (
      <Chip
        style={styles.handle}
        data-offset-key={props.offsetKey}
        label={'{{'+showText+'}}'}
      >
        props.children[0].props.text
      </Chip>

  );
};

class HtmlEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      // contentState: null,
    };
    this.onChange = (editorState) => this.setState({ editorState });
    //this.onContentChange = (contentState) => this.setState({contentState});
  }
 
  //multiple decorator allowed here
  compositeDecorator = () => {
    return (
      [
        {
          strategy: customStrategy,
          component: CustomSpan,
        },

      ])
  }

  // this function is detect where cursor is inside the token
  findWithinAtomic = (cursorPosition, text ) => {
    let matchArr, start, end;
    while ((matchArr = CUSTOM_REGEX.regex.exec(text)) !== null) {
      start = matchArr.index;
      end = start + matchArr[ 0 ].length;
      console.log(start, end)
      if( cursorPosition < end   && cursorPosition > start ) {
        CUSTOM_REGEX.regex.lastIndex = 0;
        return 'found';
      }
    }
    CUSTOM_REGEX.regex.lastIndex = 0;
    return 'not-found';
  }

  //processing before input anything, noted if insert not from keyboard, this function is not being touched\
  //return handled, editor will not react to this input.
  handleBeforeInput = (_, editorState) => {
    const selectionState = editorState.getSelection();
    const cursorPosition = selectionState.getFocusOffset();
    const contentBlock = getSelectedBlock(editorState);
    const text = contentBlock.getText();
    return this.findWithinAtomic(cursorPosition, text) === 'found' ? 'handled' : 'not-handled';
  }

  handleDrop = (selectionState, dataTransfer, _)=>{
    const cursorPosition = selectionState.getFocusOffset();
    const contentState = this.state.editorState.getCurrentContent()
    const contentBlock = getSelectedBlock(this.state.editorState);
    const text = contentBlock.getText();
    if (this.findWithinAtomic(cursorPosition, text) === 'not-found') {
      const data = dataTransfer.data.getData("text")
      let new3ContentState = Modifier.replaceText(
        contentState,
        selectionState,
        data,
        this.state.editorState.getCurrentInlineStyle(),
      );
      let newEditorState = EditorState.push(this.state.editorState, new3ContentState, 'insert-characters');

      this.setState({ editorState: newEditorState })
      return 'handled'
    }else {
      return 'handled';
    }
  }

  // a lot more command handling logics go here
  handleKeyCommand = (command, editorState) => {
    // disable delete
    if ( command === 'backspace') {
      const selectionState = editorState.getSelection();
      const cursorPosition = selectionState.getFocusOffset();
      const contentBlock = getSelectedBlock(editorState);
      const text = contentBlock.getText();
      let matchArr, start, end;
      console.log(cursorPosition)
      while ((matchArr = CUSTOM_REGEX.regex.exec(text)) !== null) {
        start = matchArr.index;
        end = start + matchArr[ 0 ].length;
        console.log(start, end)
        if (cursorPosition <= end && cursorPosition > start) {
          CUSTOM_REGEX.regex.lastIndex = 0;
          return 'handled';
        }
      }
      CUSTOM_REGEX.regex.lastIndex = 0;
    }
    return 'not-handled'
  }

  handleCopy = (e) => {
    e.clipboardData.setData('text', getSelectionText(this.state.editorState) )
    // prevent default behavior which prevent many features of the editor
    e.preventDefault()
  }

  render() {
    const {editorState} = this.state;
    console.log('render',convertToRaw(this.state.editorState.getCurrentContent()))
    console.log('selection',this.state.editorState.getSelection())
    return (
      // Editor will not receive the onCopy and onPaste event
      <div onCopy={this.handleCopy} onPaste={this.handlePaste}>
        <Editor
          //stripPastedStyles={false}
          //handle key or key combinations 
          handleKeyCommand={this.handleKeyCommand}
          //override default behavior of keyboard event
          handleBeforeInput={this.handleBeforeInput}
          //override default behavior of drop event
          handleDrop={(...props) => this.handleDrop(...props)}
          //Decorator is used to define how to render text
          customDecorators={this.compositeDecorator()}
          editorState={editorState}
          onEditorStateChange={this.onChange}
        />
      </div>
    );
  }
}

export default HtmlEditor;
