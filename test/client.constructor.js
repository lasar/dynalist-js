const should = require('should');

const Client = require('../');

describe('Client()', function () {
    it('should return an instance', function () {
        const dyn = new Client('testToken');

        dyn.should.be.an.Object();
    });

    it('should store the passed API token', function () {
        const testToken = 'testToken';

        const dyn = new Client(testToken);

        dyn.token.should.be.exactly(testToken);
    });
});
