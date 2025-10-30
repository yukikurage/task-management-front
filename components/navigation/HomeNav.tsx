import { Navigation, NavigationProps } from "./Navigation";
import { HomeIcon } from "./HomeIcon";

type HomeNavProps = Omit<NavigationProps, "variant" | "icon">;

export function HomeNav(props: HomeNavProps) {
  return (
    <Navigation
      {...props}
      variant="home"
      icon={<HomeIcon className="text-nav-home-text" />}
    />
  );
}
