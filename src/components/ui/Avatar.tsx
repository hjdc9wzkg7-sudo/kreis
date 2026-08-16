import clsx from "clsx";

export function Avatar({
  initials,
  size = "md",
  className,
}: {
  initials: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "rounded-full bg-kreis-sageLight text-kreis-sage font-semibold flex items-center justify-center shrink-0",
        {
          "w-8 h-8 text-xs": size === "sm",
          "w-10 h-10 text-sm": size === "md",
          "w-12 h-12 text-base": size === "lg",
        },
        className
      )}
    >
      {initials}
    </div>
  );
}

export function AvatarGroup({
  initials,
  max = 4,
}: {
  initials: string[];
  max?: number;
}) {
  const shown = initials.slice(0, max);
  const rest = initials.length - max;

  return (
    <div className="flex -space-x-2">
      {shown.map((init, i) => (
        <Avatar
          key={i}
          initials={init}
          size="sm"
          className="ring-2 ring-white"
        />
      ))}
      {rest > 0 && (
        <div className="w-8 h-8 rounded-full bg-kreis-sand text-kreis-muted text-xs font-medium flex items-center justify-center ring-2 ring-white">
          +{rest}
        </div>
      )}
    </div>
  );
}
