import { cn } from "~/lib/utils";

export const FloatingCard = ({
  icon,
  title,
  bgColor = "bg-white",
  textColor = "text-black",
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  bgColor?: string;
  textColor?: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        `${bgColor} absolute rounded-md px-2 py-1 md:px-5`,
        className,
      )}
    >
      <div
        className={`flex items-center gap-1 text-xs font-semibold md:text-lg ${textColor}`}
      >
        {icon}
        {title}
      </div>
    </div>
  );
};
