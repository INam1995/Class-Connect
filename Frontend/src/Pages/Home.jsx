// LearnifyHomePage.jsx
import React from "react";
import { Star } from "lucide-react";
import NavbarComponent from "../Components/Navbar"; // Adjust path if needed
import { Link } from "react-router-dom"; // Importing Link for navigation

export default function LearnifyHomePage() {
  return (
    <div style={{ backgroundColor: "rgb(252,250,247)" }} className="min-h-screen">
      <NavbarComponent />

      <div className="min-h-screen px-6 py-10 md:px-16">
        {/* Header */}
        <header className="flex items-center justify-between mb-10">
          <h1 className="text-2xl font-bold text-orange-500">Learnify</h1>
         
        </header>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Text Content */}
          <div className="max-w-xl space-y-6">
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Find the right <span className="text-orange-500">course</span> for you
            </h2>
            <p className="text-gray-600">
              See your personalised recommendations based on your interests and goals
            </p>
            <div className="flex gap-4">
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-md transition">
                Find course
              </button>
              <a href="#" className="text-orange-500 font-medium underline">
                View our blog →
              </a>
            </div>
          </div>

          {/* Illustration */}
          <div className="relative">
            <img
              src="/images/flying-girl-pencil.png"
              alt="Flying girl on pencil"
              className="w-95 md:w-100"
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid gap-6 grid-cols-1 md:grid-cols-3">
          {/* Card 1 */}
          <div className="p-6 border rounded-xl shadow-sm">
            <div className="text-sm font-semibold text-purple-600 mb-2">Education</div>
            <div className="text-3xl font-bold">+40</div>
            <p className="text-sm text-gray-500">subjects</p>
          </div>

          {/* Card 2 */}
          <div className="p-6 border rounded-xl shadow-sm">
            <div className="text-sm font-semibold text-purple-600 mb-2">Online</div>
            <div className="text-3xl font-bold">+120</div>
            <p className="text-sm text-gray-500">courses</p>
          </div>

          {/* Card 3 */}
          <div className="p-6 border rounded-xl shadow-sm">
            <div className="flex items-center gap-1 text-yellow-500 mb-2">
              <Star size={18} fill="currentColor" />
              <span className="text-sm font-medium">5.0</span>
            </div>
            <div className="text-3xl font-bold">+180k</div>
            <p className="text-sm text-gray-500">learner reviews</p>
          </div>
        </div>

        {/* Free Courses Promo Section */}
        <section className="mt-20 bg-yellow-300 rounded-3xl px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Text Content */}
          <div className="max-w-xl space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold leading-snug text-gray-900">
              Upgrade your <span className="text-yellow-600">skills</span><br />
              with <span className="text-white bg-black px-2 py-1 rounded">FREE</span> online courses
            </h2>
            <p className="text-gray-800">
              Ready to gain in-demand skills to kickstart your career? The Learnify Click Start program offers 29 FREE online courses to help you get your first experience in your chosen profession.
            </p>
            <button className="bg-black hover:bg-gray-900 text-white font-semibold px-6 py-3 rounded-md transition">
              Start now
            </button>
          </div>

          {/* Illustration */}
          <div className="w-64 md:w-80">
            <img src="/images/puzzle-hands.png" alt="Puzzle in hands" className="w-full" />
          </div>
        </section>
      </div>
    </div>
  );
}
