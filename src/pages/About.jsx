import React from "react";
import devImg from "../assets/developer.jpg"; 

export default function About() {
  return (
    <div className="max-w-3xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold text-yellow-400 mb-4">
        About Application
      </h1>

      <div className="space-y-5 text-sm sm:text-base leading-relaxed">
        <p>
          <strong>Smart Gym Manager</strong> is a web-based gym administration
          system designed to help gym owners and staff efficiently manage
          members, attendance, workout schedules, body measurements, and
          payments. The platform ensures that daily operations are streamlined
          and member progress is tracked effectively.
        </p>

        <p>
          The system allows administrators to:
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Register and approve new gym members</li>
            <li>Track attendance records</li>
            <li>Manage workout schedules for individuals</li>
            <li>Record and view body measurements over time</li>
            <li>Handle monthly or package-based payments</li>
            <li>Post notifications visible to all members</li>
          </ul>
        </p>

        <hr className="border-gray-700 my-4" />

        <h2 className="text-lg font-semibold text-yellow-300 mb-2">Developer</h2>

        <div className="flex items-center gap-4">
          <img
            src={devImg}
            alt="Developer"
            className="w-16 h-16 rounded-full object-cover border border-gray-500"
          />
          <div>
            <p><strong>Name:</strong> M.R.C. Rasika Bandara</p>
            <p><strong>IT Support:</strong> +94 75 808 4741</p>
          </div>
        </div>

        <hr className="border-gray-700 my-4" />

        <p className="text-gray-400 text-xs">
          © {new Date().getFullYear()} Smart Gym Manager. All rights reserved.
        </p>
      </div>
    </div>
  );
}
