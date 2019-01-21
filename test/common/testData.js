/*
 * Test data to be used in tests
 */
const _ = require('lodash')

const submissionId = 'bac822d2-725d-4973-9778-360918a09bc0'
const challengeId = 30054534
const userId = 23225544
const SRMChallengeId = 1111111
const SRMSubmissionId = 'bbbbbbbb-725d-4973-9778-360918a09bc0'
const submitterHandle = 'lazybaer'
const submitterEmail = 'email@domain.com.z'
const reviewerHandle = submitterHandle

const status404SubmissionId = 333333
const status500SubmissionId = 999999

const createSubmissionMessage = {
  'topic': 'submission.notification.create',
  'originator': 'submission-api',
  'timestamp': '2018-08-06T15:46:05.575Z',
  'mime-type': 'application/json',
  'payload': {
    'resource': 'submission',
    'id': submissionId,
    'type': 'Contest Submission',
    'url': 'https://s3.amazonaws.com/topcoder-dev-submissions-dmz/30054534-23225544-SUBMISSION_ZIP-1547142950200.zip',
    'memberId': 23225544,
    'challengeId': challengeId,
    'created': '2019-01-10T17:55:59.135Z',
    'updated': '2019-01-10T17:55:59.135Z',
    'createdBy': submitterHandle,
    'updatedBy': submitterHandle,
    'submissionPhaseId': 763584,
    'fileType': 'zip',
    'isFileSubmission': false
  }
}

const updateSubmissionMessage = {
  'topic': 'submission.notification.update',
  'originator': 'submission-api',
  'timestamp': '2018-08-06T15:46:05.575Z',
  'mime-type': 'application/json',
  'payload': {
    'resource': 'submission',
    'id': submissionId,
    'challengeId': challengeId,
    'memberId': 23225544,
    'submissionPhaseId': 763584,
    'type': 'Contest Submission',
    'url': 'https://s3.amazonaws.com/topcoder-dev-submissions/bac822d2-725d-4973-9778-360918a09bc0.zip'
  }
}

const reviewNotificationMessage = {
  'topic': 'submission.notification.create',
  'originator': 'submission-api',
  'timestamp': '2018-08-06T15:46:05.575Z',
  'mime-type': 'application/json',
  'payload': {
    'resource': 'review',
    'id': 'c09ab9bd-9acf-40a4-8d6f-db50e6237a4d',
    'created': '2019-01-10T17:56:04.223Z',
    'updated': '2019-01-10T17:56:04.223Z',
    'createdBy': 'maE2maBSv9fRVHjSlC31LFZSq6VhhZqC@clients',
    'updatedBy': 'maE2maBSv9fRVHjSlC31LFZSq6VhhZqC@clients',
    'score': 100,
    'reviewerId': '96059e8d-4761-4978-9a14-c86ae6b971c3',
    'reviewerHandle': reviewerHandle,
    'submissionId': submissionId,
    'scoreCardId': 30001850,
    'typeId': '68c5a381-c8ab-48af-92a7-7a869a4ee6c3'
  }
}

const submissionResponse = {
  'updatedBy': submitterHandle,
  'created': '2019-01-10T17:55:59.135Z',
  'legacySubmissionId': 206452,
  'isFileSubmission': false,
  'type': 'Contest Submission',
  'url': 'https://s3.amazonaws.com/topcoder-dev-submissions/bac822d2-725d-4973-9778-360918a09bc0.zip',
  'challengeId': challengeId,
  'createdBy': submitterHandle,
  'review': [
    {
      'score': 100,
      'updatedBy': 'maE2maBSv9fRVHjSlC31LFZSq6VhhZqC@clients',
      'reviewerId': '96059e8d-4761-4978-9a14-c86ae6b971c3',
      'submissionId': 'bac822d2-725d-4973-9778-360918a09bc0',
      'createdBy': 'maE2maBSv9fRVHjSlC31LFZSq6VhhZqC@clients',
      'created': '2019-01-10T17:56:04.223Z',
      'scoreCardId': 30001850,
      'typeId': '68c5a381-c8ab-48af-92a7-7a869a4ee6c3',
      'id': 'c09ab9bd-9acf-40a4-8d6f-db50e6237a4d',
      'updated': '2019-01-10T17:56:04.223Z'
    }
  ],
  'id': submissionId,
  'submissionPhaseId': 763584,
  'updated': '2019-01-10T17:55:59.135Z',
  'fileType': 'zip',
  'memberId': 23225544,
  'reviewSummation': []
}

const challengeResponse = {
  'id': '-64774794:1684ab27e79:-4410',
  'result': {
    'success': true,
    'status': 200,
    'metadata': null,
    'content': {
      'subTrack': 'CODE',
      'challengeTitle': 'File-Upload-Test  by Sushil',
      'challengeId': challengeId,
      'projectId': 7377,
      'forumId': 32684,
      'detailedRequirements': 'T',
      'reviewScorecardId': 30001610,
      'numberOfCheckpointsPrizes': 0,
      'postingDate': '2019-01-09T02:04:15.946Z',
      'registrationEndDate': '2019-01-31T12:04:00.000Z',
      'submissionEndDate': '2019-01-31T12:04:00.000Z',
      'reviewType': 'INTERNAL',
      'forumLink': 'https://apps.topcoder.com/forums/?module=Category&categoryID=32684',
      'appealsEndDate': '2019-02-04T00:04:00.000Z',
      'currentStatus': 'Active',
      'challengeCommunity': 'develop',
      'directUrl': 'https://www.topcoder.com/direct/contest/detail.action?projectId=30054534',
      'prizes': [
        350,
        150
      ],
      'terms': [
        {
          'termsOfUseId': 20704,
          'role': 'Specification Reviewer',
          'agreeabilityType': 'Electronically-agreeable',
          'title': 'Standard Reviewer Terms v1.0',
          'url': ''
        },
        {
          'termsOfUseId': 21303,
          'role': 'Submitter',
          'agreeabilityType': 'Electronically-agreeable',
          'title': 'Standard Terms for TopCoder Competitions v2.2',
          'url': ''
        },
        {
          'termsOfUseId': 20704,
          'role': 'Primary Screener',
          'agreeabilityType': 'Electronically-agreeable',
          'title': 'Standard Reviewer Terms v1.0',
          'url': ''
        },
        {
          'termsOfUseId': 20704,
          'role': 'Reviewer',
          'agreeabilityType': 'Electronically-agreeable',
          'title': 'Standard Reviewer Terms v1.0',
          'url': ''
        },
        {
          'termsOfUseId': 20704,
          'role': 'Aggregator',
          'agreeabilityType': 'Electronically-agreeable',
          'title': 'Standard Reviewer Terms v1.0',
          'url': ''
        },
        {
          'termsOfUseId': 20704,
          'role': 'Final Reviewer',
          'agreeabilityType': 'Electronically-agreeable',
          'title': 'Standard Reviewer Terms v1.0',
          'url': ''
        },
        {
          'termsOfUseId': 20794,
          'role': 'Manager',
          'agreeabilityType': 'Non-electronically-agreeable',
          'title': 'Approved OR Managers - TopCoder Technical Team',
          'url': 'http://www.topcoder.com'
        },
        {
          'termsOfUseId': 20893,
          'role': 'Copilot',
          'agreeabilityType': 'Non-electronically-agreeable',
          'title': 'TopCoder Master Services Agreement',
          'url': 'http://www.topcoder.com/wiki/download/attachments/35129137/Member+Master+Agreement+v0020409.pdf'
        }
      ],
      'finalSubmissionGuidelines': 'T',
      'technologies': [
        'Node.js'
      ],
      'platforms': [
        'NodeJS'
      ],
      'currentPhaseName': 'Submission',
      'currentPhaseRemainingTime': 1424328,
      'currentPhaseEndDate': '2019-01-31T12:04:00.000Z',
      'registrants': [
        {
          'reliability': null,
          'colorStyle': 'color: #000000',
          'registrationDate': '2019-01-10T15:07:03.000Z',
          'submissionDate': '2019-01-10T15:22:48.000Z',
          'handle': 'TonyJ'
        },
        {
          'reliability': null,
          'colorStyle': 'color: #000000',
          'registrationDate': '2019-01-10T15:20:27.000Z',
          'submissionDate': '2019-01-10T15:30:54.000Z',
          'handle': 'dushyantb'
        },
        {
          'reliability': null,
          'colorStyle': 'color: #000000',
          'registrationDate': '2019-01-10T15:35:20.000Z',
          'submissionDate': '2019-01-11T13:14:29.000Z',
          'handle': 'mess'
        },
        {
          'reliability': null,
          'colorStyle': 'color: #000000',
          'registrationDate': '2019-01-10T16:17:37.000Z',
          'submissionDate': '2019-01-10T17:56:00.000Z',
          'handle': 'lazybaer'
        },
        {
          'reliability': null,
          'colorStyle': 'color: #000000',
          'registrationDate': '2019-01-11T13:19:18.000Z',
          'submissionDate': '2019-01-11T13:21:02.000Z',
          'handle': 'FireIce'
        }
      ],
      'phases': [
        {
          'duration': 1936800000,
          'actualStartTime': '2019-01-09T02:04:15.946Z',
          'scheduledStartTime': '2019-01-09T02:04:15.946Z',
          'phaseId': 763583,
          'scheduledEndTime': '2019-01-31T12:04:00.000Z',
          'fixedStartTime': '2019-01-09T02:00:00.000Z',
          'type': 'Registration',
          'status': 'Open'
        },
        {
          'duration': 1936500000,
          'actualStartTime': '2019-01-09T02:09:24.295Z',
          'scheduledStartTime': '2019-01-09T02:09:24.295Z',
          'phaseId': 763584,
          'scheduledEndTime': '2019-01-31T12:04:00.000Z',
          'type': 'Submission',
          'status': 'Open'
        },
        {
          'duration': 172800000,
          'scheduledStartTime': '2019-01-31T12:04:00.000Z',
          'phaseId': 763585,
          'scheduledEndTime': '2019-02-02T12:04:00.000Z',
          'type': 'Review',
          'status': 'Scheduled'
        },
        {
          'duration': 86400000,
          'scheduledStartTime': '2019-02-02T12:04:00.000Z',
          'phaseId': 763586,
          'scheduledEndTime': '2019-02-03T12:04:00.000Z',
          'type': 'Appeals',
          'status': 'Scheduled'
        },
        {
          'duration': 43200000,
          'scheduledStartTime': '2019-02-03T12:04:00.000Z',
          'phaseId': 763587,
          'scheduledEndTime': '2019-02-04T00:04:00.000Z',
          'type': 'Appeals Response',
          'status': 'Scheduled'
        }
      ],
      'submissions': [
        {
          'submitter': 'dushyantb',
          'submitterId': 40157409,
          'submissions': [
            {
              'submissionId': 206431,
              'submissionStatus': 'Active',
              'submissionTime': '2019-01-10T15:30:54.000Z'
            }
          ]
        },
        {
          'submitter': 'FireIce',
          'submitterId': 15050434,
          'submissions': [
            {
              'submissionId': 206471,
              'submissionStatus': 'Active',
              'submissionTime': '2019-01-11T13:21:02.000Z'
            }
          ]
        },
        {
          'submitter': 'TonyJ',
          'submitterId': 8547899,
          'submissions': [
            {
              'submissionId': 206429,
              'submissionStatus': 'Active',
              'submissionTime': '2019-01-10T15:22:48.000Z'
            }
          ]
        },
        {
          'submitter': 'lazybaer',
          'submitterId': 23225544,
          'submissions': [
            {
              'submissionId': 206452,
              'submissionStatus': 'Active',
              'submissionTime': '2019-01-10T17:56:00.000Z'
            }
          ]
        },
        {
          'submitter': 'mess',
          'submitterId': 305384,
          'submissions': [
            {
              'submissionId': 206470,
              'submissionStatus': 'Active',
              'submissionTime': '2019-01-11T13:14:29.000Z'
            }
          ]
        }
      ],
      'checkpoints': [],
      'numberOfRegistrants': 5,
      'numberOfSubmissions': 5
    }
  }
}
const userResponse = {
  'id': '-127439e3:1685159d1d0:2c99',
  'result': {
    'success': true,
    'status': 200,
    'metadata': null,
    'content': [
      {
        'id': '23225544',
        'modifiedBy': null,
        'modifiedAt': '2019-01-15T12:50:57.000Z',
        'createdBy': null,
        'createdAt': '2011-03-28T21:03:25.000Z',
        'handle': submitterHandle,
        'email': submitterEmail,
        'firstName': 'F_NAME',
        'lastName': 'L_NAME',
        'credential': {
          'activationCode': 'MV9YSICQ5I',
          'resetToken': null,
          'hasPassword': true
        },
        'status': 'A',
        'country': null,
        'regSource': 'cloudspokes',
        'utmSource': null,
        'utmMedium': null,
        'utmCampaign': null,
        'roles': null,
        'ssoLogin': false,
        'active': true,
        'profile': null,
        'emailActive': true
      }
    ]
  },
  'version': 'v3'
}

const SRMSubmissionResponse = _.cloneDeep(submissionResponse)
_.set(SRMSubmissionResponse, 'challengeId', SRMChallengeId)
_.set(SRMSubmissionResponse, 'id', SRMSubmissionId)

const SRMChallengeResponse = _.cloneDeep(challengeResponse)
_.set(SRMChallengeResponse, 'result.content.subTrack', 'SRM')

const submitterResponse = {
  'id': '-20fea014:16849a4a697:35e5',
  'result': {
    'success': true,
    'status': 200,
    'metadata': null,
    'content': {
      'maxRating': {
        'rating': 0,
        'track': null,
        'subTrack': null
      },
      'userId': userId,
      'description': 'Ayatollah of RockNRollah\nBreakfast of Champions',
      'handle': submitterHandle,
      'handleLower': submitterHandle,
      'status': 'ACTIVE',
      'homeCountryCode': 'USA',
      'competitionCountryCode': 'USA',
      'photoURL': 'http://res.cloudinary.com/hnep56ea0/image/upload/c_fill,h_125,w_125/lazybaer.png',
      'tracks': [
        'DATA_SCIENCE',
        'DEVELOP'
      ],
      'createdAt': '43208-01-08T08:56:40.000Z',
      'createdBy': '23225544',
      'updatedAt': '50903-07-08T14:37:30.000Z',
      'updatedBy': '23225544'
    }
  },
  'version': 'v3'
}

const submissionResult = {
  'data': {
    'submitter': {
      'handle': submitterHandle,
      'email': submitterEmail,
      'rating': {'rating': 0, 'track': null, 'subTrack': null}
    },
    'submission': {
      'updatedBy': submitterHandle,
      'created': '2019-01-10T17:55:59.135Z',
      'legacySubmissionId': 206452,
      'isFileSubmission': false,
      'type': 'Contest Submission',
      'url': 'https://s3.amazonaws.com/topcoder-dev-submissions/bac822d2-725d-4973-9778-360918a09bc0.zip',
      'challengeId': challengeId,
      'createdBy': submitterHandle,
      'review': [{
        'score': 100,
        'updatedBy': 'maE2maBSv9fRVHjSlC31LFZSq6VhhZqC@clients',
        'reviewerId': '96059e8d-4761-4978-9a14-c86ae6b971c3',
        'submissionId': submissionId,
        'createdBy': 'maE2maBSv9fRVHjSlC31LFZSq6VhhZqC@clients',
        'created': '2019-01-10T17:56:04.223Z',
        'scoreCardId': 30001850,
        'typeId': '68c5a381-c8ab-48af-92a7-7a869a4ee6c3',
        'id': 'c09ab9bd-9acf-40a4-8d6f-db50e6237a4d',
        'updated': '2019-01-10T17:56:04.223Z'
      }],
      'id': submissionId,
      'submissionPhaseId': 763584,
      'updated': '2019-01-10T17:55:59.135Z',
      'fileType': 'zip',
      'memberId': userId,
      'reviewSummation': []
    },
    'challenge': {
      'challengeTitle': 'File-Upload-Test  by Sushil',
      'challengeId': challengeId,
      'submissionEndDate': '2019-01-31T12:04:00.000Z',
      'prizes': [350, 150],
      'challengeCommunity': 'develop',
      'subTrack': 'CODE',
      'technologies': ['Node.js'],
      'platforms': ['NodeJS'],
      'numberOfRegistrants': 5,
      'numberOfSubmissions': 5
    }
  },
  'recipients': [submitterEmail],
  'replyTo': ''
}

const reviewResult = {
  'data': {
    'submitter': {
      'handle': submitterHandle,
      'email': submitterEmail,
      'rating': {'rating': 0, 'track': null, 'subTrack': null}
    },
    'submission': {
      'updatedBy': submitterHandle,
      'created': '2019-01-10T17:55:59.135Z',
      'legacySubmissionId': 206452,
      'isFileSubmission': false,
      'type': 'Contest Submission',
      'url': 'https://s3.amazonaws.com/topcoder-dev-submissions/bac822d2-725d-4973-9778-360918a09bc0.zip',
      'challengeId': challengeId,
      'createdBy': submitterHandle,
      'review': [{
        'score': 100,
        'updatedBy': 'maE2maBSv9fRVHjSlC31LFZSq6VhhZqC@clients',
        'reviewerId': '96059e8d-4761-4978-9a14-c86ae6b971c3',
        'submissionId': submissionId,
        'createdBy': 'maE2maBSv9fRVHjSlC31LFZSq6VhhZqC@clients',
        'created': '2019-01-10T17:56:04.223Z',
        'scoreCardId': 30001850,
        'typeId': '68c5a381-c8ab-48af-92a7-7a869a4ee6c3',
        'id': 'c09ab9bd-9acf-40a4-8d6f-db50e6237a4d',
        'updated': '2019-01-10T17:56:04.223Z'
      }],
      'id': submissionId,
      'submissionPhaseId': 763584,
      'updated': '2019-01-10T17:55:59.135Z',
      'fileType': 'zip',
      'memberId': userId,
      'reviewSummation': []
    },
    'challenge': {
      'challengeTitle': 'File-Upload-Test  by Sushil',
      'challengeId': challengeId,
      'submissionEndDate': '2019-01-31T12:04:00.000Z',
      'prizes': [350, 150],
      'challengeCommunity': 'develop',
      'subTrack': 'CODE',
      'technologies': ['Node.js'],
      'platforms': ['NodeJS'],
      'numberOfRegistrants': 5,
      'numberOfSubmissions': 5
    },
    'reviewer': {
      'handle': submitterHandle,
      'email': submitterEmail,
      'rating': {'rating': 0, 'track': null, 'subTrack': null}
    }
  },
  'recipients': [submitterEmail],
  'replyTo': ''
}

const messageRequiredFields = ['topic', 'originator', 'timestamp', 'mime-type', 'payload.resource']
const commonStringFields = ['topic', 'originator', 'mime-type', 'payload.resource', 'payload.id']
const submissionRequiredFields = [...messageRequiredFields,
  'payload.resource', 'payload.id', 'payload.challengeId', 'payload.memberId'
]
const submissionStringFields = [...commonStringFields]
const reviewRequiredFields = [...messageRequiredFields,
  'payload.resource', 'payload.id', 'payload.submissionId', 'payload.reviewerId', 'payload.reviewerHandle'
]
const submissionIntegerFields = ['payload.challengeId', 'payload.memberId']
const reviewStringFields = [...commonStringFields, 'payload.submissionId', 'payload.reviewerHandle', 'payload.reviewerId']

const testCases = {
  'Submission Create Notification': {
    methodName: 'processSubmission',
    expectedResult: submissionResult,
    requiredFields: submissionRequiredFields,
    integerFields: submissionIntegerFields,
    stringFields: submissionStringFields,
    testMessage: createSubmissionMessage
  },
  'Submission Update Notification': {
    methodName: 'processSubmission',
    expectedResult: submissionResult,
    requiredFields: submissionRequiredFields,
    integerFields: submissionIntegerFields,
    stringFields: submissionStringFields,
    testMessage: updateSubmissionMessage
  },
  'Review Notification': {
    methodName: 'processReview',
    expectedResult: reviewResult,
    requiredFields: reviewRequiredFields,
    stringFields: reviewStringFields,
    testMessage: reviewNotificationMessage
  }
}

const invalidSubmissions = [{
  invalidSubmissionId: status404SubmissionId,
  invalidStatus: '404'
}, {
  invalidSubmissionId: status500SubmissionId,
  invalidStatus: '500'
}]

module.exports = {
  challengeId,
  submissionId,
  submitterHandle,
  submissionResponse,
  challengeResponse,
  userResponse,
  userId,
  submitterResponse,
  testCases,
  invalidSubmissions,
  status404SubmissionId,
  status500SubmissionId,
  SRMSubmissionResponse,
  SRMSubmissionId,
  SRMChallengeId,
  SRMChallengeResponse
}
