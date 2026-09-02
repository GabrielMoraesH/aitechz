import type { ReactNode, SVGProps } from "react";

export type IconName =
  | "arrow" | "audio" | "battery" | "category" | "check" | "circuitBoard" | "computer"
  | "connector" | "drone" | "game" | "headset" | "instagram" | "location"
  | "menu" | "phone" | "search" | "scooter" | "shield" | "spark" | "tools"
  | "watch" | "whatsapp" | "x";

type SvgIconProps = Omit<SVGProps<SVGSVGElement>, "name">;
type Props = SvgIconProps & { name: IconName };

const paths: Record<IconName, ReactNode> = {
  arrow: <path d="m9 18 6-6-6-6M4 12h11" />,
  audio: <path d="M9 18H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l5-4v20l-5-4Zm9-9a4 4 0 0 1 0 6m2.5-9a8 8 0 0 1 0 12" />,
  battery: <><rect x="7" y="4" width="10" height="17" rx="2" /><path d="M10 1.5h4M10 8h4M10 11h4M10 14h4" /></>,
  category: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  circuitBoard: <><rect x="7" y="7" width="10" height="10" rx="1.5" /><path d="M10 10h4v4h-4zM9 2v5m6-5v5M9 17v5m6-5v5M2 9h5m-5 6h5m10-6h5m-5 6h5" /></>,
  computer: <path d="M4 5h16v11H4zM8 20h8m-4-4v4" />,
  connector: <><path d="M9 3v6m6-6v6M7 9h10v3a5 5 0 0 1-5 5v4m-3 0h6" /><path d="M9 6h6" /></>,
  drone: <><path d="M9 10h6l2 4H7l2-4Zm3 4v3m-5-5-3-3m13 3 3-3" /><ellipse cx="4" cy="7" rx="3" ry="1.5" /><ellipse cx="20" cy="7" rx="3" ry="1.5" /><path d="M7 7h2m6 0h2" /></>,
  game: <path d="M8 10v4m-2-2h4m6-1h.01M18 13h.01M7 6h10a5 5 0 0 1 4.8 6.4l-1.1 3.7a2.5 2.5 0 0 1-4.3.9L14 14h-4l-2.4 3a2.5 2.5 0 0 1-4.3-.9l-1.1-3.7A5 5 0 0 1 7 6Z" />,
  headset: <path d="M4 14v-2a8 8 0 0 1 16 0v2m-16 0h3v6H5a1 1 0 0 1-1-1v-5Zm16 0h-3v6h2a1 1 0 0 0 1-1v-5Z" />,
  instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></>,
  location: <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Zm-8 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  phone: <path d="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm3 17h4" />,
  search: <path d="m21 21-4.35-4.35m2.35-5.15A7.5 7.5 0 1 1 4 11.5a7.5 7.5 0 0 1 15 0Z" />,
  scooter: <><circle cx="5.5" cy="18" r="2" /><circle cx="18.5" cy="18" r="2" /><path d="M7.5 18h7.25a3.75 3.75 0 0 0 3.75-3.75V6.5L16.75 3M15 3h3.5M18.5 6.5h-2" /></>,
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Zm-3-10 2 2 4-5" />,
  spark: <path d="m12 2 1.4 5.6L19 9l-5.6 1.4L12 16l-1.4-5.6L5 9l5.6-1.4L12 2Zm7 13 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z" />,
  tools: <path d="M14.5 8.5 18 5a5 5 0 0 1-6.6 6.6l-6.1 6.1a1.9 1.9 0 0 1-2.7-2.7l6.1-6.1A5 5 0 0 1 15.5 2L12 5.5l2.5 3Z" />,
  watch: <path d="M9 2h6l1 4H8l1-4Zm-1 4h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Zm1 12h6l1 4H8l1-4Z" />,
  whatsapp: <path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.4-4.7a8.5 8.5 0 1 1 16.1-4.1Zm-11.8-4c.2-.5.4-.5.8-.5h.4c.2 0 .4.1.5.4l1 2.3c.1.3 0 .5-.2.7l-.8 1c-.2.2-.1.4 0 .6.7 1.2 1.7 2.2 3 2.8.2.1.4.1.6-.1l1-1.2c.2-.2.4-.3.7-.1l2.2 1c.3.1.4.3.4.5 0 .3-.2 1.5-1 2.1-.7.6-1.7.9-2.8.7-1.1-.2-2.6-.8-4.3-2.3-1.4-1.3-2.5-2.9-2.8-4.1-.4-1.3 0-2.8.3-3.4Z" />,
  x: <path d="m6 6 12 12M18 6 6 18" />,
};

export function Icon({ name, ...props }: Props) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}

export const WhatsAppIcon = (props: SvgIconProps) => <Icon name="whatsapp" {...props} />;
export const InstagramIcon = (props: SvgIconProps) => <Icon name="instagram" {...props} />;
