import NavbarComponent from "../Components/Navbar"; // Adjust path if needed
import { Link } from "react-router-dom"; // Importing Link for navigation

export default function LearnifyHomePage() {
  return (
    <div style={{ backgroundColor: "rgb(252,250,247)" }} className="min-h-screen">
      <NavbarComponent />

      <div className="min-h-screen px-6 py-10 md:px-16">
        {/* Header */}
        <header className="flex items-center justify-between mb-10">
          <h1 className="text-2xl font-bold text-orange-500">Lrnify</h1>
         
        </header>

      
       {/* Hero Section */}
<section className="flex flex-col-reverse md:flex-row items-center justify-between gap-10 mt-10">
  {/* Text Content */}
  <div className="max-w-xl space-y-6 text-center md:text-left">
    <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900">
      All Your <span className="text-orange-500">College Material</span>, in One Place
    </h2>
    <p className="text-gray-600 text-lg">
      Notes, PDFs, previous year papers, and more for every subject.
    </p>

    {/* Search Bar */}
    <div className="flex items-center justify-center md:justify-start">
      <input
        type="text"
        placeholder="🔍 Search by subject, topic, or course code"
        className="w-full max-w-md px-4 py-3 border border-orange-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
      />
    </div>
  </div>

  {/* Illustration */}
  <div className="w-full max-w-sm md:max-w-md">
    <img
      src="/images/study-illustration.png" // Replace this with your preferred image path
      alt="Study Illustration"
      className="w-full"
    />
  </div>
</section>
{/* Subject Categories Section */}
<section className="mt-20">
  <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
    📚 Explore by Subject
  </h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {/* Subject Card - Computer Science */}
    <Link to="/subjects/computer-science" className="bg-white border hover:shadow-lg rounded-xl p-6 transition flex flex-col items-center text-center">
      <span className="text-4xl">📘</span>
      <h3 className="text-lg font-semibold mt-4 text-orange-500">Computer Science</h3>
    </Link>

    {/* Subject Card - Chemistry */}
    <Link to="/subjects/chemistry" className="bg-white border hover:shadow-lg rounded-xl p-6 transition flex flex-col items-center text-center">
      <span className="text-4xl">🧪</span>
      <h3 className="text-lg font-semibold mt-4 text-orange-500">Chemistry</h3>
    </Link>

    {/* Subject Card - Mechanical Engineering */}
    <Link to="/subjects/mechanical-engineering" className="bg-white border hover:shadow-lg rounded-xl p-6 transition flex flex-col items-center text-center">
      <span className="text-4xl">📐</span>
      <h3 className="text-lg font-semibold mt-4 text-orange-500">Mechanical Engineering</h3>
    </Link>

    {/* Subject Card - Management */}
    <Link to="/subjects/management" className="bg-white border hover:shadow-lg rounded-xl p-6 transition flex flex-col items-center text-center">
      <span className="text-4xl">📊</span>
      <h3 className="text-lg font-semibold mt-4 text-orange-500">Management</h3>
    </Link>

    {/* You can add more subject cards below */}
  </div>
</section>


{/* Featured/Popular Notes Section */}
<section className="mt-20">
  <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
    🌟 Featured Notes & Materials
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {/* Most Downloaded */}
    <div className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-lg transition">
      <h3 className="text-xl font-semibold text-orange-500 mb-2">🔥 Most Downloaded</h3>
      <p className="text-gray-600 mb-4">Operating Systems - Unit Wise Notes (CS 3rd Year)</p>
      <Link to="/notes/operating-systems" className="text-sm text-blue-600 underline">
        View Note →
      </Link>
    </div>

    {/* Top Rated */}
    <div className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-lg transition">
      <h3 className="text-xl font-semibold text-orange-500 mb-2">⭐ Top Rated</h3>
      <p className="text-gray-600 mb-4">Digital Electronics Lab Manual (ECE)</p>
      <Link to="/notes/digital-electronics" className="text-sm text-blue-600 underline">
        View Note →
      </Link>
    </div>

    {/* Recently Uploaded */}
    <div className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-lg transition">
      <h3 className="text-xl font-semibold text-orange-500 mb-2">🆕 Recently Uploaded</h3>
      <p className="text-gray-600 mb-4">Business Communication Notes (Management 1st Year)</p>
      <Link to="/notes/business-communication" className="text-sm text-blue-600 underline">
        View Note →
      </Link>
    </div>
  </div>
</section>




{/* Upload Your Notes - CTA Section */}
<section className="mt-20 bg-orange-100 rounded-3xl px-8 py-12 text-center">
  <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
    📤 Have great notes?
  </h2>
  <p className="text-gray-700 text-lg mb-6">
    Help others by uploading your study material and notes!
  </p>
  <Link to="/upload" className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-md transition">
    Upload Now
  </Link>
</section>
{/* Testimonials / Feedback Section */}
<section className="mt-20">
  <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-10">
    💬 What Students Are Saying
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* Testimonial 1 */}
    <div className="bg-white border rounded-xl p-6 shadow hover:shadow-lg transition">
      <p className="text-gray-700 mb-4 italic">
        “I found all my Computer Science notes here—super organized and easy to download.”
      </p>
      <div className="font-semibold text-orange-500">Riya Sharma</div>
      <div className="text-sm text-gray-500">B.Tech CSE, 3rd Year</div>
    </div>

    {/* Testimonial 2 */}
    <div className="bg-white border rounded-xl p-6 shadow hover:shadow-lg transition">
      <p className="text-gray-700 mb-4 italic">
        “This platform helped me crack my exams by giving access to previous year papers and quick summaries.”
      </p>
      <div className="font-semibold text-orange-500">Aman Verma</div>
      <div className="text-sm text-gray-500">MBA, 1st Year</div>
    </div>

    {/* Testimonial 3 */}
    <div className="bg-white border rounded-xl p-6 shadow hover:shadow-lg transition">
      <p className="text-gray-700 mb-4 italic">
        “Uploading my notes was super simple—and I loved seeing others find them useful.”
      </p>
      <div className="font-semibold text-orange-500">Mehak Gill</div>
      <div className="text-sm text-gray-500">B.Sc Chemistry, Final Year</div>
    </div>
  </div>
</section>

      {/* Footer */}
<footer className="mt-24 bg-gray-900 text-white py-10 px-6 md:px-16">
  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
    {/* About Us */}
    <div>
      <h4 className="text-xl font-semibold mb-4">About Us</h4>
      <p className="text-sm text-gray-300">
        Learnify is a student-driven platform that makes study materials accessible for everyone. Curated by students, for students.
      </p>
    </div>

    {/* Contact */}
    <div>
      <h4 className="text-xl font-semibold mb-4">Contact</h4>
      <ul className="space-y-2 text-sm text-gray-300">
        <li>Email: support@learnify.com</li>
        <li>Phone: +91-XXXXXXXXX</li>
        <li>Mumbai, Maharashtra, India</li>
      </ul>
    </div>

    {/* Terms */}
    <div>
      <h4 className="text-xl font-semibold mb-4">Legal</h4>
      <ul className="space-y-2 text-sm text-gray-300">
        <li><Link to="/terms">Terms & Conditions</Link></li>
        <li><Link to="/privacy">Privacy Policy</Link></li>
      </ul>
    </div>

    {/* Social Links */}
    <div>
      <h4 className="text-xl font-semibold mb-4">Follow Us</h4>
      <div className="flex gap-4 text-lg">
        <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-orange-400">📘</a>
        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-orange-400">📸</a>
        <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-orange-400">💼</a>
      </div>
    </div>
  </div>

  {/* Disclaimer */}
  <div className="mt-10 text-center text-sm text-gray-400 border-t border-gray-700 pt-6">
    Disclaimer: All materials shared are for educational purposes only. We do not claim ownership unless stated.
    <br />
    © {new Date().getFullYear()} Learnify. All rights reserved.
  </div>
</footer>

      </div>
    </div>
  );
}
