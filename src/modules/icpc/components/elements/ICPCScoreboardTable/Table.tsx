import Problem from '@/icpc/types/Problem'
import Team from '@/icpc/types/Team'
import { FC } from 'react'
import styles from '@/styles/Table.module.css'
import clsx from 'clsx'
import Image from 'next/image'
import itsLogo from '../../../../../../public/img/logo-its.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowDown,
  faArrowUp,
  faCircle,
} from '@fortawesome/free-solid-svg-icons'

type Props = {
  problems: Problem[]
  teams: Team[]
  prevRank?: { [key: string]: number }
}

const getProgressClassName = (count: number, total: number) => {
  const progress = Math.round(Math.round((count * 100) / total) / 10) * 10
  return styles[`progress${progress}`]
}

const Table: FC<Props> = ({ problems, teams, prevRank }) => {
  const totalProblems = problems.length

  return (
    <table className={styles.table}>
      <thead className={styles.scoreThead}>
        <tr>
          <th
            className={clsx(styles.scoreTh, styles.rankTh)}
            style={{ borderLeft: 'none' }}
          >
            Rank
          </th>
          <th className={styles.scoreTh}>Team</th>
          <th className={styles.scoreTh}>Score</th>
          {problems.map(({ label, name }) => (
            <th
              key={label}
              title={`Problem ${name}`}
              className={styles.scoreTh}
            >
              {label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {teams.map(({ id, institution, name, problems, score }, rank) => (
          <tr key={id}>
            <td className={styles.scoreTd} style={{ borderLeft: 'none' }}>
              {rank + 1} (
              {prevRank &&
                (!(id in prevRank) || prevRank[id] > rank ? (
                  <>
                    <FontAwesomeIcon
                      icon={faArrowUp}
                      className="text-green-400 my-0"
                    />
                    <span className="text-green-400">
                      &nbsp;
                      {!(id in prevRank)
                        ? teams.length - rank
                        : prevRank[id] - rank}
                    </span>
                  </>
                ) : prevRank[id] === rank ? (
                  <FontAwesomeIcon
                    icon={faCircle}
                    className="text-yellow-300 my-0"
                  />
                ) : (
                  <>
                    <FontAwesomeIcon
                      icon={faArrowDown}
                      className="text-red-400 my-0"
                    />
                    <span className="text-red-400">
                      &nbsp;{rank - prevRank[id]}
                    </span>
                  </>
                ))}
              )
            </td>
            <td className={clsx(styles.scoreTd, styles.teamNameTd)}>
              <div className="flex gap-x-3 items-center pl-3 pr-8">
                <div className="block w-8 h-8">
                  <Image
                    src={itsLogo}
                    height={32}
                    width={32}
                    alt="Logo of Institut Teknologi Sepuluh Nopember"
                  />
                </div>
                <div>
                  <p>{name}</p>
                  <small className={styles.small}>{institution.name}</small>
                </div>
              </div>
            </td>
            <td
              className={clsx(
                styles.scoreTd,
                getProgressClassName(score.solvedCount, totalProblems)
              )}
            >
              {score.penalty === 0 && score.solvedCount === 0 ? (
                <>0</>
              ) : (
                <>
                  <p>{score.solvedCount}</p>
                  <small className={styles.small}>{score.penalty}</small>
                </>
              )}
            </td>
            {problems.map(
              ({
                firstToSolve,
                isSolved,
                pendingCount,
                problem,
                tryCount,
                time,
              }) => (
                <td
                  className={clsx(
                    styles.scoreTd,
                    pendingCount > 0
                      ? styles.pending
                      : tryCount > 0
                      ? isSolved
                        ? firstToSolve
                          ? styles.firstToSolve
                          : styles.progress100
                        : styles.progress0
                      : ''
                  )}
                  key={problem.label}
                >
                  {tryCount > 0 && (
                    <>
                      <p>{time === null ? '-' : time}</p>
                      <small className={styles.small}>
                        {tryCount} {tryCount === 1 ? 'try' : 'tries'}
                      </small>
                    </>
                  )}
                </td>
              )
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Table
