function FullScreenLayout({ children, className }) {
  return (
    <div
      className={`absolute top-0 left-0 w-screen h-screen flex items-center justify-center ${className}`}
    >
      {children}
    </div>
  );
}

export default FullScreenLayout;
