import Link from 'next/link'

export function Navbar() {
  return (
    <header className="bg-primary text-primary-foreground">
      <nav className="container mx-auto flex justify-between items-center p-4">
        <Link href="/" className="text-2xl font-bold cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 hover:text-green-500">
          Year Guessing Game
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link href="/about" className="hover:underline">
              About
            </Link>
          </li>
          <li>
            <Link href="https://dominiksaatz.de" className="hover:underline">
              More
            </Link>
          </li>
          <li>
            <Link href="https://github.com/DSaatz" className="hover:underline">
              GitHub
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
