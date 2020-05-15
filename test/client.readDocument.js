const should = require('should');

const Client = require('../');

const env = require('./env');

describe('Client#readDocument', function () {
    it('should return a proper response', async function () {
        const dyn = new Client(env.apiToken);

        const response = await dyn.readDocument(env.fileId);

        env.verifySuccess(response);

        response.file_id.should.be.exactly(env.fileId);
        response.title.should.be.a.String();
        response.nodes.should.be.an.Array();
        response.nodes.should.not.be.empty();
    });

    it('should fail when passed a bogus API token', async function() {
        const dyn = new Client('bogus');

        const response = await dyn.readDocument(env.fileId);

        env.verifyFailure(response, 'InvalidToken');
    });

    it('should fail when passed a bogus ID', async function() {
        const dyn = new Client(env.apiToken);

        const response = await dyn.readDocument('bogus');

        env.verifyFailure(response, 'NotFound');
    });
});
