import Meta from "../components/Meta";
import Link from "next/Link";

const Home = () => {
  return (
    <>
      <Meta title={"Sign Language Detection"} />
      <main className="flex flex-col items-center justify-center flex-1 py-3 text-center">
        <h1 className="text-5xl font-bold">
          Welcome to <a className="text-blue-600">Sign Language Detection</a>
        </h1>

        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          <Link href="/detect-static-signs">
            <a className="card">
              <h3 className="text-2xl font-bold">
                Static Sign Language Detection &rarr;
              </h3>
              <p className="mt-4 text-xl">
                For detecting Static Signs click here!
              </p>
            </a>
          </Link>
          <Link href="/">
            <a className="card">
              <h3 className="text-2xl font-bold">
                Dynamic Sign Language Detection &rarr;
              </h3>
              <p className="mt-4 text-xl">
                For detecting Dynamic Signs click here!
              </p>
            </a>
          </Link>
          <Link href="/capture-photo-set">
            <a className="card">
              <h3 className="text-2xl font-bold">
                Capture Static Dataset &rarr;
              </h3>
              <p className="mt-4 text-xl">
                For capturing static dataset click here!
              </p>
            </a>
          </Link>
          <Link href="/capture-video-set">
            <a className="card">
              <h3 className="text-2xl font-bold">
                Capture Dynamic Dataset &rarr;
              </h3>
              <p className="mt-4 text-xl">
                For capturing Dynamic dataset click here!
              </p>
            </a>
          </Link>
          <Link href="/train-for-static">
            <a className="card">
              <h3 className="text-2xl font-bold">
                Train for Static Dataset &rarr;
              </h3>
              <p className="mt-4 text-xl">
                For training static model click here!
              </p>
            </a>
          </Link>
          <Link href="/train-for-static">
            <a className="card">
              <h3 className="text-2xl font-bold">
                Capture Dynamic Dataset &rarr;
              </h3>
              <p className="mt-4 text-xl">
                For training Dynamic model click here!
              </p>
            </a>
          </Link>
        </div>
      </main>
      <footer className="flex items-center justify-center w-full h-24 border-t">
        <Link href="https://www.tensorflow.org/js">
          <a
            className="flex items-center justify-center"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by
            <img
              src="/tensorflow.svg"
              alt="Tensorflowjs Logo"
              className="h-4 ml-2"
            />
          </a>
        </Link>
      </footer>
    </>
  );
};

export default Home;
