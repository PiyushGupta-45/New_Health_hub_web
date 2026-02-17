import axios from 'axios'

const LATEST_PLAN_KEY = 'latest_weekly_workout_plan_local'
const PENDING_PLAN_KEY = 'pending_weekly_workout_plan_local'

const parseStoredPlan = (raw) => {
  if (!raw) return null
  try {
    const data = JSON.parse(raw)
    return {
      id: String(data._id || ''),
      goal: String(data.goal || 'Not specified'),
      duration: String(data.duration || '30 minutes'),
      equipment: String(data.equipment || 'None'),
      intensity: String(data.intensity || 'Moderate'),
      injury: String(data.injury || 'No injury'),
      notes: String(data.notes || ''),
      planText: String(data.planText || ''),
      approvedAt: data.approvedAt || null,
      createdAt: data.createdAt || null
    }
  } catch {
    return null
  }
}

const toStorageShape = (plan) => ({
  _id: plan.id,
  goal: plan.goal,
  duration: plan.duration,
  equipment: plan.equipment,
  intensity: plan.intensity,
  injury: plan.injury,
  notes: plan.notes,
  planText: plan.planText,
  approvedAt: plan.approvedAt,
  createdAt: plan.createdAt
})

const toPlan = (data) => ({
  id: String(data?._id || data?.id || ''),
  goal: String(data?.goal || 'Not specified'),
  duration: String(data?.duration || '30 minutes'),
  equipment: String(data?.equipment || 'None'),
  intensity: String(data?.intensity || 'Moderate'),
  injury: String(data?.injury || 'No injury'),
  notes: String(data?.notes || ''),
  planText: String(data?.planText || ''),
  approvedAt: data?.approvedAt || null,
  createdAt: data?.createdAt || null
})

const saveLocalPlan = (plan) => {
  localStorage.setItem(LATEST_PLAN_KEY, JSON.stringify(toStorageShape(plan)))
}

const savePendingPlan = (plan) => {
  localStorage.setItem(PENDING_PLAN_KEY, JSON.stringify(toStorageShape(plan)))
}

const clearPendingPlan = () => {
  localStorage.removeItem(PENDING_PLAN_KEY)
}

const loadLocalPlan = () => parseStoredPlan(localStorage.getItem(LATEST_PLAN_KEY))
const loadPendingPlan = () => parseStoredPlan(localStorage.getItem(PENDING_PLAN_KEY))

const createFallbackPlan = (payload) => ({
  id: `local_${Date.now()}`,
  goal: payload.goal,
  duration: payload.duration,
  equipment: payload.equipment,
  intensity: payload.intensity,
  injury: payload.injury,
  notes: payload.notes,
  planText: payload.planText,
  approvedAt: new Date().toISOString(),
  createdAt: new Date().toISOString()
})

const trySyncPendingPlan = async () => {
  const pending = loadPendingPlan()
  if (!pending) return

  try {
    await axios.post('/workout-plans', {
      goal: pending.goal,
      duration: pending.duration,
      equipment: pending.equipment,
      intensity: pending.intensity,
      injury: pending.injury,
      notes: pending.notes,
      planText: pending.planText
    })
    clearPendingPlan()
  } catch {
    // Keep pending plan for retry.
  }
}

export async function saveApprovedPlan(payload) {
  try {
    const res = await axios.post('/workout-plans', payload)
    if (res.data?.success) {
      const plan = toPlan(res.data.data)
      saveLocalPlan(plan)
      clearPendingPlan()
      return { success: true, data: plan, localOnly: false }
    }
    throw new Error(res.data?.message || 'Failed to save workout plan')
  } catch (error) {
    const plan = createFallbackPlan(payload)
    saveLocalPlan(plan)
    savePendingPlan(plan)
    return {
      success: true,
      data: plan,
      localOnly: true,
      warning: error?.response?.data?.message || error.message || 'Failed to save workout plan'
    }
  }
}

export async function getLatestApprovedPlan() {
  try {
    await trySyncPendingPlan()
    const res = await axios.get('/workout-plans/latest')
    if (res.data?.success) {
      const raw = res.data.data
      if (!raw) return { success: true, data: null, localOnly: false }
      const plan = toPlan(raw)
      saveLocalPlan(plan)
      return { success: true, data: plan, localOnly: false }
    }

    const local = loadLocalPlan()
    if (local) return { success: true, data: local, localOnly: true }
    return { success: false, error: res.data?.message || 'Failed to fetch latest workout plan' }
  } catch (error) {
    const local = loadLocalPlan()
    if (local) return { success: true, data: local, localOnly: true }
    return { success: false, error: error?.response?.data?.message || error.message || 'Failed to fetch latest workout plan' }
  }
}