import React from "react";
import { Eye, EyeOff } from "lucide-react";

interface Props {
  label: string;
  type?: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
  showToggle?: boolean;
  showPassword?: boolean;
  onToggle?: () => void;
}

const InputField: React.FC<Props> = ({
  label,
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  icon,
  showToggle,
  showPassword,
  onToggle,
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <div className="relative flex items-center">
      <span className="absolute left-3 text-gray-400">{icon}</span>
      <input
        type={showToggle ? (showPassword ? "text" : "password") : type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-9 pr-9 py-2.5 bg-white border border-gray-300 rounded-lg
                   text-gray-900 text-sm focus:outline-none focus:border-blue-500"
      />
      {showToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      )}
    </div>
  </div>
);

export default InputField;