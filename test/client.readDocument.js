const should = require('should');

const Client = require('../');

const env = require('./env');

describe('Client#readDocument', function () {
    it('should return a proper response', async function () {
        const dyn = new Client(env.apiToken);

        const response = await dyn.readDocument(env.fileId);

        response.should.be.an.Object();
        response._code.should.be.exactly('Ok');
        response.file_id.should.be.exactly(env.fileId);
        response.title.should.be.a.String();
        response.nodes.should.be.an.Array();
        response.nodes.should.not.be.empty();
    });
});
