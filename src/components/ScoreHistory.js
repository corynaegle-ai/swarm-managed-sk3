import React from 'react';
import './ScoreHistory.css';

const ScoreHistory = ({ scoreHistory = [] }) => {
  // Handle empty state
  if (!scoreHistory || scoreHistory.length === 0) {
    return (
      <div className="score-history-empty">
        <p>No previous rounds to display</p>
      </div>
    );
  }

  // Normalize data to handle both object and simple number formats
  const normalizedHistory = scoreHistory.map((item, index) => {
    if (typeof item === 'number') {
      return { roundNumber: index + 1, score: item };
    }
    return item;
  });

  return (
    <div className="score-history">
      <table 
        className="score-history-table" 
        aria-label="Previous round scores"
        role="table"
      >
        <thead>
          <tr>
            <th scope="col">Round</th>
            <th scope="col">Score</th>
          </tr>
        </thead>
        <tbody>
          {normalizedHistory.map((round, index) => (
            <tr key={index}>
              <td>Round {round.roundNumber}</td>
              <td>{round.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScoreHistory;
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