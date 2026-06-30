import { IconType } from "react-icons";
import {
  LuMenu,
  LuSettings,
  LuSend,
  LuSquare,
  LuPlus,
  LuSparkles,
  LuTrash2,
  LuCopy,
  LuCheck,
  LuX,
  LuSearch,
  LuArrowRight,
  LuArrowLeft,
  LuArrowUpRight,
  LuRefreshCw,
  LuEllipsis,
  LuPencil,
  LuFeather,
  LuFileText,
  LuEraser,
  LuInfo,
  LuTriangleAlert,
  LuContrast,
  LuGlobe,
  LuGithub,
  LuPanelRightClose,
  LuLock,
  LuShield,
  LuLanguages,
  LuCode,
  LuEye,
  LuEyeOff,
} from "react-icons/lu";

export const Icons = {
  menu: LuMenu,
  settings: LuSettings,
  send: LuSend,
  stop: LuSquare,
  new: LuPlus,
  curate: LuSparkles,
  delete: LuTrash2,
  copy: LuCopy,
  check: LuCheck,
  tick: LuCheck,
  close: LuX,
  search: LuSearch,
  arrowRight: LuArrowRight,
  arrowLeft: LuArrowLeft,
  external: LuArrowUpRight,
  regenerate: LuRefreshCw,
  more: LuEllipsis,
  edit: LuPencil,
  quill: LuFeather,
  note: LuFileText,
  eraser: LuEraser,
  info: LuInfo,
  alert: LuTriangleAlert,
  theme: LuContrast,
  globe: LuGlobe,
  github: LuGithub,
  split: LuPanelRightClose,
  key: LuLock,
  shield: LuShield,
  translate: LuLanguages,
  source: LuCode,
  eye: LuEye,
  eyeOff: LuEyeOff,
} as const;

export type IconName = keyof typeof Icons;

export function Icon({
  name,
  size = 20,
  strokeWidth = 1.6,
  className,
}: {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  const Component = Icons[name] as IconType;
  return <Component size={size} strokeWidth={strokeWidth} className={className} />;
}
