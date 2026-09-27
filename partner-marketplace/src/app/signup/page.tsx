import type { Metadata } from "next";
import { Suspense } from "react";
import SignupClient from "./SignupClient";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create your Partner Marketplace account as an advertiser or a publisher.",
};

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupClient />
    </Suspense>
  );
}
