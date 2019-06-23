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
      const { action, group: gid, requireSID, data } = msg.payload;
      msg.payload = await api.request({ action, gid, data, requireSID }).catch((e) => {
        node.error(`Error Requesting: ${JSON.stringify(e)}`);
      });
      return node.send(msg);
    });

  }

  RED.nodes.registerType('tuyapi-cloud-request', request);
  RED.nodes.registerType('tuyapi-cloud-configuration', configuration);
};
