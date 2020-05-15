const should = require('should');

const Client = require('../');

describe('Client#setToken', function () {
    it('should store the passed API token', function() {
        const testToken = 'testToken';

        const dyn = new Client();
        dyn.setToken(testToken);

        dyn.token.should.be.exactly(testToken);
    });
});
