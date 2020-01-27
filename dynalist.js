const request = require('request');

const Dynalist = function (token) {
    this.token = token;
};

Dynalist.prototype.apiBaseUrl = 'https://dynalist.io/api/v1/';
Dynalist.prototype.linkBaseUrl = 'https://dynalist.io/d/';

Dynalist.prototype.setToken = function (token) {
    this.token = token;
};

// API Endpoints

Dynalist.prototype.listFiles = function (callback) {
    this.makeRequest('file/list', {}, callback);
};

Dynalist.prototype.editFile = function (changes, callback) {
    this.makeRequest('file/edit', {
        changes: changes
    }, callback);
};

Dynalist.prototype.readDocument = function (file_id, callback) {
    this.makeRequest('doc/read', {
        file_id: file_id
    }, callback);
};

Dynalist.prototype.checkForDocumentUpdates = function (file_ids, callback) {
    this.makeRequest('doc/check_for_updates', {
        file_ids: file_ids
    }, callback);
};

Dynalist.prototype.editDocument = function (file_id, changes, callback) {
    this.makeRequest('doc/edit', {
        file_id: file_id,
        changes: changes
    }, callback);
};

Dynalist.prototype.sendToInbox = function (content, options, callback) {
    if (typeof options === 'function') {
        callback = options;

        options = {};
    }

    options.content = content;

    this.makeRequest('inbox/add', options, callback);
};

Dynalist.prototype.upload = function (filename, content_type, data, callback) {
    this.makeRequest('doc/edit', {
        filename: filename,
        content_type: content_type,
        data: data
    }, callback);
};

// Internal

Dynalist.prototype.makeRequest = function (endpoint, data, callback) {
    data.token = this.token;

    request({
        url: this.apiBaseUrl + endpoint,
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        json: data
    }, function (err, res, response) {
        if (err) {
            // Error in HTTP request - return object that is formatted like a Dynalist error
            return callback({
                _code: err,
                _msg: err,
            });
        }

        // Return response as error
        if (response._code !== 'Ok') {
            return callback(response);
        }

        // Success
        callback(null, response);
    });
};

// Utilities

Dynalist.prototype.buildUrl = function (file_id, node_id) {
    let url = this.linkBaseUrl + file_id;

    if (node_id) {
        url += '#z=' + node_id;
    }

    return url;
};

Dynalist.prototype.buildNodeMap = function (nodes) {
    let nodeMap = {},
        i;

    for (i in nodes) {
        nodeMap[nodes[i].id] = nodes[i];
    }

    for (i in nodes) {
        for (k in nodes[i].children) {
            nodeMap[nodes[i].children[k]].parent = nodes[i].id;
        }
    }

    return nodeMap;
};

Dynalist.prototype.buildNodeTree = function (nodes) {
    let nodeMap = this.buildNodeMap(nodes),
        tree = recurse('root');

    function recurse(id) {
        let node = nodeMap[id],
            k,
            childId;

        if (node.children) {
            for (k in node.children) {
                childId = node.children[k];

                node.children[k] = recurse(childId);
            }
        }

        return node;
    }

    return tree;
};

module.exports = Dynalist;
