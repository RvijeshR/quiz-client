// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { toast, ToastContainer } from 'react-toastify';

// export default function ListQuestions() {
//     const [questions, setQuestions] = useState([]);
//     const [selectedQuestion, setSelectedQuestion] = useState(null); // Store selected question for editing
//     const [isEditing, setIsEditing] = useState(false); // State to control modal visibility
//     const [formData, setFormData] = useState({ questionText: '', options: [], correctAnswer: '' }); // Store form data for editing

//     useEffect(() => {
//         fetchQuestions();
//     }, []);

//     const fetchQuestions = async () => {
//         try {
//             const response = await axios.get('http://localhost:5000/api/get/question', {
//                 headers: { Authorization: localStorage.getItem('token') },
//             });

//             const formattedQuestions = response.data.questions.map((q) => {
//                 let parsedOptions;
//                 try {
//                     // First, remove the outer quotes and parse the stringified array
//                     const innerString = q.options.replace(/^"|"$|\\/g, '');
//                     parsedOptions = JSON.parse(innerString);
//                 } catch (error) {
//                     console.error('Error parsing options:', error);
//                     parsedOptions = []; // Default to an empty array on error
//                 }

//                 return {
//                     ...q,
//                     options: Array.isArray(parsedOptions) ? parsedOptions : [], // Ensure options is an array
//                 };
//             });

//             setQuestions(formattedQuestions);
//         } catch (error) {
//             console.error('Error fetching questions:', error);
//             toast.error('Error fetching questions.');
//         }
//     };

//     const handleEdit = (question) => {
//         // Populate form data with selected question's details
//         setFormData({
//             questionText: question.questionText,
//             options: question.options,
//             correctAnswer: question.correctAnswer,
//         });
//         setSelectedQuestion(question.id); // Store the ID of the question being edited
//         setIsEditing(true); // Show the modal
//     };

//     const handleDelete = async (id) => {
//         try {
//             await axios.delete(`http://localhost:5000/api/delete/question/${id}`, {
//                 headers: { Authorization: localStorage.getItem('token') },
//             });
//             toast.success('Question deleted successfully!');
//             fetchQuestions(); // Refresh the list after deletion
//         } catch (error) {
//             console.error('Error deleting question:', error);
//             toast.error('Error deleting question.');
//         }
//     };

//     const handleFormChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
//     };

//     const handleUpdate = async (e) => {
//         e.preventDefault();
//         try {
//             await axios.put(`http://localhost:5000/api/edit/question/${selectedQuestion}`, {
//                 ...formData,
//                 options: JSON.stringify(formData.options), // Convert options back to JSON string
//             }, {
//                 headers: { Authorization: localStorage.getItem('token') },
//             });
//             toast.success('Question updated successfully!');
//             setIsEditing(false); // Close the modal
//             fetchQuestions(); // Refresh the list after update
//         } catch (error) {
//             console.error('Error updating question:', error);
//             toast.error('Error updating question.');
//         }
//     };

//     return (
//         <div>
//             <ToastContainer />
//             <h2 className="text-xl font-semibold mb-2">Existing Questions:</h2>
//             <div className="space-y-4">
//                 {questions.map((q) => (
//                     <div key={q.id} className="p-4 border border-gray-300 rounded shadow-md bg-white flex justify-between">
//                         <div className="flex-1"> {/* Allow this div to take the available space */}
//                             <strong className="block mb-2">{q.questionText}</strong>
//                             <ul className="list-decimal pl-5 mb-2">
//                                 {q.options.map((option, idx) => (
//                                     <li key={idx}>{` ${option}`}</li>
//                                     // <li key={idx}>{`${String.fromCharCode(65 + idx)}: ${option}`}</li>
//                                 ))}
//                             </ul>
//                         </div>
//                         <div className="flex flex-col justify-between ml-4"> {/* Right side for correct answer and buttons */}
//                             <p className="text-gray-400 mb-2 ">{`Correct Answer: ${q.correctAnswer}`}</p>
//                             <div className="flex space-x-2">
//                                 <button
//                                     onClick={() => handleEdit(q)}
//                                     className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
//                                 >
//                                     Edit
//                                 </button>
//                                 <button
//                                     onClick={() => handleDelete(q.id)}
//                                     className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
//                                 >
//                                     Delete
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 ))}

//             </div>

//             {/* Edit Modal */}
//             {isEditing && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//                     <div className="bg-white p-6 rounded shadow-lg w-1/3">
//                         <h2 className="text-lg font-semibold mb-4">Edit Question</h2>
//                         <form onSubmit={handleUpdate}>
//                             <div className="mb-4">
//                                 <label className="block mb-1">Question Text</label>
//                                 <input
//                                     type="text"
//                                     name="questionText"
//                                     value={formData.questionText}
//                                     onChange={handleFormChange}
//                                     className="border border-gray-300 rounded p-2 w-full"
//                                     required
//                                 />
//                             </div>
//                             {formData.options.map((option, idx) => (
//                                 <div key={idx} className="mb-4">
//                                     <label className="block mb-1">{`Option ${String.fromCharCode(65 + idx)}`}</label>
//                                     <input
//                                         type="text"
//                                         value={option}
//                                         onChange={(e) => {
//                                             const updatedOptions = [...formData.options];
//                                             updatedOptions[idx] = e.target.value;
//                                             setFormData({ ...formData, options: updatedOptions });
//                                         }}
//                                         className="border border-gray-300 rounded p-2 w-full"
//                                         required
//                                     />
//                                 </div>
//                             ))}
//                             <div className="mb-4">
//                                 <label className="block mb-1">Correct Answer (A, B, C, or D)</label>
//                                 <input
//                                     type="text"
//                                     name="correctAnswer"
//                                     value={formData.correctAnswer}
//                                     onChange={handleFormChange}
//                                     className="border border-gray-300 rounded p-2 w-full"
//                                     required
//                                 />
//                             </div>
//                             <div className="flex justify-end">
//                                 <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300">
//                                     Submit
//                                 </button>
//                                 <button
//                                     type="button"
//                                     onClick={() => setIsEditing(false)}
//                                     className="ml-2 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition duration-300"
//                                 >
//                                     Cancel
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

export default function ListQuestions() {
    const [questions, setQuestions] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState(null); 
    const [isEditing, setIsEditing] = useState(false); 
    const [formData, setFormData] = useState({ questionText: '', options: [], correctAnswer: '' });

    useEffect(() => {
        fetchQuestions();
    }, []);

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

                return {
                    ...q,
                    options: Array.isArray(parsedOptions) ? parsedOptions : [],
                };
            });

            setQuestions(formattedQuestions);
        } catch (error) {
            console.error('Error fetching questions:', error);
            toast.error('Error fetching questions.');
        }
    };

    const handleEdit = (question) => {
        setFormData({
            questionText: question.questionText,
            options: question.options,
            correctAnswer: question.correctAnswer,
        });
        setSelectedQuestion(question.id);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/delete/question/${id}`, {
                headers: { Authorization: localStorage.getItem('token') },
            });
            toast.success('Question deleted successfully!');
            fetchQuestions();
        } catch (error) {
            console.error('Error deleting question:', error);
            toast.error('Error deleting question.');
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/edit/question/${selectedQuestion}`, {
                ...formData,
                options: JSON.stringify(formData.options),
            }, {
                headers: { Authorization: localStorage.getItem('token') },
            });
            toast.success('Question updated successfully!');
            setIsEditing(false);
            fetchQuestions();
        } catch (error) {
            console.error('Error updating question:', error);
            toast.error('Error updating question.');
        }
    };

    return (
        <div>
            <ToastContainer />
            <h2 className="text-xl font-semibold mb-2">Existing Questions:</h2>
            <div className="space-y-4">
                {questions.map((q) => (
                    <div key={q.id} className="p-4 border border-gray-300 rounded shadow-md bg-white flex justify-between">
                        <div className="flex-1">
                            <strong className="block mb-2">{q.questionText}</strong>
                            <ul className="list-decimal pl-5 mb-2">
                                {q.options.map((option, idx) => (
                                    <li key={idx}>{` ${option}`}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex flex-col justify-between ml-4">
                            <p className="text-gray-400 mb-2">{`Correct Answer: ${q.correctAnswer}`}</p>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEdit(q)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(q.id)}
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 max-w-lg">
                        <h2 className="text-lg font-semibold mb-4">Edit Question</h2>
                        <form onSubmit={handleUpdate}>
                            <div className="mb-4">
                                <label className="block mb-1">Question Text</label>
                                <textarea
                                    name="questionText"
                                    value={formData.questionText}
                                    onChange={handleFormChange}
                                    className="border border-gray-300 rounded p-2 w-full"
                                    required
                                    rows="3"
                                />
                            </div>
                            {formData.options.map((option, idx) => (
                                <div key={idx} className="mb-4 flex items-center">
                                    <input
                                        type="radio"
                                        name="correctAnswer"
                                        value={option}
                                        checked={formData.correctAnswer === option}
                                        onChange={handleFormChange}
                                        className="mr-2"
                                    />
                                    <label className="block mb-1">{`Option ${String.fromCharCode(65 + idx)}`}</label>
                                    <input
                                        type="text"
                                        value={option}
                                        onChange={(e) => {
                                            const updatedOptions = [...formData.options];
                                            updatedOptions[idx] = e.target.value;
                                            setFormData({ ...formData, options: updatedOptions });
                                        }}
                                        className="border border-gray-300 rounded p-2 w-full"
                                        required
                                    />
                                </div>
                            ))}
                            <div className="mb-4">
                                <label className="block mb-1">Select Correct Answer</label>
                                <p className="text-gray-500 mb-2">Choose the correct answer from the options above.</p>
                            </div>
                            <div className="flex justify-end">
                                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300">
                                    Submit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="ml-2 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition duration-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
