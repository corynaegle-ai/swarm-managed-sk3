import React from 'react';
import './ScoreHistory.css';

const ScoreHistory = ({ scoreHistory = [] }) => {
  if (!scoreHistory || scoreHistory.length === 0) {
    return (
      <div className="score-history">
        <h3 className="score-history__title">Score History</h3>
        <div className="score-history__empty">
          <p>No previous rounds to display</p>
        </div>
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
            {scoreHistory.map((round, index) => {
              const roundNumber = round.roundNumber || index + 1;
              const score = round.score || round;
              
              return (
                <tr key={`round-${roundNumber}`} className="score-history__row">
                  <td className="score-history__round">Round {roundNumber}</td>
                  <td className="score-history__score">{score}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScoreHistory;