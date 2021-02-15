const Utilities = function (client) {
    this.client = client;
};

// Utilities

Utilities.prototype.buildUrl = function (file_id, node_id) {
    let url = this.client.linkBaseUrl + file_id;

    if (node_id) {
        url += '#z=' + node_id;
    }

    return url;
};

Utilities.prototype.buildNodeMap = function (nodes) {
    let nodeMap = {};

    Object.keys(nodes).forEach(function (key) {
        const node = nodes[key];

        nodeMap[node.id] = JSON.parse(JSON.stringify(node));
    });

    Object.keys(nodes).forEach(function (key) {
        const node = nodes[key];

        let k;

        if(!node.children) {
            return;
        }

        node.children.forEach(function (childNodeId) {
            if (nodeMap[childNodeId]) {
                nodeMap[childNodeId].parent = node.id;
            }
        });
    });

    return nodeMap;
};

Utilities.prototype.buildNodeTree = function (nodes) {
    let nodeMap = this.buildNodeMap(nodes);

    function recurse(id) {
        let node = nodeMap[id],
            k,
            childId;

        if (node.children) {
            for (k in node.children) {
                childId = node.children[k];

                node.children[k] = recurse(childId);
            }
        }

        return node;
    }

    return recurse('root');
};

module.exports = Utilities;
