const should = require('should');
const sleep = require('sleep-promise');

const Client = require('../');

const env = require('./env');

describe('Client#editDocument', function () {
    let testNode, moveTargetNode;

    it('should insert', async function () {
        const dyn = new Client(env.apiToken);

        const changes = [
            // This element will be used in subsequent tests as target for moving
            {
                action: 'insert',
                parent_id: 'root',
                content: 'move target',
            },
            // This element will be used (modified, moved, deleted) in subsequent tests
            {
                action: 'insert',
                parent_id: 'root',
                content: 'insert',
            },
        ];

        const response = await dyn.editDocument(env.fileId, changes);

        env.verifySuccess(response);

        response.should.have.key('new_node_ids');
        response.new_node_ids.should.be.an.Array();
        response.new_node_ids.should.not.be.empty();

        moveTargetNode = response.new_node_ids[0];
        testNode = response.new_node_ids[1];

        if (env.sleepForHuman) {
            await sleep(500);
        }
    });

    it('should edit items', async function () {
        const dyn = new Client(env.apiToken);

        const changes = [
            {
                action: 'edit',
                node_id: testNode,
                content: 'edit',
            }
        ];

        const response = await dyn.editDocument(env.fileId, changes);

        env.verifySuccess(response);

        response.should.have.key('new_node_ids');
        response.new_node_ids.should.be.an.Array();
        response.new_node_ids.should.be.empty();

        if (env.sleepForHuman) {
            await sleep(500);
        }
    });

    it('should move an item', async function () {
        const dyn = new Client(env.apiToken);

        const changes = [
            {
                action: 'move',
                node_id: testNode,
                parent_id: moveTargetNode,
            }
        ];

        const response = await dyn.editDocument(env.fileId, changes);

        env.verifySuccess(response);

        response.should.have.key('new_node_ids');
        response.new_node_ids.should.be.an.Array();
        response.new_node_ids.should.be.empty();

        if (env.sleepForHuman) {
            await sleep(500);
        }
    });

    it('should delete an item', async function () {
        const dyn = new Client(env.apiToken);

        const changes = [
            {
                action: 'delete',
                node_id: testNode,
            },
            {
                action: 'delete',
                node_id: moveTargetNode,
            }
        ];

        const response = await dyn.editDocument(env.fileId, changes);

        env.verifySuccess(response);

        response.should.have.key('new_node_ids');
        response.new_node_ids.should.be.an.Array();
        response.new_node_ids.should.be.empty();
    });
});
