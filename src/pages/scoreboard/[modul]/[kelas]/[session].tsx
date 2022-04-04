import { Listbox, Transition, Tab } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { availableKelas, isValidKelas } from '@/common/data/Kelas'
import { availableModul, isValidModul } from '@/common/data/PortalPraktikum'
import ICPCScoreboardTable from '@/icpc/components/elements/ICPCScoreboardTable'
import ScoreboardData from '@/icpc/types/ScoreboardData'
import { GetStaticPaths, GetStaticProps } from 'next'
import { FC, Fragment } from 'react'
import clsx from 'clsx'
import getContestSlugByModulAndKelas from '@/common/data/PortalPraktikum'
import { NextSeo } from 'next-seo'
import { ParsedUrlQuery } from 'querystring'
import { useRouter } from 'next/router'
import { readFileSync } from 'fs'
import AnchorLink from '@/common/components/elements/AnchorLink'

type Props = {
  data: ScoreboardData
  lastUpdated: string
  kelasIndex: number
  modulIndex: number
  sessionIndex: number
}

const kelas = ['a', 'b', 'c', 'e', 'f', 'iup']
const modul = ['1', '2']
const sessions = ['praktikum', 'revisi']

const PraktikumScoreboard: FC<Props> = ({
  data,
  lastUpdated,
  kelasIndex,
  modulIndex,
  sessionIndex,
}) => {
  const router = useRouter()

  return (
    <>
      <NextSeo
        title={`Scoreboard ${data.contest.name}`}
        description={`Scoreboard ${data.contest.name}`}
        openGraph={{
          title: `Scoreboard ${data.contest.name}`,
          images: [
            {
              url: 'https://zydhan.xyz/logo.webp',
              height: 1080,
              width: 1080,
              alt: 'Animated photo of Zydhan Linnar Putra',
            },
          ],
          locale: 'id-ID',
        }}
      />
      <header
        style={{
          textAlign: 'center',
          paddingTop: '48px',
          paddingBottom: '48px',
        }}
      >
        <h1 className="text-2xl font-semibold">
          {data ? data.contest.name : 'Loading'}
        </h1>
        <p className="text-slate-400 mt-2">Last updated: {lastUpdated}</p>
        <div className="w-full max-w-xs mx-auto mt-5">
          <Listbox
            value={sessions[sessionIndex]}
            onChange={(sess) => {
              router.push(
                `/scoreboard/${modul[modulIndex]}/${kelas[kelasIndex]}/${sess}`
              )
            }}
          >
            {({ open }) => (
              <div className="mt-3">
                <div className="mt-1 relative">
                  <Listbox.Button className="relative w-full border border-white/[0.24] rounded-md shadow-sm px-4 py-2 text-left cursor-default focus:ring-4 focus:ring-blue-600 focus:ring-opacity-30 focus:outline-none">
                    <span className="flex items-center">
                      <span className="block truncate capitalize">
                        {sessions[sessionIndex]}
                      </span>
                    </span>
                    <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <SelectorIcon
                        className="h-5 w-5 text-white"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>

                  <Transition
                    show={open}
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 mt-1 w-full bg-gray-900 shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-white/[0.24] ring-opacity-5 overflow-auto focus:outline-none">
                      {['revisi', 'praktikum'].map((ses) => (
                        <Listbox.Option
                          key={ses}
                          className={({ active }) =>
                            clsx(
                              active
                                ? 'text-white bg-blue-600/30'
                                : 'text-white',
                              'cursor-default select-none relative py-2 pl-3 pr-9'
                            )
                          }
                          value={ses}
                        >
                          {({ selected, active }) => (
                            <>
                              <div className="flex items-center">
                                <span className="ml-3 block truncate capitalize">
                                  {ses}
                                </span>
                              </div>

                              {selected ? (
                                <span
                                  className={clsx(
                                    active ? 'text-white' : 'text-indigo-600',
                                    'absolute inset-y-0 right-0 flex items-center pr-4'
                                  )}
                                >
                                  <CheckIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </div>
            )}
          </Listbox>
        </div>
        <div className="w-full max-w-md px-2 pt-8 sm:px-0 mx-auto">
          <Tab.Group
            defaultIndex={kelasIndex}
            onChange={(index) => {
              router.push(
                `/scoreboard/${modul[modulIndex]}/${kelas[index]}/${sessions[sessionIndex]}`
              )
            }}
          >
            <Tab.List className="flex p-1 space-x-1 bg-blue-900/20 rounded-xl">
              {kelas.map((kelas) => (
                <Tab
                  key={kelas}
                  className={({ selected }) =>
                    clsx(
                      'w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg',
                      'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60',
                      selected
                        ? 'bg-white shadow'
                        : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                    )
                  }
                >
                  Kelas <span className="uppercase">{kelas}</span>
                </Tab>
              ))}
            </Tab.List>
          </Tab.Group>
        </div>
      </header>
      <main className="max-w-full">
        <div className="w-fit mx-auto">
          <div className="flex justify-between w-full mx-auto mb-5">
            {modulIndex > 0 ? (
              <AnchorLink
                href={`/scoreboard/${modul[modulIndex - 1]}/${
                  kelas[kelasIndex]
                }/${sessions[sessionIndex]}`}
              >
                ← Modul {modul[modulIndex - 1]}
              </AnchorLink>
            ) : (
              <p>← Tidak ada modul sebelumnya</p>
            )}
            {modulIndex + 1 < modul.length ? (
              <AnchorLink
                href={`/scoreboard/${modul[modulIndex + 1]}/${
                  kelas[kelasIndex]
                }/${sessions[sessionIndex]}`}
              >
                Modul {modul[modulIndex + 1]} →
              </AnchorLink>
            ) : (
              <p>Tidak ada modul setelahnya →</p>
            )}
          </div>
          <ICPCScoreboardTable
            problems={data ? data.problems : []}
            teams={data ? data.teams : []}
          />
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const currModul = params?.modul
  const currKelas = params?.kelas
  const session = params?.session
  if (
    typeof currModul !== 'string' ||
    typeof currKelas !== 'string' ||
    typeof session !== 'string' ||
    !isValidKelas(currKelas) ||
    !isValidModul(currModul)
  )
    return {
      notFound: true,
    }
  try {
    const data = JSON.parse(
      readFileSync(
        `./public/scoreboard/${params?.session}/${getContestSlugByModulAndKelas(
          currModul,
          currKelas
        )}.json`
      ).toString()
    )
    const sessionIndex = sessions.findIndex((sess) => sess === session)
    if (sessionIndex === -1) return { notFound: true }
    const kelasIndex = kelas.findIndex((kls) => kls == currKelas)
    if (kelasIndex === -1) return { notFound: true }
    const modulIndex = modul.findIndex((mdl) => mdl == currModul)
    if (modulIndex === -1) return { notFound: true }

    return {
      props: { ...data, sessionIndex, kelasIndex, modulIndex },
    }
  } catch (e) {
    return { notFound: true }
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: { params: ParsedUrlQuery }[] = []
  modul.forEach((modul) =>
    kelas.forEach((kelas) =>
      sessions.forEach((session) =>
        paths.push({ params: { modul, kelas, session } })
      )
    )
  )
  return {
    paths: paths,
    fallback: false,
  }
}

export default PraktikumScoreboard
