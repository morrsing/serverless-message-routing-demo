# Deploying a Source Process-to-Target-Process Route with Simulators
![Source Process to Target Process Diagram](https://s3.amazonaws.com/f12f301f-messaging-demo/diagrams/source-process--target-process.png "Source Process to Target Process Diagram")

  1. Deploy a route between the source and the target: [![Deploy to AWS](https://s3.amazonaws.com/f12f301f-messaging-demo/misc/deploy_to_aws.png "Deploy to AWS")](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?stackName=messaging-demo-ecs-cluster&templateURL=https://s3.amazonaws.com/f12f301f-messaging-demo/templates/source-process--target-process.yaml)
  2. Deploy a Source Process: [![Deploy to AWS](https://s3.amazonaws.com/f12f301f-messaging-demo/misc/deploy_to_aws.png "Deploy to AWS")](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?stackName=messaging-demo-ecs-cluster&templateURL=https://s3.amazonaws.com/f12f301f-messaging-demo/templates/source-process.yaml)
  3. Deploy a Target Endpoint: [![Deploy to AWS](https://s3.amazonaws.com/f12f301f-messaging-demo/misc/deploy_to_aws.png "Deploy to AWS")](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?stackName=messaging-demo-ecs-cluster&templateURL=https://s3.amazonaws.com/f12f301f-messaging-demo/templates/target-process.yaml)

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

## Target Process Template Parameters
The Target Endpoint template requires several parameters. The following are required:
  * **Stack name:** Provide a unique name for this CloudFormation Stack. The Stack Name is used to generate names for various aspects of the task, service, security groups, and other resources, so you should ensure that the Stack Name a unique identifier among your deployed Stacks, as well as other resources in your region.
  * **EcsClusterArn:** The ARN of the Fargate cluster you created previously. If you used the template provided above, the ARN is available as an output of the CloudFormation stack.
  * **VpcId:** The VPC within which the Fargate cluster runs. If you created a Fargate cluster using the above template, the VPC ID is an output.
  * **SubnetIds:** A comma separated list of subnets within which the Fargate cluster runs. If you created a Fargate cluster using the above template, the subnet IDs are available as outputs.
  * **LogLevel:** A log level for output from the target. By default, `verbose` is selected and is recommended.
  * **Frequency:** The number of milliseconds between requests. The target process will poll for completed messages at this rate.
  * **PointedAt:** The URL for the target process to request for completed messages. This will be an output of any of the templates that routes messages to a target process.
  * **RequestMethod:** The HTTP method for making requests for compoleted messages. This will be an output of any of the tempaltes that routes messages to a target process.

Additionally, one of the following two parameters must be provided:
  * **ExecutionRoleArn:** Provide the ARN of an IAM Role that contains the `AmazonECSTaskExecutionRolePolicy` or equivalent. This is optional; CloudFormation can create the Role on your behalf if you leave this blank and specify `ExecutionRoleName` instead.
  * **ExecutionRoleName:** The name of a new IAM Role that will contain the `AmazonECSTaskExecutionRolePolicy` IAM Policy. This is optional; CloudFormation can use an existing IAM Role if you provide it in the `ExecutionRoleArn` parameter.

## Route Template Parameters
  * **Stack name:** Provide a unique name for this CloudFormation Stack. The Stack Name is used to generate names for various aspects of the API Gateway and other resources, so you should ensure that the Stack Name a unique identifier among your deployed Stacks, as well as other resources in your region.
