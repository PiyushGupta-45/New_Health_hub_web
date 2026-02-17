import { generateWithHuggingFace } from './huggingFace'

const history = []

export function getChatbotGreeting() {
  return `Hi! I am your Health Assistant.\n\nI can help with:\n- Nutrition and calories\n- Protein and macros\n- Diet and meal planning\n- Exercise and fitness\n- Sleep and recovery\n- Posture and wellness\n\nWhat would you like to know?`
}

export function clearChatbotHistory() {
  history.length = 0
}

export async function askHealthChatbot(question) {
  const context = history.length ? `\nRecent chat:\n${history.join('\n')}` : ''

  const prompt = `
You are a helpful health and wellness assistant.
Provide accurate and practical information about nutrition, fitness, posture, sleep, and recovery.
Use concise bullet points where useful.
If asked about diagnosis, medicine, or serious symptoms, advise consulting a qualified healthcare professional.
${context}

User question: ${question}
`.trim()

  try {
    const answer = await generateWithHuggingFace({ prompt, temperature: 0.2, maxTokens: 700 })
    history.push(`User: ${question}`)
    history.push(`Assistant: ${answer}`)
    if (history.length > 12) {
      history.splice(0, history.length - 12)
    }
    return answer
  } catch (error) {
    const message = String(error?.message || '').toLowerCase()
    if (message.includes('401') || message.includes('unauthorized')) return 'API key error. Check VITE_HF_API_KEY.'
    if (message.includes('503') || message.includes('loading')) return 'The model is warming up. Retry in a few seconds.'
    if (message.includes('network') || message.includes('connection') || message.includes('timeout')) return 'Connection error. Check internet and retry.'
    return 'Unable to generate a response right now. Please try again.'
  }
}
