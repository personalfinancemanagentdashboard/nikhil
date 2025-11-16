import ThemeToggle from '../ThemeToggle';

export default function ThemeToggleExample() {
  return (
    <div className="p-6 flex items-center justify-center gap-4">
      <p className="text-sm text-muted-foreground">Toggle theme:</p>
      <ThemeToggle />
    </div>
  );
}
