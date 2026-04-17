import React, { createContext, useContext, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { Drawer, type SnapPoint } from "./Drawer";
import { Text } from "./Text";

// ── Context ──────────────────────────────────────────────────────────────

type SelectItemTone = "primary" | "neutral";

interface SelectContextValue {
  value?: string;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  itemTone: SelectItemTone;
}

const SelectContext = createContext<SelectContextValue | null>(null);

function useSelectContext() {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error("Select components must be wrapped in <Select />");
  }
  return context;
}

// ── Select Root ──────────────────────────────────────────────────────────

export interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  children: React.ReactNode;
  /** Controls selected-item and focus accent in the bottom sheet + trigger. */
  itemTone?: SelectItemTone;
}

export function Select({
  value: controlledValue,
  onValueChange,
  defaultValue,
  children,
  itemTone = "primary",
}: SelectProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);

  const value = controlledValue !== undefined ? controlledValue : uncontrolledValue;

  const handleValueChange = (newValue: string) => {
    if (onValueChange) onValueChange(newValue);
    if (controlledValue === undefined) setUncontrolledValue(newValue);
    setOpen(false); // Auto-close drawer on selection
  };

  return (
    <SelectContext.Provider
      value={{
        value,
        onValueChange: handleValueChange,
        open,
        setOpen,
        itemTone,
      }}
    >
      {children}
    </SelectContext.Provider>
  );
}

// ── Select Trigger ───────────────────────────────────────────────────────

export interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className = "", children, ...props }, ref) => {
    const { setOpen, open, itemTone } = useSelectContext();
    const focusRing =
      itemTone === "neutral"
        ? "focus:ring-neutral focus:ring-offset-base-100"
        : "focus:ring-primary focus:ring-offset-2";

    return (
      <button
        ref={ref}
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex h-12 w-full items-center justify-between rounded-2xl border border-base-content/10 bg-base-100 px-4 py-2 hover:bg-base-200 transition-colors focus:outline-none focus:ring-2 ${focusRing} ${className}`}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
      </button>
    );
  }
);
SelectTrigger.displayName = "SelectTrigger";

// ── Select Value ─────────────────────────────────────────────────────────

export interface SelectValueProps {
  placeholder?: string;
}

export const SelectValue: React.FC<SelectValueProps> = ({ placeholder }) => {
  const { value } = useSelectContext();
  
  return (
    <Text variant="body" className={`truncate ${!value ? "text-base-content/50" : "text-base-content font-medium"}`}>
      {value || placeholder}
    </Text>
  );
};

// ── Select Content ───────────────────────────────────────────────────────

export interface SelectContentProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  snapPoints?: SnapPoint[];
  initialSnap?: number;
  presentation?: "translate" | "height";
}

export const SelectContent: React.FC<SelectContentProps> = ({
  title,
  description,
  children,
  snapPoints = ["auto", "90%"],
  initialSnap = 0,
  presentation = "translate",
}) => {
  const { open, setOpen } = useSelectContext();

  return (
    <Drawer
      isOpen={open}
      onClose={() => setOpen(false)}
      title={title}
      description={description}
      snapPoints={snapPoints}
      initialSnap={initialSnap}
      presentation={presentation}
    >
       <div className="flex flex-col px-4 pb-0 gap-2">
         {children}
       </div>
    </Drawer>
  );
};

// ── Select Item ──────────────────────────────────────────────────────────

export interface SelectItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  label: string;
  description?: string;
  preview?: React.ReactNode;
}

export const SelectItem = React.forwardRef<HTMLButtonElement, SelectItemProps>(
  ({ value, label, description, preview, className = "", ...props }, ref) => {
    const { value: selectedValue, onValueChange } = useSelectContext();
    const isSelected = selectedValue === value;
    const selectedSurface = "border border-primary bg-primary/10";
    const unselectedSurface =
      "bg-base-200 border border-transparent hover:bg-base-300";

    return (
      <button
        ref={ref}
        type="button"
        onClick={() => onValueChange(value)}
        className={`flex items-center justify-between w-full h-20 px-5 rounded-2xl transition-colors active:scale-[0.98] ${
          isSelected ? selectedSurface : unselectedSurface
        } ${className}`}
        {...props}
      >
        <div className="flex flex-col items-start gap-1">
          <Text
            variant="body"
            weight={isSelected ? "semibold" : "medium"}
            color={isSelected ? "primary" : "base"}
          >
            {label}
          </Text>
          {description && (
            <Text variant="caption" color="subtle" className="text-left">
              {description}
            </Text>
          )}
        </div>
        <div className="flex items-center gap-3">
          {preview}
          {isSelected && (
            <Check className="w-5 h-5 text-primary drop-shadow-sm" />
          )}
        </div>
      </button>
    );
  }
);
SelectItem.displayName = "SelectItem";
