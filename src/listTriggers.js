async function listTriggers(client, projectId) {
  const [result] = await client.listBuildTriggers({
    projectId,
  })
  return result
}

module.exports.listTriggers = listTriggers
