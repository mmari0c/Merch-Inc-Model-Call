function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 py-4 text-center text-xs text-gray-400 flex flex-col gap-1">
      <p>&copy; {new Date().getFullYear()} Merch Inc. All rights reserved.</p>
      <p>
        Built by{' '}
        <a
          href="https://www.linkedin.com/in/marionolascocortez/"
          target="_blank"
          rel="noreferrer"
          className="text-gray-500 hover:underline"
        >
          Mario Nolasco
        </a>
        {' '}&middot;{' '}
        <a
          href="https://www.instagram.com/merchandisinginc"
          target="_blank"
          rel="noreferrer"
          className="text-gray-500 hover:underline"
        >
          @merchandisinginc
        </a>
      </p>
    </footer>
  )
}

export default Footer
