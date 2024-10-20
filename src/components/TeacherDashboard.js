import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import DOMPurify from 'dompurify';

export default function CreateQuestion({ refreshQuestions }) {
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState([{ value: '' }]); // Dynamic array for options
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null); // To store index of selected correct answer

  // Add a new option field
  const addOption = () => {
    if (options.length < 4) {
      setOptions([...options, { value: '' }]);
    } else {
      toast.error('You can only add up to 4 options.');
    }
  };

  // Remove an option field
  const removeOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);

    // If removing the selected correct answer, reset the correct answer index
    if (index === correctAnswerIndex) {
      setCorrectAnswerIndex(null);
    }
  };

  // Handle changes in option input
  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index].value = DOMPurify.sanitize(value);
    setOptions(updatedOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Sanitize inputs
    const sanitizedQuestionText = DOMPurify.sanitize(questionText);
    const sanitizedOptions = options.map(opt => DOMPurify.sanitize(opt.value)).filter(Boolean); // Ensure all options are valid

    // Validation
    if (!sanitizedQuestionText || correctAnswerIndex === null || sanitizedOptions.length < 2) {
      toast.error('Please fill in the question, at least two options, and select a correct answer.');
      return;
    }

    try {
      const questionData = {
        questionText: sanitizedQuestionText,
        options: sanitizedOptions, // Send sanitized options array
        correctAnswer: sanitizedOptions[correctAnswerIndex], // Correct answer is the selected option
      };

      await axios.post('http://localhost:5000/api/create/question', questionData, {
        headers: { Authorization: localStorage.getItem('token') }, // Ensure token is set in localStorage
      });

      toast.success('Question created successfully!');
      setQuestionText('');
      setOptions([{ value: '' }]);
      setCorrectAnswerIndex(null);

      // Refresh questions after creation
      if (refreshQuestions) {
        refreshQuestions();
      }
    } catch (error) {
      console.error('Error creating question:', error);
      toast.error('Creation failed. Please try again.');
    }
  };

  return (
    <div>
      <ToastContainer />
      <p className='text-2xl mb-5'>ADD Question</p>
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
          placeholder="Question Text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          rows={3} // Adjust height with rows attribute
        />

        <div className="mb-4">
          
          {options.map((option, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option.value}
                onChange={(e) => handleOptionChange(index, e.target.value)}
              />

              {/* Radio button to select correct answer with label */}
              <label className="ml-2 flex items-center">
                <input
                  type="radio"
                  name="correctAnswer"
                  className="mr-1"
                  checked={correctAnswerIndex === index}
                  onChange={() => setCorrectAnswerIndex(index)}
                />
                Confirm this as the correct answer
              </label>

              {options.length > 2 && (
                <button
                  type="button"
                  className="ml-2 p-2 bg-red-500 text-white rounded"
                  onClick={() => removeOption(index)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          {options.length < 4 && (
            <button
              type="button"
              className="w-full mt-2 bg-green-500 text-white py-2 rounded hover:bg-green-600 transition duration-300"
              onClick={addOption}
            >
              Add Option
            </button>
          )}
        </div>

        <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300" type="submit">
          Create Question
        </button>
      </form>
    </div>
  );
}
