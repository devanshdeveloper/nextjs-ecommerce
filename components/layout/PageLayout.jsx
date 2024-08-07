import { twMerge } from "tailwind-merge";

function PageLayout({ children, className }) {
  return (
    <div
      className={twMerge(
        "w-screen h-[calc(100vh-64px)] flex flex-col items-center justify-center gap-5",
        className
      )}
    >
      {children}
    </div>
  );
}

export default PageLayout;
