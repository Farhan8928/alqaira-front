import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-8xl text-gold">404</p>
      <h1 className="mt-2 font-display text-3xl text-foreground">Page not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist.</p>
      <Link to="/" className="mt-6 rounded-full bg-navy px-7 py-3 text-sm font-semibold text-white">
        Back to Home
      </Link>
    </div>
  );
}
