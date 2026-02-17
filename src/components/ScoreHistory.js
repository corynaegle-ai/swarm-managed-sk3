import React from 'react';
import './ScoreHistory.css';

const ScoreHistory = ({ scoreHistory = [] }) => {
  if (!scoreHistory || scoreHistory.length === 0) {
    return (
      <div className="score-history">
        <h3 className="score-history__title">Score History</h3>
        <div className="score-history__empty">
          <p>No previous rounds yet. Start playing to see your score history!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="score-history">
      <h3 className="score-history__title">Score History</h3>
      <div className="score-history__list" role="region" aria-label="Previous round scores">
        <table className="score-history__table" role="table">
          <thead>
            <tr>
              <th scope="col">Round</th>
              <th scope="col">Score</th>
            </tr>
          </thead>
          <tbody>
            {scoreHistory.map((score, index) => (
              <tr key={index} className="score-history__row">
                <td className="score-history__round">
                  Round {index + 1}
                </td>
                <td className="score-history__score">
                  {score}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScoreHistory;