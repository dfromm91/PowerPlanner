import { useState } from "react";

const ChartQueryForm = ({
  onTimePeriodChange,
  onExerciseChange,
  exercises,
}) => {
  const [timePeriod, setTimePeriod] = useState("week");
  const [selectedExercise, setSelectedExercise] = useState("");

  const handleTimePeriodChange = (e) => {
    setTimePeriod(e.target.value);
    onTimePeriodChange(e.target.value);
  };

  const handleExerciseChange = (e) => {
    setSelectedExercise(e.target.value);
    onExerciseChange(e.target.value);
  };

  return (
    <div className="w-full p-6 bg-white rounded-2xl shadow-xl flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Strength Level Graph</h2>
      <div className="mb-4">
        <label className="block text-gray-600 font-semibold mb-2">
          Select Time Period
        </label>
        <select
          value={timePeriod}
          onChange={handleTimePeriodChange}
          className="w-full p-2 border rounded"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
          <option value="all">All Time</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-600 font-semibold mb-2">
          Select Exercise
        </label>
        <select
          value={selectedExercise}
          onChange={handleExerciseChange}
          className="w-full p-2 border rounded"
        >
          <option value="">All Exercises</option>
          {exercises.map((exercise) => (
            <option key={exercise.id} value={exercise.id}>
              {exercise.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ChartQueryForm;
