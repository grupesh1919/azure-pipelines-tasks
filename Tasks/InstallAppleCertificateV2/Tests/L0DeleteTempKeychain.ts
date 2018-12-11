import ma = require('azure-pipelines-task-lib/mock-answer');
import tmrm = require('azure-pipelines-task-lib/mock-run');
import path = require('path');
import fs = require('fs');
import os = require('os');

let taskPath = path.join(__dirname, '..', 'postinstallcert.js');
let tr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tr.setInput('keychain', 'temp');

tr.registerMock('fs', {
    readFileSync: fs.readFileSync,
    statSync: fs.statSync,
    writeFileSync: function (filePath, contents) {
    }
});

process.env['AGENT_VERSION'] = '2.116.0';
process.env['VSTS_TASKVARIABLE_APPLE_CERTIFICATE_KEYCHAIN'] = '/build/temp/ios_signing_temp.keychain';
process.env['HOME'] = '/users/test';

// provide answers for task mock
let a: ma.TaskLibAnswers = <ma.TaskLibAnswers>{
    "which": {
        "security": "/usr/bin/security"
    },
    "exist": {
        "/build/temp/ios_signing_temp.keychain": true
    },
    "checkPath": {
        "/usr/bin/security": true
    },
    "exec": {
        "/usr/bin/security delete-keychain /build/temp/ios_signing_temp.keychain": {
            "code": 0,
            "stdout": "deleted keychain"
        }
    }
};
tr.setAnswers(a);

os.platform = () => {
    return 'darwin';
}
tr.registerMock('os', os);

tr.run();

