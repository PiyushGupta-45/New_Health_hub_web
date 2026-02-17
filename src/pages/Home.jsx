import { useState, useEffect } from "react";
import axios from "axios";
import { Activity, TrendingUp, RefreshCw, Calendar, Target } from "lucide-react";
import { format } from "date-fns";

function Home({ user }) {
  const [todaySteps, setTodaySteps] = useState(0);
  const [stepGoal, setStepGoal] = useState(10000);
  const [stepsHistory, setStepsHistory] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch all dashboard data
  const fetchData = async () => {
    try {
      const [stepsRes, historyRes, workoutsRes] = await Promise.all([
        axios.get("/steps/today"),
        axios.get("/steps/history?limit=7"),
        axios.get("/workouts/logs?limit=5"),
      ]);

      if (stepsRes.data.success) {
        setTodaySteps(stepsRes.data.data.steps || 0);
        setLastSynced(stepsRes.data.data.syncedAt);
      }

      if (historyRes.data.success) {
        setStepsHistory(historyRes.data.data || []);
      }

      if (workoutsRes.data.success) {
        setWorkouts(workoutsRes.data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await fetchData();
      setLastSynced(new Date());
    } catch {
      console.error("Sync failed");
    } finally {
      setSyncing(false);
    }
  };

  const calculateCalories = (steps) => Math.round(steps * 0.04);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const progressPercentage = Math.min((todaySteps / stepGoal) * 100, 100);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-400 text-xl">
        Loading…
      </div>
    );

  return (
    <div className="pb-8">
      <div className="max-w-[1200px] mx-auto px-6">

        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-semibold">
              {getGreeting()}, {user.name?.split(" ")[0]}!
            </h1>
            <p className="text-gray-400">Track your fitness journey</p>
          </div>

          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-2 bg-[#4C5BF1] text-white px-4 py-2 rounded-lg shadow hover:bg-[#3c4be0] transition"
          >
            <RefreshCw
              size={18}
              className={syncing ? "animate-spin" : ""}
            />
            {syncing ? "Syncing..." : "Sync"}
          </button>
        </div>

        {/* Steps Card */}
        <div className="bg-white rounded-xl p-6 shadow mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-semibold">Today's Steps</h2>
              {lastSynced && (
                <p className="text-gray-400 text-sm">
                  Last synced {format(new Date(lastSynced), "MMM d • h:mm a")}
                </p>
              )}
            </div>

            <div className="w-16 h-16 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Activity size={32} color="#4C5BF1" />
            </div>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl font-extrabold text-[#4C5BF1] leading-tight">
              {todaySteps.toLocaleString()}
            </div>
            <div className="text-gray-400 text-lg">
              Goal: {stepGoal.toLocaleString()}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-gradient-to-r from-[#4C5BF1] to-[#20B2AA] transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Steps Stats */}
          <div className="flex justify-center gap-12">
            <div className="flex items-center gap-3">
              <TrendingUp size={20} />
              <div>
                <div className="text-xl font-semibold">
                  {calculateCalories(todaySteps)}
                </div>
                <div className="text-gray-400 text-sm">Calories</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Target size={20} />
              <div>
                <div className="text-xl font-semibold">
                  {Math.round(progressPercentage)}%
                </div>
                <div className="text-gray-400 text-sm">Progress</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Days Tracked */}
          <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
            <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Calendar size={26} color="#4C5BF1" />
            </div>
            <div>
              <h3 className="text-3xl font-semibold">{stepsHistory.length}</h3>
              <p className="text-gray-400">Days Tracked</p>
            </div>
          </div>

          {/* Avg Steps */}
          <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
            <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
              <Activity size={26} color="#10B981" />
            </div>
            <div>
              <h3 className="text-3xl font-semibold">
                {stepsHistory.length > 0
                  ? Math.round(
                      stepsHistory.reduce((sum, d) => sum + (d.steps || 0), 0) /
                        stepsHistory.length
                    )
                  : 0}
              </h3>
              <p className="text-gray-400">Avg Steps</p>
            </div>
          </div>

          {/* Workouts */}
          <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
            <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center">
              <TrendingUp size={26} color="#ef4444" />
            </div>
            <div>
              <h3 className="text-3xl font-semibold">{workouts.length}</h3>
              <p className="text-gray-400">Workouts</p>
            </div>
          </div>
        </div>

        {/* Recent Workouts */}
        {workouts.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Recent Workouts</h2>
            <div className="flex flex-col gap-3">
              {workouts.slice(0, 3).map((w) => (
                <div
                  key={w._id}
                  className="p-4 bg-gray-100 rounded-xl flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-lg font-semibold">{w.workoutType}</h4>
                    <p className="text-gray-400 text-sm">
                      {format(
                        new Date(w.startTime),
                        "MMM dd, yyyy • h:mm a"
                      )}
                    </p>
                  </div>

                  <div className="flex gap-6 text-[#4C5BF1] font-semibold">
                    <span>{Math.round(w.durationSeconds / 60)} min</span>
                    <span>{Math.round(w.calories)} cal</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Steps History Chart */}
        {stepsHistory.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-6">Last 7 Days</h2>

            <div className="flex justify-between items-end gap-6 px-4 h-[220px]">

              {stepsHistory.slice(0, 7).reverse().map((day, index) => {
                const maxSteps = Math.max(...stepsHistory.map(d => d.steps || 0), stepGoal)
                const height = ((day.steps || 0) / maxSteps) * 100
                const steps = day.steps || 0

                return (
                  <div key={index} className="flex flex-col items-center w-[60px] relative">

                    {/* Wrapper for number + bar */}
                    <div className="flex flex-col items-center justify-end h-[160px] w-full relative">

                      {/* Steps Number (always above bar with fixed safe distance) */}
                      <div
                        className="absolute text-sm font-semibold text-gray-700"
                        style={{
                          bottom: `calc(${height}% + 12px)` // 12px safe gap from bar top
                        }}
                      >
                        {steps.toLocaleString()}
                      </div>

                      {/* The bar */}
                      <div
                        className="w-[30px] rounded-t-md bg-gradient-to-b from-[#4C5BF1] to-[#20B2AA]"
                        style={{ height: `${height}%`, minHeight: "6px" }}
                      ></div>
                    </div>

                    {/* Day Name */}
                    <div className="mt-2 text-gray-400 text-sm">
                      {format(new Date(day.date), "EEE")}
                    </div>

                  </div>
                )
              })}

            </div>
          </div>

        )}
      </div>
    </div>
  );
}

export default Home;
