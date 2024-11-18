import styles from "./howto.module.css";
export default function HowToPlay() {
  return (
    <div>
    <div className={styles.modal}>
      <h2>How to play &#x1F4E2;</h2>
      <div>
        <ul>
          <li>Sign up</li>
          <li>Join a league</li>
          <li>Submit your predictions for the next race</li>
          <li>Have fun, smoke your friends!</li>
        </ul>
      </div>
    </div>

      <div className={styles.modal}>
        <h2>Scoring &#x1F680;</h2>
        <p>
          Points are awarded based on how closely a player's predictions align
          with the actual race results. Scoring is broken down by prediction
          type:
        </p>
        <ul>
          <li>
            Exact Position Match: +10 points per driver if the predicted
            position matches the actual finishing position.
          </li>
          <li>
            Near Match:
            <ul>
              <li>1 position off: +5 points</li>
              <li>2 positions off: +3 points</li>
              <li>
                Correct driver but incorrect position: +1 point per driver
              </li>
            </ul>
          </li>
          <li>
            Podium prediction:
            <ul>
              <li>1st place: +25 points</li>
              <li>2nd place: +20 points</li>
              <li>3rd place: +15 points</li>
              <li>
                Correct driver but incorrect podium position: +10 points per
                driver
              </li>
            </ul>
          </li>
          <li>Winner +50 points</li>
        </ul>
      </div>
    </div>
  );
}
