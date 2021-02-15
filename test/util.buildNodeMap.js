const should = require('should');
const sleep = require('sleep-promise');

const Client = require('../');

const env = require('./env');

describe('Util#buildNodeMap', function () {
    this.timeout(10000);

    let edit1, edit2, edit3;

    before(async function () {
        // Create a simple tree of nodes

        const dyn = new Client(env.apiToken);

        edit1 = await dyn.editDocument(env.fileId, [
            {
                action: 'insert',
                parent_id: 'root',
                content: 'buildNodeMap',
            },
        ]);

        edit2 = await dyn.editDocument(env.fileId, [
            {
                action: 'insert',
                parent_id: edit1.new_node_ids[0],
                content: 'buildNodeMap A',
            },
            {
                action: 'insert',
                parent_id: edit1.new_node_ids[0],
                content: 'buildNodeMap B',
            },
            {
                action: 'insert',
                parent_id: edit1.new_node_ids[0],
                content: 'buildNodeMap C',
            },
        ]);

        edit3 = await dyn.editDocument(env.fileId, [
            {
                action: 'insert',
                parent_id: edit2.new_node_ids[0],
                content: 'buildNodeMap A.1',
            },
            {
                action: 'insert',
                parent_id: edit2.new_node_ids[0],
                content: 'buildNodeMap A.2',
            },
            {
                action: 'insert',
                parent_id: edit2.new_node_ids[1],
                content: 'buildNodeMap B.1',
            },
            {
                action: 'insert',
                parent_id: edit2.new_node_ids[1],
                content: 'buildNodeMap B.2',
            },
            {
                action: 'insert',
                parent_id: edit2.new_node_ids[2],
                content: 'buildNodeMap C.1',
            }
        ]);
    });

    after(async function () {
        // Remove tree again

        const dyn = new Client(env.apiToken);

        const del = await dyn.editDocument(env.fileId, [
            {
                action: 'delete',
                node_id: edit1.new_node_ids[0],
            }
        ]);

        env.verifySuccess(del);
    });

    it('should convert to a map', async function () {
        const dyn = new Client(env.apiToken);

        // Fetch document

        const response = await dyn.readDocument(env.fileId);

        env.verifySuccess(response);

        // Do the actual testing

        const nodeMap = dyn.util.buildNodeMap(response.nodes);

        nodeMap.should.be.an.Object();

        // See that root exists
        nodeMap.should.have.key('root');

        // Check that one of the nodes exist
        nodeMap.should.have.key(edit3.new_node_ids[0]);
        nodeMap[edit3.new_node_ids[0]].should.have.key('content');
        nodeMap[edit3.new_node_ids[0]].content.should.be.exactly('buildNodeMap A.1');

        if(env.sleepForHuman) {
            await sleep(500);
        }
    });

    it('should not modify the original', async function () {
        const dyn = new Client(env.apiToken);

        const document1 = await dyn.readDocument(env.fileId);
        const document2 = await dyn.readDocument(env.fileId);

        dyn.util.buildNodeTree(document1.nodes);

        document1.nodes.should.deepEqual(document2.nodes);

    });
});
