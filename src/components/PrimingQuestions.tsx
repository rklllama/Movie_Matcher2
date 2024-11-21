import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { PRIMING_QUESTIONS } from '../lib/questions';
import { Button } from './ui/Button';
import type { PrimingQuestion } from '../types/party';

interface PrimingQuestionsProps {
  onComplete: (answers: Record<string, string[]>) => void;
}

export function PrimingQuestions({ onComplete }: PrimingQuestionsProps) {
  const [questions, setQuestions] = React.useState<PrimingQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, string[]>>({});
  const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);

  // Initialize with random questions on mount
  React.useEffect(() => {
    const shuffled = [...PRIMING_QUESTIONS]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    setQuestions(shuffled);
  }, []);

  const question = questions[currentQuestion];

  const handleOptionSelect = (value: string) => {
    if (value === 'any') {
      setSelectedOptions(['any']);
      return;
    }

    setSelectedOptions((prev) => {
      // Remove 'any' if it was previously selected
      const withoutAny = prev.filter(v => v !== 'any');
      
      if (prev.includes(value)) {
        const newSelection = withoutAny.filter(v => v !== value);
        // If no options left, default to 'any'
        return newSelection.length === 0 ? ['any'] : newSelection;
      } else {
        return [...withoutAny, value];
      }
    });
  };

  const handleNextQuestion = () => {
    if (!question) return;

    const newAnswers = {
      ...answers,
      [question.id]: selectedOptions,
    };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOptions([]);
    } else {
      onComplete(newAnswers);
    }
  };

  if (!question) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-lg space-y-6 rounded-xl bg-gray-900 p-6"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">{question.question}</h2>
        <p className="text-sm text-gray-400">
          Select all options that interest you
        </p>
        <div className="h-1 w-full rounded-full bg-gray-800">
          <div
            className="h-full rounded-full bg-red-500 transition-all"
            style={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
            }}
          />
        </div>
      </div>
      <div className="grid gap-3">
        {question.options.map((option) => (
          <Button
            key={option.value}
            onClick={() => handleOptionSelect(option.value)}
            variant={selectedOptions.includes(option.value) ? 'primary' : 'secondary'}
            className="flex items-center justify-between text-left"
          >
            <span>{option.text}</span>
            {selectedOptions.includes(option.value) && (
              <Check size={20} className="shrink-0" />
            )}
          </Button>
        ))}
      </div>
      <Button
        onClick={handleNextQuestion}
        disabled={selectedOptions.length === 0}
        size="lg"
        className="mt-6 w-full disabled:opacity-50"
      >
        {currentQuestion < questions.length - 1 ? 'Next Question' : 'Start Matching'}
      </Button>
    </motion.div>
  );
}