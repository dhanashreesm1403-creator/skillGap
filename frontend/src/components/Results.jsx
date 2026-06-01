function Results({ data, onReset }) {

  // This function draws the circular progress bar using SVG
  // SVG is a way to draw shapes directly in HTML
  // Think of it like a canvas where we draw circles
  const CircularProgress = ({ percentage, size = 160, color = "#9333ea" }) => {
    const radius = (size - 20) / 2;
    // circumference = total length of the circle outline
    const circumference = 2 * Math.PI * radius;
    // strokeDashoffset controls how much of the circle is "filled"
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          {/* Background circle — gray */}
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#374151" strokeWidth="10"/>
          {/* Foreground circle — purple, animated */}
          <circle
            cx={size/2} cy={size/2} r={radius}
            fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        {/* Text in center of circle */}
        <div className="absolute text-center">
          <div className="text-3xl font-extrabold text-white">{percentage}%</div>
          <div className="text-xs text-gray-400">Job Ready</div>
        </div>
      </div>
    );
  };

  // Color coding for feasibility label
  const getFeasibilityColor = (label) => {
    if (label === "Highly Achievable") return "text-green-400 bg-green-900";
    if (label === "Challenging but Possible") return "text-yellow-400 bg-yellow-900";
    if (label === "Difficult") return "text-orange-400 bg-orange-900";
    return "text-red-400 bg-red-900";
  };

  const feasibilityColor = getFeasibilityColor(data.feasibilityLabel);

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-12">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-white mb-2">
            Your <span className="text-purple-500">Learning Path</span> is Ready!
          </h1>
          <p className="text-gray-400">Follow this schedule and you'll be job-ready 💪</p>
        </div>

        {/* Top Row — Readiness + Feasibility */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

          {/* Circular Readiness Score */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col items-center">
            <h2 className="text-purple-400 font-bold text-lg mb-4">🎯 Overall Readiness</h2>
            <CircularProgress percentage={data.readinessScore || 0} />
            <p className="text-gray-400 text-sm mt-4 text-center">
              You already have {data.existingSkills?.length || 0} of the required skills
            </p>
          </div>

          {/* Feasibility Score */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col justify-between">
            <h2 className="text-purple-400 font-bold text-lg mb-4">⚡ Feasibility Score</h2>

            {/* Big score number */}
            <div className="text-center my-4">
              <div className="text-6xl font-extrabold text-white">{data.feasibilityScore || 0}</div>
              <div className="text-gray-500 text-sm">out of 100</div>
            </div>

            {/* Label badge */}
            <div className={`text-center px-4 py-2 rounded-xl font-bold text-sm ${feasibilityColor}`}>
              {data.feasibilityLabel || "Analyzing..."}
            </div>

            {/* Message */}
            <p className="text-gray-400 text-xs mt-3 text-center">
              {data.feasibilityMessage}
            </p>
          </div>

        </div>

        {/* Hours Comparison */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <h2 className="text-purple-400 font-bold text-lg mb-4">⏱️ Hours Analysis</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center bg-gray-800 rounded-xl p-4">
              <div className="text-3xl font-bold text-red-400">{data.totalRequiredHours || 0}</div>
              <div className="text-gray-400 text-sm mt-1">Hours Required</div>
            </div>
            <div className="text-center bg-gray-800 rounded-xl p-4">
              <div className="text-3xl font-bold text-green-400">{data.totalAvailableHours || 0}</div>
              <div className="text-gray-400 text-sm mt-1">Hours Available</div>
            </div>
          </div>
          {/* Progress bar comparing hours */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Coverage</span>
              <span>{Math.min(100, Math.round((data.totalAvailableHours / data.totalRequiredHours) * 100)) || 0}%</span>
            </div>
            <div className="bg-gray-700 rounded-full h-3">
              <div
                className="bg-purple-500 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, Math.round((data.totalAvailableHours / data.totalRequiredHours) * 100)) || 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Existing Skills */}
        {data.existingSkills?.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
            <h2 className="text-purple-400 font-bold text-lg mb-4">✅ Skills You Already Have</h2>
            <div className="flex flex-wrap gap-2">
              {data.existingSkills.map((skill, i) => (
                <span key={i} className="bg-green-900 text-green-200 text-sm px-3 py-1 rounded-full">
                  ✓ {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Missing Skills */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <h2 className="text-purple-400 font-bold text-lg mb-4">📊 Skills to Learn</h2>
          <div className="flex flex-wrap gap-2">
            {data.missingSkills?.map((skill, i) => (
              <span key={i} className="bg-purple-900 text-purple-200 text-sm px-3 py-1 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Weekly Schedule */}
        <div className="space-y-4 mb-6">
          <h2 className="text-purple-400 font-bold text-lg">📅 Your Weekly Schedule</h2>
          {data.schedule?.map((week, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-white font-bold">Week {week.week} — {week.focus}</h3>
                <span className="text-purple-400 text-xs bg-purple-900 px-2 py-1 rounded-full">
                  {week.days} • {week.estimatedHours}hrs
                </span>
              </div>
              <ul className="space-y-2">
                {week.tasks?.map((task, j) => (
                  <li key={j} className="flex items-start gap-2 text-gray-300 text-sm">
                    <span className="text-purple-400 mt-0.5">✓</span>
                    {task}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Free Resources */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <h2 className="text-purple-400 font-bold text-lg mb-4">🔗 Free Resources</h2>
          <div className="space-y-3">
            {data.resources?.map((res, i) => (
              <a key={i} href={res.url} target="_blank" rel="noreferrer" className="flex items-center justify-between bg-gray-800 hover:bg-gray-700 rounded-xl px-4 py-3 transition group">
                <div>
                  <p className="text-white text-sm font-semibold">{res.skill}</p>
                  <p className="text-gray-400 text-xs">{res.platform}</p>
                </div>
                <span className="text-purple-400 group-hover:translate-x-1 transition">→</span>
              </a>
            ))}
          </div>
        </div>

        {/* Industry Projects */}
        {data.projects?.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
            <h2 className="text-purple-400 font-bold text-lg mb-4">🏗️ Recommended Projects</h2>
            <div className="space-y-3">
              {data.projects?.map((project, i) => (
                <div key={i} className="bg-gray-800 rounded-xl px-4 py-3">
                  <div className="flex justify-between items-center">
                    <p className="text-white text-sm font-semibold">{project.title}</p>
                    <span className="text-xs bg-purple-900 text-purple-300 px-2 py-1 rounded-full">{project.difficulty}</span>
                  </div>
                  <p className="text-gray-400 text-xs mt-1">{project.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reset Button */}
        <button onClick={onReset} className="w-full border border-purple-700 text-purple-400 hover:bg-purple-900 font-bold py-3 rounded-xl transition">
          ← Analyze Another Job
        </button>

      </div>
    </div>
  );
}

export default Results;