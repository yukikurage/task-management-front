"use client";

import { ReactNode } from "react";
import { createPortal } from "react-dom";

interface FloatingPortalProps {
  children: ReactNode;
  targetId?: string;
}

export function FloatingPortal({
  children,
  targetId = "floating-space",
}: FloatingPortalProps) {
  if (typeof window === "undefined") return null;

  const target = document.getElementById(targetId);
  if (!target) return null;

  return createPortal(children, target);
}
