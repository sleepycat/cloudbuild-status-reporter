const { toState } = require('../toState')
describe('toState', () => {
  describe('given a Cloudbuild CANCELLED state', () => {
    it('returns Github error status', async () => {
      expect(toState('CANCELLED')).toEqual({
        message: 'Cancelled',
        state: 'error',
      })
    })
  })

  describe('given a Cloudbuild FAILURE state', () => {
    it('returns Github error status', async () => {
      expect(toState('FAILURE')).toEqual({
        message: 'Failed!',
        state: 'error',
      })
    })
  })

  describe('given a Cloudbuild TIMEOUT state', () => {
    it('returns Github error status', async () => {
      expect(toState('TIMEOUT')).toEqual({
        message: 'Timeout',
        state: 'error',
      })
    })
  })

  describe('given a Cloudbuild INTERNAL_ERROR state', () => {
    it('returns Github error status', async () => {
      expect(toState('INTERNAL_ERROR')).toEqual({
        message: 'Failed!',
        state: 'error',
      })
    })
  })

  describe('given a Cloudbuild SUCCESS state', () => {
    it('returns Github success status', async () => {
      expect(toState('SUCCESS')).toEqual({
        message: 'Passed',
        state: 'success',
      })
    })
  })

  describe('given a Cloudbuild WORKING state', () => {
    it('returns Github pending status', async () => {
      expect(toState('WORKING')).toEqual({
        message: 'Running cloud build',
        state: 'pending',
      })
    })
  })

  describe('given a Cloudbuild QUEUED state', () => {
    it('returns Github pending status', async () => {
      expect(toState('QUEUED')).toEqual({
        message: 'Queueing cloud build',
        state: 'pending',
      })
    })
  })
})
