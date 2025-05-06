import React from 'react';
const loggedInUser = JSON.parse(localStorage.getItem("user"));
const loggedInUserId = loggedInUser?._id;

const Sidebar = ({ activeSection, setActiveSection, sectionRefs, profileUserId }) => {
  const handleClick = (section) => {
    setActiveSection(section);
    sectionRefs[section].current.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  return (
    <div className="w-1/4 bg-gray-300 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray mb-8">My Profile</h2>
      <div className="space-y-6 mt-4">
        <button
          className={`w-full text-left p-3 rounded-r-full transition duration-300 ease-in-out hover:bg-gray-600  ${
            activeSection === 'profile' ? 'bg-gray-400 text-white' : 'bg-gray-400 text-white'
          } mb-4`}
          onClick={() => handleClick('profile')}
        >
          <span className="text-xl">Profile</span>
        </button>

        {/* Show only if logged-in user is viewing their own profile */}
        {loggedInUserId === profileUserId && (
          <button
            className={`w-full text-left p-3 rounded-full transition duration-300 ease-in-out hover:bg-gray-600 ${
              activeSection === 'security' ? 'bg-gray-400 text-white' : 'bg-gray-400 text-white'
            } mb-4`}
            onClick={() => handleClick('security')}
          >
            <span className="text-xl">Security</span>
          </button>
        )}

        <button
          className={`w-full text-left p-3 rounded-full transition duration-300 ease-in-out hover:bg-gray-600 ${
            activeSection === 'activity' ? 'bg-gray-400 text-white' : 'bg-gray-400 text-white'
          }`}
          onClick={() => handleClick('activity')}
        >
          <span className="text-xl">My Activity</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
