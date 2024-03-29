const express = require('express')
const bodyParser = require('body-parser')
const { messageSchema } = require('./messageSchema')
const { toState } = require('./toState')
const { unencode } = require('./encoding')
const Ajv = require('ajv')

const Server = ({ triggers, log, createStatus }) => {
  const app = express()

  let builds = {}

  app.use(bodyParser.json())

  app.post('/', (req, res) => {
    const ajv = new Ajv()
    const valid = ajv.validate(messageSchema, req.body)

    if (!valid) {
      log({
        error: 'Malformed Pub/Sub message received',
        validation: ajv.errors,
        requestBody: req.body,
      })
      // ack 20X to prevent retries
      res.status(204).send('No Content')
      return
    }

    const pubsubMessage = req.body.message
    const data = unencode(pubsubMessage.data)

    if (!data.sourceProvenance) {
      // Anything coming from Github will have a resolvedRepoSource. Someone is
      // using clouldbuild directly, so ack with a 200, 201, 202, 204, or 102
      // so it doesn't get resent, but do nothing.
      log('Received data with no sourceProvenance: ', JSON.stringify(data))
      res.status(204).send(`No Content`)
      return
    }

    if (!data.sourceProvenance.resolvedRepoSource) {
      // Anything coming from Github will have a resolvedRepoSource. Someone is
      // using clouldbuild directly, so ack with a 200, 201, 202, 204, or 102
      // so it doesn't get resent, but do nothing.
      log('Received data with no resolvedRepoSource: ', JSON.stringify(data))
      res.status(204).send(`No Content`)
      return
    }

    const { message, state } = toState(pubsubMessage.attributes.status)

    builds = Object.assign(
      {},
      {
        [data.id]: {
          state,
          target_url: data.logUrl,
          description: message,
          sha: data.sourceProvenance.resolvedRepoSource.commitSha,
          context: `CloudBuild: ${triggers[data.buildTriggerId]}`,
        },
      },
    )

    for (const buildId of Object.keys(builds)) {
      // TODO: this is optimistic. What if this goes wrong?
      log('creating status: ', JSON.stringify(builds[buildId]))
      createStatus(builds[buildId])
    }
    // ack
    res.status(204).send('No Content')
  })

  return app
}
module.exports.Server = Server
