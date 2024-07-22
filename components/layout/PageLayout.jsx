function PageLayout({children}) {
  return (
    <div className="w-screen h-[calc(100vh-64px)] flex items-center justify-center">{children}</div>
  )
}

export default PageLayout