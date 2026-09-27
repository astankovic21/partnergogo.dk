import type { Metadata } from "next";
import LoginClient from "./LoginClient";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your PartnerGoGo account.",
};

export default function LoginPage() {
  return <LoginClient />;
}
