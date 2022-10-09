import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {InferenceDataSource} from '../datasources';

export interface Predictions {
  predictions: {
    fields: string[],
    values: (string|number|number[])[][]
  }[]
}

export interface Inference {
  getToken(username: string, password: string): Promise<{
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "_messageCode_": string,
    "message": string,
    "token": string
}>;
  getPredictions(model: string, version:string, inputData: Array<object>, token: string): Promise<Predictions>;
}

export class InferenceProvider implements Provider<Inference> {
  constructor(
    // inference must match the name property in the datasource json file
    @inject('datasources.inference')
    protected dataSource: InferenceDataSource = new InferenceDataSource(),
  ) {}

  value(): Promise<Inference> {
    return getService(this.dataSource);
  }
}
