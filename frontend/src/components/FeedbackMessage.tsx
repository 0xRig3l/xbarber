type FeedbackMessageProps = {
  error?: string;
  success?: string;
};

export function FeedbackMessage({ error, success }: FeedbackMessageProps) {
  if (error) {
    return (
      <p className="feedback feedback--error" role="alert">
        {error}
      </p>
    );
  }

  return success ? (
    <p className="feedback feedback--success" role="status">
      {success}
    </p>
  ) : null;
}
