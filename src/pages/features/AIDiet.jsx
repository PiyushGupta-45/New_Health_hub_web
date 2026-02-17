import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { generateWithHuggingFace } from '../../services/huggingFace'
import AIResultRenderer from '../../components/AIResultRenderer'

function AIDiet() {
  const [goal, setGoal] = useState('')
  const [diet, setDiet] = useState('')
  const [allergy, setAllergy] = useState('')
  const [meals, setMeals] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState('')

  const generatePlan = async () => {
    setLoading(true)
    setError('')
    setResult('')

    const selectedGoal = goal.trim() || 'Not specified'
    const selectedDiet = diet.trim() || 'Not specified'
    const selectedAllergy = allergy.trim() || 'None'
    const selectedMeals = meals.trim() || '3'

    const systemPrompt = `
You are a strict diet planning assistant.
Follow user-selected inputs exactly.
Never change, replace, or reinterpret selected values.
Do not add conflicting assumptions.
Return concise markdown only.
`.trim()

    const prompt = `
Create a ONE-DAY diet plan using these exact selected inputs:
- Goal: ${selectedGoal}
- Diet type: ${selectedDiet}
- Allergies: ${selectedAllergy}
- Meals per day: ${selectedMeals}

Rules:
1) Use these selected values exactly as written above.
2) Do not suggest foods that violate allergies.
3) Keep the plan realistic and safe for a general healthy adult.
4) Keep output short and practical.
5) If an input is "Not specified", keep recommendations generic and say "Not specified" in Inputs Echo.

Output format (follow exactly):
## Inputs Echo
- Goal: <exact value>
- Diet type: <exact value>
- Allergies: <exact value>
- Meals per day: <exact value>

## Plan
- Time - Meal name: foods + portion hint
- Time - Meal name: foods + portion hint
(repeat to match meals per day exactly)

## Notes
- 2 to 4 short safety or hydration notes.
`.trim()

    try {
      const text = await generateWithHuggingFace({
        prompt,
        systemPrompt,
        temperature: 0.1,
        maxTokens: 700
      })
      setResult(text)
    } catch (err) {
      setError(err.message || 'Failed to generate diet plan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Diet AI</h1>
      <p className="text-slate-500 mb-6">Generate a one-day personalized diet plan using AI.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <Field label="Goal" value={goal} onChange={setGoal} placeholder="Fat loss, muscle gain, maintenance" />
          <Field label="Diet Type" value={diet} onChange={setDiet} placeholder="Vegetarian, keto, high-protein" />
          <Field label="Allergies" value={allergy} onChange={setAllergy} placeholder="Nuts, dairy, gluten" />
          <Field label="Meals per day" value={meals} onChange={setMeals} placeholder="3, 4, or 5" />

          <button
            onClick={generatePlan}
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
          >
            <Sparkles size={18} />
            {loading ? 'Generating...' : 'Generate with AI'}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow p-6 min-h-[320px]">
          {error ? (
            <p className="text-red-600 text-sm">{error}</p>
          ) : result ? (
            <AIResultRenderer rawText={result} />
          ) : (
            <p className="text-slate-500 text-sm">AI result will appear here once generated.</p>
          )}
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

export default AIDiet