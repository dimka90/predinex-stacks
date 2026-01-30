import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Predinex Rewards",
  description: "Your rewards and leaderboard position",
};

export default function RewardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="rewards-layout">{children}</div>;
}
