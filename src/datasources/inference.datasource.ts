import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';


const CPD_BASE_URL = process.env.CPD_BASE_URL;

const config = {
  name: 'inference',
  connector: 'rest',
  baseURL: CPD_BASE_URL,
  options: {
    headers: {
      accept: 'application/json',
      'content-type': 'application/json'
    }
  },
  operations: [
    {
      template: {
        method: 'POST',
        url: `${CPD_BASE_URL}/icp4d-api/v1/authorize`,
        body: {
          username: '{username:string}',
          password: '{password:string}'
        }
      },
      functions: {
        getToken: [
          'username',
          'password'
        ]
      }
    },
    {
      template: {
        method: 'POST',
        url: `${CPD_BASE_URL}/ml/v4/deployments/{model:string}/predictions`,
        headers: {
          'Authorization': 'Bearer {token:string}'
        },
        query: {
          version: '{version:string}'
        },
        body: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          input_data: '{inputData:array}',
        }
      },
      functions: {
        getPredictions: [
          'model',
          'version',
          'inputData',
          'token'
        ]
      }
    },
  ],
  crud: false
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class InferenceDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'inference';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.inference', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
