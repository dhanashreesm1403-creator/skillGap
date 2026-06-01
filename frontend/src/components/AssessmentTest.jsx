import { useState } from "react";

function AssessmentTest({ skill, onPass, onFail, onClose }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // These are sample questions — later Gemini will generate real ones
  // Each skill gets 4 questions with 4 options each
  const questions = [
    {
      question: `What is the primary purpose of ${skill}?`,
      options: [
        "To style web pages",
        "To solve real-world problems efficiently",
        "To manage databases only",
        "To handle server requests only"
      ],
      correct: 1
    },
    {
      question: `Which of the following is a best practice in ${skill}?`,
      options: [
        "Writing duplicate code",
        "Ignoring error handling",
        "Writing clean, readable, reusable code",
        "Avoiding documentation"
      ],
      correct: 2
    },
    {
      question: `In ${skill}, what does debugging mean?`,
      options: [
        "Adding more features",
        "Finding and fixing errors in code",
        "Deleting unused files",
        "Writing new functions"
      ],
      correct: 1
    },
    {
      question: `What is a common use case for ${skill} in industry?`,
      options: [
        "Only for personal projects",
        "Building scalable production applications",
        "Only for academic purposes",
        "Replacing all other technologies"
      ],
      correct: 1
    }
  ];

  const handleSelect = (questionIndex, optionIndex) => {
    // Save selected answer for this question
    setSelectedAnswers({ ...selectedAnswers, [questionIndex]: optionIndex });
  };

  const handleSubmit = () => {
    // Calculate score — count correct answers
    let correct = 0;
    questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.correct) correct++;
    });

    // Score as percentage
    const percentage = Math.round((correct / questions.length) * 100);
    setScore(percentage);
    setSubmitted(true);

    // Pass = 75% or more
    if (percentage >= 75) {
      setTimeout(() => onPass(percentage), 2000);
    } else {
      setTimeout(() => onFail(percentage), 2000);
    }
  };

  const allAnswered = Object.keys(selectedAnswers).length === questions.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 w-full max-w-2xl max-h-screen overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-white font-bold text-xl">📝 {skill} Assessment</h2>
            <p className="text-gray-400 text-sm mt-1">Score 75% or above to unlock this skill</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-2xl">✕</button>
        </div>

        {/* Score result — shows after submission */}
        {submitted ? (
          <div className={`text-center py-8 rounded-xl ${score >= 75 ? "bg-green-900 border border-green-700" : "bg-red-900 border border-red-700"}`}>
            <div className="text-6xl font-extrabold text-white mb-2">{score}%</div>
            {score >= 75 ? (
              <>
                <p className="text-green-300 font-bold text-xl">🎉 Passed! Skill Unlocked!</p>
                <p className="text-green-400 text-sm mt-2">Moving to next skill...</p>
              </>
            ) : (
              <>
                <p className="text-red-300 font-bold text-xl">❌ Not Passed</p>
                <p className="text-red-400 text-sm mt-2">You need 75% to pass. Keep practicing!</p>
                <button
                  onClick={onClose}
                  className="mt-4 bg-red-700 hover:bg-red-600 text-white px-6 py-2 rounded-xl"
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        ) : (
          <>
            {/* Progress indicator */}
            <div className="flex gap-2 mb-6">
              {questions.map((_, i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full ${selectedAnswers[i] !== undefined ? "bg-purple-500" : "bg-gray-700"}`}/>
              ))}
            </div>

            {/* Questions */}
            <div className="space-y-6">
              {questions.map((q, qIndex) => (
                <div key={qIndex} className="bg-gray-800 rounded-xl p-5">
                  <p className="text-white font-semibold mb-4">
                    Q{qIndex + 1}. {q.question}
                  </p>
                  <div className="space-y-2">
                    {q.options.map((option, oIndex) => (
                      <button
                        key={oIndex}
                        onClick={() => handleSelect(qIndex, oIndex)}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm transition ${
                          selectedAnswers[qIndex] === oIndex
                            ? "bg-purple-700 border border-purple-500 text-white"
                            : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                        }`}
                      >
                        {String.fromCharCode(65 + oIndex)}. {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className="w-full mt-6 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition"
            >
              {allAnswered ? "Submit Test →" : `Answer all ${questions.length} questions to submit`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default AssessmentTest;