const request = require('supertest')
const { Server } = require('../Server')
const { encode } = require('../encoding')

describe('POST /', () => {
  describe('with a malformed Pub/Sub message', () => {
    it('returns a 400', async () => {
      const server = Server({
        log: jest.fn(),
        createStatus: jest.fn(),
      })
      const response = await request(server)
        .post('/')
        .send({
          foo: 'bar',
        })

      expect(response.status).toEqual(400)
    })

    it('logs helpful errors to STDOUT so it will be seen in Stackdriver', async () => {
      const mockStdout = jest.fn()
      const server = Server({
        log: mockStdout,
        createStatus: jest.fn(),
      })
      await request(server)
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

  describe('when recieving a second message', () => {
    it('calls createStatus once for each build trigger', async () => {
      const mock = jest.fn()
      const server = Server({
        log: jest.fn(),
        createStatus: mock,
      })

      await request(server)
        .post('/')
        .send({
          message: {
            attributes: {
              buildId: '08d2c9e9-4977-43b7-94e6-89a8825efbea',
              status: 'QUEUED',
            },
            data:
              'eyJpZCI6IjA4ZDJjOWU5LTQ5NzctNDNiNy05NGU2LTg5YTg4MjVlZmJlYSIsInByb2plY3RJZCI6InJlcG9ydC1hLWN5YmVyY3JpbWUtYWxwaGEiLCJzdGF0dXMiOiJRVUVVRUQiLCJzb3VyY2UiOnsicmVwb1NvdXJjZSI6eyJwcm9qZWN0SWQiOiJyZXBvcnQtYS1jeWJlcmNyaW1lLWFscGhhIiwicmVwb05hbWUiOiJnaXRodWJfY2RzLXNuY19yZXBvcnQtYS1jeWJlcmNyaW1lIiwiYnJhbmNoTmFtZSI6ImFkZC1idW5kbGUtYW5hbHl6ZXIifX0sInN0ZXBzIjpbeyJuYW1lIjoibm9kZToxMS1hbHBpbmUiLCJlbnYiOlsiSFVTS1lfU0tJUF9JTlNUQUxMPXRydWUiXSwiYXJncyI6WyJjaSJdLCJkaXIiOiJmcm9udGVuZCIsImlkIjoiY2kiLCJlbnRyeXBvaW50IjoibnBtIn0seyJuYW1lIjoibm9kZToxMS1hbHBpbmUiLCJhcmdzIjpbInJ1biIsImNvbXBpbGUiXSwiZGlyIjoiZnJvbnRlbmQiLCJpZCI6ImNvbXBpbGUtbGFuZ3VhZ2VzIiwiZW50cnlwb2ludCI6Im5wbSJ9LHsibmFtZSI6Im5vZGU6MTEtYWxwaW5lIiwiYXJncyI6WyJydW4iLCJjb3ZlcmFnZSJdLCJkaXIiOiJmcm9udGVuZCIsImlkIjoiY292ZXJhZ2UiLCJlbnRyeXBvaW50IjoibnBtIn0seyJuYW1lIjoibm9kZToxMS1hbHBpbmUiLCJhcmdzIjpbInJ1biIsImxpbnQiXSwiZGlyIjoiZnJvbnRlbmQiLCJpZCI6ImxpbnQiLCJlbnRyeXBvaW50IjoibnBtIn0seyJuYW1lIjoibm9kZToxMS1hbHBpbmUiLCJhcmdzIjpbInJ1biIsImNoZWNrLXRyYW5zbGF0aW9ucyJdLCJkaXIiOiJmcm9udGVuZCIsImlkIjoidHJhbnNsYXRpb25zIiwiZW50cnlwb2ludCI6Im5wbSJ9LHsibmFtZSI6Imdjci5pby9jbG91ZC1idWlsZGVycy9kb2NrZXIiLCJhcmdzIjpbImJ1aWxkIiwiLS1idWlsZC1hcmc9UkFaWkxFX0dPT0dMRV9BTkFMWVRJQ1NfSUQ9VUEtMTAyNDg0OTI2LTEzIiwiLXQiLCJnY3IuaW8vcmVwb3J0LWEtY3liZXJjcmltZS1hbHBoYS9mcm9udGVuZDphZGQtYnVuZGxlLWFuYWx5emVyLWI1MzZhZDAiLCItdCIsImdjci5pby9yZXBvcnQtYS1jeWJlcmNyaW1lLWFscGhhL2Zyb250ZW5kOmxhdGVzdCIsIi1mIiwiRG9ja2VyZmlsZSIsIi4iXSwiZGlyIjoiZnJvbnRlbmQifV0sImNyZWF0ZVRpbWUiOiIyMDE5LTA3LTExVDIyOjAyOjQ1LjMyMTc2MTU4NFoiLCJ0aW1lb3V0IjoiNjAwcyIsImltYWdlcyI6WyJnY3IuaW8vcmVwb3J0LWEtY3liZXJjcmltZS1hbHBoYS9mcm9udGVuZDphZGQtYnVuZGxlLWFuYWx5emVyLWI1MzZhZDAiLCJnY3IuaW8vcmVwb3J0LWEtY3liZXJjcmltZS1hbHBoYS9mcm9udGVuZDpsYXRlc3QiXSwiYXJ0aWZhY3RzIjp7ImltYWdlcyI6WyJnY3IuaW8vcmVwb3J0LWEtY3liZXJjcmltZS1hbHBoYS9mcm9udGVuZDphZGQtYnVuZGxlLWFuYWx5emVyLWI1MzZhZDAiLCJnY3IuaW8vcmVwb3J0LWEtY3liZXJjcmltZS1hbHBoYS9mcm9udGVuZDpsYXRlc3QiXX0sImxvZ3NCdWNrZXQiOiJnczovLzQ3OTczNzUxMzM4My5jbG91ZGJ1aWxkLWxvZ3MuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic291cmNlUHJvdmVuYW5jZSI6eyJyZXNvbHZlZFJlcG9Tb3VyY2UiOnsicHJvamVjdElkIjoicmVwb3J0LWEtY3liZXJjcmltZS1hbHBoYSIsInJlcG9OYW1lIjoiZ2l0aHViX2Nkcy1zbmNfcmVwb3J0LWEtY3liZXJjcmltZSIsImNvbW1pdFNoYSI6ImI1MzZhZDBmYTgzODE5YTFiOTA0ZDQyOWRlMzQzOWZkZjdhMWU4YjYifX0sImJ1aWxkVHJpZ2dlcklkIjoiYjBmZmYwZjEtMGI2Mi00MTUzLTg0ODgtYjBiMDVlNzlmZjAxIiwib3B0aW9ucyI6eyJzdWJzdGl0dXRpb25PcHRpb24iOiJBTExPV19MT09TRSIsImxvZ2dpbmciOiJMRUdBQ1kifSwibG9nVXJsIjoiaHR0cHM6Ly9jb25zb2xlLmNsb3VkLmdvb2dsZS5jb20vZ2NyL2J1aWxkcy8wOGQyYzllOS00OTc3LTQzYjctOTRlNi04OWE4ODI1ZWZiZWE/cHJvamVjdD00Nzk3Mzc1MTMzODMiLCJzdWJzdGl0dXRpb25zIjp7Il9SQVpaTEVfR09PR0xFX0FOQUxZVElDU19JRCI6IlVBLTEwMjQ4NDkyNi0xMyJ9LCJ0YWdzIjpbInRyaWdnZXItYjBmZmYwZjEtMGI2Mi00MTUzLTg0ODgtYjBiMDVlNzlmZjAxIl19',
            messageId: '613004193204400',
            message_id: '613004193204400',
            publishTime: '2019-07-11T22:02:46.563Z',
            publish_time: '2019-07-11T22:02:46.563Z',
          },
        })

      await request(server)
        .post('/')
        .send({
          message: {
            attributes: {
              buildId: '506123e9-0c11-4911-bfca-7e1d0999aeb7',
              status: 'WORKING',
            },
            data:
              'eyJpZCI6IjUwNjEyM2U5LTBjMTEtNDkxMS1iZmNhLTdlMWQwOTk5YWViNyIsInByb2plY3RJZCI6InJlcG9ydC1hLWN5YmVyY3JpbWUtYWxwaGEiLCJzdGF0dXMiOiJXT1JLSU5HIiwic291cmNlIjp7InJlcG9Tb3VyY2UiOnsicHJvamVjdElkIjoicmVwb3J0LWEtY3liZXJjcmltZS1hbHBoYSIsInJlcG9OYW1lIjoiZ2l0aHViX2Nkcy1zbmNfcmVwb3J0LWEtY3liZXJjcmltZSIsImJyYW5jaE5hbWUiOiJhZGQtYnVuZGxlLWFuYWx5emVyIn19LCJzdGVwcyI6W3sibmFtZSI6Im1pa2V3aWxsaWFtc29uL3VzZXN0aGlzLWNpIiwiYXJncyI6WyItYyIsIiBkb2NrZXIgcnVuIC1kIC0tbmV0d29yaz1jbG91ZGJ1aWxkIC1wPTg1Mjk6ODUyOSAtLW5hbWU9YXJhbmdvZGIgbWlrZXdpbGxpYW1zb24vYWNpIFx1MDAyNlx1MDAyNiAvd2FpdC1mb3IgYXJhbmdvZGI6ODUyOSAiXSwiaWQiOiJzdGFydF9hcmFuZ29kYiIsImVudHJ5cG9pbnQiOiIvYmluL3NoIn0seyJuYW1lIjoibm9kZToxMS1hbHBpbmUiLCJlbnYiOlsiSFVTS1lfU0tJUF9JTlNUQUxMPXRydWUiXSwiYXJncyI6WyJjaSJdLCJkaXIiOiJhcGkiLCJpZCI6ImNpIiwiZW50cnlwb2ludCI6Im5wbSJ9LHsibmFtZSI6Im5vZGU6MTEtYWxwaW5lIiwiYXJncyI6WyJydW4iLCJsaW50Il0sImRpciI6ImFwaSIsImlkIjoibGludCIsImVudHJ5cG9pbnQiOiJucG0ifSx7Im5hbWUiOiJub2RlOjExLWFscGluZSIsImVudiI6WyJEQl9OQU1FPWN5YmVyY3JpbWUiLCJEQl9VUkw9aHR0cDovL2FyYW5nb2RiOjg1MjkiLCJURVNUX0RCX1VSTD1odHRwOi8vYXJhbmdvZGI6ODUyOSIsIkRCX1VTRVI9cm9vdCIsIkRCX1BBU1NXT1JEPXRlc3QiLCJNSU5JT19BQ0NFU1NfS0VZPXRlc3QiLCJNSU5JT19TRUNSRVRfS0VZPXN0cmljdGx5dGVzdGluZyIsIk1JTklPX0JVQ0tFVF9OQU1FPXJlcG9ydHMiXSwiYXJncyI6WyJydW4iLCJjb3ZlcmFnZSJdLCJkaXIiOiJhcGkiLCJlbnRyeXBvaW50IjoibnBtIn0seyJuYW1lIjoiZ2NyLmlvL2Nsb3VkLWJ1aWxkZXJzL2RvY2tlciIsImFyZ3MiOlsiYnVpbGQiLCItdCIsImdjci5pby9yZXBvcnQtYS1jeWJlcmNyaW1lLWFscGhhL2FwaTphZGQtYnVuZGxlLWFuYWx5emVyLWI1MzZhZDAiLCItdCIsImdjci5pby9yZXBvcnQtYS1jeWJlcmNyaW1lLWFscGhhL2FwaTpsYXRlc3QiLCItZiIsIkRvY2tlcmZpbGUiLCIuIl0sImRpciI6ImFwaSJ9XSwiY3JlYXRlVGltZSI6IjIwMTktMDctMTFUMjI6MDI6NDUuMzU4Nzc4OTQ5WiIsInN0YXJ0VGltZSI6IjIwMTktMDctMTFUMjI6MDI6NDYuMjgxODc4NDY5WiIsInRpbWVvdXQiOiI2MDBzIiwiaW1hZ2VzIjpbImdjci5pby9yZXBvcnQtYS1jeWJlcmNyaW1lLWFscGhhL2FwaTphZGQtYnVuZGxlLWFuYWx5emVyLWI1MzZhZDAiLCJnY3IuaW8vcmVwb3J0LWEtY3liZXJjcmltZS1hbHBoYS9hcGk6bGF0ZXN0Il0sImFydGlmYWN0cyI6eyJpbWFnZXMiOlsiZ2NyLmlvL3JlcG9ydC1hLWN5YmVyY3JpbWUtYWxwaGEvYXBpOmFkZC1idW5kbGUtYW5hbHl6ZXItYjUzNmFkMCIsImdjci5pby9yZXBvcnQtYS1jeWJlcmNyaW1lLWFscGhhL2FwaTpsYXRlc3QiXX0sImxvZ3NCdWNrZXQiOiJnczovLzQ3OTczNzUxMzM4My5jbG91ZGJ1aWxkLWxvZ3MuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic291cmNlUHJvdmVuYW5jZSI6eyJyZXNvbHZlZFJlcG9Tb3VyY2UiOnsicHJvamVjdElkIjoicmVwb3J0LWEtY3liZXJjcmltZS1hbHBoYSIsInJlcG9OYW1lIjoiZ2l0aHViX2Nkcy1zbmNfcmVwb3J0LWEtY3liZXJjcmltZSIsImNvbW1pdFNoYSI6ImI1MzZhZDBmYTgzODE5YTFiOTA0ZDQyOWRlMzQzOWZkZjdhMWU4YjYifX0sImJ1aWxkVHJpZ2dlcklkIjoiZjUxOGEwMzktYTdjMC00NzBiLTlkZTAtNzdhODlhMmFkNjYxIiwib3B0aW9ucyI6eyJzdWJzdGl0dXRpb25PcHRpb24iOiJBTExPV19MT09TRSIsImxvZ2dpbmciOiJMRUdBQ1kifSwibG9nVXJsIjoiaHR0cHM6Ly9jb25zb2xlLmNsb3VkLmdvb2dsZS5jb20vZ2NyL2J1aWxkcy81MDYxMjNlOS0wYzExLTQ5MTEtYmZjYS03ZTFkMDk5OWFlYjc/cHJvamVjdD00Nzk3Mzc1MTMzODMiLCJzdWJzdGl0dXRpb25zIjp7Il9EQl9OQU1FIjoiY3liZXJjcmltZSIsIl9EQl9QQVNTV09SRCI6InRlc3QiLCJfREJfVVJMIjoiaHR0cDovL2FyYW5nb2RiOjg1MjkiLCJfREJfVVNFUiI6InJvb3QiLCJfTUlOSU9fQUNDRVNTX0tFWSI6InRlc3QiLCJfTUlOSU9fQlVDS0VUX05BTUUiOiJyZXBvcnRzIiwiX01JTklPX1NFQ1JFVF9LRVkiOiJzdHJpY3RseXRlc3RpbmciLCJfVEVTVF9EQl9VUkwiOiJodHRwOi8vYXJhbmdvZGI6ODUyOSJ9LCJ0YWdzIjpbInRyaWdnZXItZjUxOGEwMzktYTdjMC00NzBiLTlkZTAtNzdhODlhMmFkNjYxIl19',
            messageId: '613009364484079',
            message_id: '613009364484079',
            publishTime: '2019-07-11T22:02:52.032Z',
            publish_time: '2019-07-11T22:02:52.032Z',
          },
        })

      expect(mock.mock.calls).toEqual([
        [
          {
            context: 'CloudBuild-b0fff0f1-0b62-4153-8488-b0b05e79ff01',
            description: 'Queueing cloud build',
            sha: 'b536ad0fa83819a1b904d429de3439fdf7a1e8b6',
            state: 'pending',
            target_url:
              'https://console.cloud.google.com/gcr/builds/08d2c9e9-4977-43b7-94e6-89a8825efbea?project=479737513383',
          },
        ],
        [
          {
            context: 'CloudBuild-f518a039-a7c0-470b-9de0-77a89a2ad661',
            description: 'Running cloud build',
            sha: 'b536ad0fa83819a1b904d429de3439fdf7a1e8b6',
            state: 'pending',
            target_url:
              'https://console.cloud.google.com/gcr/builds/506123e9-0c11-4911-bfca-7e1d0999aeb7?project=479737513383',
          },
        ],
      ])
    })
  })

  describe('with a well formed Pub/Sub message', () => {
    it('acks the message with a 204 success status', async () => {
      const server = Server({
        log: jest.fn(),
        createStatus: jest.fn(),
      })
      const response = await request(server)
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

  describe('with a non-Github Pub/Sub message', () => {
    it(`doesn't send a status to github and returns 204`, async () => {
      const mockCreateStatus = jest.fn()
      const server = Server({
        log: jest.fn(),
        createStatus: mockCreateStatus,
      })
      const response = await request(server)
        .post('/')
        .send({
          message: {
            attributes: {
              buildId: '3c2c30c1-d563-496a-a97e-bf3bcc561c74',
              status: 'QUEUED',
            },
            data: encode({
              id: 'edd4db3a-e831-48d8-8fe1-23a2cc9a8bba',
              projectId: 'propertygraph',
              status: 'QUEUED',
              source: {
                storageSource: {
                  bucket: 'propertygraph_cloudbuild',
                  object:
                    'source/1558365793.99-a2fa3a137cf845f8b00c073370fd74bf.tgz',
                  generation: '1558365794711726',
                },
              },
              steps: [
                {
                  name: 'gcr.io/kaniko-project/executor:latest',
                  args: [Array],
                },
              ],
              createTime: '2019-05-20T15:23:15.054616862Z',
              timeout: '600s',
              logsBucket:
                'gs://861907550287.cloudbuild-logs.googleusercontent.com',
              sourceProvenance: {
                resolvedStorageSource: {
                  bucket: 'propertygraph_cloudbuild',
                  object:
                    'source/1558365793.99-a2fa3a137cf845f8b00c073370fd74bf.tgz',
                  generation: '1558365794711726',
                },
              },
              options: { logging: 'LEGACY' },
              logUrl:
                'https://console.cloud.google.com/gcr/builds/edd4db3a-e831-48d8-8fe1-23a2cc9a8bba?project=861907550287',
              tags: [],
            }),
            messageId: '553785523340334',
            message_id: '553785523340334',
            publishTime: '2019-05-19T21:20:15.109Z',
            publish_time: '2019-05-19T21:20:15.109Z',
          },
        })

      expect(mockCreateStatus).not.toHaveBeenCalled()
      expect(response.status).toEqual(204)
    })
  })
})
