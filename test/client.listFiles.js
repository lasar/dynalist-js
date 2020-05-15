const should = require('should');

const Client = require('../');

const env = require('./env');

// Using listFiles to verify that all interaction modes (callback, promise, async/await) work.

describe('Client#listFiles', function () {
    it('should work with async/await', async function () {
        const dyn = new Client(env.apiToken);

        const response = await dyn.listFiles();

        verifyResponse(response);
    });

    it('should work with promise', function (end) {
        const dyn = new Client(env.apiToken);

        dyn.listFiles()
            .then(function (response) {
                response.should.be.an.Object();
                end();
            });
    });

    it('should work with callback', function (end) {
        const dyn = new Client(env.apiToken);

        dyn.listFiles(function (err, response) {
            response.should.be.an.Object();
            end();
        });
    });

    function verifyResponse(response) {
        response.should.be.an.Object();

        response.should.have.key('_code');
        response._code.should.be.exactly('Ok');

        response.should.have.key('files');
        response.files.should.be.an.Array();
        response.files.should.not.be.empty();
    }
});
