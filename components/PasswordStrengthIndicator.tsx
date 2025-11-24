'use client';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export default function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  if (!password) return null;

  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
  };

  const strength = Object.values(checks).filter(Boolean).length;
  const allPassed = Object.values(checks).every(Boolean);

  const getStrengthColor = () => {
    if (strength === 1) return 'bg-red-500';
    if (strength === 2) return 'bg-orange-500';
    if (strength === 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (strength === 1) return 'Weak';
    if (strength === 2) return 'Fair';
    if (strength === 3) return 'Good';
    return 'Strong';
  };

  return (
    <div className="space-y-2">
      {/* Strength bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: `${(strength / 4) * 100}%` }}
          />
        </div>
        <span className={`text-xs font-medium ${allPassed ? 'text-green-600' : 'text-gray-500'}`}>
          {getStrengthText()}
        </span>
      </div>

      {/* Requirements checklist */}
      <div className="space-y-1">
        <RequirementCheck met={checks.length} text="At least 8 characters" />
        <RequirementCheck met={checks.uppercase} text="One uppercase letter" />
        <RequirementCheck met={checks.lowercase} text="One lowercase letter" />
        <RequirementCheck met={checks.number} text="One number" />
      </div>
    </div>
  );
}

interface RequirementCheckProps {
  met: boolean;
  text: string;
}

function RequirementCheck({ met, text }: RequirementCheckProps) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <div
        className={`w-1.5 h-1.5 rounded-full ${
          met ? 'bg-green-500' : 'bg-gray-300'
        }`}
      />
      <span className={met ? 'text-green-600' : 'text-gray-500'}>{text}</span>
    </div>
  );
}
