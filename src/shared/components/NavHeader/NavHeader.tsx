import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./NavHeader.module.css";

interface NavHeaderProps {
  title: string;
  rightElement?: React.ReactNode;
}

/**
 * Standard Navigation Header with Back button and custom action area.
 */
export function NavHeader(props: NavHeaderProps) {
  const navigate = useNavigate();
  const { title, rightElement } = props;

  return (
    <header className={styles.header}>
      <button 
        className={styles.backBtn} 
        onClick={() => navigate(-1)}
        aria-label="Go Back"
      >
        <ArrowLeft size={22} strokeWidth={2.5} />
      </button>

      <h2 className={styles.title}>{title}</h2>

      <div className={styles.spacer}>
        {rightElement || null}
      </div>
    </header>
  );
}
