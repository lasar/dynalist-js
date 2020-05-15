const should = require('should');
const sleep = require('sleep-promise');

const Client = require('../');

const env = require('./env');

describe('Util#buildNodeMap', function () {
    it('should convert to a map', async function () {
        const dyn = new Client(env.apiToken);

        // Create a simple tree of nodes

        const edit1 = await dyn.editDocument(env.fileId, [
            {
                action: 'insert',
                parent_id: 'root',
                content: 'buildNodeMap',
            },
        ]);

        const edit2 = await dyn.editDocument(env.fileId, [
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

        const edit3 = await dyn.editDocument(env.fileId, [
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

        // Fetch document

        const response = await dyn.readDocument(env.fileId);

        response.should.have.key('_code');
        response._code.should.be.exactly('Ok');

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

        // Remove tree again

        const del = await dyn.editDocument(env.fileId, [
            {
                action: 'delete',
                node_id: edit1.new_node_ids[0],
            }
        ]);

        del.should.have.key('_code');
        del._code.should.be.exactly('Ok');
    });
});
