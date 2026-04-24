import {
  LayoutGrid,
  Wallet,
  ArrowLeftRight,
  Landmark,
  Settings,
} from "lucide-react";

export const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/budget",    label: "Budget",      icon: Wallet },
  { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/accounts",  label: "Accounts",    icon: Landmark },
  { href: "/settings",  label: "Settings",    icon: Settings },
] as const;
