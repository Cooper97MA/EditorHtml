# Editor
### Prerequisite
- node 6.x
- yarn 1.x

### Install node modules
run `yarn install`

### Run development server
`yarn run start`
It will start express server on development mode and you can open `http://localhost:3000/create` on browser

### Description
  It is a `htmlEditor` which is used to edit text(fontType, fontSize, colorPicker), image, entity(video, audio, link).  
  It is build on `draftjs` and `react-draft-wysiwyg`, it is not being wrapped into a package as it is halfway done and the right means to use those additional function in the this edtior is not issue a pull request on react-draft-wysiwyg or put the package on your github and modify the file inside to integrate the feature you want into the react-draft-wysiwyg editor. This is the initial thinking of what is the right way to add aditionaly funcionality. A quick remainder: if you ever want to modify source code of node-modulers, download from github and modify locally.  
  The goal is to add `token` into the editor through `drag and drop`. The problem is how you could do it. Two choices, one is mentaining an `entity map` to indicate where the token is, another is trough detecting the predefined pattern to decide whether certain text is a token or not. Problem with the formmer is the underlying editor doesnot support copy and paste which means mentaining the entity attribute of text pattern. while, problem with the latter is the way of handling 'token' doesnot follow the principle, that the text and text feature should be seperated, and it is way more harder to solve the latter than the formmer.  
  Through this readme file, some experience on how to use predefined functions is given.  
  In the file `src/components/DraggableWord.js`, onDragStart function is used, which set the data of what is being transferred here. The Chip is from materail-ui and doesnot need to be used here. file `Template.js` include some packages for drag and drop, it is not used.  
  The file `Editor.js` is where manipulating pured on text patterns happens and the file `HtmlEditor.js` tries to mentain entity map.  
### Pitfalls
  manipulation on text is default on current block, but if you want to get current block inside some function without this parameter, check `draftjs-utils`.
  use `get selection`to get the cursor position 

### Useful reference
 `draftjs-utils`: provides useful functions on get current block.   
 `draftjs`: provides most of the function.
 ### Demo
 ![editor](https://github.com/Cooper97MA/EditorHtml/blob/master/public/12.PNG)
 
