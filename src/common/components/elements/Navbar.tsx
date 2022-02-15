import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

const navigation = [{ name: 'Home', href: '/', passHref: false }]

export default function Navbar() {
  const { data: session } = useSession()
  const user = session?.user

  return (
    <nav
      className="bg-zinc-900/25 sticky top-0 min-h-[52px] sm:h-[52px] z-10 w-full backdrop-blur-[20px] backdrop-saturate-[1.80]
      after:w-full after:h-px after:bg-white/[0.24] after:content-[''] after:block after:absolute after:top-full"
    >
      <div className="flex justify-between h-[52px] my-0 mx-auto py-0 max-w-5xl px-6">
        <Link href="/">
          <a className="my-auto font-semibold text-lg">
            <h1>Struktur Data 2022</h1>
          </a>
        </Link>
        <nav className="z-20 my-auto text-sm hidden sm:block">
          <ul className="flex gap-x-8">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link href={item.href} passHref={item.passHref}>
                  <a>{item.name}</a>
                </Link>
              </li>
            ))}
            {!user && (
              <li>
                <button onClick={() => signIn()}>Log in</button>
              </li>
            )}
            {user && (
              <li>
                <button onClick={() => signOut()}>Log out</button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </nav>
  )
}
