import { useState } from "react";
import {
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import "./Display_Component.css"; // Import the CSS file
import axios from "axios"; // For making API requests

const DisplayComponent = () => {
  const [filter, setFilter] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [filteredResponse, setFilteredResponse] = useState("");
  const [apiResponse, setApiResponse] = useState(null); // New state for storing API response
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setFilteredResponse("");
    setLoading(true);

    try {
      // Ensure the input is in valid JSON format
      const jsonData = JSON.parse(inputValue);
      if (
        !jsonData ||
        !Array.isArray(jsonData.data) ||
        !jsonData.data.every((item) => typeof item === "string")
      ) {
        setError("Invalid JSON format. Data should be an array of strings.");
        setLoading(false);
        return;
      }

      // Call the REST API
      const response = await axios.post(
        "https://akshat-bajaj-backend-1.onrender.com/bfhl",
        jsonData
      );
      const data = response.data;
      console.log(data);
      setApiResponse(data); // Store the API response in state

      // Filter response based on selected options
      const filters = {
        Alphabets: (item) => /^[A-Za-z]$/.test(item),
        Numbers: (item) => !isNaN(item),
        "Highest lowercase alphabet": (item) => /^[a-z]$/.test(item),
      };

      const selectedFilters = filter.map((f) => filters[f] || (() => false));
      const filteredData = jsonData.data.filter((item) =>
        selectedFilters.some((filterFunc) => filterFunc(item))
      );

      setFilteredResponse(filteredData.join(","));
    } catch (err) {
      console.log(err);
      setError("Failed to process request or invalid JSON.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <TextField
        className="input-field"
        variant="outlined"
        label="API Input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        error={!!error}
        helperText={error}
      />
      <Button
        className="submit-button"
        variant="contained"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Processing..." : "Submit"}
      </Button>

      <FormControl fullWidth className="filter-select">
        <InputLabel>Multi Filter</InputLabel>
        <Select
          multiple
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          renderValue={(selected) => selected.join(", ")}
          variant="outlined"
          label="Multi Filter"
        >
          <MenuItem value="Alphabets">Alphabets</MenuItem>
          <MenuItem value="Numbers">Numbers</MenuItem>
          <MenuItem value="Highest lowercase alphabet">
            Highest lowercase alphabet
          </MenuItem>
        </Select>
      </FormControl>

      <div className="response-container">
        <h3>Filtered Response</h3>
        <p>{filteredResponse}</p>

        <h3>API Response</h3>
        {apiResponse && <pre>{JSON.stringify(apiResponse, null, 2)}</pre>}
      </div>
    </div>
  );
};

export default DisplayComponent;
