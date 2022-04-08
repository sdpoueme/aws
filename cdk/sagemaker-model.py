from aws_cdk import (
    # Duration,
    Stack
)
from constructs import Construct

from aws_cdk import aws_sagemaker as sagemaker

class SagemakerTestStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)  

        cfn_model = sagemaker.CfnModel(self, "SageMaker-test",
        
        execution_role_arn="arn:aws:iam::742301976366:role/service-role/AmazonSageMaker-ExecutionRole-20220126T075519",

        model_name="sagemaker-test",
        primary_container=sagemaker.CfnModel.ContainerDefinitionProperty(
            container_hostname="containerHostname",
            image="763104351884.dkr.ecr.us-east-1.amazonaws.com/tensorflow-inference-eia:2.3.0-cpu-py37-ubuntu18.04",
            mode="SingleModel",
            model_data_url="s3://mybucket/model.tar.gz"
        )
    )
