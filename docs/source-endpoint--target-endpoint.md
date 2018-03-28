# Deploying a Source Endpoint-to-Target Endpoint Route with Simulators
![Source Endpoint to Target Endpoint Diagram](https://s3.amazonaws.com/f12f301f-messaging-demo/diagrams/source-endpoint--target-endpoint.png "Source Endpoint to Target Endpoint Diagram")

## Deploying
Deploy the route using the following steps:

  1. Deploy a Source Endpoint: [![Deploy to AWS](https://s3.amazonaws.com/f12f301f-messaging-demo/misc/deploy_to_aws.png "Deploy to AWS")](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?stackName=messaging-demo-source-endpoint&templateURL=https://s3.amazonaws.com/f12f301f-messaging-demo/templates/source-endpoint.yaml)
  2. Deploy a Target Endpoint: [![Deploy to AWS](https://s3.amazonaws.com/f12f301f-messaging-demo/misc/deploy_to_aws.png "Deploy to AWS")](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?stackName=messaging-demo-target-endpoint&templateURL=https://s3.amazonaws.com/f12f301f-messaging-demo/templates/target-endpoint.yaml)
  3. Deploy a route between the source and the target: [![Deploy to AWS](https://s3.amazonaws.com/f12f301f-messaging-demo/misc/deploy_to_aws.png "Deploy to AWS")](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?stackName=messaging-demo-source-ep-target-ep&templateURL=https://s3.amazonaws.com/f12f301f-messaging-demo/templates/source-endpoint--target-endpoint.yaml)

### Source Endpoint Template Parameters
The Source Endpoint template requires several parameters. The following are required:
  * **Stack name:** Provide a unique name for this CloudFormation Stack. The Stack Name is used to generate names for various aspects of the task, service, security groups, and other resources, so you should ensure that the Stack Name a unique identifier among your deployed Stacks, as well as other resources in your region.
  * **BatchSize:** How many messages to send for each request of the endpoint. Setting this number small will help you to trace messages as they move across a route.
  * **EcsClusterArn:** The ARN of the Fargate cluster you created previously. If you used the template provided above, the ARN is available as an output of the CloudFormation stack.
  * **VpcId:** The VPC within which the Fargate cluster runs. If you created a Fargate cluster using the above template, the VPC ID is an output.
  * **SubnetIds:** A comma separated list of subnets within which the Fargate cluster runs. If you created a Fargate cluster using the above template, the subnet IDs are available as outputs.
  * **LogLevel:** A log level for output from the source. By default, `verbose` is selected and is recommended.

Additionally, one of the following two parameters must be provided:
  * **ExecutionRoleArn:** Provide the ARN of an IAM Role that contains the `AmazonECSTaskExecutionRolePolicy` or equivalent. This is optional; CloudFormation can create the Role on your behalf if you leave this blank and specify `ExecutionRoleName` instead.
  * **ExecutionRoleName:** The name of a new IAM Role that will contain the `AmazonECSTaskExecutionRolePolicy` IAM Policy. This is optional; CloudFormation can use an existing IAM Role if you provide it in the `ExecutionRoleArn` parameter.

### Target Endpoint Template Parameters
The Target Endpoint template requires several parameters. The following are required:
  * **Stack name:** Provide a unique name for this CloudFormation Stack. The Stack Name is used to generate names for various aspects of the task, service, security groups, and other resources, so you should ensure that the Stack Name a unique identifier among your deployed Stacks, as well as other resources in your region.
  * **EcsClusterArn:** The ARN of the Fargate cluster you created previously. If you used the template provided above, the ARN is available as an output of the CloudFormation stack.
  * **VpcId:** The VPC within which the Fargate cluster runs. If you created a Fargate cluster using the above template, the VPC ID is an output.
  * **SubnetIds:** A comma separated list of subnets within which the Fargate cluster runs. If you created a Fargate cluster using the above template, the subnet IDs are available as outputs.
  * **LogLevel:** A log level for output from the source. By default, `verbose` is selected and is recommended.

Additionally, one of the following two parameters must be provided:
  * **ExecutionRoleArn:** Provide the ARN of an IAM Role that contains the `AmazonECSTaskExecutionRolePolicy` or equivalent. This is optional; CloudFormation can create the Role on your behalf if you leave this blank and specify `ExecutionRoleName` instead.
  * **ExecutionRoleName:** The name of a new IAM Role that will contain the `AmazonECSTaskExecutionRolePolicy` IAM Policy. This is optional; CloudFormation can use an existing IAM Role if you provide it in the `ExecutionRoleArn` parameter.

### Route Template Parameters
The Source Endpoint-to-Target Endpoint route requires the following parameters:
  * **Stack name:** Provide a unique name for this CloudFormation Stack. The Stack Name is used to generate names for various aspects of the API Gateway and other resources, so you should ensure that the Stack Name a unique identifier among your deployed Stacks, as well as other resources in your region.
  * **SouceEndpoint:** The source endpoint URL, which is an output of the Souce Endpoint template. This is the URL from which messages are requested.
  * **SourceRequestMethod:** The HTTP method for requesting messages from the `SourceEndpoint`, which is an output of the Source Endpoint template.
  * **TargetEndpoint:** The target endpoint URL, which is an output of the Target Endpoint template. This is the URL where routed messages are POSTed.

## Verify Message Routing
You can use your favorite CloudWatch tool, or the CloudWatch Logs section in the AWS Management Console to tail the logs for the source and target components, as well as the Lambdas that are executed through the message route to see evidence of each message traversing the route. Here, the use of [cwtail](https://www.npmjs.com/package/cwtail) is demonstrated.

List the logs that are associated with this demo:
```sh
aws logs describe-log-groups | jq .logGroups[].logGroupName
```

```
"/aws/lambda/messaging-demo-source-ep-target-ep-PollIngestor-1IHZ412NPIYDD"
"/aws/lambda/messaging-demo-source-ep-target-ep-PushEmitter-1VQRV7H1XK474"
"/aws/lambda/messaging-demo-source-ep-target-ep-Transformer-YWT9LSCW1KUZ"
"/ecs/messaging-demo-source-endpoint/Log"
"/ecs/messaging-demo-target-endpoint/Log"
```

Here, you can see a log associated with the Source Endpoint and Target Endpoint containers, as well as a log for each of the Lambdas: Poll Ingestor, Transformer, and Push Emitter.

### Examine the Source Endpoint
Tail the Source Endpoint log to see messages as they are sent into the route:
```sh
cwtail -ef /ecs/messaging-demo-source-endpoint/Log
```

```
info: Running on port 3000. Batch size: 10
info:  id=0, timestamp=1522267924273, message=4772dd1437458e3603fdf57fc28c4b6180b1bccf
info:  id=1, timestamp=1522267924274, message=e297d979262f8150d36e0c19c5296569c01b5170
info:  id=2, timestamp=1522267924274, message=e297d979262f8150d36e0c19c5296569c01b5170
info:  id=3, timestamp=1522267924274, message=e297d979262f8150d36e0c19c5296569c01b5170
info:  id=4, timestamp=1522267924275, message=03cb3655f48df0ddb86c017ce8c4ea22506f7cb8
info:  id=5, timestamp=1522267924275, message=03cb3655f48df0ddb86c017ce8c4ea22506f7cb8
info:  id=6, timestamp=1522267924275, message=03cb3655f48df0ddb86c017ce8c4ea22506f7cb8
info:  id=7, timestamp=1522267924275, message=03cb3655f48df0ddb86c017ce8c4ea22506f7cb8
info:  id=8, timestamp=1522267924275, message=03cb3655f48df0ddb86c017ce8c4ea22506f7cb8
info:  id=9, timestamp=1522267924275, message=03cb3655f48df0ddb86c017ce8c4ea22506f7cb8
```

### Examine the Poll Ingestor
Tail the Poll Ingestor log to see messages as they enter the route:
```sh
cwtail -ef /aws/lambda/messaging-demo-source-ep-target-ep-PollIngestor-1IHZ412NPIYDD
```

```
START RequestId: 479b2a4d-32c4-11e8-87b4-0b8f3fffc583 Version: $LATEST
info: Poll ingester invoked.
info:  id=0, timestamp=1522267924273, message=4772dd1437458e3603fdf57fc28c4b6180b1bccf
info:  id=1, timestamp=1522267924274, message=e297d979262f8150d36e0c19c5296569c01b5170
info:  id=2, timestamp=1522267924274, message=e297d979262f8150d36e0c19c5296569c01b5170
info:  id=3, timestamp=1522267924274, message=e297d979262f8150d36e0c19c5296569c01b5170
info:  id=4, timestamp=1522267924275, message=03cb3655f48df0ddb86c017ce8c4ea22506f7cb8
info:  id=5, timestamp=1522267924275, message=03cb3655f48df0ddb86c017ce8c4ea22506f7cb8
info:  id=6, timestamp=1522267924275, message=03cb3655f48df0ddb86c017ce8c4ea22506f7cb8
info:  id=7, timestamp=1522267924275, message=03cb3655f48df0ddb86c017ce8c4ea22506f7cb8
info:  id=8, timestamp=1522267924275, message=03cb3655f48df0ddb86c017ce8c4ea22506f7cb8
info:  id=9, timestamp=1522267924275, message=03cb3655f48df0ddb86c017ce8c4ea22506f7cb8
END RequestId: 479b2a4d-32c4-11e8-87b4-0b8f3fffc583
REPORT RequestId: 479b2a4d-32c4-11e8-87b4-0b8f3fffc583	Duration: 1601.46 ms	Billed Duration: 1700 ms 	Memory Size: 128 MB	Max Memory Used: 46 MB
```

### Examine the Transformer
Tail the Transformer log to see messages as they are transformed in the middle of the route:
```sh
cwtail -ef /aws/lambda/messaging-demo-source-ep-target-ep-Transformer-YWT9LSCW1KUZ
```

```
START RequestId: 490baa22-32c4-11e8-991d-71b7085f6747 Version: $LATEST
END RequestId: 490baa22-32c4-11e8-991d-71b7085f6747
REPORT RequestId: 490baa22-32c4-11e8-991d-71b7085f6747	Duration: 23.27 ms	Billed Duration: 100 ms 	Memory Size: 128 MB	Max Memory Used: 19 MB
```

### Examine the Push Emitter
Tail the Push Emitter to see transformed messages as they are pushed out to the Target Endpoint and leave the route:
```sh
cwtail -ef /aws/lambda/messaging-demo-source-ep-target-ep-PushEmitter-1VQRV7H1XK474
```

```
START RequestId: 49705ed4-32c4-11e8-b126-118c53215adf Version: $LATEST
END RequestId: 49705ed4-32c4-11e8-b126-118c53215adf
REPORT RequestId: 49705ed4-32c4-11e8-b126-118c53215adf	Duration: 544.56 ms	Billed Duration: 600 ms 	Memory Size: 128 MB	Max Memory Used: 27 MB
```

### Examine the Target Endpoint
Tail the Target Endpoint log to see messages as they are received by the Target Endpoint:
```sh
cwtail -ef /ecs/messaging-demo-target-endpoint/Log
```
```
info: Running on port 3000.
info:  id=4, timestamp=1522267924275, message=03cb3655f48df0ddb86c017ce8c4ea22506f7cb8, additionalValue=true
info:  id=1, timestamp=1522267924274, message=e297d979262f8150d36e0c19c5296569c01b5170, additionalValue=true
info:  id=6, timestamp=1522267924275, message=03cb3655f48df0ddb86c017ce8c4ea22506f7cb8, additionalValue=true
info:  id=9, timestamp=1522267924275, message=03cb3655f48df0ddb86c017ce8c4ea22506f7cb8, additionalValue=true
info:  id=3, timestamp=1522267924274, message=e297d979262f8150d36e0c19c5296569c01b5170, additionalValue=true
info:  id=8, timestamp=1522267924275, message=03cb3655f48df0ddb86c017ce8c4ea22506f7cb8, additionalValue=true
info:  id=0, timestamp=1522267924273, message=4772dd1437458e3603fdf57fc28c4b6180b1bccf, additionalValue=true
info:  id=2, timestamp=1522267924274, message=e297d979262f8150d36e0c19c5296569c01b5170, additionalValue=true
info:  id=5, timestamp=1522267924275, message=03cb3655f48df0ddb86c017ce8c4ea22506f7cb8, additionalValue=true
info:  id=7, timestamp=1522267924275, message=03cb3655f48df0ddb86c017ce8c4ea22506f7cb8, additionalValue=true
```

### Examine the State Machine
You can also query AWS for the AWS Step Functions State Machine that managed the transformation and routing of each message. Start by locating the correct State Machine: 
```sh
aws stepfunctions list-state-machines | jq .stateMachines[].stateMachineArn
```

```
"arn:aws:states:us-east-1:XXXXXXXXXXXX:stateMachine:messaging-demo-source-ep-target-ep-StateMachine"
```

Query the State Machine for a list of executions:
```sh
aws stepfunctions list-executions --state-machine-arn "arn:aws:states:us-east-1:XXXXXXXXX:stateMachine:messaging-demo-source-ep-target-ep-StateMachine"
```

```json
{
    "executions": [
        {
            "status": "SUCCEEDED", 
            "startDate": 1522268224.44, 
            "name": "6ec94ebf-bf38-40ce-baab-dee226c063da", 
            "executionArn": "arn:aws:states:us-east-1:XXXXXXXXXXXX:execution:messaging-demo-source-ep-target-ep-StateMachine:6ec94ebf-bf38-40ce-baab-dee226c063da", 
            "stateMachineArn": "arn:aws:states:us-east-1:XXXXXXXXXXXX:stateMachine:messaging-demo-source-ep-target-ep-StateMachine", 
            "stopDate": 1522268224.761
        }
    ]
} 

```

Describe the execution to get the input and output:
```sh
aws stepfunctions describe-execution --execution-arn "arn:aws:states:us-east-1:196431283258:execution:messaging-demo-source-proc-target-ep-StateMachine:82f2564b-1096-40f6-8592-93b0410db193"
```

```json
{
    "status": "SUCCEEDED", 
    "startDate": 1522278285.109, 
    "name": "82f2564b-1096-40f6-8592-93b0410db193", 
    "executionArn": "arn:aws:states:us-east-1:XXXXXXXXXXXX:execution:messaging-demo-source-ep-target-ep-StateMachine:6ec94ebf-bf38-40ce-baab-dee226c063da", 
    "stateMachineArn": "arn:aws:states:us-east-1:XXXXXXXXXXXX:stateMachine:messaging-demo-source-proc-target-ep-StateMachine", 
    "stopDate": 1522278285.324, 
    "output": "\"SUCCESS\"", 
    "input": "{\"message\":{\"id\":\"4591\",\"timestamp\":\"1522278284797\",\"message\":\"173baa22dd310ecb14764f5f06f455fb17ca92fe\"}}"
}
```
