import InputForm from "./components/InputForm";

function App() {
  const handleSubmit = async (data) => {
    console.log("User data:", data);
  };

  return <InputForm onSubmit={handleSubmit} />;
}

export default App;