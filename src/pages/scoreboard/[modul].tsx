import { Listbox, Transition, Tab } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { availableKelas, isValidKelas } from '@/common/data/Kelas'
import getContestmodulByModulAndKelas, {
  availableModul,
  isValidModul,
} from '@/common/data/PortalPraktikum'
import ICPCScoreboardTable from '@/icpc/components/elements/ICPCScoreboardTable'
import ScoreboardData from '@/icpc/types/ScoreboardData'
import axios from 'axios'
import { GetStaticPaths, GetStaticProps } from 'next'
import { FC, Fragment, useState } from 'react'
import { Fetcher } from 'swr'
import useSWRImmutable from 'swr/immutable'
import clsx from 'clsx'
import getContestSlugByModulAndKelas from '@/common/data/PortalPraktikum'

type Props = {
  modul: availableModul
}

type Data = {
  data: ScoreboardData
  lastUpdated: string
}

const kelas = ['a', 'b', 'c', 'e', 'f', 'iup']

const fetcher: Fetcher<Data> = (url: string) =>
  axios.get(url).then((res) => res.data)

const PraktikumScoreboard: FC<Props> = ({ modul }) => {
  const [session, setSession] = useState<'praktikum' | 'revisi'>('revisi')
  const [selectedKelas, setSelectedKelas] = useState(kelas[0])
  const { data, error } = useSWRImmutable(
    `/scoreboard/${session}/${getContestSlugByModulAndKelas(
      modul,
      selectedKelas as unknown as availableKelas
    )}.json`,
    fetcher
  )

  return (
    <>
      <header
        style={{
          textAlign: 'center',
          paddingTop: '48px',
          paddingBottom: '48px',
        }}
      >
        <h1 className="text-2xl font-semibold">
          {data ? data.data.contest.name : 'Loading'}
        </h1>
        <p className="text-slate-400 mt-2">Last updated: {data?.lastUpdated}</p>
        <div className="w-full max-w-xs mx-auto mt-5">
          <Listbox value={session} onChange={setSession}>
            {({ open }) => (
              <div className="mt-3">
                <div className="mt-1 relative">
                  <Listbox.Button className="relative w-full border border-white/[0.24] rounded-md shadow-sm px-4 py-2 text-left cursor-default focus:ring-4 focus:ring-blue-600 focus:ring-opacity-30 focus:outline-none">
                    <span className="flex items-center">
                      <span className="block truncate capitalize">
                        {session}
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
            onChange={(index) => {
              setSelectedKelas(kelas[index])
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
        <ICPCScoreboardTable
          problems={data ? data.data.problems : []}
          teams={data ? data.data.teams : []}
        />
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  return { props: { modul: context.params?.modul } }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const modul = ['1', '2']

  return {
    paths: modul.map((modul) => ({ params: { modul } })),
    fallback: false,
  }
}

export default PraktikumScoreboard
