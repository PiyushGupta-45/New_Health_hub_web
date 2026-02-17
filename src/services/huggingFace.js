export async function generateWithHuggingFace({ prompt, systemPrompt = '', temperature = 0.2, maxTokens = 700 }) {
  const apiKey = (import.meta.env.VITE_HF_API_KEY || '').trim()
  if (!apiKey) {
    throw new Error('VITE_HF_API_KEY missing in .env')
  }

  const model = (import.meta.env.VITE_HF_MODEL || '').trim() || 'Qwen/Qwen2.5-7B-Instruct'
  const baseUrl = ((import.meta.env.VITE_HF_BASE_URL || '').trim() || 'https://router.huggingface.co/v1').replace(/\/$/, '')

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      messages: [
        ...(systemPrompt.trim() ? [{ role: 'system', content: systemPrompt.trim() }] : []),
        { role: 'user', content: prompt }
      ],
      temperature,
      max_tokens: maxTokens
    })
  })

  let data = null
  try {
    data = await response.json()
  } catch {
    // keep null for non-json responses
  }

  if (!response.ok) {
    const errorText = data?.error?.message || data?.error || data?.message || `Request failed (${response.status})`
    throw new Error(String(errorText))
  }

  const text = data?.choices?.[0]?.message?.content?.trim()
  if (!text) {
    throw new Error('No response text returned from Hugging Face')
  }

  return text
}