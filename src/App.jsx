import React, { useState } from "react";
import axios from "axios";

function App() {
  // State to manage student input, algorithm, and conversation history
  const [response, setResponse] = useState("");  // For student input
  const [algorithm, setAlgorithm] = useState("Quick Sort");  // Default algorithm
  const [history, setHistory] = useState([]);  // Empty array to store conversation history
  const [aiResponse, setAiResponse] = useState("");  // For storing AI response
  const [loading, setLoading] = useState(false);  // Loading state for the submit button
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      // Send the POST request to the backend API
      const res = await axios.post("http://127.0.0.1:8000/ai-response", {
        response: response,       // User's input response
        algorithm: algorithm,     // Algorithm selected by the user
        history: history,         // Previous conversation history (must be updated after every response)
      });
  
      // Update AI response and conversation history
      setAiResponse(res.data.ai_response);
      setHistory(res.data.updated_history);  // Update the history from backend response

      console.log("Student Response:", response);
      console.log("Algorithm:", algorithm);
      console.log("History:", history);
      setResponse("");  // Clear the student response after each submission for new input
      setHistory([]);
    } catch (error) {
      console.error("Error fetching AI response:", error.response ? error.response.data : error);
    }
  
    setLoading(false);
  };
  

  return (
    <div className="App" style={{ padding: "20px" }}>
      <h1>Socratic AI Assistant</h1>

      {/* Form for user input */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Student Response:</label>
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            required
            style={{ width: "100%", height: "80px", marginBottom: "10px" }}
          />
        </div>

        <div>
          <label>Algorithm:</label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            required
            style={{ width: "100%", height: "40px", marginBottom: "10px" }}
          >
            <option value="Quick Sort">Quick Sort</option>
            <option value="Merge Sort">Merge Sort</option>
            <option value="Fibonacci">Fibonacci</option>
            <option value="Recursion">Recursion</option>
          </select>
        </div>

        <button type="submit" style={{ width: "100%", height: "40px" }}>
          {loading ? "Processing..." : "Submit"}
        </button>
      </form>

      {/* Display AI Response */}
      <div style={{ marginTop: "20px" }}>
        <h3>AI Follow-up Question:</h3>
        <p>{aiResponse}</p>
      </div>

      {/* Display Conversation History */}
      <div style={{ marginTop: "20px" }}>
        <h3>Conversation History:</h3>
        <ul>
          {history.map((entry, index) => (
            <li key={index}>{entry}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
