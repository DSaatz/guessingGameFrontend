// pages/about.tsx
export default function About() {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <h1 className="text-4xl font-bold mb-4">About This Game</h1>
        <p className="text-lg text-center max-w-2xl">
          This game was created by me to try out the stack containing NextJS, TailwindCSS, FastAPI, PostgreSQL and Vercel.
          Therefore the features as of right now only one set of hints per year. Later on I may more contents which is easily doable 
          due to the way the Datbase is structured. But as of right now it stands a demo of my skills.
        </p>
        <p className="text-lg text-center max-w-2xl m-5">
          None the less I hope you enjoy playing the simple game.
        </p>
      </div>
    )
  }  