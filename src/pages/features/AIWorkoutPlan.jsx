import { useState } from 'react'
import { CheckCircle2, Edit3, Send, Sparkles } from 'lucide-react'
import { generateWithHuggingFace } from '../../services/huggingFace'
import { saveApprovedPlan } from '../../services/weeklyWorkoutPlan'
import AIResultRenderer from '../../components/AIResultRenderer'

function AIWorkoutPlan() {
  const [goal, setGoal] = useState('')
  const [duration, setDuration] = useState('')
  const [equipment, setEquipment] = useState('')
  const [intensity, setIntensity] = useState('')
  const [injury, setInjury] = useState('')

  const [changeRequest, setChangeRequest] = useState('')
  const [lastRefinementNote, setLastRefinementNote] = useState('')
  const [showChangeBox, setShowChangeBox] = useState(false)

  const [loading, setLoading] = useState(false)
  const [approving, setApproving] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState('')

  const generatePlan = async (refinement) => {
    setLoading(true)
    setError('')
    if (!refinement) {
      setResult('')
      setShowChangeBox(false)
    }

    const selectedGoal = goal.trim() || 'Not specified'
    const selectedDuration = duration.trim() || '30 minutes'
    const selectedEquipment = equipment.trim() || 'None'
    const selectedIntensity = intensity.trim() || 'Moderate'
    const selectedInjury = injury.trim() || 'No injury'

    const systemPrompt = `
You are a strict workout planning assistant.
Follow user-selected inputs exactly.
Never change, replace, or reinterpret selected values.
Do not add conflicting assumptions.
Return concise markdown only.
`.trim()

    const prompt = `
Create a 7-DAY WEEKLY workout plan using these exact selected inputs:
- Goal: ${selectedGoal}
- Duration: ${selectedDuration}
- Equipment: ${selectedEquipment}
- Intensity: ${selectedIntensity}
- Injury: ${selectedInjury}

Rules:
1) Use these selected values exactly as written above.
2) Do not include exercises requiring equipment not listed.
3) Respect injury: if injury is present, avoid stressing that area and add safer alternatives.
4) Keep each day session duration aligned with selected duration.
5) Keep intensity aligned with selected intensity.
6) Keep output short, safe, and practical.
7) Include one rest/recovery day.
${refinement ? `8) Also apply this user change request exactly where possible: ${refinement}` : ''}

Output format (follow exactly):
## Inputs Echo
- Goal: <exact value>
- Duration: <exact value>
- Equipment: <exact value>
- Intensity: <exact value>
- Injury: <exact value>

## Plan
- Day 1: ...
- Day 2: ...
- Day 3: ...
- Day 4: ...
- Day 5: ...
- Day 6: ...
- Day 7: ...

## Notes
- 2 to 4 short safety/progression notes.
`.trim()

    try {
      const text = await generateWithHuggingFace({
        prompt,
        systemPrompt,
        temperature: 0.1,
        maxTokens: 1000
      })
      setResult(text)
      if (refinement) setLastRefinementNote(refinement)
    } catch (err) {
      setError(err.message || 'Failed to generate weekly plan')
    } finally {
      setLoading(false)
    }
  }

  const approvePlan = async () => {
    if (!result.trim()) return

    setApproving(true)
    setError('')

    const response = await saveApprovedPlan({
      goal: goal.trim() || 'Not specified',
      duration: duration.trim() || '30 minutes',
      equipment: equipment.trim() || 'None',
      intensity: intensity.trim() || 'Moderate',
      injury: injury.trim() || 'No injury',
      notes: lastRefinementNote,
      planText: result.trim()
    })

    setApproving(false)

    if (response.success) {
      const message = response.localOnly
        ? 'Plan approved and saved locally. It will sync when backend is reachable.'
        : 'Weekly plan approved and saved. It is now visible in Track Workout.'
      alert(message)
      return
    }

    setError(response.error || 'Failed to approve plan')
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Workout AI</h1>
      <p className="text-slate-500 mb-6">Create, refine, and approve a weekly AI workout plan.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <Field label="Goal" value={goal} onChange={setGoal} placeholder="Strength, endurance, fat loss" />
          <Field label="Duration" value={duration} onChange={setDuration} placeholder="20, 30, 45 minutes" />
          <Field label="Equipment" value={equipment} onChange={setEquipment} placeholder="None, dumbbells, gym" />
          <Field label="Intensity" value={intensity} onChange={setIntensity} placeholder="Easy, moderate, hard" />
          <Field label="Injury (if any)" value={injury} onChange={setInjury} placeholder="Knee pain, lower back strain" />

          <button
            onClick={() => generatePlan()}
            disabled={loading || approving}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
          >
            <Sparkles size={18} />
            {loading ? 'Generating...' : 'Generate Weekly Plan'}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow p-6 min-h-[360px]">
          {error ? <p className="text-red-600 text-sm">{error}</p> : null}

          {!result && !error ? (
            <p className="text-slate-500 text-sm">AI plan will appear here once generated.</p>
          ) : null}

          {result ? (
            <>
              <AIResultRenderer rawText={result} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                <button
                  onClick={() => setShowChangeBox((v) => !v)}
                  disabled={loading || approving}
                  className="border border-slate-300 hover:bg-slate-50 rounded-lg py-2 font-medium flex items-center justify-center gap-2"
                >
                  <Edit3 size={16} />
                  {showChangeBox ? 'Hide Changes' : 'Change Something'}
                </button>

                <button
                  onClick={approvePlan}
                  disabled={loading || approving}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-lg py-2 font-medium flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={16} />
                  {approving ? 'Approving...' : 'Approve Plan'}
                </button>
              </div>

              {showChangeBox ? (
                <div className="mt-4 space-y-3">
                  <textarea
                    value={changeRequest}
                    onChange={(e) => setChangeRequest(e.target.value)}
                    rows={3}
                    placeholder="Example: make Day 3 low impact and reduce jumping due to knee pain"
                    className="w-full p-3 border rounded-lg focus:border-blue-500 outline-none"
                  />

                  <button
                    onClick={() => generatePlan(changeRequest.trim())}
                    disabled={loading || approving || !changeRequest.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2"
                  >
                    <Send size={16} />
                    {loading ? 'Updating Plan...' : 'Send Change Request'}
                  </button>
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block mb-1 font-medium text-slate-700">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-3 border rounded-lg focus:border-blue-500 outline-none"
      />
    </div>
  )
}

export default AIWorkoutPlan