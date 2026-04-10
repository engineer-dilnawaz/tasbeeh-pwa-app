import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NavHeaderProps {
  title: string;
  rightElement?: ReactNode;
}

/**
 * Standard navigation header: full-bleed width edge-to-edge, safe-area aware.
 */
export function NavHeader(props: NavHeaderProps) {
  const navigate = useNavigate();
  const { title, rightElement } = props;

  return (
    <header className="sticky top-0 z-100 box-border w-full shrink-0 bg-base-200 pt-[env(safe-area-inset-top,0px)] font-sans">
      <div className="flex h-[54px] items-center justify-between px-4">
        <button
          type="button"
          className="flex size-11 shrink-0 items-center justify-center rounded-full border border-base-300 bg-transparent text-base-content transition-all duration-200 ease-in-out active:scale-90 active:bg-base-content/8"
          onClick={() => navigate(-1)}
          aria-label="Go Back"
        >
          <ArrowLeft size={22} strokeWidth={2.5} />
        </button>

        <h2 className="m-0 flex-1 text-center text-lg font-extrabold tracking-tight text-base-content">
          {title}
        </h2>

        <div className="flex min-w-11 items-center justify-end">
          {rightElement ?? null}
        </div>
      </div>
    </header>
  );
}
