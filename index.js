require('dotenv-safe').config()
const Octokit = require('@octokit/rest')
const { CloudBuildClient } = require('@google-cloud/cloudbuild')
const cb = new CloudBuildClient()
const { Server } = require('./src/Server.js')
const { listTriggers } = require('./src/listTriggers')
const { buildTriggerMap } = require('./src/buildTriggerMap')
const {
  PORT = 8080,
  GITHUB_TOKEN,
  REPO_NAME,
  REPO_OWNER,
  GCP_PROJECT,
} = process.env

const octokit = Octokit({
  auth: GITHUB_TOKEN,
})

;(async () => {
  const triggerList = await listTriggers(cb, GCP_PROJECT)
  const triggers = buildTriggerMap(triggerList)

	console.log('watching for builds from the follow triggers:', JSON.stringify(triggers, null, 2))

  const server = Server({
    log: console.log,
    triggers,
    createStatus: status =>
      octokit.repos.createStatus(
        Object.assign(
          {
            repo: REPO_NAME,
            owner: REPO_OWNER,
          },
          status,
        ),
      ),
  })
  server.listen(PORT, () => console.log(`🚀 listening on port ${PORT}`))
})()
