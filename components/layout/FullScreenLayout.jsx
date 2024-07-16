function FullScreenLayout({ children }) {
  return (
    <div className="absolute top-0 left-0 w-screen h-screen flex items-center justify-center">
      {children}
    </div>
  );
}

export default FullScreenLayout;
