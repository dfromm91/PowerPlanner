import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ChartDisplay = ({
  timePeriod,
  selectedExercise,
  workouts,
  exercises,
}) => {
  // Helper to calculate 1RM
  const calculate1RM = (weight, reps) => {
    const oneRepMax = weight * (1 + reps / 30);
    console.log(
      `Calculating 1RM: Weight = ${weight}, Reps = ${reps}, 1RM = ${oneRepMax}`
    );
    return oneRepMax;
  };

  // Get the name of the selected exercise
  const selectedExerciseName = useMemo(() => {
    const exercise = exercises.find(
      (ex) => ex.id === parseInt(selectedExercise, 10)
    );
    return exercise ? exercise.name : "Unknown Exercise";
  }, [selectedExercise, exercises]);

  // Filter and prepare data
  const chartData = useMemo(() => {
    if (!selectedExercise || !workouts || workouts.length === 0) {
      return [];
    }

    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
      .toISOString()
      .split("T")[0];
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split("T")[0];
    const startOfYear = new Date(now.getFullYear(), 0, 1)
      .toISOString()
      .split("T")[0];

    const filterDate = (date) => {
      if (timePeriod === "week") return date >= startOfWeek;
      if (timePeriod === "month") return date >= startOfMonth;
      if (timePeriod === "year") return date >= startOfYear;
      return true; // All time
    };

    console.log(
      "Filtered date ranges - Week:",
      startOfWeek,
      "Month:",
      startOfMonth,
      "Year:",
      startOfYear
    );

    const filteredData = workouts
      .filter((workout) => filterDate(workout.date)) // Filter by time period
      .map((workout) => {
        const exercise = workout.exercises.find(
          (ex) => ex.exercise_definition_id === parseInt(selectedExercise, 10)
        );

        if (!exercise) return null;

        const best1RM = Math.max(
          ...exercise.sets.map((set) =>
            calculate1RM(set.weight, set.repetitions)
          )
        );

        return { date: workout.date, best1RM: best1RM || 0 };
      })
      .filter(Boolean) // Remove null values
      .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date ascending

    return filteredData;
  }, [selectedExercise, timePeriod, workouts]);

  return (
    <div className="w-full p-6 bg-white rounded-2xl shadow-xl flex items-center justify-center">
      <div className="w-full">
        <p className="text-gray-500 text-center">
          Displaying Best Calculated 1RM Data for{" "}
          <strong>{selectedExerciseName}</strong>
        </p>
        <div className="mt-4 h-64 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="best1RM"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No data available for the selected exercise and time period.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartDisplay;
