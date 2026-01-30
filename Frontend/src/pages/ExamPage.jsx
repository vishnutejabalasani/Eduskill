import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Loader2, ArrowLeft, CheckCircle, XCircle, Award, AlertTriangle } from 'lucide-react';
import Certificate from '../components/common/Certificate';
import { useAuth } from '../context/AuthContext';

const ExamPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({}); // { 0: 1, 1: 3 } (questionIndex: selectedOptionIndex)
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null); // { passed, score, certificate }
    const { user } = useAuth();

    // Proctoring State
    const [warnings, setWarnings] = useState(0);
    const MAX_WARNINGS = 3;

    useEffect(() => {
        const fetchExam = async () => {
            try {
                const res = await api.get(`/courses/${id}/exam`);
                setTitle(res.data.data.title);
                setQuestions(res.data.data.questions);
            } catch (err) {
                console.error(err);
                alert("Failed to load exam or exam not found.");
                navigate(`/courses/${id}`);
            } finally {
                setLoading(false);
            }
        };
        fetchExam();
    }, [id, navigate]);

    // Proctoring Logic
    useEffect(() => {
        if (loading || result || submitting) return;

        const handleViolation = () => {
            setWarnings(prev => {
                const newCount = prev + 1;
                if (newCount >= MAX_WARNINGS) {
                    handleSubmit(true); // Auto-submit
                }
                return newCount;
            });
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                handleViolation();
            }
        };

        const handleBlur = () => {
            handleViolation();
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleBlur);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("blur", handleBlur);
        };
    }, [loading, result, submitting]);

    const handleSelect = (qIndex, oIndex) => {
        setAnswers({ ...answers, [qIndex]: oIndex });
    };

    const handleSubmit = async (autoSubmit = false) => {
        if (!autoSubmit && Object.keys(answers).length < questions.length) {
            return alert("Please answer all questions before submitting.");
        }

        if (!autoSubmit && !window.confirm("Are you sure you want to submit? You cannot change answers after submission.")) return;

        setSubmitting(true);
        try {
            // Convert answers object to array based on index
            const answerArray = questions.map((_, i) => answers[i]);

            const res = await api.post(`/courses/${id}/exam/submit`, { answers: answerArray });
            setResult(res.data.data);
            if (autoSubmit) {
                alert("Exam auto-submitted due to proctoring violations (Tab switching/Focus loss).");
            }
        } catch (err) {
            alert(err.response?.data?.message || "Submission failed");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center bg-[#0a0a0a]"><Loader2 className="animate-spin text-[#00E676]" /></div>;

    if (result) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4">
                <div className="bg-white/5 border border-white/10 p-8 rounded-2xl max-w-5xl w-full text-center">
                    {result.passed ? (
                        <>
                            <Award size={64} className="mx-auto text-[#00E676] mb-4" />
                            <h2 className="text-3xl font-bold mb-2">Congratulations!</h2>
                            <p className="text-gray-300 mb-8">You passed the exam with a score of <span className="text-[#00E676] font-bold">{result.score}%</span>.</p>

                            <div className="mb-8 overflow-hidden w-full flex justify-center">
                                {/* Fully visible landscape certificate (3300px * 0.28 ~= 924px width) */}
                                <div className="transform origin-top scale-[0.18] md:scale-[0.22] lg:scale-[0.28] h-[480px] md:h-[580px] lg:h-[730px] w-[3300px]">
                                    <Certificate
                                        studentName={user?.name || "Student Name"}
                                        courseName={title || "Course Title"}
                                        date={new Date()}
                                        certificateId={result.certificate?.certificateId}
                                        score={result.score}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={() => window.print()}
                                className="bg-[#00E676] text-black w-full py-3 rounded-xl font-bold hover:bg-[#00c853] transition-colors mb-4"
                            >
                                Download / Print Certificate
                            </button>
                        </>
                    ) : (
                        <>
                            <XCircle size={64} className="mx-auto text-red-500 mb-4" />
                            <h2 className="text-3xl font-bold mb-2">Exam Failed</h2>
                            <p className="text-gray-300 mb-6">You scored <span className="text-red-500 font-bold">{result.score}%</span>. You need 70% to pass.</p>

                            <button
                                onClick={() => setResult(null)}
                                className="bg-white text-black w-full py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                            >
                                Try Again
                            </button>
                        </>
                    )}

                    <button onClick={() => navigate(`/courses/${id}`)} className="text-gray-400 hover:text-white mt-4 text-sm underline">
                        Back to Course
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white py-12 px-4 md:px-8">
            <div className="max-w-3xl mx-auto">
                <button onClick={() => navigate(`/courses/${id}`)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8">
                    <ArrowLeft size={20} /> Back to Course
                </button>

                {/* Proctoring Warning UI */}
                {warnings > 0 && warnings < 3 && (
                    <div className="mb-6 bg-red-500/10 border border-red-500/50 p-4 rounded-xl flex items-center gap-4 animate-pulse">
                        <AlertTriangle className="text-red-500 shrink-0" size={24} />
                        <div>
                            <h3 className="text-red-500 font-bold">Proctoring Warning ({warnings}/3)</h3>
                            <p className="text-sm text-gray-300">Do not switch tabs or lose focus. The exam will auto-submit after 3 warnings.</p>
                        </div>
                    </div>
                )}

                <h1 className="text-3xl font-bold mb-2">{title} - Certification Exam</h1>
                <p className="text-gray-400 mb-8">Answer all {questions.length} questions. Pass mark: 70%.</p>

                <div className="space-y-6">
                    {questions.length === 0 && (
                        <div className="text-center py-10 bg-white/5 rounded-xl border border-white/10">
                            <p className="text-gray-400">No questions found for this exam.</p>
                            <p className="text-sm text-gray-500 mt-2">Please ask the instructor to add questions.</p>
                        </div>
                    )}
                    {questions.map((q, qIndex) => (
                        <div key={qIndex} className="bg-white/5 border border-white/10 p-6 rounded-xl">
                            <h3 className="text-lg font-bold mb-4 flex gap-3">
                                <span className="text-[#00E676]">{qIndex + 1}.</span>
                                {q.question}
                            </h3>
                            <div className="space-y-3">
                                {q.options.map((opt, oIndex) => (
                                    <label
                                        key={oIndex}
                                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${answers[qIndex] === oIndex
                                            ? 'bg-[#00E676]/10 border-[#00E676]'
                                            : 'bg-black/30 border-transparent hover:bg-white/5'
                                            }`}
                                    >
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${answers[qIndex] === oIndex ? 'border-[#00E676]' : 'border-gray-500'
                                            }`}>
                                            {answers[qIndex] === oIndex && <div className="w-3 h-3 rounded-full bg-[#00E676]"></div>}
                                        </div>
                                        <input
                                            type="radio"
                                            name={`question-${qIndex}`}
                                            checked={answers[qIndex] === oIndex}
                                            onChange={() => handleSelect(qIndex, oIndex)}
                                            className="hidden"
                                        />
                                        <span className={answers[qIndex] === oIndex ? 'text-white' : 'text-gray-300'}>{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-10 flex justify-end">
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="bg-[#00E676] text-black px-8 py-3 rounded-xl font-bold hover:bg-[#00c853] transition-colors flex items-center gap-2"
                    >
                        {submitting ? <Loader2 className="animate-spin" /> : <CheckCircle />} Submit Exam
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExamPage;
