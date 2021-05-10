const { palindrome } = require('../utils/for_testing')

test.skip('Palindrome of gaston', () => {
  const result = palindrome('gaston')

  expect(result).toBe('notsag')
})

test.skip('Palindrome of empty string', () => {
  const result = palindrome('')

  expect(result).toBe('')
})

test.skip('Palindrome of undefined', () => {
  const result = palindrome()

  expect(result).toBeUndefined()
})
