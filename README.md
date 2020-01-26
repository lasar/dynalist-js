# dynalist.js - a Node.JS Client for dynalist.io

Based on the [official API documentation](https://apidocs.dynalist.io/).

## Callbacks

All callback functions are called with `err` and `data` parameters.

`err` is either `null` or an object with the attributes `_code` and `_msg` as described [in the API documentation](https://apidocs.dynalist.io/#common-error-reference).

`data` is an object representing the JSON response without modifications.

## API methods

### Create Dynalist client instance

Require the module, then create an instance with the api token.

```js
const Dynalist = require('dynalist');

const dyn = new Dynalist('<my developer api token>');
```
    
The API token can also be set/changed afterwards:

```js
dyn.setToken('<my developer api token>');
```

### listFiles - Get all documents and folders

```js
dyn.listFiles(function(err, data) {
    // …
});
```

### editFile - Make changes to documents and folders

**NOTE**: This method has not been implemented yet.

```js
let changes = [
    // See API documentation for formatting:
    // https://apidocs.dynalist.io/#make-change-to-the-content-of-a-document
];

dyn.editFile(changes, function(err, data) {
    // …
});
```

### readDocument - Get content of a document

```js
let file_id = '…';

dyn.readDocument(file_id, function(err, data) {
    // …
});
```

### checkForDocumentUpdates - Check if documents has been updated

**NOTE**: This method has not been implemented yet.

```js
let file_ids = ['…'];

dyn.checkForDocumentUpdates(file_ids, function(err, data) {
    // …
});
```

### editDocument - Make change to the content of a document

```js
let file_id = '…';

let changes = [
    // …
];

dyn.editDocument(file_id, changes, function(err, data) {
    // …
});
```

### sendToInbox - Send to inbox

```js
let content = 'Call Dave';

let options = {
    index: -1,
    // See API documentation for more options:
    // https://apidocs.dynalist.io/#send-to-inbox
};

dyn.sendToInbox(content, options, function(err, data) {
    // …
});
```

`options` is optional and can be omitted:

```js
dyn.sendToInbox('Call Anna', function(err, data) {
    // …
});
```
    
### upload - Upload file (Pro only)

**NOTE**: This method has not been implemented yet.

```js
dyn.upload(filename, content_type, data, callback) {
    // …
});
```

## Utilities

Some helpers to massage data. They work only on local data.

### buildUrl - Generate URL to document/node

```js
let file_id = 'fe7a87a626f241b18ef30661';

let link_to_document = dyn.buildUrl(file_id);
// => https://dynalist.io/d/UQX32RxuAERPfVQtNJpGHgxT

let node_id = '7be6403186fb8a7ed11931ed';

let link_to_node = dyn.buildUrl(file_id, node_id);
// => https://dynalist.io/d/UQX32RxuAERPfVQtNJpGHgxT#z=EJKenCUBeLhoPp3PoRGnBm9i
```

### buildNodeMap - Generate a hash map of nodes

The document tree and the node tree inside a file are returned from the API as a flat array.

This method converts that array into an object with each node's id as the key. 

```js
dyn.readDocument('my document id', function(err, doc) {
    const nodeMap = dyn.buildNodeMap(doc.nodes);
    
    console.log(nodeMap['jQvLeBjvZ35WAs_HxdtI1RWK']);
});
```

### buildNodeTree - Generate a tree of nodes

Converts a flat array of nodes into a tree based on `children` associations. 

```js
dyn.readDocument(documentId, function(err, doc) {
    const tree = dyn.buildNodeTree(doc.nodes);

    console.log(JSON.stringify(tree, 0, 4));
});
```

## To Do

This client is not done yet.

- Implement: `editFile` 
- Implement: `checkForDocumentUpdates` 
- Implement: `upload` 
- Testing
- License
- Expand examples in readme
- Create usable example scripts
