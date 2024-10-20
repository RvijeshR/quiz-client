// src/components/StudentQuiz.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function StudentQuiz() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  useEffect(() => {
    // Fetch quiz questions
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('/api/questions', {
          headers: { Authorization: localStorage.getItem('token') }
        });
        setQuestions(response.data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
    fetchQuestions();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const correctAnswers = questions.filter(
      (q) => q.correctAnswer === answers[q.id]
    ).length;
    setScore(correctAnswers);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Take Quiz</h1>
      {score !== null && <h2>Your Score: {score}/{questions.length}</h2>}
      <form onSubmit={handleSubmit}>
        {questions.map((q) => (
          <div key={q.id} className="mb-6">
            <h3>{q.questionText}</h3>
            {['A', 'B', 'C', 'D'].map((option) => (
              <div key={option}>
                <input
                  type="radio"
                  id={`${q.id}-${option}`}
                  name={`question-${q.id}`}
                  value={`option${option}`}
                  onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                />
                <label htmlFor={`${q.id}-${option}`}>{q[`option${option}`]}</label>
              </div>
            ))}
          </div>
        ))}
        <button className="w-full bg-blue-500 text-white py-2" type="submit">
          Submit Quiz
        </button>
      </form>
    </div>
  );
}
  