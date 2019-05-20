module.exports.messageSchema = {
  definitions: {},
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'http://example.com/root.json',
  type: 'object',
  title: 'The Root Schema',
  required: ['message'],
  properties: {
    message: {
      $id: '#/properties/message',
      type: 'object',
      title: 'The Message Schema',
      required: [
        'attributes',
        'data',
        'messageId',
        'message_id',
        'publishTime',
        'publish_time',
      ],
      properties: {
        attributes: {
          $id: '#/properties/message/properties/attributes',
          type: 'object',
          title: 'The Attributes Schema',
          required: ['buildId', 'status'],
          properties: {
            buildId: {
              $id:
                '#/properties/message/properties/attributes/properties/buildId',
              type: 'string',
              title: 'The Buildid Schema',
              default: '',
              examples: ['3c2c30c1-d563-496a-a97e-bf3bcc561c74'],
              pattern: '^(.*)$',
            },
            status: {
              $id:
                '#/properties/message/properties/attributes/properties/status',
              type: 'string',
              title: 'The Status Schema',
              default: '',
              examples: ['QUEUED'],
              pattern: '^(.*)$',
            },
          },
        },
        data: {
          $id: '#/properties/message/properties/data',
          type: 'string',
          title: 'The Data Schema',
          default: '',
          examples: [
            'eyJpZCI6IjNjMmMzMGMxLWQ1NjMtNDk2YS1hOTdlLWJmM2JjYzU2MWM3NCIsInByb2plY3RJZCI6InByb3BlcnR5Z3JhcGgiLCJzdGF0dXMiOiJRVUVVRUQiLCJzb3VyY2UiOnsicmVwb1NvdXJjZSI6eyJwcm9qZWN0SWQiOiJwcm9wZXJ0eWdyYXBoIiwicmVwb05hbWUiOiJnaXRodWJfc2xlZXB5Y2F0X3Byb3BlcnR5Z3JhcGgiLCJicmFuY2hOYW1lIjoiYWRkLWFwaS1yZWFkbWUifX0sInN0ZXBzIjpbeyJuYW1lIjoibm9kZToxMi1hbHBpbmUiLCJhcmdzIjpbImNpIl0sImRpciI6ImFwaSIsImlkIjoiY2kiLCJlbnRyeXBvaW50IjoibnBtIn0seyJuYW1lIjoibm9kZToxMi1hbHBpbmUiLCJhcmdzIjpbInRlc3QiXSwiZGlyIjoiYXBpIiwiZW50cnlwb2ludCI6Im5wbSJ9LHsibmFtZSI6Imdjci5pby9rYW5pa28tcHJvamVjdC9leGVjdXRvcjpkZWJ1ZyIsImFyZ3MiOlsiLS1kZXN0aW5hdGlvbj1nY3IuaW8vcHJvcGVydHlncmFwaC9hcGk6YWRkLWFwaS1yZWFkbWUtNDBiYTBmNiIsIi0tZGVzdGluYXRpb249Z2NyLmlvL3Byb3BlcnR5Z3JhcGgvYXBpOmxhdGVzdCIsIi0tZG9ja2VyZmlsZT0uL0RvY2tlcmZpbGUiLCItLXJlcHJvZHVjaWJsZSIsIi0tY2FjaGU9dHJ1ZSIsIi0tY2FjaGUtdHRsPTZoIl0sImRpciI6ImFwaSJ9XSwiY3JlYXRlVGltZSI6IjIwMTktMDUtMTlUMjE6MjA6MTQuMzQ5MTYyMTQ0WiIsInRpbWVvdXQiOiI2MDBzIiwibG9nc0J1Y2tldCI6ImdzOi8vODYxOTA3NTUwMjg3LmNsb3VkYnVpbGQtbG9ncy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzb3VyY2VQcm92ZW5hbmNlIjp7InJlc29sdmVkUmVwb1NvdXJjZSI6eyJwcm9qZWN0SWQiOiJwcm9wZXJ0eWdyYXBoIiwicmVwb05hbWUiOiJnaXRodWJfc2xlZXB5Y2F0X3Byb3BlcnR5Z3JhcGgiLCJjb21taXRTaGEiOiI0MGJhMGY2MDY5NTcxZjJhNDJjZWE3OGRkMTgwYjVmZWYyZTFiZjlmIn19LCJidWlsZFRyaWdnZXJJZCI6IjUzYWEzM2FiLTMzNTgtNGE5YS04NDNiLTZmMTY4YmM1ZDYwYiIsIm9wdGlvbnMiOnsic3Vic3RpdHV0aW9uT3B0aW9uIjoiQUxMT1dfTE9PU0UiLCJsb2dnaW5nIjoiTEVHQUNZIn0sImxvZ1VybCI6Imh0dHBzOi8vY29uc29sZS5jbG91ZC5nb29nbGUuY29tL2djci9idWlsZHMvM2MyYzMwYzEtZDU2My00OTZhLWE5N2UtYmYzYmNjNTYxYzc0P3Byb2plY3Q9ODYxOTA3NTUwMjg3IiwidGFncyI6WyJldmVudC01MWI4YzRjNi1iOGQ5LTRjZDktYTRlNy0xNWMwMzg2NTU1OTkiLCJ0cmlnZ2VyLTUzYWEzM2FiLTMzNTgtNGE5YS04NDNiLTZmMTY4YmM1ZDYwYiJdfQ==',
          ],
          pattern: '^(.*)$',
        },
        messageId: {
          $id: '#/properties/message/properties/messageId',
          type: 'string',
          title: 'The Messageid Schema',
          default: '',
          examples: ['553785523340334'],
          pattern: '^(.*)$',
        },
        message_id: {
          $id: '#/properties/message/properties/message_id',
          type: 'string',
          title: 'The Message_id Schema',
          default: '',
          examples: ['553785523340334'],
          pattern: '^(.*)$',
        },
        publishTime: {
          $id: '#/properties/message/properties/publishTime',
          type: 'string',
          title: 'The Publishtime Schema',
          default: '',
          examples: ['2019-05-19T21:20:15.109Z'],
          pattern: '^(.*)$',
        },
        publish_time: {
          $id: '#/properties/message/properties/publish_time',
          type: 'string',
          title: 'The Publish_time Schema',
          default: '',
          examples: ['2019-05-19T21:20:15.109Z'],
          pattern: '^(.*)$',
        },
      },
    },
  },
}
