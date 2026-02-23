function Options({ onGood, onNeutral, onBad, onReset }) {
  return (
    <>
      <button onClick={onGood}>Good</button>
      <button onClick={onNeutral}>Neutral</button>

      <button onClick={onBad}>Bad</button>

      <button onClick={onReset}>Reset</button>
    </>
  );
}
export default Options;