import { AirPollutionInfo } from '../types';
import styles from './AirQuality.module.css';

type Props = {
  data: AirPollutionInfo;
};

export default function AirQuality({ data }: Props) {
  const quality = {
    1: 'Good',
    2: 'Fair',
    3: 'Moderate',
    4: 'Poor',
    5: 'Very Poor',
  };
  return (
    <div className={styles.widget}>
      <h2>Air Quality</h2>
      <div>
        <p>{quality[data.main.aqi]}</p>
        <ul>
          <li>
            <span className="lbl">CO</span> :{' '}
            <span className="val">{data.components.co}</span>
          </li>
          <li>
            <span className="lbl">NO</span> :{' '}
            <span className="val">{data.components.no}</span>
          </li>
          <li>
            <span className="lbl">
              NO<sub>2</sub>
            </span>
            : <span className="val">{data.components.no2}</span>
          </li>
          <li>
            <span className="lbl">
              O<sub>3</sub>
            </span>
            : <span className="val">{data.components.o3}</span>
          </li>
          <li>
            <span className="lbl">
              SO<sub>2</sub>
            </span>
            : <span className="val">{data.components.so2}</span>
          </li>
          <li>
            <span className="lbl">
              PM<sub>2.5</sub>
            </span>
            : <span className="val">{data.components.pm2_5}</span>
          </li>
          <li>
            <span className="lbl">
              PM<sub>10</sub>
            </span>
            : <span className="val">{data.components.pm10}</span>
          </li>
          <li>
            <span className="lbl">
              NH<sub>3</sub>
            </span>
            : <span className="val">{data.components.nh3}</span>
          </li>
        </ul>
        <small>
          * Сoncentration: μg/m<sup>3</sup>
        </small>
      </div>
    </div>
  );
}
