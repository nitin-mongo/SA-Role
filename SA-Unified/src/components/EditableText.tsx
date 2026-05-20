interface Props {
  value: string;
  onChange: (v: string) => void;
  isEditing: boolean;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
}

export default function EditableText({ value, onChange, isEditing, className, multiline, placeholder }: Props) {
  if (!isEditing) return <>{value}</>;

  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`editable-field ${className || ''}`}
        placeholder={placeholder || 'Enter text...'}
        rows={3}
      />
    );
  }

  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`editable-field ${className || ''}`}
      placeholder={placeholder || 'Enter text...'}
    />
  );
}
