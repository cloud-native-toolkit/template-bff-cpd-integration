import { inject } from "@loopback/core";
import { post, param, requestBody, RequestBodyObject, response, ResponseObject } from "@loopback/rest";
import { Inference, Predictions } from "../services";


interface PredictionsPayload {
  fields: string[],
  values: (string|number)[][]
}

/**
 * OpenAPI body for predictions
 */
const PREDICTIONS_BODY: RequestBodyObject = {
  description: 'Predictions Body',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'PredictionsBody',
        properties: {
          fields: {
            type: 'array',
            example: [
              "ID",
              "LONGDISTANCE",
              "INTERNATIONAL",
              "LOCAL",
              "DROPPED",
              "PAYMETHOD",
              "LOCALBILLTYPE",
              "LONGDISTANCEBILLTYPE",
              "USAGE",
              "RATEPLAN",
              "GENDER",
              "STATUS",
              "CHILDREN",
              "ESTINCOME",
              "CAROWNER",
              "AGE"
            ]
          },
          values: {
            type: 'array',
            items: {
              type: 'array',
              example: [
                1,
                28,
                0,
                60,
                0,
                "Auto",
                "FreeLocal",
                "Standard",
                89,
                4,
                "F",
                "M",
                1,
                23000,
                "N",
                45
              ]
            }
          },
        },
      },
    },
  },
};

/**
 * OpenAPI response for predictions
 */
const PREDICTIONS_RES: ResponseObject = {
  description: 'Predictions Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'PredictionsResponse',
        properties: {
          predictions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                fields: {
                  type: 'array',
                  example: [
                    "prediction",
                    "probability"
                  ]
                },
                values: {
                  type: 'array',
                  example: [
                    "F",
                    [
                      0.9753829214790144,
                      0.024617078520985585
                    ]
                  ]
                }
              }
            }
          },
        },
      },
    },
  },
};

export class InferenceController {
  constructor(
    @inject('services.Inference')
    protected inferenceService: Inference,
  ) {}

  @post('/inference/predictions')
  @response(200, PREDICTIONS_RES)
  async getPredictions(
    @requestBody(PREDICTIONS_BODY) payload: PredictionsPayload,
    @param.query.string('username') username: string,
    @param.query.string('password') password: string,
    @param.query.string('model') model: string,
    @param.query.string('version') version?: string,
  ): Promise<Predictions> {
    const token: string = (await this.inferenceService.getToken(username, password)).token;
    return this.inferenceService.getPredictions(model, version ?? (new Date()).toISOString().split('T')[0], [payload], token);
  }

}
