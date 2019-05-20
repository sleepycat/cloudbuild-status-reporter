const express = require('express')
const bodyParser = require('body-parser')
const { messageSchema } = require('./messageSchema')
const { toState } = require('./toState')
const Ajv = require('ajv')

const unencode = data => JSON.parse(Buffer.from(data, 'base64').toString())

const Server = ({ log }) => {
  const app = express()

  let builds = {}

  app.use(bodyParser.json())

  app.post('/', (req, res) => {
    const ajv = new Ajv()
    const valid = ajv.validate(messageSchema, req.body)

    if (!valid) {
      log('Malformed Pub/Sub message received:', JSON.stringify(ajv.errors))
      res.status(400).send(`Bad Request`)
      return
    }

    log('the whole event:', JSON.stringify(req.body.message))
    const pubsubMessage = req.body.message
    const data = unencode(pubsubMessage.data)
    const { message, state } = toState(pubsubMessage.attributes.status)
    builds = Object.assign(
      {},
      {
        [data.id]: {
          state,
          target_url: data.logUrl,
          description: message,
          owner: 'sleepycat',
          repo: data.source.repoSource.repoName.replace('sleepycat_', ''),
          sha: data.sourceProvenance.resolvedRepoSource.commitSha,
          context: 'CloudBuild',
        },
      },
    )

    for (let buildId of Object.keys(builds)) {
			// TODO: create a Github status for each build
      log(buildId)
    }

    res.status(204).send()
  })

  return app
}
module.exports.Server = Server
