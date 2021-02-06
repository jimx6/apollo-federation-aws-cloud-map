import {
  SimpleAwsCloudMap,
  SimpleAwsCloudMapConfig,
} from "simple-aws-cloud-map";
import { AwsAdapterSendOutput } from "simple-aws-cloud-map/dist/aws/AwsAdapter";

export interface ApolloFederationAwsCloudMapConfig
  extends SimpleAwsCloudMapConfig {
  namespace: string;
}

export interface ServiceEndpointDefinition {
  name: string;
  url?: string;
}

export class ApolloFederationAwsCloudMap {
  private cm: SimpleAwsCloudMap;
  private config: ApolloFederationAwsCloudMapConfig;

  constructor(config: ApolloFederationAwsCloudMapConfig) {
    this.config = config;
    this.cm = new SimpleAwsCloudMap(config);
  }

  async getServicesList(
    servicesList: string[]
  ): Promise<ServiceEndpointDefinition[]> {
    return Promise.all(
      servicesList.map((serviceName) =>
        this.cm
          .get(this.config.namespace + "->" + serviceName)
          .then(
            (output: AwsAdapterSendOutput): ServiceEndpointDefinition => ({
              name: serviceName,
              url: output?.URL,
            })
          )
      )
    );
  }
}
