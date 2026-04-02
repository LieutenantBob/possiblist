interface AnswerOptionsProps {
  options: string[]
  onSelect: (index: number) => void
}

export function AnswerOptions({ options, onSelect }: AnswerOptionsProps) {
  return (
    <div className="flex flex-col gap-3" role="group" aria-label="Answer options">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => onSelect(index)}
          className="w-full text-left px-5 py-4 rounded-lg border transition-colors duration-150 cursor-pointer font-body"
          style={{
            backgroundColor: 'var(--cream)',
            borderColor: 'var(--deep-10)',
            color: 'var(--deep)',
            minHeight: '52px',
            fontSize: '1.05rem',
          }}
          aria-label={`Option ${index + 1}: ${option}`}
        >
          {option}
        </button>
      ))}
    </div>
  )
}
