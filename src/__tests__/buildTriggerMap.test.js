const { buildTriggerMap } = require('../buildTriggerMap')

describe('buildTriggerMap', () => {
  describe('given an array of triggers', () => {
    const triggers = [
      {
        ignoredFiles: ['api/**', 'platform/**', 'parse/**'],
        includedFiles: ['frontend/**'],
        tags: [],
        substitutions: {},
        id: '50799a88-171a-4544-8b4d-8d70c3ba3850',
        createTime: {
          seconds: '1573091726',
          nanos: 548895748,
        },
        triggerTemplate: {
          projectId: 'propertygraph',
          repoName: 'github_sleepycat_propertygraph',
          dir: '',
          branchName: '.*',
          revision: 'branchName',
        },
        disabled: false,
        description: 'frontend',
        github: null,
        name: 'frontend',
        filename: 'frontend/cloudbuild.yaml',
        buildTemplate: 'filename',
      },
    ]

    it('returns an object that maps a trigger id to a trigger name', async () => {
      const triggerMap = buildTriggerMap(triggers)

      expect(triggerMap).toEqual({
        '50799a88-171a-4544-8b4d-8d70c3ba3850': 'frontend',
      })
    })
  })
})
