const toState = status => {
  if (!status) throw new Error('No status passed')
  let state
  let message
  switch (status) {
    case 'QUEUED':
      state = 'pending'
      message = 'Queueing cloud build'
      break
    case 'WORKING':
      state = 'pending'
      message = 'Running cloud build'
      break
    case 'SUCCESS':
      state = 'success'
      message = 'Passed'
      break
    case 'INTERNAL_ERROR':
      state = 'error'
      message = 'Failed!'
      break
    case 'TIMEOUT':
      state = 'error'
      message = 'Timeout'
      break
    case 'FAILURE':
      state = 'error'
      message = 'Failed!'
      break
    case 'CANCELLED':
      state = 'error'
      message = 'Cancelled'
      break
  }
  return {
    state,
    message,
  }
}
module.exports.toState = toState
