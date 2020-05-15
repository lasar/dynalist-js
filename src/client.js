const request = require('request');

const Utilities = require('./utilities');

const Client = function (token) {
    this.token = token;

    this.util = new Utilities(this);
};

Client.prototype.apiBaseUrl = 'https://dynalist.io/api/v1/';
Client.prototype.linkBaseUrl = 'https://dynalist.io/d/';

Client.prototype.setToken = function (token) {
    this.token = token;
};

// API Endpoints

Client.prototype.listFiles = function (callback) {
    return this.makeRequest('file/list', {}, callback);
};

Client.prototype.editFile = function (changes, callback) {
    const data = {
        changes: changes
    };

    return this.makeRequest('file/edit', data, callback);
};

Client.prototype.readDocument = function (file_id, callback) {
    const data = {
        file_id: file_id
    };

    return this.makeRequest('doc/read', data, callback);
};

Client.prototype.checkForDocumentUpdates = function (file_ids, callback) {
    const data = {
        file_ids: file_ids
    };

    return this.makeRequest('doc/check_for_updates', data, callback);
};

Client.prototype.editDocument = function (file_id, changes, callback) {
    const data = {
        file_id: file_id,
        changes: changes
    };

    return this.makeRequest('doc/edit', data, callback);
};

Client.prototype.sendToInbox = function (content, data, callback) {
    if (typeof data === 'function') {
        callback = data;

        data = {};
    }

    data.content = content;

    return this.makeRequest('inbox/add', data, callback);
};

// Internal

Client.prototype.makeRequest = function (endpoint, data, callback) {
    const self = this;

    return new Promise(async (resolve, reject) => {
        data.token = self.token;

        const options = {
            url: self.apiBaseUrl + endpoint,
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            json: data
        };

        request(options, function (err, res, response) {
            if (err) {
                // Error in HTTP request - return object that is formatted like a Client error
                const errorData = {
                    _code: err,
                    _msg: err,
                };

                if(typeof callback === 'function') {
                    callback(errorData);
                }

                reject(errorData);

                return;
            }

            // Return response as error
            if (response._code !== 'Ok') {
                if(typeof callback === 'function') {
                    callback(response);
                }

                reject(response);
            }

            // Success
            if(typeof callback === 'function') {
                callback(null, response);
            }

            resolve(response);
        });
    });
};

module.exports = Client;
