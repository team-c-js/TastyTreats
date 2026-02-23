import Description from "./components/Description/Description";
import Feedback from "./components/FeedBack/Feedback";
import Options from "./components/Options/Options";

import { useState, useEffect } from "react";
function App() {
  const [feedback, setFeedback] = useState(() => {
    const localFeedback = localStorage.getItem("feedback");
    return localFeedback
      ? JSON.parse(localFeedback)
      : {
          good: 0,
          neutral: 0,
          bad: 0,
        };
  });
  useEffect(() => {
    localStorage.setItem("feedback", JSON.stringify(feedback));
  }, [feedback]);
  const handleGood = () => {
    setFeedback({
      ...feedback,
      good: feedback.good + 1,
    });
  };

  const handleNeutral = () => {
    setFeedback({
      ...feedback,
      neutral: feedback.neutral + 1,
    });
  };
  const handleBad = () => {
    setFeedback({
      ...feedback,
      bad: feedback.bad + 1,
    });
  };
  const handleReset = () => {
    setFeedback({
      good: 0,
      neutral: 0,
      bad: 0,
    });
  };
  const positiveFeedback = Math.round(
    (feedback.good / (feedback.good + feedback.neutral + feedback.bad)) * 100
  );

  const getFeedback = (positiveFeedback) => {
    if (positiveFeedback > 50 && positiveFeedback <= 100) {
      return "good";
    } else if (positiveFeedback === 50) {
      return "neutral";
    } else if (positiveFeedback >= 0 && positiveFeedback < 50) {
      return "bad";
    }
    return "";
  };
  return (
    <>
      <Description styleClass={getFeedback(positiveFeedback)} />
      <Options
        onGood={handleGood}
        onNeutral={handleNeutral}
        onBad={handleBad}
        onReset={handleReset}
      />
      <Feedback
        feedback={feedback}
        positiveFeedback={positiveFeedback}
        styleClass={getFeedback(positiveFeedback)}
      />
    </>
  );
}
export default App;