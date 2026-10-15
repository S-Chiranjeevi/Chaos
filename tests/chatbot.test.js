import test from 'node:test'
import assert from 'node:assert/strict'
import { createChatReply } from '../src/services/chatbotService.js'

test('chatbot returns required disclaimer with routine guidance', () => {
  const reply = createChatReply('How can I track my cycle?')
  assert.equal(reply.kind, 'guidance')
  assert.match(reply.message, /This is information, not a diagnosis\./)
})

test('chatbot provides visit preparation guidance without diagnosis', () => {
  const reply = createChatReply('What should I ask at my appointment?')
  assert.match(reply.message, /You could ask:/)
  assert.doesNotMatch(reply.message, /you have/i)
  assert.equal(reply.warnings.length, 0)
})

test('chatbot returns an urgent reply before routine guidance', () => {
  const reply = createChatReply('I am soaking a pad every hour')
  assert.equal(reply.kind, 'urgent')
  assert.equal(reply.warnings[0].id, 'heavy_bleeding')
  assert.equal(reply.suggestions.length, 0)
})

test('chatbot detects urgent pregnancy concerns without a backend', () => {
  const reply = createChatReply('I might be pregnant and have bleeding')
  assert.equal(reply.kind, 'urgent')
  assert.ok(reply.warnings.some((warning) => warning.id === 'pregnancy_concern'))
})
