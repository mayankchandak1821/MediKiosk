import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, Loader2, Send, Sparkles } from 'lucide-react';

const API_URL = 'http://localhost:5000/api/ai/next-question';

export default function AIQuestionPanel({
  chiefComplaint,
  careMode,
  module,
  onAnswer,
  onFallback,
  onComplete
}) {
  const [question, setQuestion] = useState({
    question_text: 'What is the main purpose of your visit today?',
    target_field: 'visit_purpose',
    field_category: 'visit_context',
    intake_complete: false
  });
  const [answer, setAnswer] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState('');

  const requestQuestion = async (priorQa, lastAnswer) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chief_complaint: chiefComplaint,
          track: careMode,
          module,
          prior_qa: priorQa,
          last_answer: lastAnswer
        })
      });
      const data = await response.json();
      if (!response.ok || !data.success || !data.question) {
        throw new Error(data.error || 'AI question generation unavailable');
      }
      console.debug('[OLLAMA_OK]', data.question.reasoning_note || '');
      setQuestion(data.question);
      if (data.question.intake_complete) {
        setComplete(true);
        onComplete?.();
      }
    } catch (requestError) {
      console.warn('[AI_FALLBACK]', requestError);
      setError('Local AI is unavailable. Continuing with the decision tree.');
      onFallback?.();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setQuestion({
      question_text: 'What is the main purpose of your visit today?',
      target_field: 'visit_purpose',
      field_category: 'visit_context',
      intake_complete: false
    });
    setAnswer('');
    setHistory([]);
    setComplete(false);
    setError('');
  }, [chiefComplaint]);

  const submitAnswer = async (event) => {
    event.preventDefault();
    const trimmedAnswer = answer.trim();
    if (!question || !trimmedAnswer || loading) return;

    const nextHistory = [
      ...history,
      { question_text: question.question_text, answer_value: trimmedAnswer }
    ];
    setHistory(nextHistory);
    onAnswer?.(question.target_field, trimmedAnswer);
    setAnswer('');
    await requestQuestion(nextHistory, trimmedAnswer);
  };

  return (
    <div className="bg-slate-950 border-2 border-teal-500/30 rounded-3xl p-5 md:p-6 shadow-2xl space-y-5">
      <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-100 text-base">AI Clinical Follow-up</h3>
            <p className="text-xs text-slate-400">Local Ollama questioning from question {history.length + 5}</p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-300 font-mono text-xs font-bold border border-teal-500/30">
          QWEN3:8B
        </span>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-200 text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-sm text-teal-300">
          <Loader2 className="w-4 h-4 animate-spin" /> Generating the next clinical question...
        </div>
      )}

      {complete ? (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-sm">
          <CheckCircle2 className="w-5 h-5" /> Follow-up intake is complete.
        </div>
      ) : question && !loading && (
        <form onSubmit={submitAnswer} className="space-y-4">
          <label className="block text-sm font-bold text-slate-100" htmlFor="ai-follow-up-answer">
            {question.question_text}
          </label>
          <textarea
            id="ai-follow-up-answer"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            rows={3}
            placeholder="Describe your answer in your own words"
            className="w-full rounded-xl bg-slate-900 border border-slate-700 p-3 text-sm text-slate-100 outline-none focus:border-teal-400"
          />
          <button
            type="submit"
            disabled={!answer.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-400 text-slate-950 font-bold text-xs disabled:bg-slate-800 disabled:text-slate-500"
          >
            <Send className="w-4 h-4" /> Save answer & continue
          </button>
        </form>
      )}
    </div>
  );
}
