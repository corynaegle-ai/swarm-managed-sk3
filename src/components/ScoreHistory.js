import React from 'react';
import './ScoreHistory.css';

const ScoreHistory = ({ scoreHistory = [] }) => {
  if (scoreHistory.length === 0) {
    return (
      <div className="score-history">
        <h3 className="score-history__title">Score History</h3>
        <p className="score-history__empty-state">
          No previous rounds played yet. Start a game to see your score history!
        </p>
      </div>
    );
  }

  return (
    <div className="score-history">
      <h3 className="score-history__title">Score History</h3>
      <div className="score-history__container">
        <table className="score-history__table" role="table" aria-label="Previous round scores">
          <thead>
            <tr>
              <th scope="col">Round</th>
              <th scope="col">Score</th>
            </tr>
          </thead>
          <tbody>
            {/* Using index as key is acceptable here because:
               - Score history is append-only (rounds are never reordered or removed)
               - Each round represents a historical snapshot at a specific position
               - The list order is semantically tied to the chronological sequence */}
            {scoreHistory.map((round, index) => (
              <tr key={index} className="score-history__row">
                <td className="score-history__round">
                  Round {index + 1}
                </td>
                <td className="score-history__score">
                  {round}
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