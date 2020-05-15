const should = require('should');

const Client = require('../');

// const env = require('./env');

describe('setToken', function () {
    it('should store the passed API token', function() {
        const testToken = 'testToken';

        const dyn = new Client();
        dyn.setToken(testToken);

        dyn.token.should.be.exactly(testToken);
    });
});
