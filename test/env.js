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
};
