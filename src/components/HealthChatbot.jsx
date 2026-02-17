import { useEffect, useRef, useState } from 'react'
import { MessageCircle, Send, X } from 'lucide-react'
import { askHealthChatbot, getChatbotGreeting } from '../services/healthChatbot'

function HealthChatbot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState(() => [
    {
      id: 1,
      text: getChatbotGreeting(),
      isUser: false
    }
  ])

  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, open, loading])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMessage = { id: Date.now(), text, isUser: true }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    const response = await askHealthChatbot(text)
    setMessages((prev) => [...prev, { id: Date.now() + 1, text: response, isUser: false }])
    setLoading(false)
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open ? (
        <div className="w-[360px] max-w-[calc(100vw-24px)] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-3 flex items-center justify-between">
            <p className="font-semibold">Health Assistant</p>
            <button onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div ref={scrollRef} className="h-[360px] overflow-y-auto bg-slate-50 p-3 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] whitespace-pre-wrap text-sm px-3 py-2 rounded-2xl ${
                    msg.isUser ? 'bg-blue-600 text-white rounded-br-md' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-md'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading ? <p className="text-xs text-slate-500">Thinking...</p> : null}
          </div>

          <div className="p-3 border-t border-slate-200 bg-white flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') send()
              }}
              placeholder="Ask about health, fitness, sleep..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
            <button onClick={send} disabled={loading} className="bg-blue-600 text-white px-3 rounded-lg disabled:opacity-60">
              <Send size={16} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-xl flex items-center justify-center"
        >
          <MessageCircle size={24} />
        </button>
      )}
    </div>
  )
}

export default HealthChatbot