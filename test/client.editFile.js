const should = require('should');

const Client = require('../');

const env = require('./env');

describe('Client#editFile', function () {
    it('should edit a document', async function () {
        const originalTitle = await getOriginalTitle();

        const dyn = new Client(env.apiToken);

        const response = await dyn.editFile([
            {
                action: 'edit',
                type: 'document',
                file_id: env.fileId,
                title: originalTitle + ' (edited)'
            }
        ]);

        response.should.be.an.Object();

        response.should.have.key('_code');
        response._code.should.be.exactly('Ok');

        response.should.have.key('results');
        response.results.should.be.an.Array();
        response.results.should.not.be.empty();
        response.results[0].should.be.exactly(true);

        // Change it back to be nice.
        await dyn.editFile([
            {
                action: 'edit',
                type: 'document',
                file_id: env.fileId,
                title: originalTitle
            }
        ]);
    });

    it('should move a document');
});

async function getOriginalTitle() {
    const dyn = new Client(env.apiToken);

    const response = await dyn.listFiles();

    for (let i in response.files) {
        if (response.files[i].id === env.fileId) {
            return response.files[i].title;
        }
    }

    return null;
}
