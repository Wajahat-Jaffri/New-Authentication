import React from "react";

const About = () => {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center bg-gray-100 px-6">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">
        About Us
      </h1>

      <p className="text-gray-700 text-lg text-center max-w-2xl">
        This is the About page of our React application. The purpose of this
        project is to learn React, React Router, and Tailwind CSS by building
        simple and practical applications.
      </p>

      <div className="mt-8 bg-white shadow-md rounded-lg p-6 max-w-xl w-full">
        <h2 className="text-2xl font-semibold mb-3">
          What You'll Learn
        </h2>

        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>React Components</li>
          <li>React Router Navigation</li>
          <li>Tailwind CSS Styling</li>
          <li>State Management</li>
          <li>API Integration</li>
        </ul>
      </div>
    </div>
  );
};

export default About;