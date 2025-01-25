import { useState, useEffect } from "react";
import ChartQueryForm from "./ChartQueryForm";
import ChartDisplay from "./ChartDisplay";
import axios from "axios";

const Stats = ({ userId }) => {
  const [chartType, setChartType] = useState("exercises");
  const [timePeriod, setTimePeriod] = useState("week");
  const [selectedExercise, setSelectedExercise] = useState("");
  const [workoutsStats, setWorkoutsStats] = useState({
    week: 0,
    month: 0,
    year: 0,
    allTime: 0,
  });
  const [exercises, setExercises] = useState([]);
  const [workouts, setWorkouts] = useState([]); // Add workouts state

  useEffect(() => {
    fetchWorkouts();
    fetchExercises();
  }, [userId]);

  const fetchWorkouts = async () => {
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage or other storage
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/workouts/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the header
          },
          params: { userId }, // Pass params within the same config object
        }
      );

      const workouts = response.data;
      // Log fetched workouts
      setWorkouts(workouts); // Store workouts in state

      const now = new Date();
      const today = now.toISOString().split("T")[0]; // Today's date in "YYYY-MM-DD"
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
        .toISOString()
        .split("T")[0];
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split("T")[0];
      const startOfYear = new Date(now.getFullYear(), 0, 1)
        .toISOString()
        .split("T")[0];

      const stats = {
        week: 0,
        month: 0,
        year: 0,
        allTime: workouts.length, // Total workouts count
      };

      workouts.forEach((workout) => {
        const workoutDate = workout.date; // Date is already in "YYYY-MM-DD" format
        if (workoutDate >= startOfWeek) stats.week += 1;
        if (workoutDate >= startOfMonth) stats.month += 1;
        if (workoutDate >= startOfYear) stats.year += 1;
      });

      setWorkoutsStats(stats);
    } catch (error) {
      console.error("Error fetching workouts stats:", error);
    }
  };

  const fetchExercises = async () => {
    try {
      const response = await axios.get(
        "https://workoutappbackend-oyyg.onrender.com/exercises"
      );
      setExercises(response.data || []);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Basic Stats */}
      <div className="flex-shrink-0 w-full sm:w-1/3">
        <div className="p-4 border rounded bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">Workout Stats</h3>
          <ul className="grid grid-cols-2 gap-4">
            <li className="mb-2">Workouts This Week: {workoutsStats.week}</li>
            <li className="mb-2">Workouts This Month: {workoutsStats.month}</li>
            <li className="mb-2">Workouts This Year: {workoutsStats.year}</li>
            <li>All-Time Workouts: {workoutsStats.allTime}</li>
          </ul>
        </div>
        {/* Query Form */}
        <ChartQueryForm
          onChartTypeChange={setChartType}
          onTimePeriodChange={setTimePeriod}
          onExerciseChange={setSelectedExercise}
          exercises={exercises}
        />
      </div>
      {/* Chart Display */}
      <div className="flex-1">
        <ChartDisplay
          chartType={chartType}
          exercises={exercises}
          timePeriod={timePeriod}
          selectedExercise={selectedExercise}
          workouts={workouts} // Pass workouts to ChartDisplay
        />
      </div>
    </div>
  );
};

export default Stats;
