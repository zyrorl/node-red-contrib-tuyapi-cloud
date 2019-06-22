import * as TuyaCloud from '@tuyapi/cloud';
// import { get } from 'lodash';

module.exports = (RED) => {
  function configuration (config) {
    RED.nodes.createNode(this, config);
    this.name = config.name;
    this.key = config.key;
    this.secret = config.secret;
    this.secret2 = config.secret2;
    this.certSign = config.certSign;
    this.region = config.region;
    this.apiEtVersion = config.apiEtVersion;
    this.email = config.email;
    this.password = config.password;
    this.mapping = config.mapping;
  }

  function request (config) {
    RED.nodes.createNode(this, config);
    const node = this;
    const conf = RED.nodes.getNode(config.config);

    // console.dir({ conf: Object.keys(conf) }, {color: true});
    node.status({ fill: 'yellow', shape: 'dot', text: 'connecting' });

    let api;
    try {
      api = new TuyaCloud({
        key: conf.key,
        secret: conf.secret,
        secret2: conf.secret2,
        certSign: conf.certSign,
        apiEtVersion: conf.apiEtVersion,
        region: conf.region,
      });
    } catch (e) {
      node.status({ fill: 'red', shape: 'ring', text: e.message });
      throw e;
    }

    let sid;

    api.loginEx({ email: conf.email, password: conf.password })
      .then((sessionId) => {
        node.status({ fill: 'green', shape: 'dot', text: 'connected' });
        sid = sessionId;
        node.log(`Session Id: ${JSON.stringify(sid)}`);
      }).catch((e) => {
        node.status({ fill: 'red', shape: 'ring', text: `Unable to connect: ${e.message}` });
        node.error(`Error Logging in: ${JSON.stringify(e)}`);
      });

    node.on('input', async (msg) => {
      const { action, group: gid, data } = msg.payload;
      msg.payload = await api.request({ action, gid, data }).catch((e) => {
        node.error(`Error Requesting: ${JSON.stringify(e)}`);
      });
      return node.send(msg);
    });

  }

  RED.nodes.registerType('tuyapi-cloud-request', request);
  RED.nodes.registerType('tuyapi-cloud-configuration', configuration);
};

// const apiKeys = require('./keys.json')
// let api = new TuyaCloud({key: apiKeys.key,
//                      secret: apiKeys.secret,
//                      secret2: apiKeys.secret2,
//                      certSign: apiKeys.certSign,
//                      apiEtVersion: '0.0.1',
//                      region: 'AZ'});

// api.loginEx({email: "admin@zyrorl.com", password: "c*3&zUrV&GUM"}).then(async sid => {
//   console.log(sid);

//   api.request({action: 'tuya.m.location.list'}).then(async groups => {
//     for (const group of groups) {
//       // Get device list
//       api.request({action: 'tuya.m.my.group.device.list', gid: group.groupId}).then(async devicesArr => {
//         for (const device of devicesArr) {
//            console.log('group: "%s"\tdevice: "%s"\tdevId: "%s"', group.name, device.name, device.devId);
//         }
//       });
//       // Get Unlock Password
//       api.request({action: 'tuya.m.device.lock.dynapwd.get', gid: group.groupId, data: {
//         "devId":"73042804807d3a5fe22b","gwId":"73042804807d3a5fe22b"
//       }}).then(async devicesArr => {
//         console.dir(devicesArr);
//       });
//       // Alarm List
//       // api.request({action: 'm.smart.scale.history.get.list', gid: group.groupId, data: {
//       //   "devId":"73042804807d3a5fe22b","dpIds":["8"],"gwId":"73042804807d3a5fe22b","limit":50,"offset":0
//       // }}).then(async devicesArr => {
//       //   console.dir(devicesArr, { depth: 10 });
//       // });
//       // Door Bell Rang
//       // api.request({action: 'm.smart.scale.history.get.list', gid: group.groupId, data: {
//       //   "devId":"73042804807d3a5fe22b","dpIds":["19"],"gwId":"73042804807d3a5fe22b","limit":50,"offset":0
//       // }}).then(async devicesArr => {tuya.m.my.group.device.list
//       //   console.dir(devicesArr, { depth: 10 });
//       // });
//       // Unlock List
//       // api.request({action: 'm.smart.scale.history.get.list', gid: group.groupId, data: {
//       //   "devId":"73042804807d3a5fe22b","dpIds":[1,2,3,4,5,6,7,15,17],"gwId":"73042804807d3a5fe22b","limit":50,"offset":0
//       // }}).then(async devicesArr => {
//       //   console.dir(devicesArr, { depth: 10 });
//       // });

//          // Battery State
//          api.request({action: 'm.smart.scale.history.get.list', gid: group.groupId, data: {
//           "devId":"73042804807d3a5fe22b","dpIds":[11],"gwId":"73042804807d3a5fe22b","limit":1,"offset":0
//         }}).then(async devicesArr => {
//           console.dir(devicesArr, { depth: 10 });
//         });
//     }
//   });
// });
