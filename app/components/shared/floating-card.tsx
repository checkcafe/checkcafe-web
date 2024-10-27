import { cn } from "~/lib/utils";

interface FloatingCardProps {
  icon?: React.ReactNode;
  title: string;
  bgColor?: string;
  textColor?: string;
  className?: string;
}

export const FloatingCard: React.FC<FloatingCardProps> = ({
  icon,
  title,
  bgColor = "bg-white",
  textColor = "text-black",
  className,
}) => {
  return (
    <div
      className={cn(
        `${bgColor} px-2 md:px-5 py-1 rounded-md absolute`,
        className
      )}
    >
      <div
        className={`text-xs md:text-lg font-semibold flex items-center gap-1 ${textColor}`}
      >
        {icon}
        {title}
      </div>
    </div>
  );
};
