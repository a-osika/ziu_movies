interface Props {
  message?: string;
  onRetry?: () => void;
}

export function ErrorBanner({ message = "Wystąpił błąd.", onRetry }: Props) {
  return (
    <div className="error-banner">
      <p>❌ {message}</p>

      {onRetry && <button onClick={onRetry}>Spróbuj ponownie</button>}
    </div>
  );
}
