import Link from "next/link";
import { Handshake } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div className="sm:col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-brand-foreground">
              <Handshake className="h-4 w-4" strokeWidth={2.25} />
            </span>
            Partner Marketplace
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted">
            Where performance meets distribution.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground">Platform</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>
              <Link href="/#how-it-works" className="hover:text-foreground">
                How it works
              </Link>
            </li>
            <li>
              <Link href="/#marketplace" className="hover:text-foreground">
                Marketplace
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground">Get started</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>
              <Link href="/signup?role=advertiser" className="hover:text-foreground">
                For advertisers
              </Link>
            </li>
            <li>
              <Link href="/signup?role=publisher" className="hover:text-foreground">
                For publishers
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-foreground">
                Log in
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground">Company</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li className="text-muted">contact@partnermarketplace.io</li>
            <li className="text-muted">Copenhagen, Denmark</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-6">
        <p className="container-page flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
          <span>&copy; {new Date().getFullYear()} Partner Marketplace. All rights reserved.</span>
          <Link href="/admin" className="text-muted/70 hover:text-muted">
            Admin
          </Link>
        </p>
      </div>
    </footer>
  );
}
