// Predefined motivational quotes
const quotes = [
  "Small steps every day lead to big results.",
  "Consistency is the key to success.",
  "Your habits shape your future.",
  "Progress, not perfection.",
  "Every day is a fresh start.",
  "Build habits that build you.",
  "Stay consistent, stay strong.",
];

export function getRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

export function getTodayFormatted() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Generate a consistent color for a habit name
export function getHabitColor(name) {
  const colors = [
    'bg-rose-500',
    'bg-orange-500',
    'bg-amber-500',
    'bg-emerald-500',
    'bg-teal-500',
    'bg-cyan-500',
    'bg-sky-500',
    'accent-bg-500',
    'accent-bg-500',
    'bg-fuchsia-500',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

// Get first letter(s) for avatar
export function getInitials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
