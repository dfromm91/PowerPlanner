const ExerciseViewCard = ({ exerciseInstance }) => {
  return (
    <div className="p-4 border rounded shadow-md bg-white">
      <h3 className="text-lg font-semibold">{exerciseInstance.name}</h3>
      <ul className="mt-2">
        {exerciseInstance.sets.map((set, index) => (
          <li key={index} className="text-sm">
            <span className="font-medium">Set {index + 1}:</span> {set.weight}{" "}
            lbs x {set.repetitions} reps
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExerciseViewCard;
