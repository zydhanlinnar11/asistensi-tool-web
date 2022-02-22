import Header from '@/common/components/elements/Header'
import SpinnerLoading from '@/common/components/elements/SpinnerLoading'
import { useUser } from '@/modules/auth/providers/UserProvider'
import Head from 'next/head'
import React, { FC, Fragment, useState } from 'react'
import useDaftarSoal from '@/modules/asdos/hooks/useDaftarSoal'
import PrivateRoute from '@/modules/asdos/components/PrivateRoute'
import DaftarSoalCard from './DaftarSoalCard'
import mataKuliah from '@/common/data/MataKuliah'
import { availableModul, isValidModul } from '@/common/data/PortalPraktikum'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { Listbox, Transition } from '@headlessui/react'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const DaftarSoal: FC = () => {
  const { user } = useUser()
  const { daftarSoal, isError, isLoading } = useDaftarSoal()
  const [modul, setModul] = useState<availableModul>('1')
  const modules = ['1', '2', '3', '4', 'final']

  return (
    <div>
      <Head>
        <title>
          Daftar Soal - {mataKuliah.nama} {mataKuliah.tahunAjar}
        </title>
      </Head>
      <PrivateRoute>
        <Header
          midText="Daftar Soal"
          bottomText={`${mataKuliah.nama} ${user?.kelas?.toUpperCase()} ${
            mataKuliah.tahunAjar
          }`}
        >
          <Listbox value={modul} onChange={setModul}>
            {({ open }) => (
              <div className="mt-3">
                <div className="mt-1 relative">
                  <Listbox.Button className="relative w-full border border-white/[0.24] rounded-md shadow-sm px-4 py-2 text-left cursor-default focus:ring-4 focus:ring-blue-600 focus:ring-opacity-30 focus:outline-none">
                    <span className="flex items-center">
                      <span className="block truncate">
                        {modul === 'final'
                          ? 'Praktikum Final'
                          : `Modul ${modul}`}
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
                      {modules.map((module) => (
                        <Listbox.Option
                          key={module}
                          className={({ active }) =>
                            classNames(
                              active
                                ? 'text-white bg-blue-600/30'
                                : 'text-white',
                              'cursor-default select-none relative py-2 pl-3 pr-9'
                            )
                          }
                          value={module}
                        >
                          {({ selected, active }) => (
                            <>
                              <div className="flex items-center">
                                <span className="ml-3 block truncate">
                                  {module === 'final'
                                    ? 'Praktikum Final'
                                    : `Modul ${module}`}
                                </span>
                              </div>

                              {selected ? (
                                <span
                                  className={classNames(
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
        </Header>
        {isLoading ? (
          <div className="my-24">
            <SpinnerLoading />
          </div>
        ) : isError ? (
          <div className="my-auto text-center">
            <h1 className="text-4xl">Terdapat kesalahan</h1>
            <p className="mt-3 text-gray-400">Silahkan refresh halaman ini</p>
          </div>
        ) : daftarSoal?.filter((soal) => soal.modul === modul).length === 0 ? (
          <div className="my-24 text-center">
            <h1 className="text-4xl">Tidak ada soal</h1>
            <p className="mt-3 text-gray-400">
              Belum ada soal / praktikum di kelas ini
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 pb-5">
            {daftarSoal
              ?.filter((soal) => soal.modul === modul)
              .map((soal) => (
                <DaftarSoalCard soal={soal} key={soal.slug} />
              ))}
          </div>
        )}
      </PrivateRoute>
    </div>
  )
}
export default DaftarSoal
