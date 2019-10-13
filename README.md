# kanban-board-calendar-exporter

Export [kanban-board-app](https://github.com/shellyln/kanban-board-app) tasks as iCal (*.ics) format
with AWS Lambda + S3 infrastructure.



## Deploying

1. Create S3 Bucket as public.
1. Create Lambda function by 'Author from scratch'.
    1. Select runtime `Node 10.x`, Create a new role with basic Lambda permissions.
    1. Move view `IAM/Roles` and edit the generated role for the Lambda function.
        1. Edit the role's policies. See below.
    1. Set `Handler` as `lambda-index.handler`.
1. Add `CloudWatch Events` trigger.
    1. Select `Create new rule`.
    1. Select `Scheduled expression`.
        1. expression: `rate(1 hour)`
        1. `Enable trigger` and `Add`.
1. Run Cloud9 and import the Lambda function.
    1. Clone this repository and overwrite copying to the imported Lambda function directory.
    1. Copy `config/*.config.dist.js` to `config/*.config.js` and edit.
    1. `npm ci`
    1. `node index.js` for testing db configurations.
    1. Deploy the imported Lambda function.



### Lambda function's IAM policy settings

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogStream",
                "logs:PutLogEvents",
                "s3:GetObjectAcl",
                "s3:GetObject",
                "s3:ListBucket",
                "s3:DeleteObject",
                "s3:PutObject",
                "s3:PutObjectAcl"
            ],
            "Resource": [
                "arn:aws:logs:<your-region-name>:<your-cloud-watch-log-id>:log-group:/aws/lambda/<your-lambda-function-name>:*",
                "arn:aws:s3:::<your-bucket-name>/*"
            ]
        },
        {
            "Sid": "VisualEditor1",
            "Effect": "Allow",
            "Action": "logs:CreateLogGroup",
            "Resource": "arn:aws:logs:<your-region-name>:<your-cloud-watch-log-id>:*"
        }
    ]
}
```

* `<your-region-name>`
* `<your-cloud-watch-log-id>`
* `<your-bucket-name>`
* `<your-lambda-function-name>`



## Import to Google Calendar

See [Add someone else's Google calendar](https://support.google.com/calendar/answer/37100) > `Add using a link`.



## License
[ISC](https://github.com/shellyln/kanban-board-calendar-exporter/blob/master/LICENSE.md)  
Copyright (c) 2019 Shellyl_N and Authors.
