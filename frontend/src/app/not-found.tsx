"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-ai-cyan font-mono text-sm mb-4">ERROR_404</p>
        <h1 className="text-4xl font-bold text-primary-text mb-2">
          Not Found
        </h1>
        <p className="text-secondary-text mb-8">
          This page does not exist on the network.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-primary-blue text-white rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
