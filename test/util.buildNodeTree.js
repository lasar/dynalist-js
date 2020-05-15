const should = require('should');
const sleep = require('sleep-promise');

const Client = require('../');

const env = require('./env');

describe('Util#buildNodeTree', function () {
    it('should convert to a tree', async function () {
        const dyn = new Client(env.apiToken);

        // Create a simple tree of nodes

        const edit1 = await dyn.editDocument(env.fileId, [
            {
                action: 'insert',
                parent_id: 'root',
                content: 'buildNodeTree',
                index: -1,
            },
        ]);

        const edit2 = await dyn.editDocument(env.fileId, [
            {
                action: 'insert',
                parent_id: edit1.new_node_ids[0],
                content: 'buildNodeTree A',
                index: -1,
            },
            {
                action: 'insert',
                parent_id: edit1.new_node_ids[0],
                content: 'buildNodeTree B',
                index: -1,
            },
            {
                action: 'insert',
                parent_id: edit1.new_node_ids[0],
                content: 'buildNodeTree C',
                index: -1,
            },
        ]);

        await dyn.editDocument(env.fileId, [
            {
                action: 'insert',
                parent_id: edit2.new_node_ids[0],
                content: 'buildNodeTree A.1',
                index: -1,
            },
            {
                action: 'insert',
                parent_id: edit2.new_node_ids[0],
                content: 'buildNodeTree A.2',
                index: -1,
            },
            {
                action: 'insert',
                parent_id: edit2.new_node_ids[1],
                content: 'buildNodeTree B.1',
                index: -1,
            },
            {
                action: 'insert',
                parent_id: edit2.new_node_ids[1],
                content: 'buildNodeTree B.2',
                index: -1,
            },
            {
                action: 'insert',
                parent_id: edit2.new_node_ids[2],
                content: 'buildNodeTree C.1',
                index: -1,
            }
        ]);

        // Fetch document

        const response = await dyn.readDocument(env.fileId);

        env.verifySuccess(response);

        // Do the actual testing

        const nodeTree = dyn.util.buildNodeTree(response.nodes);

        // console.log(nodeTree);

        nodeTree.should.be.an.Object();

        // Dig down into tree to find "buildNodeTree B.1"

        // root
        nodeTree.should.have.key('id');
        nodeTree.id.should.be.exactly('root');
        nodeTree.should.have.key('children');
        nodeTree.children.should.be.an.Array();
        nodeTree.children.should.not.be.empty();

        // root -> buildNodeTree

        nodeTree.children[0].should.be.an.Object();
        nodeTree.children[0].should.have.key('content');
        nodeTree.children[0].content.should.be.exactly('buildNodeTree');
        nodeTree.children[0].should.have.key('children');
        nodeTree.children[0].children.should.not.be.empty();

        // root -> buildNodeTree -> B

        nodeTree.children[0].children[1].should.be.an.Object();
        nodeTree.children[0].children[1].should.have.key('content');
        nodeTree.children[0].children[1].content.should.be.exactly('buildNodeTree B');
        nodeTree.children[0].children[1].should.have.key('children');
        nodeTree.children[0].children[1].children.should.not.be.empty();

        // root -> buildNodeTree -> B -> B.1

        nodeTree.children[0].children[1].children[1].should.be.an.Object();
        nodeTree.children[0].children[1].children[1].should.have.key('content');
        nodeTree.children[0].children[1].children[1].content.should.be.exactly('buildNodeTree B.1');
        nodeTree.children[0].children[1].children[1].should.not.have.key('children');

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

        env.verifySuccess(del);
    });
});
