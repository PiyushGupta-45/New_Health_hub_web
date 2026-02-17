function AIResultRenderer({ rawText }) {
  const lines = rawText.split('\n')

  return (
    <div className="space-y-2 text-sm leading-6 text-slate-700">
      {lines.map((line, index) => {
        const trimmed = line.trim()

        if (!trimmed) {
          return <div key={index} className="h-2" />
        }

        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={index} className="text-base font-bold text-slate-900 mt-3">
              {trimmed.replace(/^##\s+/, '')}
            </h3>
          )
        }

        if (trimmed.startsWith('- ')) {
          return (
            <p key={index} className="pl-4 relative">
              <span className="absolute left-0 top-0 text-indigo-600">•</span>
              {trimmed.slice(2)}
            </p>
          )
        }

        return (
          <p key={index} className="text-slate-700">
            {trimmed}
          </p>
        )
      })}
    </div>
  )
}

export default AIResultRenderer