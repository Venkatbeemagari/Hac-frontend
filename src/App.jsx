import React, { useState } from "react";
import axios from "axios";

function App() {
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
      setHistory([
        z̧
      ]);  // Update the history from backend response

      setResponse("");  // Clear the student response after each submission for new input
    } catch (error) {
      console.error("Error fetching AI response:", error.response ? error.response.data : error);
    }
  
    setLoading(false);
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh", // Use full viewport height
      width: "100vw",  // Use full viewport width
      margin: "0",     // Remove default margin
      background: "linear-gradient(135deg, #7A60C7, #6B8DE3)",
      color: "white",
      fontFamily: "Arial, sans-serif"
    }}>
      <div style={{
        padding: "30px",
        width: "90%",
        maxWidth: "600px",
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "10px",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)"
      }}>
        <header style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "20px"
        }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>Socratic Teach AI</h1>
          <div>
            <select 
              value={algorithm} 
              onChange={(e) => setAlgorithm(e.target.value)} 
              style={{
                padding: "10px",
                borderRadius: "5px",
                background: "#fff",
                color: "#333"
              }}>
              <option value="Quick Sort">Quick Sort</option>
              <option value="Merge Sort">Merge Sort</option>
              <option value="Bubble Sort">Bubble Sort</option>
              <option value="Selection Sort">Selection Sort</option>
              <option value="Radix Sort">Radix Sort</option>
              <option value="Insertion Sort">Insertion Sort</option>
              <option value="Heap Sort">Heap Sort</option>
            </select>
          </div>
        </header>

        <form onSubmit={handleSubmit} style={{
          background: "rgba(255, 255, 255, 0.2)",
          borderRadius: "8px",
          padding: "20px"
        }}>
          <div style={{ marginBottom: "10px" }}>
            <label>Student Response:</label>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              required
              style={{
                width: "100%",
                height: "80px",
                marginBottom: "10px",
                padding: "10px",
                borderRadius: "5px",
                border: "none",
                outline: "none",
                resize: "none"
              }}
              placeholder="Ask about DSA..."
            />
          </div>

          <button 
            type="submit" 
            style={{
              width: "100%",
              height: "40px",
              backgroundColor: "#4A90E2",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px"
            }}>
            {loading ? "Processing..." : "Send"}
          </button>
        </form>

        <div style={{ marginTop: "20px" }}>
          <h3>AI Follow-up Question:</h3>
          <p style={{
            background: "rgba(255, 255, 255, 0.2)",
            padding: "15px",
            borderRadius: "5px"
          }}>
            {aiResponse || "No response yet."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
