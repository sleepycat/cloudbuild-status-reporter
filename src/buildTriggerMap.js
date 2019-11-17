const buildTriggerMap = triggers =>
  triggers.reduce((arr, tr) => {
    arr[tr.id] = tr.name
    return arr
  }, {})

module.exports.buildTriggerMap = buildTriggerMap
