const request = require('supertest')
const uuid = require('uuid/v4')
const { Server } = require('../Server')
const { encode } = require('../encoding')

describe('POST /', () => {
  describe('with a malformed Pub/Sub message', () => {
    it('returns a 400', async () => {
      const response = await request(Server({ log: jest.fn() }))
        .post('/')
        .send({
          foo: 'bar',
        })

      expect(response.status).toEqual(400)
    })

    it('logs helpful errors to STDOUT so it will be seen in Stackdriver', async () => {
      mockStdout = jest.fn()
      const response = await request(Server({ log: mockStdout }))
        .post('/')
        .send({
          foo: 'bar',
        })

      expect(mockStdout).toHaveBeenCalledWith(
        'Malformed Pub/Sub message received:',
        '[{"keyword":"required","dataPath":"","schemaPath":"#/required","params":{"missingProperty":"message"},"message":"should have required property \'message\'"}]',
      )
    })
  })

  describe('with a well formed Pub/Sub message', () => {
    it('acks the message with a 204 success status', async () => {
      const response = await request(Server({ log: jest.fn() }))
        .post('/')
        .send({
          message: {
            attributes: {
              buildId: '3c2c30c1-d563-496a-a97e-bf3bcc561c74',
              status: 'QUEUED',
            },
            data: encode({
              id: '3c2c30c1-d563-496a-a97e-bf3bcc561c74',
              projectId: 'propertygraph',
              status: 'QUEUED',
              source: {
                repoSource: {
                  projectId: 'propertygraph',
                  repoName: 'github_sleepycat_propertygraph',
                  branchName: 'add-api-readme',
                },
              },
              steps: [
                {
                  name: 'node:12-alpine',
                  args: ['ci'],
                  dir: 'api',
                  id: 'ci',
                  entrypoint: 'npm',
                },
                {
                  name: 'node:12-alpine',
                  args: ['test'],
                  dir: 'api',
                  entrypoint: 'npm',
                },
                {
                  name: 'gcr.io/kaniko-project/executor:debug',
                  args: [
                    '--destination=gcr.io/propertygraph/api:add-api-readme-40ba0f6',
                    '--destination=gcr.io/propertygraph/api:latest',
                    '--dockerfile=./Dockerfile',
                    '--reproducible',
                    '--cache=true',
                    '--cache-ttl=6h',
                  ],
                  dir: 'api',
                },
              ],
              createTime: '2019-05-19T21:20:14.349162144Z',
              timeout: '600s',
              logsBucket:
                'gs://861907550287.cloudbuild-logs.googleusercontent.com',
              sourceProvenance: {
                resolvedRepoSource: {
                  projectId: 'propertygraph',
                  repoName: 'github_sleepycat_propertygraph',
                  commitSha: '40ba0f6069571f2a42cea78dd180b5fef2e1bf9f',
                },
              },
              buildTriggerId: '53aa33ab-3358-4a9a-843b-6f168bc5d60b',
              options: { substitutionOption: 'ALLOW_LOOSE', logging: 'LEGACY' },
              logUrl:
                'https://console.cloud.google.com/gcr/builds/3c2c30c1-d563-496a-a97e-bf3bcc561c74?project=12342363456',
              tags: [
                'event-51b8c4c6-b8d9-4cd9-a4e7-15c038655599',
                'trigger-53aa33ab-3358-4a9a-843b-6f168bc5d60b',
              ],
            }),
            messageId: '553785523340334',
            message_id: '553785523340334',
            publishTime: '2019-05-19T21:20:15.109Z',
            publish_time: '2019-05-19T21:20:15.109Z',
          },
        })

      expect(response.status).toEqual(204)
    })
  })
})
