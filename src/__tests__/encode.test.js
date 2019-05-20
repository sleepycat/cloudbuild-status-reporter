const { encode, unencode } = require('../encoding')

describe('encode', () => {
  it('converts input to a base64 encoded string', async () => {
    expect(encode({foo: "bar"})).toEqual("eyJmb28iOiJiYXIifQ==")
  })
})

describe('unencode', () => {
  it('converts base64 encoded string to a JSON object', async () => {
    expect(unencode("eyJmb28iOiJiYXIifQ==")).toEqual({foo: "bar"})
  })
})
