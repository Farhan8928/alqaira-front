export function PageLoader() {
  return (
    <div className="flex h-full min-h-[50vh] w-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={
        "inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent " +
        (className ?? "")
      }
    />
  );
}
