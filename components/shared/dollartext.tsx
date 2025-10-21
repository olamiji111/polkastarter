import { useEffect, useRef } from "react";

interface DollarTextProps {
  children: React.ReactNode;
  weight?: 300 | 400 | 500 | 700 | 800;
}

export default function DollarText({
  children,
  weight = 400,
}: DollarTextProps) {
  const wrapperRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;

    // Convert children to string
    const text = Array.isArray(children) ? children.join("") : String(children);

    const replacementClass = `__className_a17902 font-[${weight}]`;

    // Replace $ and ,
    wrapperRef.current.innerHTML = text.replace(
      /(\$|,)/g,
      `<span class="${replacementClass}">$1</span>`
    );
  }, [children, weight]);

  return <span ref={wrapperRef} />;
}