import React, { useState } from "react";

interface TagInputProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export default function TagInput({ label, values, onChange, placeholder }: TagInputProps) {
  const [draft, setDraft] = useState("");

  const addTag = () => {
    const tag = draft.trim();
    if (tag && !values.includes(tag)) {
      onChange([...values, tag]);
    }
    setDraft("");
  };

  const removeTag = (tag: string) => {
    onChange(values.filter((v) => v !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && draft === "" && values.length > 0) {
      removeTag(values[values.length - 1]);
    }
  };

  return (
    <div>
      <label>{label}</label>
      <div className="chip-row">
        {values.map((tag) => (
          <span key={tag} className="chip">
            {tag}{" "}
            <a onClick={() => removeTag(tag)} style={{ cursor: "pointer" }}>
              ×
            </a>
          </span>
        ))}
      </div>
      <input
        className="form-input"
        type="text"
        value={draft}
        placeholder={placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
      />
    </div>
  );
}
