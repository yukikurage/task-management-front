import { Navigation, NavigationProps } from "./Navigation";

type NavProps = Omit<NavigationProps, "variant" | "icon">;

export function Nav(props: NavProps) {
  return <Navigation {...props} variant="default" />;
}
