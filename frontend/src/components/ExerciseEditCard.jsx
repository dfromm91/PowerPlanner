import { useState, useEffect } from "react";

const ExerciseEditCard = ({
  exerciseInstance,
  updateExercise,
  availableExercises,
  allExercisesInWorkout,
  workout,
  setWorkout,
}) => {
  const [exercise, setExercise] = useState({
    ...exerciseInstance,
    sets: exerciseInstance.sets || [],
  });
  useEffect(() => {
    setExercise({
      ...exerciseInstance,
      sets: exerciseInstance.sets || [],
    });
  }, [exerciseInstance]);

  useEffect(() => {
    // Debugging Logs

    // Ensure `exercise_definition_id` matches the current exercise
    if (!exercise.exercise_definition_id) {
      const matchingExercise = availableExercises.find(
        (ex) => ex.id === exerciseInstance.exercise_definition_id
      );

      if (matchingExercise) {
        setExercise((prev) => ({
          ...prev,
          exercise_definition_id: matchingExercise.id,
          name: matchingExercise.name,
        }));
      }
    }
  }, [exerciseInstance, availableExercises]);

  const handleSetChange = (index, field, value) => {
    const updatedSets = exercise.sets.map((set, i) =>
      i === index ? { ...set, [field]: value } : set
    );
    const updatedExercise = { ...exercise, sets: updatedSets };
    setExercise(updatedExercise);
    updateExercise(updatedExercise);
  };

  const handleAddSet = () => {
    const newSet = { id: null, weight: 0, repetitions: 0 };
    const updatedExercise = {
      ...exercise,
      sets: [...exercise.sets, newSet],
    };
    setExercise(updatedExercise);
    updateExercise(updatedExercise);
  };
  const handleRemoveExercise = () => {
    const updatedExercises = workout.exercises.filter(
      (e) => e.id !== exerciseInstance.id
    );

    setWorkout((prevWorkout) => ({
      ...prevWorkout,
      exercises: updatedExercises,
    }));
  };

  const handleRemoveSet = (index) => {
    const updatedSets = exercise.sets.filter((_, i) => i !== index);
    const updatedExercise = { ...exercise, sets: updatedSets };
    setExercise(updatedExercise);
    updateExercise(updatedExercise);
  };

  const handleNameChange = (newExerciseId) => {
    const selectedExercise = availableExercises.find(
      (ex) => ex.id === parseInt(newExerciseId, 10)
    );

    if (selectedExercise) {
      const isDuplicate = allExercisesInWorkout.some(
        (ex) =>
          ex.exercise_definition_id === selectedExercise.id &&
          ex.id !== exerciseInstance.id
      );

      if (isDuplicate) {
        alert(
          "This exercise is already in the workout. Please choose another."
        );
        return;
      }

      const updatedExercise = {
        ...exercise,
        exercise_definition_id: selectedExercise.id,
        name: selectedExercise.name,
      };
      setExercise(updatedExercise);
      updateExercise(updatedExercise);
    }
  };

  // Debugging Logs

  return (
    <div className="p-4 border rounded shadow-md bg-gray-50">
      <div className="relative flex">
        <h3 className="text-lg font-semibold mb-2">Edit Exercise</h3>
        <button
          onClick={handleRemoveExercise}
          className="p-2 bg-red-500 text-white rounded ml-auto"
        >
          Delete
        </button>
      </div>
      <div className="mb-4">
        <label
          htmlFor="exercise-name"
          className="block text-sm font-medium mb-1"
        >
          Exercise Name:
        </label>

        <select
          id="exercise-name"
          value={exercise.exercise_definition_id || ""}
          onChange={(e) => handleNameChange(e.target.value)}
          className="p-2 border rounded w-full mb-2"
          required
        >
          <option value="" disabled>
            Select an Exercise
          </option>
          {availableExercises.map((ex) => (
            <option
              key={ex.id}
              value={ex.id}
              disabled={allExercisesInWorkout.some(
                (workoutEx) =>
                  workoutEx.exercise_definition_id === ex.id &&
                  workoutEx.id !== exerciseInstance.id
              )}
            >
              {ex.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-6">
        <ul className="relative flex mb-2">
          <li className="absolute left-0 w-1/3">Weight</li>
          <li className="absolute left-1/3 w-1/3 ml-4">Repetitions</li>
        </ul>
      </div>
      <ul>
        {exercise.sets.map((set, index) => (
          <li key={index} className="flex items-center gap-4">
            <input
              type="number"
              placeholder="Weight"
              value={set.weight}
              step="2.5"
              min="0"
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                handleSetChange(index, "weight", value >= 0 ? value : 0); // Prevent negative values
              }}
              className="p-2 border rounded w-1/3"
            />
            <input
              type="number"
              placeholder="Reps"
              value={set.repetitions}
              min="0"
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                handleSetChange(index, "repetitions", value >= 0 ? value : 0); // Prevent negative values
              }}
              className="p-2 border rounded w-1/3"
            />
            <button onClick={() => handleRemoveSet(index)} className="text-red">
              Delete
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={handleAddSet}
        className="p-2 bg-blue-500 text-white rounded mt-4"
      >
        Add Set
      </button>
    </div>
  );
};

export default ExerciseEditCard;
