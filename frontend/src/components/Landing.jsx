import Register from "./Register";

const LandingPage = ({ loggedIn, setLoggedIn, setUserId, setIsValidated }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4">
      <div className="bg-black">
        test user = caoxhpcqgjcfiwiyhf@nbmbb.com <br /> Password = Pa$$w0rd!
      </div>
      <div className="text-center mb-8 max-w-2xl">
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-4">
          Welcome to PowerPlanner
        </h1>
        <p className="text-xl sm:text-2xl font-light leading-relaxed">
          Your personalized fitness journey starts here. Sign up or log in to
          begin tracking your workouts, achieving your goals, and unlocking your
          potential.
        </p>
      </div>
      <div className=" rounded-lg shadow-2xl w-full max-w-md">
        <Register
          loggedIn={loggedIn}
          setLoggedIn={setLoggedIn}
          setUserId={setUserId}
          setIsValidated={setIsValidated} // Pass down the new prop
        />
      </div>
    </div>
  );
};

export default LandingPage;
