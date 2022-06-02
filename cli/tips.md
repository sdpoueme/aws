#bulk delete s3 buckets
```
aws s3api list-buckets    --query 'Buckets[?starts_with(Name, `bucket pattern`) == `true`].[Name]'    --output text | xargs -I {} aws s3 rb s3://{} --force
```
