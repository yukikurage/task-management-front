"use client";

import { useEffect, useState, ReactNode } from "react";
import { createPortal } from "react-dom";

interface FloatingPortalProps {
  children: ReactNode;
  targetId?: string;
}

export function FloatingPortal({ children, targetId = "floating-space" }: FloatingPortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  const target = document.getElementById(targetId);
  if (!target) return null;

  return createPortal(children, target);
}
