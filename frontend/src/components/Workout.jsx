import { useState, useEffect } from "react";
import axios from "axios";
import ExerciseViewCard from "./ExerciseViewCard";
import ExerciseEditCard from "./ExerciseEditCard";

const Workout = ({
  selectedDate,
  userId,
  loggedIn,
  setIsEditing,
  isEditing,
}) => {
  const [workout, setWorkout] = useState(null);

  const [availableExercises, setAvailableExercises] = useState([]);
  const [newExerciseId, setNewExerciseId] = useState("");

  // Fetch available exercises
  useEffect(() => {
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage or other storage
    axios
      .get(`${import.meta.env.VITE_BACKEND_API}/exercises`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the header
        },
      })
      .then((response) => {
        setAvailableExercises(response.data || []);
      })
      .catch((error) => console.error("Error fetching exercises:", error));
  }, []);

  // Fetch workout data
  useEffect(() => {
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage or other storage
    if (!userId || !selectedDate) return;

    const formattedDate =
      selectedDate instanceof Date
        ? selectedDate.toISOString().split("T")[0]
        : selectedDate;

    axios
      .get(`${import.meta.env.VITE_BACKEND_API}/workouts`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
        params: { userId, date: formattedDate }, // Include query parameters
      })
      .then((response) => {
        setWorkout(response.data[0] || { id: null, exercises: [] });
      })
      .catch((error) => {
        console.error(
          "Error fetching workout:",
          error.response?.data || error.message
        );
      });
  }, [userId, selectedDate]);

  // Update an exercise
  const onDelete = () => {
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage or other storage
    if (!workout || !workout.id) {
      console.error("No workout to delete");
      return;
    }

    axios
      .delete(`${import.meta.env.VITE_BACKEND_API}/workouts/${workout.id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the header
        },
      })
      .then((response) => {
        setWorkout(null); // Clear the workout from the state after deletion
      })
      .catch((error) => {
        console.error("Error deleting workout:", error);
      });
  };
  const updateExercise = (updatedExercise) => {
    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) =>
        ex.id === updatedExercise.id ? updatedExercise : ex
      ),
    }));
  };

  // Add a new exercise
  const addExercise = () => {
    const selected = availableExercises.find(
      (ex) => ex.id === parseInt(newExerciseId, 10)
    );
    if (selected) {
      const newExercise = {
        id: Date.now(), // Temporary unique ID for frontend only
        name: selected.name,
        exercise_definition_id: selected.id,
        sets: [],
      };

      setWorkout((prev) => ({
        ...prev,
        exercises: [...(prev?.exercises || []), newExercise], // Handle null `prev`
      }));
      setNewExerciseId(""); // Reset selection
    }
  };

  // Save workout
  const saveWorkout = () => {
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage or other storage
    if (!workout) return;

    const payload = {
      workoutId: workout.id,
      user_id: userId,
      date:
        selectedDate instanceof Date
          ? selectedDate.toISOString().split("T")[0]
          : selectedDate,
      exercises: workout.exercises.map((ex) => ({
        exercise_definition_id: ex.exercise_definition_id, // Use the correct definition ID
        sets: ex.sets.map((set) => ({
          id: set.id || null,
          weight: parseFloat(set.weight) || 0,
          repetitions: parseInt(set.repetitions, 10) || 0,
        })),
      })),
    };

    axios
      .post(`${import.meta.env.VITE_BACKEND_API}/workouts`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setIsEditing(false);

        // Refetch workout to ensure correct names are reloaded
        fetchWorkout();
      })
      .catch((error) => console.error("Error saving workout:", error));
  };
  const fetchWorkout = () => {
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage or other storage
    const formattedDate =
      selectedDate instanceof Date
        ? selectedDate.toISOString().split("T")[0]
        : selectedDate;

    axios
      .get(`${import.meta.env.VITE_BACKEND_API}/workouts`, {
        params: { userId, date: formattedDate },
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the header
        },
      })
      .then((response) =>
        setWorkout(response.data[0] || { id: null, exercises: [] })
      )
      .catch((error) => console.error("Error fetching workout:", error));
  };

  return (
    <div className="workout-container">
      {!isEditing ? (
        <>
          {workout && workout.exercises.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {workout.exercises.map((exercise, index) => (
                <ExerciseViewCard exerciseInstance={exercise} key={index} />
              ))}
            </div>
          ) : (
            <p>No Workout Found</p>
          )}
          <div className="mt-4 flex gap-4">
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
            >
              Edit
            </button>
            {workout && workout.exercises.length > 0 && (
              <button
                onClick={onDelete}
                className="px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600 transition"
              >
                Delete
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {workout &&
              workout.exercises.map((exercise, index) => (
                <ExerciseEditCard
                  key={exercise.id} // Unique key based on exercise ID
                  exerciseInstance={exercise}
                  updateExercise={updateExercise}
                  availableExercises={availableExercises}
                  allExercisesInWorkout={workout.exercises}
                  setWorkout={setWorkout}
                  workout={workout}
                />
              ))}
            <div className="border border-dashed rounded-lg p-4 bg-gray-100 hover:bg-gray-200 transition">
              <h3 className="text-lg font-medium mb-2">Add Exercise</h3>
              <select
                value={newExerciseId}
                onChange={(e) => setNewExerciseId(e.target.value)}
                className="p-2 border rounded w-full mb-2"
              >
                <option value="">Select an Exercise</option>
                {availableExercises.map((exercise) => (
                  <option key={exercise.id} value={exercise.id}>
                    {exercise.name}
                  </option>
                ))}
              </select>
              <button
                onClick={addExercise}
                className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
              >
                Add
              </button>
            </div>
          </div>
          <button
            onClick={saveWorkout}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 transition"
          >
            Save
          </button>
        </>
      )}
    </div>
  );
};

export default Workout;
