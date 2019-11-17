require('dotenv-safe').config()
const Octokit = require('@octokit/rest')
const { Server } = require('./src/Server.js')
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

const server = Server({
  log: console.log,
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
