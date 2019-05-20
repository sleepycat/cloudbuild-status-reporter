const express = require('express')
const bodyParser = require('body-parser')
const { messageSchema } = require('./messageSchema')
const { toState } = require('./toState')
const { unencode } = require('./encoding')
const Ajv = require('ajv')

const Server = ({ log, createStatus }) => {
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
		// TODO: What if the repo name has an underscore?
    const [_org, _user, repo] = data.source.repoSource.repoName.split('_')
    builds = Object.assign(
      {},
      {
        [data.id]: {
          state,
          target_url: data.logUrl,
          description: message,
          owner: 'sleepycat',
          repo,
          sha: data.sourceProvenance.resolvedRepoSource.commitSha,
          context: 'CloudBuild',
        },
      },
    )

    for (let buildId of Object.keys(builds)) {
      // TODO: this is optimistic. What if this goes wrong?
      log('creating status: ', builds[buildId])
      createStatus(builds[buildId])
    }

    res.status(204).send()
  })

  return app
}
module.exports.Server = Server
