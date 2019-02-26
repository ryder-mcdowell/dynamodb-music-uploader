# s3-uploader

A command line app using node and aws sdk to upload songs to DynamoDB.

## Development

1. Clone the repository: ``
2. Setup credentials in `~/.aws/credentials` and role profile in `~/.aws/config` for AWS credentials
3. Run app with: 
```
AWS_SDK_LOAD_CONFIG=true AWS_PROFILE=NAME_OF_ROLE_PROFILE node index.js
```