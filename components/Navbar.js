import React from "react";
import Link from "next/Link";

const Navbar = () => {
  const [show, setShow] = React.useState(false);

  const switchMenu = React.useCallback(() => {
    setShow((prevState) => {
      return !prevState;
    });
  }, [show]);

  const videoSvg = (
    <svg
      className="inline w-6 h-6 mr-1"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  );

  const photoSvg = (
    <svg
      className="inline w-6 h-6 mr-2"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );

  return (
    <nav className="fixed inset-x-0 bg-gray-200">
      <div className="max-w-6xl px-4 mx-auto">
        <div className="flex justify-between">
          <div className="flex space-x-4">
            <div>
              <Link href="/">
                <a className="flex items-center px-2 py-5 text-gray-700 hover:text-gray-900">
                  <svg
                    className="w-6 h-6 mr-1 text-blue-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                  <span className="font-bold">Sign Language Detection</span>
                </a>
              </Link>
            </div>

            <div className="items-center hidden space-x-1 md:flex">
              <Link href="/capture-photo-set">
                <a className="flex items-center px-3 py-5 text-gray-700 hover:text-gray-900">
                  {photoSvg}
                  <span>Static</span>
                </a>
              </Link>
              <Link href="/capture-video-set">
                <a className="flex items-center px-3 py-5 text-gray-700 hover:text-gray-900">
                  {videoSvg}
                  <span>Dynamic</span>
                </a>
              </Link>
            </div>
          </div>

          <div className="items-center hidden space-x-1 md:flex">
            <Link href="/detect-static-signs">
              <a className="px-3 py-5">Detect {photoSvg}</a>
            </Link>
            <Link href="/detect-static-signs">
              <a className="px-3 py-5">Detect {videoSvg}</a>
            </Link>
          </div>

          <div className="flex items-center md:hidden">
            <button className="mobile-menu-button" onClick={switchMenu}>
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className={`${show ? "" : "hidden"} mobile-menu md:hidden`}>
        <Link href="/capture-photo-set">
          <a
            className="items-center block p-2 space-x-2 text-sm hover:bg-gray-200"
            onClick={switchMenu}
          >
            {photoSvg}
            <span> Capture Static dataset</span>
          </a>
        </Link>
        <Link href="/capture-video-set">
          <a
            className="items-center block p-2 space-x-2 text-sm hover:bg-gray-200"
            onClick={switchMenu}
          >
            {videoSvg}
            <span> Capture Dynamic dataset</span>
          </a>
        </Link>
        <Link href="/detect-static-signs">
          <a
            className="items-center block p-2 space-x-2 text-sm hover:bg-gray-200"
            onClick={switchMenu}
          >
            {videoSvg}
            <span> Detect Dynamic</span>
          </a>
        </Link>
        <Link href="/detect-static-signs">
          <a
            className="items-center block p-2 space-x-2 text-sm hover:bg-gray-200"
            onClick={switchMenu}
          >
            {photoSvg}
            <span> Detect Static</span>
          </a>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
