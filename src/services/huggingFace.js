import axios from 'axios'

export async function generateWithHuggingFace({
  prompt,
  systemPrompt = '',
  temperature = 0.2,
  maxTokens = 700
}) {
  const res = await axios.post('/ai/generate', {
    prompt,
    systemPrompt,
    temperature,
    maxTokens
  })

  if (!res.data?.success) {
    throw new Error(res.data?.message || 'AI request failed')
  }

  const text = res.data?.data?.text
  if (!text || !String(text).trim()) {
    throw new Error('No response text returned from AI service')
  }

  return String(text).trim()
}