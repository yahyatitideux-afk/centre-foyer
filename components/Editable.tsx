"use client";

import React from "react";
import { useSiteState } from "@/lib/SiteStateContext";

interface EditableProps {
  label: string;
  value: string;
  onSave: (newValue: string) => void;
  onDelete?: () => void;
  children: React.ReactElement;
  className?: string;
}

export default function Editable({
  label,
  value,
  onSave,
  onDelete,
  children,
  className = ""
}: EditableProps) {
  const { isAdminUnlocked, isEditModeActive, setGlobalEditor } = useSiteState();

  if (!isAdminUnlocked || !isEditModeActive) {
    return children;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setGlobalEditor({
      label,
      value,
      onSave,
      onDelete
    });
  };

  // Extract the original child element's tags and props
  const child = React.Children.only(children);
  const childProps = (child.props as any) || {};

  return React.cloneElement(child as any, {
    ...childProps,
    onClick: handleClick,
    className: `${childProps.className || ""} cursor-pointer border border-dashed border-sky-400 hover:border-sky-600 bg-sky-500/5 hover:bg-sky-500/10 p-0.5 rounded-lg transition-all duration-200 relative group select-all`,
    title: `Cliquer pour modifier : ${label}`,
    style: {
      ...childProps.style,
      minWidth: "15px",
      minHeight: "15px"
    }
  });
}
