import React from "react";

const Home = () => {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-4xl font-bold text-green-600 mb-4">
        Welcome to Home Page
      </h1>

      <p className="text-gray-700 text-lg text-center max-w-xl">
        This is a simple Home page created using React, React Router, and
        Tailwind CSS. You can navigate between different pages using the
        navigation bar.
      </p>

      <button className="mt-6 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg">
        Get Started
      </button>
    </div>
  );
};

export default Home;