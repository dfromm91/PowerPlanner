const Calendar = ({ selectedDate, setSelectedDate, setIsEditing }) => {
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const changeMonth = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(selectedDate.getMonth() + direction);
    setSelectedDate(newDate);
  };

  const renderCalendar = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const days = daysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const calendar = [];
    let day = 1;

    // Create leading empty cells
    for (let i = 0; i < firstDay; i++) {
      calendar.push(null);
    }

    // Add days of the month
    while (day <= days) {
      calendar.push(day);
      day++;
    }

    // Create trailing empty cells to fill the row
    while (calendar.length % 7 !== 0) {
      calendar.push(null);
    }

    return calendar;
  };

  const handleDateClick = (day) => {
    if (day) {
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();
      const newDate = new Date(year, month, day);

      if (newDate.getTime() !== selectedDate.getTime()) {
        setIsEditing(false);
      }
      setSelectedDate(newDate);
    }
  };

  const calendar = renderCalendar();

  return (
    <div className="w-full max-w-lg p-6 mx-auto bg-white rounded-2xl shadow-xl flex flex-col">
      <div className="flex justify-between pb-4">
        <button onClick={() => changeMonth(-1)} className="cursor-pointer">
          &#8249;
        </button>
        <span className="uppercase text-sm font-semibold text-gray-600">
          {selectedDate.toLocaleString("default", { month: "long" })} -{" "}
          {selectedDate.getFullYear()}
        </span>
        <button onClick={() => changeMonth(1)} className="cursor-pointer">
          &#8250;
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="uppercase text-gray-600">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-sm">
        {calendar.map((day, index) => (
          <div
            key={index}
            onClick={() => handleDateClick(day)}
            className={`w-10 h-10 flex items-center justify-center rounded ${
              day &&
              selectedDate.getDate() === day &&
              selectedDate.getMonth() === new Date(selectedDate).getMonth() &&
              selectedDate.getFullYear() ===
                new Date(selectedDate).getFullYear()
                ? "bg-green-500 text-white"
                : "cursor-pointer hover:bg-green-100"
            }`}
          >
            {day || ""}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
