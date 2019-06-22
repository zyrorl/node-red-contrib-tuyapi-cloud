# node-red-contrib-tuyapi-cloud

[![NPM version](https://badge.fury.io/js/node-red-contrib-tuyapi-cloud.svg)](https://www.npmjs.com/package/node-red-contrib-tuyapi-cloud)

This module allows users to control and query Tuya Smart Devices using Node-RED through the Tuya Cloud API. It uses the [@tuyapi/cloud](https://www.npmjs.com/package/@tuyapi/cloud) library to communicate with the Tuya Cloud API.

In order to setup the plugin you will need to obtain the credentials to talk to the API cloud service.  Obtaining keys for the API (additional parameters secret2 and certSign are required) involves disassembling obtained an APK file (either official app or generated "demo" app from [iot.tuya.com](https://iot.tuya.com/)). For details see [tuya-sign-hacking](https://github.com/nalajcie/tuya-sign-hacking) repo.

For the latest updates see the [CHANGELOG.md](https://github.com/zyrorl/node-red-contrib-tuyapi-cloud/blob/master/CHANGELOG.md)


## Pre-requisites

The Node-RED-Dashboard requires <a href="https://nodered.org">Node-RED</a> to be installed.

## Installation

```
npm install node-red-contrib-tuyapi-cloud
```

Restart your Node-RED instance and you should have the `tuya api cloud request` node available in the palette.

## Settings

Once you've added the node to your flow setting up the configuration requires the Tuya Smart login credentials (the same as the ones registered through the TuyaSmart app), in addition to setting region, API version, and API Credentials (Key, Secret, Secret2, Certificate Signature and Region).

Getting the Key, Secret, Secret2 and Certificate Signature will require a bit of work documented at the [tuya-sign-hacking](https://github.com/nalajcie/tuya-sign-hacking) repo.

## Development

1. After cloning, run `npm install`
2. To build the TypeScript source for use in Node-RED run `npm run build`


