import { Code, Camera, Mic, PenTool, Paintbrush } from "lucide-react";

const icons = [
  { Icon: Code, style: "top-[15%] left-[8%] text-3xl", delay: "0s" },
  { Icon: Camera, style: "top-[25%] right-[12%] text-2xl", delay: "3s" },
  { Icon: Mic, style: "top-[55%] left-[5%] text-2xl", delay: "7s" },
  { Icon: PenTool, style: "top-[70%] right-[8%] text-3xl", delay: "11s" },
  { Icon: Paintbrush, style: "top-[40%] right-[25%] text-xl", delay: "5s" },
];

const FloatingElements = () => (
  <>
    {icons.map(({ Icon, style, delay }, i) => (
      <div
        key={i}
        className={`floating-element ${style}`}
        style={{ animationDelay: delay }}
      >
        <Icon size={32} />
      </div>
    ))}
  </>
);

export default FloatingElements;
