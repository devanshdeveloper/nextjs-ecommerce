function AdminLayoutCover({ children, className }) {
  return (
    <div
      className={`w-full h-[calc(100vh-4rem)] flex items-center justify-center ${className}`}
    >
      {children}
    </div>
  );
}

export default AdminLayoutCover;
