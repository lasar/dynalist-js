# client.js - a Node.JS Client for dynalist.io

![CI](https://github.com/lasar/dynalist-js/workflows/Node.js%20CI/badge.svg) ![Package Build](https://github.com/lasar/dynalist-js/workflows/Node.js%20Package/badge.svg)

A thin client for accessing the Client API.

- [Dynalist home page](https://dynalist.io)
- [Official API documentation](https://apidocs.dynalist.io/)
- [Client Developer page](https://dynalist.io/developer) for generating a Secret Token to access the API

## Installation

```bash
# NPM:
npm install dynalist-js

# Yarn:
yarn add dynalist-js
```

## API client usage

### Create Dynalist client instance

Require the module, then create an instance with the API Secret Token.

```js
const Client = require('dynalist-js');

const dyn = new Client('<my developer api token>');
```
    
The API token can also be set/changed afterwards:

```js
dyn.setToken('<my developer api token>');
```

### Promises

All API methods return a promise object that can be used with `.then` or async/await.

### Callbacks

All API methods can be called with a callback function as the last parameter.

Callback functions are always called with `err` and `data` parameters.

`err` is either `null` or an object with the attributes `_code` and `_msg` as described [in the API documentation](https://apidocs.dynalist.io/#common-error-reference).

`data` is an object representing the JSON response without modifications.

## API methods

### listFiles - Get all documents and folders

```js
// Using promise interface

dyn.listFiles()
    .then(response => console.log)
    .catch(error => console.log);

// Using async/await

async function getMyFiles() {
    const data = await dyn.listFiles();

    // …
}

// With callback

dyn.listFiles(function(err, data) {
    // …
});
```

You can use `dyn.buildNodeTree(data.files)` to create a hierarchical tree of folders and files.

### editFile - Make changes to documents and folders

```js
let changes = [
    // …
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

You can use `dyn.buildNodeTree(data.nodes)` to create a hierarchical tree of the content.

### checkForDocumentUpdates - Check if documents has been updated

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

See [API documentation](https://apidocs.dynalist.io/#make-change-to-the-content-of-a-document) for formatting `changes`.

### sendToInbox - Send to inbox

```js
let content = 'Call Dana';

let options = {
    index: -1,
    // See API documentation for more options:
    // https://apidocs.dynalist.io/#send-to-inbox
};

dyn.sendToInbox(content, options, function(err, data) {
    // …
});
```

`options` can be omitted when not needed:

```js
dyn.sendToInbox('Call Fox', function(err, data) {
    // …
});
```
    
### upload - Upload file (Pro only)

This API method is not yet implemented.

## Utilities

Some helpers to massage data. They work only on local data.

### util.buildUrl - Generate URL to document/node

```js
let file_id = 'fe7a87a626f241b18ef30661';

let link_to_document = dyn.util.buildUrl(file_id);
// => https://dynalist.io/d/fe7a87a626f241b18ef30661

let node_id = '7be6403186fb8a7ed11931ed';

let link_to_node = dyn.util.buildUrl(file_id, node_id);
// => https://dynalist.io/d/fe7a87a626f241b18ef30661#z=7be6403186fb8a7ed11931ed
```

### util.buildNodeMap - Generate a hash map of nodes

The document tree and the node tree inside a file are returned from the API as a flat array.

This method converts that array into an object with each node's id as the key. 

```js
dyn.readDocument('my document id', function(err, doc) {
    const nodeMap = dyn.util.buildNodeMap(doc.nodes);
    
    // Now the nodes can be accessed by using their ID as the key:
    console.log(nodeMap['7be6403186fb8a7ed11931ed']);
});
```

### util.buildNodeTree - Generate a tree of nodes

Converts a flat array of nodes into a tree based on `children` associations. 

```js
dyn.readDocument(documentId, function(err, doc) {
    const tree = dyn.util.buildNodeTree(doc.nodes);

    console.log(JSON.stringify(tree, 0, 4));
});
```

## Test

Rudimentary tests exist but could be extended by a lot. They are written with `mocha` and `should`.

The tests require a working API token and the ID of a file that can be used by the tests. The file will be modified, therefore it should not contain actually important information.
Also note that frequent test runs may run into the API's rate limiting.

There is no option to run tests only offline yet. **Tests WILL modify data in your account.**

```bash
# Install dependencies
npm install

# Run test, passing in API token and file ID as environment variables
API_TOKEN=my_api_token FILE_ID=my_test_file npm test

# If you want to pass options to mocha you need to call mocha directly: 
API_TOKEN=my_api_token FILE_ID=my_test_file ./node_modules/.bin/mocha --grep "Client#listFiles" 
```
