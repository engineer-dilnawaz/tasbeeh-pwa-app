export interface TasbeehItemProps {
  title: string;
  target?: number;
  count: number;
  onIncrement: () => void;
  onReset?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
}
