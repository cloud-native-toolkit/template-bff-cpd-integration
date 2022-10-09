<p align="center">
    <a href="http://kitura.io/">
        <img src="https://landscape.cncf.io/logos/ibm-member.svg" height="100" alt="IBM Cloud">
    </a>
</p>

<p align="center">
    <a href="https://cloud.ibm.com">
    <img src="https://img.shields.io/badge/IBM%20Cloud-powered-blue.svg" alt="IBM Cloud">
    </a>
    <img src="https://img.shields.io/badge/platform-node-lightgrey.svg?style=flat" alt="platform">
    <img src="https://img.shields.io/badge/license-Apache2-blue.svg?style=flat" alt="Apache 2">
</p>

# BFF with AI inference integration Code Pattern

This is a template repository for a typescript-based Loopback micro-service acting as a backend service that integrates with a Cloud-Pak for Data inference service.

This app contains an opinionated set of components for modern web development, including:
- [Node.js](https://nodejs.org/en/)
- [TypeScript](https://www.typescriptlang.org/)
- [LoopBack 4](https://loopback.io/doc/en/lb4/)

## Deploying

After you have created a new git repo from this git template, remember to rename the project.
Edit `package.json` and change the default name to the name you used to create the template.

Make sure you are logged into the IBM Cloud using the IBM Cloud CLI and have access to you development cluster. If you are using OpenShift make sure you have logged into OpenShift CLI on the command line.

```$bash
npm install --location=global @ibmgaragecloud/cloud-native-toolkit-cli
```

Ensure you have the [Cloud-Native Toolkit](https://cloudnativetoolkit.dev) installed in your cluster to make this method of pipeline registry quick and easy Cloud-Native Toolkit.

Create your development project using `oc sync`:

```$bash
oc sync <project>
```

Create a `cpd-config` ConfigMap with information on how to reach your Cloud Pak for Data inference service:

```sh
❯ cat <<EOF | kubectl apply -f -     
kind: ConfigMap
apiVersion: v1
metadata:
  name: cpd-config
  namespace: <DEV_NAMESPACE>
data:
  base-url: https://<YOUR_CPD_ENDPOINT>
EOF
```

Use the IBM Garage for Cloud CLI to register the GIT Repo with Tekton or Jenkins:

```$bash
oc pipeline
```

## Local Development

### Install dependencies

By default, dependencies were installed when this application was generated.
Whenever dependencies in `package.json` are changed, run the following command:

```sh
npm install
```

To only install resolved dependencies in `package-lock.json`:

```sh
npm ci
```

### Run the application

```sh
npm start
```

You can also run `node .` to skip the build step.

Open http://127.0.0.1:3001 in your browser.

### Rebuild the project

To incrementally build the project:

```sh
npm run build
```

To force a full build by cleaning up cached artifacts:

```sh
npm run rebuild
```

### Fix code style and formatting issues

```sh
npm run lint
```

To automatically fix such issues:

```sh
npm run lint:fix
```

### Other useful commands

- `npm run migrate`: Migrate database schemas for models
- `npm run openapi-spec`: Generate OpenAPI spec into a file
- `npm run docker:build`: Build a Docker image for this application
- `npm run docker:run`: Run this application inside a Docker container

### Tests

```sh
npm test
```

## Add inference service

Implemented in `/src/services/inference.service.ts` using Loopback [documentation](https://loopback.io/doc/en/lb4/Calling-rest-apis.html):

```sh
❯ lb4 datasource --connector rest inference --format
? Select the connector for inference:  REST services (supported by StrongLoop)
? Base URL for the REST service: https://<CPD_ENDPOINT>
? Default options for the request: {"headers":{"accept":"application/json","content-type
":"application/json"}}
? An array of operation templates: [{"template":{"method":"POST","url":"https://<CPD_ENDPOINT>/icp4d-api/v1/authorize","body":{"username":"{username:string}","password":"{password:string}"}},"function
s":{"getToken":["username","password"]}},{"template":{"method":"POST","url":"https://<CPD_ENDPOINT>/ml/v4/deployments/customer_churn/predictions","headers":{"Authorization":"Bearer {token:string}"},"query":{"version":"{version:string}"},"body":{"input_data":"{inputData:array}"}},"function
s":{"getPredictions":["version","inputData","token"]}}]
❯ lb4 service --type proxy --datasource inference inference --format
   create src/services/inference.service.ts
   update src/services/index.ts

Service Inference was/were created in src/services

Running 'npm run lint:fix' to format the code...
❯ lb4 controller --format
? Controller class name: inference
Controller Inference will be created in src/controllers/inference.controller.ts

? What kind of controller would you like to generate? Empty Controller
   create src/controllers/inference.controller.ts
   update src/controllers/index.ts

Controller Inference was/were created in src/controllers

Running 'npm run lint:fix' to format the code...
```

## What's next

Please check out [LoopBack 4 documentation](https://loopback.io/doc/en/lb4/) to
understand how you can continue to add features to this application.

[![LoopBack](https://github.com/loopbackio/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)

## License

This sample application is licensed under the Apache License, Version 2. Separate third-party code objects invoked within this code pattern are licensed by their respective providers pursuant to their own separate licenses. Contributions are subject to the [Developer Certificate of Origin, Version 1.1](https://developercertificate.org/) and the [Apache License, Version 2](https://www.apache.org/licenses/LICENSE-2.0.txt).

[Apache License FAQ](https://www.apache.org/foundation/license-faq.html#WhatDoesItMEAN)
