function Results({ data, onReset }) {

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-12">
      <div className="max-w-3xl mx-auto">

        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-white mb-2">
            Your <span className="text-purple-500">Learning Path</span> is Ready!
          </h1>
          <p className="text-gray-400">Follow this schedule and you'll be job-ready 💪</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <h2 className="text-purple-400 font-bold text-lg mb-4">📊 Skill Gap Summary</h2>
          <div className="flex flex-wrap gap-2">
            {data.missingSkills?.map((skill, i) => (
              <span key={i} className="bg-purple-900 text-purple-200 text-sm px-3 py-1 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <h2 className="text-purple-400 font-bold text-lg">📅 Your Weekly Schedule</h2>
          {data.schedule?.map((week, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-3">Week {week.week} — {week.focus}</h3>
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

        <button oonClick={onReset} className="w-full border border-purple-700 text-purple-400 hover:bg-purple-900 font-bold py-3 rounded-xl transition">
          ← Analyze Another Job
        </button>

      </div>
    </div>
  );
}

export default Results;