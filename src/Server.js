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

    const pubsubMessage = req.body.message
    const data = unencode(pubsubMessage.data)

    if (!data.sourceProvenance) {
      // Anything coming from Github will have a resolvedRepoSource. Someone is
      // using clouldbuild directly, so ack with a 200, 201, 202, 204, or 102
      // so it doesn't get resent, but do nothing.
      console.log(
        'Received data with no sourceProvenance: ',
        JSON.stringify(data),
      )
      res.status(204).send(`No Content`)
      return
    }

    if (!data.sourceProvenance.resolvedRepoSource) {
      // Anything coming from Github will have a resolvedRepoSource. Someone is
      // using clouldbuild directly, so ack with a 200, 201, 202, 204, or 102
      // so it doesn't get resent, but do nothing.
      console.log(
        'Received data with no resolvedRepoSource: ',
        JSON.stringify(data),
      )
      res.status(204).send(`No Content`)
      return
    }

    log('the whole event:', JSON.stringify(req.body.message))

    const { message, state } = toState(pubsubMessage.attributes.status)

    builds = Object.assign(
      {},
      {
        [data.id]: {
          state,
          target_url: data.logUrl,
          description: message,
          sha: data.sourceProvenance.resolvedRepoSource.commitSha,
          context: `CloudBuild-${data.buildTriggerId}`,
        },
      },
    )

    for (let buildId of Object.keys(builds)) {
      // TODO: this is optimistic. What if this goes wrong?
      log('creating status: ', builds[buildId])
      createStatus(builds[buildId])
    }

    res.status(204).send('No Content')
  })

  return app
}
module.exports.Server = Server
