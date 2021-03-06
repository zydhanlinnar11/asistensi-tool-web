import mataKuliah from '@/common/data/MataKuliah'
import { signIn } from '@/modules/auth/auth'
import { useUser } from '@/modules/auth/providers/UserProvider'
import { faCircleUser } from '@fortawesome/free-regular-svg-icons'
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Menu, Transition } from '@headlessui/react'
import Image from 'next/image'
import Link from 'next/link'
import { Fragment } from 'react'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const navigation = [{ name: 'Home', href: '/', passHref: false }]

export default function Navbar() {
  const { user, signOut, isUserFetched } = useUser()

  return (
    <nav
      className="bg-gray-900 sticky top-0 min-h-[52px] sm:h-[52px] z-10 w-full backdrop-blur-[20px] backdrop-saturate-[1.80]
      after:w-full after:h-px after:bg-white/[0.24] after:content-[''] after:block after:absolute after:top-full
      print:hidden"
    >
      <div className="flex justify-between h-[52px] my-0 mx-auto py-0 max-w-5xl px-6">
        <Link href="/">
          <a className="my-auto font-semibold text-lg">
            <h1>
              {mataKuliah.nama} {mataKuliah.tahunAjar}
            </h1>
          </a>
        </Link>
        <nav className="z-20 my-auto text-sm block">
          <ul className="flex gap-x-8">
            <Menu as="div" className="ml-3 relative">
              <div>
                <Menu.Button className="bg-gray-800 flex text-sm rounded-full">
                  <span className="sr-only">Open user menu</span>
                  {user?.picture ? (
                    <Image
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full hover:opacity-75 transition duration-150 ease-in-out"
                      src={user.picture}
                      alt=""
                    />
                  ) : (
                    <span className="text-gray-300">
                      <FontAwesomeIcon icon={faCircleUser} size={'2x'} />
                    </span>
                  )}
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items
                  className="absolute origin-top-right bg-gray-900 flex
                          flex-col right-0 w-56 mt-2 border border-white/20 rounded py-1 z-10"
                >
                  <Menu.Item>
                    {({ active }) => (
                      <Link href="/">
                        <a
                          className={`${
                            active && 'bg-blue-600/30'
                          } py-2 pl-3 pr-9 text-left transition-all duration-150 text-base hover:bg-blue-600/30`}
                        >
                          Home
                        </a>
                      </Link>
                    )}
                  </Menu.Item>
                  {user && (
                    <>
                      {user.role === 'asdos' && (
                        <Menu.Item>
                          {({ active }) => (
                            <Link href="/asdos">
                              <a
                                className={`${
                                  active && 'bg-blue-600/30'
                                } py-2 pl-3 pr-9 text-left transition-all duration-150 text-base hover:bg-blue-600/30`}
                              >
                                Asdos Dashboard
                              </a>
                            </Link>
                          )}
                        </Menu.Item>
                      )}
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            onClick={() => signOut()}
                            className={`${
                              active && 'bg-blue-600/30'
                            } py-2 pl-3 pr-9 text-left transition-all duration-150 text-base hover:bg-blue-600/30`}
                          >
                            Sign out
                          </a>
                        )}
                      </Menu.Item>
                    </>
                  )}
                  {!user && (
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          onClick={() => signIn()}
                          className={`${
                            active && 'bg-blue-600/30'
                          } py-2 pl-3 pr-9 text-left transition-all duration-150 text-base`}
                        >
                          Sign in
                        </a>
                      )}
                    </Menu.Item>
                  )}
                </Menu.Items>
              </Transition>
            </Menu>
          </ul>
        </nav>
      </div>
    </nav>
  )
}
