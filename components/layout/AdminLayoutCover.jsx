function AdminLayoutCover({ children }) {
  return (
    <div className="w-[calc(100vw-300px)] h-[calc(100vh-68px)] flex items-center justify-center">
      {children}
    </div>
  );
}

export default AdminLayoutCover;
