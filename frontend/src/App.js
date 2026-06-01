import { useState } from "react";
import InputForm from "./components/InputForm";
import Results from "./components/Results";

function App() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      // fetch() sends data to Satyam's backend
      // method POST means we're sending data, not just reading
      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.error) {
        setError("AI analysis failed. Please try again.");
      } else {
        setResults(result);
      }

    } catch (err) {
      // This runs if backend is not reachable
      setError("Could not connect to server. Make sure backend is running!");
    }

    setLoading(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-purple-400 text-xl font-semibold">Analyzing your skill gap...</p>
      <p className="text-gray-500 text-sm">Gemini AI is building your personal learning path ✨</p>
      <p className="text-gray-600 text-xs mt-2">This takes about 10-15 seconds</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4">
      <p className="text-red-400 text-xl">❌ {error}</p>
      <button
        onClick={() => setError(null)}
        className="bg-purple-600 text-white px-6 py-2 rounded-xl"
      >
        Try Again
      </button>
    </div>
  );

  if (results) return <Results data={results} onReset={() => setResults(null)} />;

  return <InputForm onSubmit={handleSubmit} />;
}

export default App;