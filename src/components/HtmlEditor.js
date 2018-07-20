// @flow
import React, { Component } from 'react';
import {CompositeDecorator, EditorState, convertToRaw, convertFromRaw, Modifier, AtomicBlockUtils,ContentBlock } from 'draft-js';
import { getSelectedBlock } from 'draftjs-utils'
import Parser from 'html-react-parser'
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'draft-js/dist/Draft.css'

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
  hashtag: {
    color: 'rgba(95, 184, 138, 1.0)',
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
const ID_REGEX = /%[\d]+%/;
const WORD_REGEX = /[\d]%.+}}/;
const CUSTOM_REGEX =
  {
    regex: /{{%[\d]+%.+}}/g,
    type: 'custom',
  }
const HANDLE_REGEX =
  {
    regex: /\@[\w]+/g,
    type: 'handle',
  }
const HASHTAG_REGEX =
  {
    regex: /\#[\w\u0590-\u05ff]+/g,
    type: 'hashtag',
  }

const getDecoratedStyle = (mutability) => {
  switch (mutability) {
    case 'IMMUTABLE': return styles.immutable;
    case 'MUTABLE': return styles.mutable;
    case 'SEGMENTED': return styles.segmented;
    default: return null;
  }
}

const getEntityStrategy = (type) => {
  return function(contentBlock, callback, contentState){
    contentBlock.findEntityRanges(
      (character) => {
        const entityKey = character.getEntity();
        if (entityKey === null) {
          return false;
        }
        return contentState.getEntity(entityKey).getType() === 'ATOMIC' ;
      },
      callback
    );
  };
}

/*const customStrategy = (contentBlock, callback, contentState) => {
  return findWithRegex(CUSTOM_REGEX, contentBlock, callback, contentState);
}

const handleStrategy = (contentBlock, callback, contentState) => {
  findWithRegex(HANDLE_REGEX, contentBlock, callback, contentState);
}

const hashtagStrategy = (contentBlock, callback, contentState) => {
  findWithRegex(HASHTAG_REGEX, contentBlock, callback, contentState);
}
const showTable = (block) => {
  if (block.getType() === 'atomic') {
    return {
      component: CustomTable,
      editable: true,
    };
  }
  return null;
}

const creatEntity = ( contentBlock, contentState, matchArr, text, id ) => {

  return AddEntityToken(
    contentState,
    {
      text: text,
      blockKey: contentBlock.getKey(),
      start: matchArr.index,
      length: matchArr[ 0 ].length,
      match: matchArr,
      key: id,
    },
  );
}

const parseId = (matchArr) => {
 const matchId = ID_REGEX.exec(matchArr);
 return matchId[0].slice(1, matchId[0].length-1)
}

const parseWord = (matchArr) => {
  const matchWord = WORD_REGEX.exec(matchArr);
  return matchWord[0].slice(2, matchWord[0].length-2)
}

const findWithRegex = (regex, contentBlock, callback, contentState) => {
  const text = contentBlock.getText();
  let matchArr, start, newText = null;
  let newContentState = contentState;
  let change = false;
  while ((matchArr = regex.regex.exec(text)) !== null) {
    if (regex.type = 'custom') {
      const id = Number(parseId(matchArr))
      newContentState = creatEntity(contentBlock, newContentState, matchArr, text, id);
      change = true;
    }
    start = matchArr.index;
    callback(start, start + matchArr[ 0 ].length);
  }
  return change === true ? newContentState : null;
}

const AddEntityToken = (contentState, token = null) => {
  if (token) {
    const raw = convertToRaw(contentState);
    const word = parseWord(token.match);
    const { blocks, entityMap } = raw;
    const newBlocks = blocks.reduce((acc, block) => {
      if (block.key === token.blockKey) {
        const { entityRanges } = block;
          const newBlock = {
            ...block,
            text: token.text.slice(0, token.start) + word + token.text.slice(token.start+token.length) ,
            entityRanges: [
              ...entityRanges,
              {
                offset: token.start,
                length: word.length,
                key: token.key,
              }
            ],
          }
          return (
            [
              ...acc,
              newBlock
            ]
          )
        }
        return (
          [
            ...acc,
            block
          ]
        )
    }, [])
    //console.log('newbLOCK',newBlocks)let newEntityMap = entityMap;
    const newEntityMap = {
      ...entityMap,
      [token.key]: {
        type: 'TOKEN',
        mutability: 'IMMUTABLE',
        data:{
          type: 'token',
          offset: token.start,
          length: word.length,
        },
      }
    };
    //console.log('newMap',newEntityMap)
    const newRaw = {
      blocks: newBlocks,
      entityMap: newEntityMap,
    }
    const newContentState = convertFromRaw(newRaw);
    return newContentState;
  }
  return contentState ;
}*/

const CustomSpan = (props) => {
  /*const style = getDecoratedStyle(
    props.contentState.getEntity(props.entityKey).getMutability()
  );*/
  //console.log( props.children)
  //return ( props.children[0].props.text);
  return (
    <span
      id={'atomic'}
      style={styles.handle}
      data-offset-key={props.offsetKey}
    >
     {props.children[0].props.text}
    </span>
  );
};

/*const CustomTable = (props) => {
  console.log('called')

  return (
     <Table>
    <TableHead>
      <TableRow>
        <TableCell >
          Name
        </TableCell>
        <TableCell >
          Created
        </TableCell>
        <TableCell >
          Last Modified
        </TableCell>
        <TableCell>
          Status
        </TableCell>
        <TableCell>
          Select
        </TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow
        hover={true}
      >
        <TableCell
        >
          <Chip lable={'hello'} />
        </TableCell>
        <TableCell
        >df
        </TableCell>
        <TableCell
        >dfs
        </TableCell>
        <TableCell
        >dfs
        </TableCell>
        <TableCell
        >dfs
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
  )

}*/

const HandleSpan = (props) => {
  return (
    <span
      id={'atomic'}
      style={styles.handle}
      data-offset-key={props.offsetKey}
    >
      {props.children[0].props.text}
    </span>
  );
};

const HashtagSpan = (props) => {
  return (
    <span
      style={styles.hashtag}
      data-offset-key={props.offsetKey}
    >
      {props.children}
    </span>
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
  AddEntity = (...props) => {
      const newContentState = customStrategy(...props)
      return new Promise((resolve, reject)=>{
          if (newContentState) {
            resolve(
              EditorState.createWithContent(newContentState)
             );
          }else{
            reject('notUpdated');
          }
      })
  }

  compositeDecorator = () => {
    return (
      [
        /*{
          strategy: (...props)=>this.AddEntity(...props)
            .then(value=>{
             // console.log('new',value)
              this.setState({editorState: value})
              },
              reason=>{console.log(reason)})
        },*/
        {
          strategy:  (...props) =>{
            getEntityStrategy('ATOMIC')(...props);
          },
          component: CustomSpan,
        },

    ])
  }


  handleCursorMoveOnAtomic = (editorState) =>{
    const selectionState = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const contentBlock = getSelectedBlock(editorState);
    const blockKey = contentBlock.key;
    let entityRanges = null;
    convertToRaw(contentState).blocks.forEach((block)=>{
      if(block.key === blockKey) {
        entityRanges = block.entityRanges;
      }
    })
    let ans = true;
    if( selectionState ) {
      let start = null;
      let end = null;
      let offset = null
      const cursorPosition = selectionState.getFocusOffset();
      contentBlock.findEntityRanges(
        (character) => {
          const entityKey = character.getEntity();
          if (entityKey === null) {
            return false
          }
          const type = contentState.getEntity(entityKey).getType()
          if ( type !== 'ATOMIC'){
            return false
          }
          const rangeData = entityRanges[entityKey-1]
          if( rangeData === 'undefined'){
            return false
          }
          start = rangeData.offset;
          end = rangeData.offset + rangeData.length;
          if (cursorPosition === end - 1 ) {
            offset = start;
            return true;
          }
          if( cursorPosition === start + 1) {
            offset = end;
            return true;
          }
          if (cursorPosition < end - 1 && cursorPosition > start + 1) {
            offset = end
            return true;
          }
          return false;
        },
        () => {
          const newSelectionState = selectionState.set('anchorOffset', offset).set('focusOffset', offset)
          if ( typeof (newSelectionState) !== 'undefined' ) {
            this.setState({editorState: EditorState.forceSelection(editorState, newSelectionState)})
            ans = false;
          }

        }
      );
    }
    return ans;
  }
  /*confirmTable = (e) =>{
    e.preventDefault();
    const { editorState } = this.state;
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'Table',
      'MUTABLE',
      {type:'table'}
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(
      editorState,
      {currentContent: contentStateWithEntity}
    );

    this.setState({
      editorState: AtomicBlockUtils.insertAtomicBlock(
        newEditorState,
        entityKey,
        ' '
      ),
    })
  }*/

  handleBeforeInput = () => {
    const { editorState } = this.state;
    const selectionState = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const contentBlock = getSelectedBlock(editorState);
    const blockKey = contentBlock.key;
    let entityRanges = null;
    convertToRaw(contentState).blocks.forEach((block)=>{
      if(block.key === blockKey) {
        entityRanges = block.entityRanges;
      }
    })
    let ans = 'not-handled';
    if( selectionState ) {
      let start = null;
      let end = null;
      const cursorPosition = selectionState.getFocusOffset();
      contentBlock.findEntityRanges(
        (character) => {
          const entityKey = character.getEntity();
          if (entityKey === null) {
            return false
          }
          const type = contentState.getEntity(entityKey).getType()
          if ( type !== 'LINK'){
            return false
          }
          console.log(entityKey,cursorPosition)
          const rangeData = entityRanges[entityKey-1]
          start = rangeData.offset;
          end = rangeData.offset + rangeData.length;
          if (cursorPosition <= end - 1 && cursorPosition >= start + 1 ) {
            return true
          }else{
            return false
          }
        },
        () => {
          ans = 'handled';
          }
      );
    }
    return ans;
  }

  handleDrop = (selectionState, dataTransfer, isInternal)=>{
    const contentState = this.state.editorState.getCurrentContent()
    const data = dataTransfer.data.getData("text")
    const contentStateWithEntity = contentState.createEntity(
      'LINK',
      'MUTABLE',
      {}
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    /*const cursorPosition = selectionState.getFocusOffset();
    const newSelectionState = selectionState.set('anchorOffset', cursorPosition).set('focusOffset', cursorPosition)
    //const newContentState = Modifier.insertText(contentState, newSelectionState, data )
    const new2SelectionState = selectionState
      .set('anchorOffset', cursorPosition)
      .set('focusOffset', cursorPosition + data.length)*/
   /* const new2ContentState = Modifier.applyEntity(
      contentState,
      new2SelectionState,
      entityKey
    )*/
    let new3ContentState = Modifier.replaceText(
      contentState,
      selectionState,
      data,
      this.state.editorState.getCurrentInlineStyle(),
      entityKey,
    );
    let newEditorState = EditorState.push(this.state.editorState, new3ContentState, 'insert-characters');

    //const newEditorState = EditorState.createWithContent(new2ContentState)
    this.setState({editorState: newEditorState })
    return 'handled'
    //console.log(convertToRaw(newEditorState.getCurrentContent()))
  }

  handlePaste = (e) => {
    let data = e.clipboardData.getData('text/html')
    console.log(data)
    data = Parser ( data, {
      replace: (domNode)=>{
        if(domNode.attribs && domNode.attribs.id === 'atomic'){
          return <span>{domNode.children}</span>
        }
      }
    } );
    e.clipboardData.setData('text/html',data)
  }


  /*shouldComponentUpdate(nextProps, nextState) {
    const isAtomic = this. handleCursorMoveOnAtomic(nextState.editorState);
    return isAtomic;
  }*/

  render() {
    const {editorState} = this.state;
    console.log('render',convertToRaw(this.state.editorState.getCurrentContent()))
    console.log('selection',this.state.editorState.getSelection())
    return (
      <div ref={ref => this.editor = ref}>
        <Editor
          stripPastedStyles={false}
          handleBeforeInput={this.handleBeforeInput}
          handleDrop={(...props)=>this.handleDrop(...props)}
         // blockRendererFn={showTable}
         // handlePastedText={this.handlePastedText}
          customDecorators={this.compositeDecorator()}
          editorState={editorState}
          onEditorStateChange={this.onChange}
        />
      </div>
    );
  }
}

export default HtmlEditor;