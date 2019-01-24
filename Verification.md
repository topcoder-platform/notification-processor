# Topcoder - Challenge Resource Processor Verification

- start kafka server, start processor app
- start kafka-console-consumer to validate output messages on 'test.email'
  `bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic test.email`
- start kafka-console-producer to write messages to `submission.notification.create` topic:
  `bin/kafka-console-producer.sh --broker-list localhost:9092 --topic submission.notification.create`
- write message of `Create Submission`:
  `{ "topic": "challenge.notification.events", "originator": "some-originator", "timestamp": "2018-02-16T00:00:00", "mime-type": "application/json", "payload": { "type": "ADD_RESOURCE", "data": { "challengeId": 30075466, "request": { "roleId": 1, "resourceUserId": 10527204, "phaseId": 0, "addNotification": true, "addForumWatch": true, "checkTerm": false, "studio": false } } } }`
- the processor app console will show:

```bash
info: Successfully processed the message and published the result on kafka
```
- the result message will appear on kafka-console-consumer:(Note that, the message appears on the kafka-console-consumer could be slightly different than the message below. However, overall structure should be same)

```json
{
  "topic":"test.email",
  "originator":"tc-submission-notification-processor",
  "timestamp":"2019-01-15T19:02:38.717Z",
  "mime-type":"application/json",
  "payload":{
    "data":{
      "submitter":{
        "handle":"lazybaer",
        "email":"email@domain.com.z",
        "rating":{
          "rating":0,
          "track":null,
          "subTrack":null
        }
      },
      "submission":{
        "updatedBy":"lazybaer",
        "created":"2019-01-10T17:55:59.135Z",
        "legacySubmissionId":206452,
        "isFileSubmission":false,
        "type":"Contest Submission",
        "url":"https://s3.amazonaws.com/topcoder-dev-submissions/bac822d2-725d-4973-9778-360918a09bc0.zip",
        "challengeId":30054534,
        "createdBy":"lazybaer",
        "review":[
          {
            "score":100,
            "updatedBy":"maE2maBSv9fRVHjSlC31LFZSq6VhhZqC@clients",
            "reviewerId":"96059e8d-4761-4978-9a14-c86ae6b971c3",
            "submissionId":"bac822d2-725d-4973-9778-360918a09bc0",
            "createdBy":"maE2maBSv9fRVHjSlC31LFZSq6VhhZqC@clients",
            "created":"2019-01-10T17:56:04.223Z",
            "scoreCardId":30001850,
            "typeId":"68c5a381-c8ab-48af-92a7-7a869a4ee6c3",
            "id":"c09ab9bd-9acf-40a4-8d6f-db50e6237a4d",
            "updated":"2019-01-10T17:56:04.223Z"
          }
        ],
        "id":"bac822d2-725d-4973-9778-360918a09bc0",
        "submissionPhaseId":763584,
        "updated":"2019-01-10T17:55:59.135Z",
        "fileType":"zip",
        "memberId":23225544,
        "reviewSummation":[

        ]
      },
      "challenge":{
        "challengeTitle":"File-Upload-Test  by Sushil",
        "challengeId":30054534,
        "submissionEndDate":"2019-01-31T12:04:00.000Z",
        "prizes":[
          350,
          150
        ],
        "challengeCommunity":"develop",
        "subTrack":"CODE",
        "technologies":[
          "Node.js"
        ],
        "platforms":[
          "NodeJS"
        ],
        "numberOfRegistrants":5,
        "numberOfSubmissions":5
      }
    },
    "recipients":[
      "email@domain.com.z"
    ],
    "replyTo":""
  }
}
```

- write message of `Create Review`:
  `{ "topic": "submission.notification.create", "originator": "submission-api", "timestamp": "2018-08-06T15:46:05.575Z", "mime-type": "application/json", "payload": { "resource": "review", "id": "c09ab9bd-9acf-40a4-8d6f-db50e6237a4d", "created": "2019-01-10T17:56:04.223Z", "updated": "2019-01-10T17:56:04.223Z", "createdBy": "maE2maBSv9fRVHjSlC31LFZSq6VhhZqC@clients", "updatedBy": "maE2maBSv9fRVHjSlC31LFZSq6VhhZqC@clients", "score": 100, "reviewerId": "96059e8d-4761-4978-9a14-c86ae6b971c3", "submissionId": "bac822d2-725d-4973-9778-360918a09bc0", "scoreCardId": 30001850, "typeId": "68c5a381-c8ab-48af-92a7-7a869a4ee6c3" } }`
- the processor app console will show:

```bash
info: Successfully processed the message and published the result on kafka
```
- the result message will appear on kafka-console-consumer:(Note that, the message appears on the kafka-console-consumer could be slightly different than the message below. However, overall structure should be same)

```json
{
  "topic":"test.email",
  "originator":"tc-submission-notification-processor",
  "timestamp":"2019-01-15T19:07:10.173Z",
  "mime-type":"application/json",
  "payload":{
    "data":{
      "submitter":{
        "handle":"lazybaer",
        "email":"email@domain.com.z",
        "rating":{
          "rating":0,
          "track":null,
          "subTrack":null
        }
      },
      "submission":{
        "updatedBy":"lazybaer",
        "created":"2019-01-10T17:55:59.135Z",
        "legacySubmissionId":206452,
        "isFileSubmission":false,
        "type":"Contest Submission",
        "url":"https://s3.amazonaws.com/topcoder-dev-submissions/bac822d2-725d-4973-9778-360918a09bc0.zip",
        "challengeId":30054534,
        "createdBy":"lazybaer",
        "review":[
          {
            "score":100,
            "updatedBy":"maE2maBSv9fRVHjSlC31LFZSq6VhhZqC@clients",
            "reviewerId":"96059e8d-4761-4978-9a14-c86ae6b971c3",
            "submissionId":"bac822d2-725d-4973-9778-360918a09bc0",
            "createdBy":"maE2maBSv9fRVHjSlC31LFZSq6VhhZqC@clients",
            "created":"2019-01-10T17:56:04.223Z",
            "scoreCardId":30001850,
            "typeId":"68c5a381-c8ab-48af-92a7-7a869a4ee6c3",
            "id":"c09ab9bd-9acf-40a4-8d6f-db50e6237a4d",
            "updated":"2019-01-10T17:56:04.223Z"
          }
        ],
        "id":"bac822d2-725d-4973-9778-360918a09bc0",
        "submissionPhaseId":763584,
        "updated":"2019-01-10T17:55:59.135Z",
        "fileType":"zip",
        "memberId":23225544,
        "reviewSummation":[

        ]
      },
      "challenge":{
        "challengeTitle":"File-Upload-Test  by Sushil",
        "challengeId":30054534,
        "submissionEndDate":"2019-01-31T12:04:00.000Z",
        "prizes":[
          350,
          150
        ],
        "challengeCommunity":"develop",
        "subTrack":"CODE",
        "technologies":[
          "Node.js"
        ],
        "platforms":[
          "NodeJS"
        ],
        "numberOfRegistrants":5,
        "numberOfSubmissions":5
      },
      "reviewer":{
        "handle":"lazybaer",
        "email":"email@domain.com.z",
        "rating":{
          "rating":0,
          "track":null,
          "subTrack":null
        }
      }
    },
    "recipients":[
      "email@domain.com.z"
    ],
    "replyTo":""
  }
}
```


- start another kafka-console-producer to write messages to `submission.notification.update` topic:
  `bin/kafka-console-producer.sh --broker-list localhost:9092 --topic submission.notification.update`
- write message of `Update Submission`:
  `{"topic":"submission.notification.update","originator":"submission-api", "timestamp":"2018-08-06T15:46:05.575Z", "mime-type":"application/json", "payload":{ "resource":"submission", "id":"bac822d2-725d-4973-9778-360918a09bc0", "type":"Contest Submission", "url":"https://s3.amazonaws.com/topcoder-dev-submissions-dmz/30054534-23225544-SUBMISSION_ZIP-1547142950200.zip", "memberId":23225544, "challengeId":30054534, "created":"2019-01-10T17:55:59.135Z", "updated":"2019-01-10T17:55:59.135Z", "createdBy":"lazybaer", "updatedBy":"lazybaer", "submissionPhaseId":763584, "fileType":"zip", "isFileSubmission":false } }`
- the processor app console will show:

```bash
info: Successfully processed the message and published the result on kafka
```
- the result message will appear on kafka-console-consumer:(Note that, the message appears on the kafka-console-consumer could be slightly different than the message below. However, overall structure should be same)

```json
{
  "topic":"test.email",
  "originator":"tc-submission-notification-processor",
  "timestamp":"2019-01-15T18:48:37.172Z",
  "mime-type":"application/json",
  "payload":{
    "data":{
      "submitter":{
        "handle":"lazybaer",
        "email":"email@domain.com.z",
        "rating":{
          "rating":0,
          "track":null,
          "subTrack":null
        }
      },
      "submission":{
        "updatedBy":"lazybaer",
        "created":"2019-01-10T17:55:59.135Z",
        "legacySubmissionId":206452,
        "isFileSubmission":false,
        "type":"Contest Submission",
        "url":"https://s3.amazonaws.com/topcoder-dev-submissions/bac822d2-725d-4973-9778-360918a09bc0.zip",
        "challengeId":30054534,
        "createdBy":"lazybaer",
        "review":[
          {
            "score":100,
            "updatedBy":"maE2maBSv9fRVHjSlC31LFZSq6VhhZqC@clients",
            "reviewerId":"96059e8d-4761-4978-9a14-c86ae6b971c3",
            "submissionId":"bac822d2-725d-4973-9778-360918a09bc0",
            "createdBy":"maE2maBSv9fRVHjSlC31LFZSq6VhhZqC@clients",
            "created":"2019-01-10T17:56:04.223Z",
            "scoreCardId":30001850,
            "typeId":"68c5a381-c8ab-48af-92a7-7a869a4ee6c3",
            "id":"c09ab9bd-9acf-40a4-8d6f-db50e6237a4d",
            "updated":"2019-01-10T17:56:04.223Z"
          }
        ],
        "id":"bac822d2-725d-4973-9778-360918a09bc0",
        "submissionPhaseId":763584,
        "updated":"2019-01-10T17:55:59.135Z",
        "fileType":"zip",
        "memberId":23225544,
        "reviewSummation":[

        ]
      },
      "challenge":{
        "challengeTitle":"File-Upload-Test  by Sushil",
        "challengeId":30054534,
        "submissionEndDate":"2019-01-31T12:04:00.000Z",
        "prizes":[
          350,
          150
        ],
        "challengeCommunity":"develop",
        "subTrack":"CODE",
        "technologies":[
          "Node.js"
        ],
        "platforms":[
          "NodeJS"
        ],
        "numberOfRegistrants":5,
        "numberOfSubmissions":5
      }
    },
    "recipients":[
      "email@domain.com.z"
    ],
    "replyTo":""
  }
}
```


- you may write invalid message like:
  `{ "topic": "submission.notification.update", "originator": "some-originator", "timestamp": "2018-02-16T00:00:00", "mime-type": "application/json", "payload": { "resource": "submission", "data": { "invalid": 30075466, "memberId": 40152905 } } }`
  `{ "topic": "submission.notification.update", "originator": "some-originator", "timestamp": "2018-02-16T00:00:00", "mime-type": "application/json", "payload": { "resource": "submission", "data": { "id": ["invalid"], "memberId": 8547899 } } }`
  `[ { - a b c`
- then in the app console, you will see error messages



# Topcoder - Challenge registration processor updates Verification
- UNIT TESTS see [README.md](./README.md) about how to run unit test and run unit test with coverage report.


