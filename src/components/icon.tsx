import { HugeiconsIcon } from "@hugeicons/react";
import {
  Menu02Icon,
  Settings03Icon,
  SentIcon,
  StopIcon,
  PlusSignIcon,
  SparklesIcon,
  Delete03Icon,
  CopyIcon,
  Tick02Icon,
  Cancel02Icon,
  SearchIcon,
  ArrowRight02Icon,
  ArrowLeft02Icon,
  ArrowUpRight02Icon,
  Refresh01Icon,
  MoreHorizontalIcon,
  Edit02Icon,
  QuillWrite02Icon,
  Note02Icon,
  EraserIcon,
  InformationCircleIcon,
  AlertSquareIcon,
  ContrastIcon,
  Globe02Icon,
  GithubIcon,
  SidebarRightIcon,
  SecurityLockIcon,
  ShieldHalfIcon,
  TranslateIcon,
  SourceCodeIcon,
  Tick02Icon as CheckIcon,
} from "@hugeicons/core-free-icons";

export const Icons = {
  menu: Menu02Icon,
  settings: Settings03Icon,
  send: SentIcon,
  stop: StopIcon,
  new: PlusSignIcon,
  curate: SparklesIcon,
  delete: Delete03Icon,
  copy: CopyIcon,
  check: CheckIcon,
  tick: Tick02Icon,
  close: Cancel02Icon,
  search: SearchIcon,
  arrowRight: ArrowRight02Icon,
  arrowLeft: ArrowLeft02Icon,
  external: ArrowUpRight02Icon,
  regenerate: Refresh01Icon,
  more: MoreHorizontalIcon,
  edit: Edit02Icon,
  quill: QuillWrite02Icon,
  note: Note02Icon,
  eraser: EraserIcon,
  info: InformationCircleIcon,
  alert: AlertSquareIcon,
  theme: ContrastIcon,
  globe: Globe02Icon,
  github: GithubIcon,
  // landing feature icons
  split: SidebarRightIcon,
  key: SecurityLockIcon,
  shield: ShieldHalfIcon,
  translate: TranslateIcon,
  source: SourceCodeIcon,
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
  return (
    <HugeiconsIcon
      icon={Icons[name]}
      size={size}
      strokeWidth={strokeWidth}
      className={className}
    />
  );
}
