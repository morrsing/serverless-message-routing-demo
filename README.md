# Serverless Message Routing Demo
This project demonstrates a message routing system over HTTP leveraging Amazon Web Services serverless offerings, such as API Gateway, Kinesis, and Lambda. There are four message routes that are demonstrated, each built of several components. Both push and pull models are demonstrated at either end of the route.

The project also contains simulators of message sources that emit messages and targets that consume them. As such, the functionality of any route can be demonstrated. The source and target components are built as Docker images, which can be run on Amazon EC2 Container Service.

Please note: These routes and their various components are for demonstration purposes only. They are not production-ready. Much additional thinking would be needed around security, robustness, and other areas such as error handling and throughput. The routes are designed to demonstrate basic concepts.

## Table of Contents
  1. [Sources and Targets](#sources-and-targets)
  2. [Routes](#routes)
      1. [Souce Endpoint to Target Endpoint](#source-endpoint-to-target-endpoint)
      2. [Source Endpoint to Target Process](#source-endpoint-to-target-process)
      3. [Source Process to Target Endpoint](#source-process-to-target-endpoint)
      4. [Source Process to Target Process](#source-process-to-target-process)
  3. [Packages](#packages)
  4. [Templates](#templates)
  5. [Deploying](#deploying)

## Sources and Targets
Sources and targets come in two flavors: endpoints and processes. An endpoint emits or receives a set of messages when
an HTTP request is made of it. A process emits or polls for messages at set intervals. As such, there are four source
and target components, as follows:
  1. **Source Endpoint:** A source endpoint component starts a lightweight web server that responds to HTTP requests
  with a set of messages.
  2. **Source Process:** A source process component makes POST requests of a given URL at set intervals.
  3. **Target Endpoint:** A target endpoint component starts a lightweight web server that accepts HTTP requests that
  are POSTed to it with a set of messages.
  4. **Target Process:** A target process component makes requests of a given URL at set intervals, providing a
  timestamp as a query parameter, in essence, asking for all messages that have come across since that timestamp.

## Routes
The project demonstrates four HTTP-based routes, as follows:
  1. Source Endpoint to Target Endpoint
  2. Source Endpoint to Target Process
  3. Source Process to Target Endpoint
  4. Source Process to Target Process

Each is detailed below.

### Source Endpoint to Target Endpoint
![Source Endpoint to Target Endpoint Diagram](https://s3.amazonaws.com/f12f301f-messaging-demo/diagrams/source-endpoint--target-endpoint.png "Source Endpoint to Target Endpoint Diagram")

This route uses CloudWatch Events to trigger an ingestor Lambda periodically. The ingestor Lambda polls the Source Endpoint when triggered, sending each message to a state machine defined in AWS Step Functions. Step Functions pushes the message through a set of transformers defined in Lambda, handling failures and retry logic. (In the example routes, only a single demonstrative transformer Lambda is defined.) The final step of the Step Function is an emitter Lambda, which pushes the message to the Target Endpoint by providing it on an HTTP POST request.

### Source Endpoint to Target Process
![Source Endpoint to Target Process Diagram](https://s3.amazonaws.com/f12f301f-messaging-demo/diagrams/source-endpoint--target-process.png "Source Endpoint to Target Process Diagram")

This route uses CloudWatch Events to trigger an ingestor Lamba periodically. The ingestor Lambda polls the Source Endpoint when triggered, sending each message to a state machine defined in AWS Step Functions. Step Functions pushes the message through a set of transformers defined in Lambda, handling failures and retry logic. The final step of the Step Function is an emitter Lambda which pushes the message to an Amazon Kinesis Stream, which acts as a queue.

Asynchronously, a Target Process can make periodic GET requests to an endpoint defined in API Gateway, asking for new messages. The endpoint proxies a dequeueing Lambda, which returns messages from the Kinesis Stream. The Target Process provides a timestamp as part of its request, and receives all messages that have accumulated since that timestamp.

### Source Process to Target Endpoint
![Source Process to Target Endpoint Diagram](https://s3.amazonaws.com/f12f301f-messaging-demo/diagrams/source-process--target-endpoint.png "Source Process to Target Endpoint Diagram")

This route deploys an endpoint in API Gateway that a Source Process can hit with a POST request containing new messages. From the perspective of the source process, the endpoint acts as a sink, receiving all new messages. The endpoint also proxies an Amazon Kinesis tream, which buffers and queues messages for processing. The Kinesis Stream is configured as a trigger for an ingestor Lambda, which takes messages from the Kinesis Stream and sends them to a state machine defined in AWS Step Functions. Step Functions pushes each message through a set of transformers defined in Lambda, handling failures and retry logic. The final step of the Step Function is an emitter Lambda which pushes the message to the Target Endpoint by providing it on an HTTP POST request.

### Source Process to Target Process
![Source Process to Target Process Diagram](https://s3.amazonaws.com/f12f301f-messaging-demo/diagrams/source-process--target-process.png "Source Process to Target Process Diagram")

This route deploys an endpoint in API Gateway that a Source Process can hit with a POST request containing new messages. From the perspective of the source process, the endpoint acts as a sink, receiving all new messages. The endpoint also proxies an Amazon Kinesis tream, which buffers and queues messages for processing. The Kinesis Stream is configured as a trigger for an ingestor Lambda, which takes messages from the Kinesis Stream and sends them to a state machine defined in AWS Step Functions. Step Functions pushes each message through a set of transformers defined in Lambda, handling failures and retry logic. The final step of the Step Function is an emitter Lambda which pushes the message to an Amazon Kinesis Stream, which acts as a queue.

Asynchronously, a Target Process can make periodic GET requests to an endpoint defined in API Gateway, asking for new messages. The endpoint proxies a dequeueing Lambda, which returns messages from the Kinesis Stream. The Target Process provides a timestamp as part of its request, and receives all messages that have accumulated since that timestamp.

## Packages
For a complete list of packages in this repo, see the [Packages Documentation](docs/packages.md).

## Templates
For a complete list of CloudFormation templates in this repo, see the [Templates Documentation](docs/templates.md).

## Deploying
Simulators should be deployed on an EC2 Container Service cluster. Deploying on a Cluster using Fargate is the easiest and most cost effective way of doing so. At the time of this writing, Fargate is only available in `us-east-1`, so links only to deploying in this region are provided here.

This demo provides a template for deploying a Fargate cluster on which you can run source and target simulators:

[![Deploy to AWS](https://s3.amazonaws.com/f12f301f-messaging-demo/misc/deploy_to_aws.png "Deploy to AWS")](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?stackName=messaging-demo-ecs-cluster&templateURL=https://s3.amazonaws.com/f12f301f-messaging-demo/templates/fargate-cluster.yaml)

As is required for Fargate deployments, the cluster template establishes all necessary networking, including a VPC and subnets with CIDR blocks. Optionally, you can use an existing VPC with two subnets and the cluster will leverage those existing resources. Subsequently, when deploying a simulator, you can use the underlying compute resources in Fargate and create an ENI on that infrastructure. The ENI is associated with an ALB that sits in front of your containers and exists within the VPC established or identified here.

The template requires several parameters. In all cases, the following are required:
  * **Stack Name:** Provide a unique name for this CloudFormation Stack. The Stack Name is used to generate names for various aspects of the Fargate Cluster, so you should ensure that the Stack Name is not only unique among your deployed Stacks, but also does not conflict with existing ECS- or VPC-related resources in your region.

The following are required if creating a new VPC:
  * **SubnetCidr1:** The CIDR block of the first subnet to create in the new VPC.
  * **SubnetCidr2:** The CIDR block of the second subnet to create in the new VPC.
  * **VpcAvailabilityZone:** A comma-separated list of availability zones to use in the new VPC. The first one is assigned to the first subnet and the second one to the second subnet. Any additional availability zones are ignored.
  * **VpcCidr:** The CIDR block of the VPC, which should contain the CIDR blocks of both subnets.

The following are required if leveraging an existing VPC:
  * **SubnetIds:** Subnet IDs of two existing subnets in the provided VPC.
  * **VpcId:** The VPC ID of an existing VPC to use with this Fargate cluster.

You can tail the logs for the source and target to see successful evidence of message routing. Message contents are written to the logs on both sides. Additionally, you can view the logs for each of the component Lambda functions, as well as request the status of any of the Step Functions Executions using the AWS CLI or the Management Console.

N.B.: Endpoint simulators must be deployed *before* the routes that use them are deployed. This is because routes that interface with endpoint simulators must be configured with their respective endpoints at deploy-time. Process simulators must be deployed *after* the routes that use them are deployed. This is because they must be configured with their respective endpoints at deploy-time. These are limitations of this demo. These limitations are inherent to the demo and are not inherent to serverless message routing systems.

Once the Fargate cluster is deployed, you can deploy four different types of routes, as follows:
  1. Source Endpoint to Target Endpoint [![Tutorial](https://s3.amazonaws.com/f12f301f-messaging-demo/misc/tutorial.png "Tutorial")](docs/source-endpoint--target-endpoint.md)
  2. Source Endpoint to Target Process [![Tutorial](https://s3.amazonaws.com/f12f301f-messaging-demo/misc/tutorial.png "Tutorial")](docs/source-endpoint--target-process.md)
  3. Source Process to Target Endpoint [![Tutorial](https://s3.amazonaws.com/f12f301f-messaging-demo/misc/tutorial.png "Tutorial")](docs/source-process--target-endpoint.md)
  4. Source Process to Target Process [![Tutorial](https://s3.amazonaws.com/f12f301f-messaging-demo/misc/tutorial.png "Tutorial")](docs/source-process--target-process.md)






















