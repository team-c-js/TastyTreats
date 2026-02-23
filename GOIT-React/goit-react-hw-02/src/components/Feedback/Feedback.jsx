function Feedback({ feedback, positiveFeedback }) {
  const totalFeedback = feedback.good + feedback.neutral + feedback.bad;
  if (totalFeedback === 0) {
    return (
      <>
        <p>Not feedback yet.</p>
      </>
    );
  }

  return (
    <>
      <p>Good: {feedback.good}</p>
      <p>Neutral: {feedback.neutral}</p>
      <p>Bad: {feedback.bad}</p>
      <p>Total: {feedback.totalFeedback}</p>
      <p>Positive : % {positiveFeedback}</p>
    </>
  );
}
export default Feedback;