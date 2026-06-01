import { useState } from "react";

function SkillDashboard({ skills, onComplete }) {
  // unlockedIndex tracks which skill is currently active
  // Start at 0 — only first skill is unlocked
  const [unlockedIndex, setUnlockedIndex] = useState(0);
  const [completedSkills, setCompletedSkills] = useState([]);

  const handleMarkComplete = (skillName, index) => {
    // Add to completed list
    setCompletedSkills([...completedSkills, skillName]);
    // Unlock next skill
    setUnlockedIndex(index + 1);
  };

  // Small circular progress for each skill card
  const MiniCircle = ({ percentage, color = "#9333ea" }) => {
    const size = 56;
    const radius = 22;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    return (
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#374151" strokeWidth="5"/>
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color}
            strokeWidth="5" strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.8s ease" }}
          />
        </svg>
        <div className="absolute text-xs font-bold text-white">{percentage}%</div>
      </div>
    );
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
      <h2 className="text-purple-400 font-bold text-lg mb-6">🎯 Skill Progress Dashboard</h2>

      <div className="space-y-4">
        {skills.map((skill, index) => {
          const isCompleted = completedSkills.includes(skill.name);
          const isUnlocked = index <= unlockedIndex;
          const isLocked = !isUnlocked;
          const isCurrent = index === unlockedIndex && !isCompleted;

          // Determine progress percentage
          const progress = isCompleted ? 100 : isCurrent ? 0 : 0;

          // Determine status label and color
          const getStatus = () => {
            if (isCompleted) return { label: "✅ Completed", color: "text-green-400 bg-green-900" };
            if (isCurrent) return { label: "🔥 In Progress", color: "text-yellow-400 bg-yellow-900" };
            return { label: "🔒 Locked", color: "text-gray-500 bg-gray-800" };
          };
          const status = getStatus();

          return (
            <div
              key={index}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                isLocked
                  ? "border-gray-800 bg-gray-800 opacity-50"
                  : isCompleted
                  ? "border-green-800 bg-gray-900"
                  : "border-purple-700 bg-gray-900"
              }`}
            >
              {/* Skill number */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                isCompleted ? "bg-green-700 text-white" :
                isCurrent ? "bg-purple-700 text-white" :
                "bg-gray-700 text-gray-400"
              }`}>
                {isCompleted ? "✓" : index + 1}
              </div>

              {/* Mini progress circle */}
              <MiniCircle
                percentage={progress}
                color={isCompleted ? "#22c55e" : isCurrent ? "#9333ea" : "#374151"}
              />

              {/* Skill info */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className={`font-semibold ${isLocked ? "text-gray-500" : "text-white"}`}>
                    {skill.name}
                  </p>
                  {isLocked && <span className="text-gray-600 text-xs">🔒</span>}
                </div>
                <p className="text-gray-500 text-xs mt-0.5">{skill.estimatedHours} hrs estimated</p>
              </div>

              {/* Status badge */}
              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${status.color}`}>
                {status.label}
              </span>

              {/* Mark complete button — only for current skill */}
              {isCurrent && (
                <button
                  onClick={() => handleMarkComplete(skill.name, index)}
                  className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1.5 rounded-lg transition flex-shrink-0"
                >
                  Mark Done ✓
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* All completed message */}
      {completedSkills.length === skills.length && skills.length > 0 && (
        <div className="mt-6 text-center bg-green-900 border border-green-700 rounded-xl p-4">
          <p className="text-green-300 font-bold text-lg">🎉 All Skills Completed!</p>
          <p className="text-green-400 text-sm mt-1">You're ready to apply for this job!</p>
        </div>
      )}
    </div>
  );
}

export default SkillDashboard;