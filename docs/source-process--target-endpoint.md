# Deploying a Source Process-to-Target-Endpoint Route with Simulators
![Source Process to Target Endpoint Diagram](https://s3.amazonaws.com/f12f301f-messaging-demo/diagrams/source-process--target-endpoint.png "Source Process to Target Endpoint Diagram")

  1. Deploy a Target Endpoint: [![Deploy to AWS](https://s3.amazonaws.com/f12f301f-messaging-demo/misc/deploy_to_aws.png "Deploy to AWS")](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?stackName=messaging-demo-target-endpoint&templateURL=https://s3.amazonaws.com/f12f301f-messaging-demo/templates/target-endpoint.yaml)
  2. Deploy a route between the source and the target: [![Deploy to AWS](https://s3.amazonaws.com/f12f301f-messaging-demo/misc/deploy_to_aws.png "Deploy to AWS")](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?stackName=messaging-demo-source-proc-target-ep&templateURL=https://s3.amazonaws.com/f12f301f-messaging-demo/templates/source-process--target-endpoint.yaml)
  3. Deploy a Source Process: [![Deploy to AWS](https://s3.amazonaws.com/f12f301f-messaging-demo/misc/deploy_to_aws.png "Deploy to AWS")](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?stackName=messaging-demo-source-process&templateURL=https://s3.amazonaws.com/f12f301f-messaging-demo/templates/source-process.yaml)

## Source Process Template Parameters
The Source Process template requires several parameters. The following are required:
  * **Stack name:** Provide a unique name for this CloudFormation Stack. The Stack Name is used to generate names for various aspects of the task, service, security groups, and other resources, so you should ensure that the Stack Name a unique identifier among your deployed Stacks, as well as other resources in your region.
  * **BatchSize:** How many messages to send for each request of the endpoint. Setting this number small will help you to trace messages as they move across a route.
  * **EcsClusterArn:** The ARN of the Fargate cluster you created previously. If you used the template provided above, the ARN is available as an output of the CloudFormation stack.
  * **VpcId:** The VPC within which the Fargate cluster runs. If you created a Fargate cluster using the above template, the VPC ID is an output.
  * **SubnetIds:** A comma separated list of subnets within which the Fargate cluster runs. If you created a Fargate cluster using the above template, the subnet IDs are available as outputs.
  * **LogLevel:** A log level for output from the source. By default, `verbose` is selected and is recommended.
  * **Frequency:** The number of milliseconds between requests. The sourcex process will send new messages at this rate.
  * **PointedAt:** The URL for the sourec process to send new messages. This will be an output of any of the templates that routes messages from a source process.

Additionally, one of the following two parameters must be provided:
  * **ExecutionRoleArn:** Provide the ARN of an IAM Role that contains the `AmazonECSTaskExecutionRolePolicy` or equivalent. This is optional; CloudFormation can create the Role on your behalf if you leave this blank and specify `ExecutionRoleName` instead.
  * **ExecutionRoleName:** The name of a new IAM Role that will contain the `AmazonECSTaskExecutionRolePolicy` IAM Policy. This is optional; CloudFormation can use an existing IAM Role if you provide it in the `ExecutionRoleArn` parameter.

## Target Endpoint Template Parameters
The Target Endpoint template requires several parameters. The following are required:
  * **Stack name:** Provide a unique name for this CloudFormation Stack. The Stack Name is used to generate names for various aspects of the task, service, security groups, and other resources, so you should ensure that the Stack Name a unique identifier among your deployed Stacks, as well as other resources in your region.
  * **EcsClusterArn:** The ARN of the Fargate cluster you created previously. If you used the template provided above, the ARN is available as an output of the CloudFormation stack.
  * **VpcId:** The VPC within which the Fargate cluster runs. If you created a Fargate cluster using the above template, the VPC ID is an output.
  * **SubnetIds:** A comma separated list of subnets within which the Fargate cluster runs. If you created a Fargate cluster using the above template, the subnet IDs are available as outputs.
  * **LogLevel:** A log level for output from the source. By default, `verbose` is selected and is recommended.

Additionally, one of the following two parameters must be provided:
  * **ExecutionRoleArn:** Provide the ARN of an IAM Role that contains the `AmazonECSTaskExecutionRolePolicy` or equivalent. This is optional; CloudFormation can create the Role on your behalf if you leave this blank and specify `ExecutionRoleName` instead.
  * **ExecutionRoleName:** The name of a new IAM Role that will contain the `AmazonECSTaskExecutionRolePolicy` IAM Policy. This is optional; CloudFormation can use an existing IAM Role if you provide it in the `ExecutionRoleArn` parameter.

## Route Template Parameters
The Source Process-to-Target Endpoint route requires the following parameters:
  * **Stack name:** Provide a unique name for this CloudFormation Stack. The Stack Name is used to generate names for various aspects of the API Gateway and other resources, so you should ensure that the Stack Name a unique identifier among your deployed Stacks, as well as other resources in your region.
  * **TargetEndpoint:** The target endpoint URL, which is an output of the Target Endpoint template. This is the URL where routed messages are POSTed.

## Verify Message Routing
You can use your favorite CloudWatch tool, or the CloudWatch Logs section in the AWS Management Console to tail the logs for the source and target components, as well as the Lambdas that are executed through the message route to see evidence of each message traversing the route. Here, the use of [cwtail](https://www.npmjs.com/package/cwtail) is demonstrated.

List the logs that are associated with this demo:
```sh
aws logs describe-log-groups | jq .logGroups[].logGroupName
```

```
"/aws/lambda/messaging-demo-source-proc-target-ep-PushEmitter-IDSXM0Q3OOVE"
"/aws/lambda/messaging-demo-source-proc-target-ep-SinkIngestor-1PJVUV61MMSLR"
"/aws/lambda/messaging-demo-source-proc-target-ep-Transformer-13JE2IH666FTC"
"/ecs/messaging-demo-source-process/Log"
"/ecs/messaging-demo-target-endpoint/Log"
```

Here, you can see a log associated with the Source Process and Target Endpoint containers, as well as a log for each of the Lambdas: Poll Ingestor, Transformer, and Push Emitter.

### Examine the Source Process
Tail the Source Process log to see messages as they are sent into the route:
```
cwtail -ef /ecs/messaging-demo-source-process/Log
```

```
info: Running health check listener on port 3000.
info: SUCCESS
verbose:  id=0, timestamp=1522273683246, message=cc8b0014c0ce093772981add9385bc7f695d12f4
verbose:  id=1, timestamp=1522273684347, message=cdc10d713ca891c03beca4f94d3432793bbe8a03
verbose:  id=2, timestamp=1522273685351, message=769d63466f6bd4af1c843349e47fa0046a0cd9af
verbose:  id=3, timestamp=1522273686353, message=f6e4ffe4b0faaeb9ee1ef6cb6aebf8fbe45da399
verbose:  id=4, timestamp=1522273687356, message=d10cd588be41f30ca36c35804cccdacbaaed8679
verbose:  id=5, timestamp=1522273688357, message=e9fa987adfc3316ee2e8433db3e30cfcef8dee9a
verbose:  id=6, timestamp=1522273689359, message=551a559cddabd0494b2533e3e50f380169b71577
verbose:  id=7, timestamp=1522273690362, message=4a01dd8bdc7d2acd6961028b860913523ffff001
verbose:  id=8, timestamp=1522273691364, message=8bae7dce71ff00012f49d505c7fed7dfd43f9a11
verbose:  id=9, timestamp=1522273692365, message=61f71eebad5201722984d41406102dd2b0d8ec8c
verbose:  id=10, timestamp=1522273693367, message=e5d6b69e16d7a81098204d453586c170da05d2c9
```

### Examine the Sink Ingestor
Tail the Sink Ingestor log to see messages as they enter the route:
```
cwtail -ef /aws/lambda/messaging-demo-source-proc-target-ep-SinkIngestor-1PJVUV61MMSLR
```

```
START RequestId: b03b1095-9164-4652-9f54-d9ce5a5ff260 Version: $LATEST
END RequestId: b03b1095-9164-4652-9f54-d9ce5a5ff260
REPORT RequestId: b03b1095-9164-4652-9f54-d9ce5a5ff260	Duration: 1042.18 ms	Billed Duration: 1100 ms 	Memory Size: 128 MB	Max Memory Used: 37 MB
```

### Examine the Transformer
Tail the Transformer log to see messages as they are transformed in the middle of the route:
```
cwtail -ef /aws/lambda/messaging-demo-source-proc-target-ep-Transformer-13JE2IH666FTC
```

```
START RequestId: 490baa22-32c4-11e8-991d-71b7085f6747 Version: $LATEST
END RequestId: 490baa22-32c4-11e8-991d-71b7085f6747
REPORT RequestId: 490baa22-32c4-11e8-991d-71b7085f6747	Duration: 23.27 ms	Billed Duration: 100 ms 	Memory Size: 128 MB	Max Memory Used: 19 MB
```

### Examine the Push Emitter
Tail the Push Emitter to see transformed messages as they are pushed out to the Target Endpoint and leave the route:
```
cwtail -ef /aws/lambda/messaging-demo-source-proc-target-ep-PushEmitter-IDSXM0Q3OOVE
```

```
START RequestId: b371984e-32d1-11e8-815d-876d624b5a65 Version: $LATEST
END RequestId: b371984e-32d1-11e8-815d-876d624b5a65
REPORT RequestId: b371984e-32d1-11e8-815d-876d624b5a65	Duration: 419.03 ms	Billed Duration: 500 ms 	Memory Size: 128 MB	Max Memory Used: 27 MB
```

### Examine the Target Endpoint
Tail the Target Endpoint log to see messages as they are received by the Target Endpoint:
```
cwtail -ef /ecs/messaging-demo-target-endpoint/Log
info: Running on port 3000.
info:  id=0, timestamp=1522273683246, message=cc8b0014c0ce093772981add9385bc7f695d12f4, additionalValue=true
info:  id=2, timestamp=1522273685351, message=769d63466f6bd4af1c843349e47fa0046a0cd9af, additionalValue=true
info:  id=3, timestamp=1522273686353, message=f6e4ffe4b0faaeb9ee1ef6cb6aebf8fbe45da399, additionalValue=true
info:  id=4, timestamp=1522273687356, message=d10cd588be41f30ca36c35804cccdacbaaed8679, additionalValue=true
info:  id=5, timestamp=1522273688357, message=e9fa987adfc3316ee2e8433db3e30cfcef8dee9a, additionalValue=true
info:  id=6, timestamp=1522273689359, message=551a559cddabd0494b2533e3e50f380169b71577, additionalValue=true
info:  id=7, timestamp=1522273690362, message=4a01dd8bdc7d2acd6961028b860913523ffff001, additionalValue=true
info:  id=8, timestamp=1522273691364, message=8bae7dce71ff00012f49d505c7fed7dfd43f9a11, additionalValue=true
info:  id=10, timestamp=1522273693367, message=e5d6b69e16d7a81098204d453586c170da05d2c9, additionalValue=true
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
```
aws stepfunctions list-executions --state-machine-arn "arn:aws:states:us-east-1:196431283258:stateMachine:messaging-demo-source-ep-target-ep-StateMachine"
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
