import { twMerge } from "tailwind-merge";

function PageLayout({ children, className }) {
  return (
    <div
      className={twMerge(
        "w-screen h-[calc(100vh-64px)] flex items-center justify-center",
        className
      )}
    >
      {children}
    </div>
  );
}

export default PageLayout;
