const { listTriggers } = require('../listTriggers')

describe('listTriggers', () => {
  describe('given a client', () => {
    it('lists the build triggers for the projectId', async () => {
      // What a strange thing to return:
      // https://bit.ly/2CQ9HL8
      const actualListBuildTriggersReponse = [[{ id: 'a' }], null, null]
      const mock = jest
        .fn()
        .mockImplementation(() =>
          Promise.resolve(actualListBuildTriggersReponse),
        )

      const client = {
        listBuildTriggers: mock,
      }

      const triggerList = await listTriggers({
        client,
        projectId: 'propertygraph',
        region: 'northamerica-northeast1',
      })

      expect(mock).toHaveBeenCalledWith({
        projectId: 'propertygraph',
        parent: 'projects/propertygraph/locations/northamerica-northeast1',
      })
      expect(triggerList).toEqual([{ id: 'a' }])
    })
  })
})
