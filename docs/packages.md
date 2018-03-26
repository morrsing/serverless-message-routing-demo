# Packages
All packages require Node.js 6.x or above. Lambdas are built on the [Lambda Base](https://github.com/morrissinger/lambda-base). Sources and Targets are containerized with Docker and can be deployed on Amazon EC2 Container Service.

## Table of Contents
  1. [Ingestors](#ingestors)
     1. [Poll Ingestor](#poll-ingestor)
     2. [Sink Ingestor](#sink-ingestor)
  2. [Transformers](#transformers)
     1. [Transformer](#transformer)
  3. [Emitters](#emitters)
     1. [Queue Emitter / Dequeuer](#queue-emitter--dequeuer)
     2. [Push Emitter](#push-emitter)
  4. [Simulators](#simulators)
     1. [Source Endpoint](#source-endpoint)
     2. [Source Process](#source-process)
     3. [Target Endpoint](#target-endpoint)
     4. [Target Process](#target-process)

## Ingestors
Ingestors provide the ability to pull messages from a source into a message route. Each ingestor can be built as a Lambda. Additionally, each ingestor has a pre-built Lambda Zip file available in a publicly accessible S3 bucket.

### Poll Ingestor
Artifact   | Location
-----------|----------
Lambda Zip | [https://s3.amazonaws.com/f12f301f-messaging-demo/lambdas/poll-ingestor-lambda.zip](https://s3.amazonaws.com/f12f301f-messaging-demo/lambdas/dequeuer-lambda.zip)

The Poll ingestor responds to a trigger by requesting new messages from a source via an HTTP request and passing each new message to a state machine execution in AWS Step Functions.

The following environment variables must be supplied to the Lambda:
  * `ENDPOINT`: An endpoint to poll for new messages.
  * `METHOD`: An HTTP method with which to make requests of the endpoint provided in the `ENDPOINT` environment variable.
  * `STATE_MACHINE_ARN`: The ARN of an AWS Step Functions state machine to execute with each new message.

### Sink Ingestor
Artifact   | Location
-----------|----------
Lambda Zip | [https://s3.amazonaws.com/f12f301f-messaging-demo/lambdas/sink-ingestor-lambda.zip](https://s3.amazonaws.com/f12f301f-messaging-demo/lambdas/dequeuer-lambda.zip)

A Sink ingestor retrieves a batch of messages pushed to the route by a source and passes each new message to a state machine in AWS Step Functions.

The following environment variables must be supplied to the Lambda:
  * `STATE_MACHINE_ARN`: The ARN of an AWS Step Functions state machine to execute with each new message.

## Transformers
Transformers provide the ability to change the shape of a message and its data in-flight. There is only one transformer provided in this demonstration. It can be built as a Lambda. Additionally, the transformer has a pre-built Lambda Zip file available in a publicly accessible S3 bucket.

### Transformer
Artifact   | Location
-----------|----------
Lambda Zip | [https://s3.amazonaws.com/f12f301f-messaging-demo/lambdas/transformer-lambda.zip](https://s3.amazonaws.com/f12f301f-messaging-demo/lambdas/dequeuer-lambda.zip)

This Transformer simply provides an additional attribute to each JSON message payload, the looks like the following:

```json
{
  "additionalValue": true
}
```

This is sufficient for demonstrating transformer functionality.

There are no environment variables to be configured.

## Emitters
Emitters provide the ability to take a message that has completed a message route and provide it to a target. Each emitter can be built as a Lambda. Additionally, each emitter has a pre-built Lambda Zip file available in a publicly accessible S3 bucket.

### Queue Emitter / Dequeuer
Artifact                 | Location
-------------------------|----------
Queue Emitter Lambda Zip | [https://s3.amazonaws.com/f12f301f-messaging-demo/lambdas/dequeuer-lambda.zip](https://s3.amazonaws.com/f12f301f-messaging-demo/lambdas/queue-emitter-lambda.zip)
Dequeuer Lambda Zip      | [https://s3.amazonaws.com/f12f301f-messaging-demo/lambdas/dequeuer-lambda.zip](https://s3.amazonaws.com/f12f301f-messaging-demo/lambdas/dequeuer-lambda.zip)

The Queue Emitter is the final step in the state machine associated with a message route that must interface with a target that polls for new messages. It pushes new messages into a Kinesis Stream where they wait for dequeuing on requests from the target.

The Dequeuer sits on the other side of the Kinesis Stream. It is an API Gateway Lambda Proxy that responds to HTTP requests from a target by retrieving new messages that have accumulated since the time provided in a provided timestamp.

The following environment variables must be supplied to the Queue Emitter and Dequeuer Lambdas:
  * `KINESIS_STREAM_ID`: The name of a Kinesis Stream into which to push messages and from which to retrieve messages.
  * `KINESIS_SHARD_ID`: The ID of a Kinesis Stream Shard into which to push messages and from which to retrieve messages.

### Push Emitter
Artifact   | Location
-----------|----------
Lambda Zip |  [https://s3.amazonaws.com/f12f301f-messaging-demo/lambdas/push-emitter-lambda.zip](https://s3.amazonaws.com/f12f301f-messaging-demo/lambdas/queue-emitter-lambda.zip)

The Push Emitter is the final step in the state machine associated with a message route that must interface with a target that receives new messages through HTTP requests ot its endpoint.

The following environment variables must be supplied to the Lambda:
  * `ENDPOINT`: The URL of the endpoint on the Target that receives messages.

## Simulators
Simulators provide mocked sources for new messages and targets for message routing, allowing the functionality of routes to be demonstrated. A source can emit a message and the message can be observed making its way across the various components in a route via the specific services in the AWS Console and CloudWatch Logs.

Each simulator is provided with a `Dockerfile` so it can be packaged as a Docker image. Additionally, each simulator has a pre-built Docker image, which can be used out-of-the-box.

### Source Endpoint
Artifact     | Location
-------------|----------
Docker Image | `196431283258.dkr.ecr.us-east-1.amazonaws.com/messaging-demo/source-endpoint`

The Source Endpoint spins up a light-weight web server with an endpoint that can generate mock messages when requested. Messages are provided in a JSON array consisting of objects that match the following example:

```json
{
  "id": 0,
  "timestamp": 0123456789,
  "message": "Equals sha1(timestamp)."
}
```

The `id` attribute progresses sequentially with every message in every request. As such, it is possible to identify whether every message that came from the source ended up at the target.

The following environment variables must be supplied to the container:
  * `BATCH_SIZE`: The batch size of messages to emit when requests are made of the endpoint.
  * `LOG_LEVEL`: One of [`error`, `warn`, `info`, `verbose`, `debug`, `silly`]. Recommended: `verbose`.

### Source Process
Artifact     | Location
-------------|----------
Docker Image | `196431283258.dkr.ecr.us-east-1.amazonaws.com/messaging-demo/source-process`

The Source Process continually makes HTTP requests of an endpoint specified as an environment variable. Each request contains a JSON array consisting of objects that match the example message provided in the Source Endpoint, above.

The following environment variables must be supplied to the container:
  * `BATCH_SIZE`: The batch size of messages to emit when requests are made of the endpoint.
  * `ENDPOINT`: The URL of an ingestor or emitter API to which to point the component.
  * `FREQUENCY`: The number of milliseconds between requests.
  * `LOG_LEVEL`: One of [`error`, `warn`, `info`, `verbose`, `debug`, `silly`]. Recommended: `verbose`.

### Target Endpoint
Artifact     | Location
-------------|----------
Docker Image |  `196431283258.dkr.ecr.us-east-1.amazonaws.com/messaging-demo/target-endpoint`

The Target Endpoint spins up a light-weight web server with an endpoint that logs messages received on the POST body to the console (and to CloudWatch Logs).

The following environment variables must be supplied to the container:
  * `LOG_LEVEL`: One of [`error`, `warn`, `info`, `verbose`, `debug`, `silly`]. Recommended: `verbose`.

### Target Process
Artifact     | Location
-------------|----------
Docker Image | `196431283258.dkr.ecr.us-east-1.amazonaws.com/messaging-demo/target-process`

The Target Process continually makes HTTP requests of an endpoint specified as an environment variable. Each requet contains a `timestamp` query parameter. The expectation is that the endpoint will respond with all messages that have accumulated since the time provided in the `timestamp`.

The following environment variables must be supplied to the container:
  * `ENDPOINT`: The URL of an emitter API to which to point the component.
  * `FREQUENCY`:The number of milliseconds between requests.
  * `LOG_LEVEL`: One of [`error`, `warn`, `info`, `verbose`, `debug`, `silly`]. Recommended: `verbose`.
  * `METHOD`: The method for making requests against an emitter API.
