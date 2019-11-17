const { listTriggers } = require('../listTriggers')

describe('listTriggers', () => {
  describe('given a client', () => {
    it('lists the build triggers for the projectId', async () => {
      // What a strange thing to return:
      // https://bit.ly/2CQ9HL8
      const actualListBuildTriggersReponse = [
        [{ id: 'a' }],
        undefined,
        undefined,
      ]
      const mock = jest
        .fn()
        .mockImplementation(() =>
          Promise.resolve(actualListBuildTriggersReponse),
        )

      const client = {
        listBuildTriggers: mock,
      }
      const triggerList = await listTriggers(client, 'propertygraph')

      expect(mock).toHaveBeenCalledWith({ projectId: 'propertygraph' })
      expect(triggerList).toEqual([{ id: 'a' }])
    })
  })
})
