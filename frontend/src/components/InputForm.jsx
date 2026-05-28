import { useState } from "react";

// useState is React's way of remembering data
// When state changes, the page updates automatically — no refresh needed

function InputForm({ onSubmit }) {
  const [jobDescription, setJobDescription] = useState("");
  const [currentSkills, setCurrentSkills] = useState("");
  const [preparationDuration, setPreparationDuration] = useState("");
  const [dailyHours, setDailyHours] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Validate — make sure nothing is empty
    if (!jobDescription || !currentSkills || !preparationDuration || !dailyHours) {
      alert("Please fill in all fields!");
      return;
    }
    setLoading(true);
    await onSubmit({ jobDescription, currentSkills, preparationDuration, dailyHours });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-white mb-3">
            Skill<span className="text-purple-500">Gap</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Paste your dream job. We'll build your path to it. 🚀
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl space-y-6">

          {/* Job Description */}
          <div>
            <label className="block text-sm font-semibold text-purple-400 mb-2">
              📋 Dream Job Description
            </label>
            <textarea
              rows={6}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here — requirements, responsibilities, everything..."
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-xl px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none transition"
            />
            {/* What this does: onChange fires every time user types.
                e.target.value is what they typed. We save it in state. */}
          </div>

          {/* Current Skills */}
          <div>
            <label className="block text-sm font-semibold text-purple-400 mb-2">
              🧠 Skills You Already Have
            </label>
            <textarea
              rows={3}
              value={currentSkills}
              onChange={(e) => setCurrentSkills(e.target.value)}
              placeholder="e.g. HTML, CSS, basic Python, MS Excel, communication skills..."
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-xl px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none transition"
            />
          </div>

          {/* Two dropdowns side by side */}
          <div className="grid grid-cols-2 gap-4">

            {/* Preparation Duration */}
            <div>
              <label className="block text-sm font-semibold text-purple-400 mb-2">
                📅 Preparation Duration
              </label>
              <select
                value={preparationDuration}
                onChange={(e) => setPreparationDuration(e.target.value)}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition"
              >
                <option value="">Select duration</option>
                <option value="1 month">1 Month</option>
                <option value="3 months">3 Months</option>
                <option value="6 months">6 Months</option>
              </select>
              {/* A <select> creates a dropdown. Each <option> is one choice.
                  value="" is the placeholder (empty default) */}
            </div>

            {/* Daily Learning Hours */}
            <div>
              <label className="block text-sm font-semibold text-purple-400 mb-2">
                ⏰ Daily Learning Hours
              </label>
              <select
                value={dailyHours}
                onChange={(e) => setDailyHours(e.target.value)}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition"
              >
                <option value="">Select hours</option>
                <option value="2">2 hours/day</option>
                <option value="3">3 hours/day</option>
                <option value="6">6 hours/day</option>
              </select>
            </div>

          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition text-lg tracking-wide"
          >
            {loading ? "Analyzing your gap... ✨" : "Analyze My Skill Gap →"}
          </button>

        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          Powered by Gemini AI • Free resources only • Built for your success
        </p>

      </div>
    </div>
  );
}

export default InputForm;