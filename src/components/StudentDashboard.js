import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

export default function StudentQuiz() {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Step-by-step navigation
    const [answers, setAnswers] = useState({}); // To store selected answers
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [score, setScore] = useState(null); // For displaying the score after submission
    const [previousScore, setPreviousScore] = useState(0); // Default to 0 for previous score
    const [quizStarted, setQuizStarted] = useState(false); // To track if the quiz has started

    useEffect(() => {
        fetchPreviousScore(); // Fetch previous score on mount
        fetchQuestions(); // Fetch questions
    }, []);

    const fetchPreviousScore = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const userId = user.id;
            const response = await axios.get(`http://localhost:5000/api/get/previous-score/${userId}`, {
                headers: { Authorization: localStorage.getItem('token') },
            });
            // Set previous score; if no score exists, set to 0
            setPreviousScore(response.data.lastScore ? response.data.lastScore.score : 0);
        } catch (error) {
            console.error('Error fetching previous score:', error);
            // toast.error('Error fetching previous score.');
            setPreviousScore(0); // Set to 0 in case of error
        }
    };

    const fetchQuestions = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/get/question', {
                headers: { Authorization: localStorage.getItem('token') },
            });
            const formattedQuestions = response.data.questions.map((q) => {
                let parsedOptions;
                try {
                    const innerString = q.options.replace(/^"|"$|\\/g, '');
                    parsedOptions = JSON.parse(innerString);
                } catch (error) {
                    console.error('Error parsing options:', error);
                    parsedOptions = [];
                }
                return { ...q, options: Array.isArray(parsedOptions) ? parsedOptions : [] };
            });
            setQuestions(formattedQuestions);
        } catch (error) {
            console.error('Error fetching questions:', error);
            // toast.error('Error fetching questions.');
        }
    };

    const handleAnswerChange = (questionId, selectedOption) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: selectedOption, // Store the selected answer
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user.id;
        // Calculate the score
        let calculatedScore = 0;
        questions.forEach((q) => {
            if (answers[q.id] === q.correctAnswer) {
                calculatedScore += 1;
            }
        });

        const submissionData = {
            userId,
            answers,
            score: calculatedScore,
        };

        try {
            await axios.post('http://localhost:5000/api/submit/answers', submissionData, {
                headers: { Authorization: localStorage.getItem('token') },
            });
            setScore(calculatedScore);
            toast.success('Answers submitted successfully!');
        } catch (error) {
            console.error('Error submitting answers:', error);
            toast.error('Error submitting answers.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    // Reset the quiz to the initial state
    const handleRetest = () => {
        setCurrentQuestionIndex(0);
        setAnswers({});
        setScore(null);
        setQuizStarted(false); // Reset quiz start status
    };

    const handleStartQuiz = () => {
        setQuizStarted(true); // Set quiz to started
        setCurrentQuestionIndex(0); // Reset question index for the quiz
    };

    return (
        <div>
            <ToastContainer />
            {!quizStarted && (
                <div className="p-4 border border-gray-300 rounded shadow-md bg-white">
                    <h3 className="text-xl font-semibold mb-2">Previous Score</h3>
                    <p>Your Last Score: {previousScore}</p>
                    <button
                        onClick={handleStartQuiz}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Start Quiz
                    </button>
                </div>
            )}
            {quizStarted && (
                <>
                    {score !== null && (
                        <div className="p-4 border border-green-500 rounded shadow-md bg-white">
                            <h3 className="text-xl font-semibold mb-2">Quiz Completed!</h3>
                            <p>Your Score: {score}/{questions.length}</p>
                            <button
                                onClick={handleRetest}
                                className="mt-4 px-4 py-2 bg-orange-500 text-white rounded"
                            >
                                Retest
                            </button>
                        </div>
                    )}
                    {questions.length > 0 && score === null && (
                        <div className="p-4 border border-gray-300 rounded shadow-md bg-white">
                            <h3 className="text-xl font-semibold mb-2">{questions[currentQuestionIndex]?.questionText}</h3>
                            <ul className="mb-4">
                                {questions[currentQuestionIndex]?.options.map((option, idx) => (
                                    <li key={idx} className="mb-2">
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                name={`question-${questions[currentQuestionIndex].id}`}
                                                value={option}
                                                checked={answers[questions[currentQuestionIndex].id] === option}
                                                onChange={() => handleAnswerChange(questions[currentQuestionIndex].id, option)}
                                                className="form-radio"
                                            />
                                            <span className="ml-2">{option}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>

                            <div className="flex justify-between">
                                {currentQuestionIndex > 0 && (
                                    <button
                                        onClick={handlePreviousQuestion}
                                        className="px-4 py-2 bg-gray-500 text-white rounded"
                                    >
                                        Previous
                                    </button>
                                )}
                                {currentQuestionIndex < questions.length - 1 ? (
                                    <button
                                        onClick={handleNextQuestion}
                                        className="px-4 py-2 bg-blue-500 text-white rounded"
                                    >
                                        Next
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="px-4 py-2 bg-green-500 text-white rounded"
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit'}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
