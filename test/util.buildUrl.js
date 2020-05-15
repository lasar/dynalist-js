const should = require('should');

const Client = require('../');

const env = require('./env');

describe('Util#buildUrl', function () {
    it('should return URL to a document', function() {
        const dyn = new Client(env.apiToken);

        const url = dyn.util.buildUrl(env.fileId);

        url.should.be.exactly(dyn.linkBaseUrl + env.fileId)
    });

    it('should return URL to a node in a document', function() {
        const dyn = new Client(env.apiToken);

        const url = dyn.util.buildUrl(env.fileId, 'myNodeId');

        url.should.be.exactly(dyn.linkBaseUrl + env.fileId + '#z=myNodeId');
    });
});
