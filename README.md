# HarvestLoggerAlexaSkill
Alexa Skill for logging time to Harvest

## Requirements
- NodeJS
- Yarn
- Serverless Framework
- AWS account & Amazon Developer account

## Intro
This project is written in TypeScript and uses [Yarn][2] for package management.

It also leverages the Serverless Framework for fast deployment. Serverless takes care of spinning
up all the infrastructure for you, all you have to do is [configure it to use your AWS account][1]. 

## Setup
- Install Node, Yarn, and Serverless
- Configure Serverless to use your AWS credentials
- Restore the Node modules: `yarn install`
- Deploy to AWS: `serverless deploy`

For the time being, you must hard-code your Harvest API token. TODO: Implement OAuth.

To be continued...

[1]: https://serverless.com/framework/docs/getting-started/
[2]: https://yarnpkg.com/en/docs/install