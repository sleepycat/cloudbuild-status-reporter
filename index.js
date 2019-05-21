require('dotenv-safe').config()
const Octokit = require('@octokit/rest')
const { Server } = require('./src/Server.js')
const PORT = process.env.PORT || 8080

const octokit = Octokit({
  auth: process.env.GITHUB_TOKEN,
})

const server = Server({
  log: console.log,
  createStatus: status =>
    octokit.repos.createStatus(
      Object.assign(
        {
          repo: process.env.REPO_NAME,
          owner: process.env.REPO_OWNER,
        },
        data,
      ),
    ),
})
server.listen(PORT, () => console.log(`🚀 listening on port ${PORT}`))
