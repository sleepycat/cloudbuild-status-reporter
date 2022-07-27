require('dotenv-safe').config()
const { Octokit } = require('@octokit/rest')
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
  GCP_TRIGGER_REGION,
} = process.env

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
})

;(async () => {
  const triggerList = await listTriggers({
    client: cb,
    projectId: GCP_PROJECT,
    region: GCP_TRIGGER_REGION,
  })
  const triggers = buildTriggerMap(triggerList)

  console.log(
    'watching for builds from the follow triggers:',
    JSON.stringify(triggers),
  )

  const server = Server({
    log: console.log,
    triggers,
    createStatus: (status) =>
      octokit.repos.createCommitStatus(
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
