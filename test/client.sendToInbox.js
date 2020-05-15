const should = require('should');
const sleep = require('sleep-promise');

const Client = require('../');

const env = require('./env');

describe('Client#sendToInbox', function () {
    let inboxFileId, inboxNodeId;

    it('should create an item', async function () {
        const dyn = new Client(env.apiToken);

        const response = await dyn.sendToInbox('test item', {
            checkbox: true,
            checked: false,
            note: 'Created by test suite'
        });

        env.verifySuccess(response);

        response.should.have.key('file_id');

        response.should.have.key('node_id');

        inboxFileId = response.file_id;
        inboxNodeId = response.node_id;

        if (env.sleepForHuman) {
            await sleep(500);
        }
    });

    it('Clean up after test', async function () {
        const dyn = new Client(env.apiToken);

        const response = await dyn.editDocument(inboxFileId, [
            {
                action: 'delete',
                node_id: inboxNodeId
            }
        ]);

        env.verifySuccess(response);
    });
});
