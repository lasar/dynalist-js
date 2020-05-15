const should = require('should');

// Verify that required vars were defined
if (typeof process.env.API_TOKEN === 'undefined' || typeof process.env.FILE_ID === 'undefined') {
    console.log('');
    console.log('Usage: API_TOKEN=MyApiToken FILE_ID=MyTestDocumentId npm test');
    console.log('');
    process.exit();
}

module.exports = {
    apiToken: process.env.API_TOKEN,
    fileId: process.env.FILE_ID,
    sleepForHuman: false,
    verifySuccess: function(response) {
        response.should.be.an.Object();

        response.should.have.key('_success');
        response._success.should.be.a.Boolean();
        response._success.should.be.exactly(true);

        response.should.have.key('_code');
        response._code.should.be.exactly('Ok');
    },
    verifyFailure: function(response, expectedCode) {
        response.should.be.an.Object();

        response.should.have.key('_success');
        response._success.should.be.a.Boolean();
        response._success.should.be.exactly(false);

        response.should.have.key('_code');
        response._code.should.be.exactly(expectedCode);
    },
};
