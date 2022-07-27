async function listTriggers({ client, projectId, region }) {
  const [result] = await client.listBuildTriggers({
    projectId,
    parent: `projects/${projectId}/locations/${region}`,
  })
  return result
}

module.exports.listTriggers = listTriggers
