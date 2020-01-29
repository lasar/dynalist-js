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
    const data = {
        changes: changes
    };

    this.makeRequest('file/edit', data, callback);
};

Dynalist.prototype.readDocument = function (file_id, callback) {
    const data = {
        file_id: file_id
    };

    this.makeRequest('doc/read', data, callback);
};

Dynalist.prototype.checkForDocumentUpdates = function (file_ids, callback) {
    const data = {
        file_ids: file_ids
    };

    this.makeRequest('doc/check_for_updates', data, callback);
};

Dynalist.prototype.editDocument = function (file_id, changes, callback) {
    const data = {
        file_id: file_id,
        changes: changes
    };

    this.makeRequest('doc/edit', data, callback);
};

Dynalist.prototype.sendToInbox = function (content, data, callback) {
    if (typeof data === 'function') {
        callback = data;

        data = {};
    }

    data.content = content;

    this.makeRequest('inbox/add', data, callback);
};

Dynalist.prototype.upload = function (filename, content_type, file_data, callback) {
    const data = {
        filename: filename,
        content_type: content_type,
        data: file_data
    };

    this.makeRequest('doc/edit', data, callback);
};

// Internal

Dynalist.prototype.makeRequest = function (endpoint, data, callback) {
    data.token = this.token;

    const options = {
        url: this.apiBaseUrl + endpoint,
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        json: data
    };

    request(options, function (err, res, response) {
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
    let nodeMap = {};

    Object.keys(nodes).forEach(function(key) {
        const node = nodes[key];

        nodeMap[node.id] = node;
    });

    Object.keys(nodes).forEach(function(key) {
        const node = nodes[key];

        let k;

        for (k in node.children) {
            nodeMap[node.children[k]].parent = node.id;
        }
    });

    return nodeMap;
};

Dynalist.prototype.buildNodeTree = function (nodes) {
    let nodeMap = this.buildNodeMap(nodes);

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

    return recurse('root');
};

module.exports = Dynalist;
