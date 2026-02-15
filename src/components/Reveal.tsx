import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  as?: keyof JSX.IntrinsicElements;
};

export default function Reveal({
  children,
  className,
  delayMs = 0,
  as: Tag = "div",
}: RevealProps): JSX.Element {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as unknown as React.RefObject<any>}
      className={clsx("reveal", className)}
      style={{ transitionDelay: `${Math.max(0, delayMs)}ms` }}
      data-visible={visible}
    >
      {children}
    </Tag>
  );
}
