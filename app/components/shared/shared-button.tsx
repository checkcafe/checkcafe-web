import {
  FaCopy,
  FaFacebookF,
  FaTelegramPlane,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";
import { FaShareNodes } from "react-icons/fa6";
import { toast } from "react-toastify";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

interface ShareButtonProps {
  url: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ url }: ShareButtonProps) => {
  const handleShare = (shareUrl: string) => {
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="p-0">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white p-0 text-black hover:opacity-50">
          <FaShareNodes className="h-6 w-6" />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() =>
            handleShare(`https://www.facebook.com/sharer/sharer.php?u=${url}`)
          }
        >
          <FaFacebookF className="mr-2" /> Facebook
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            handleShare(`https://twitter.com/intent/tweet?url=${url}`)
          }
        >
          <FaTwitter className="mr-2" /> Twitter
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleShare(`https://wa.me/?text=${url}`)}
        >
          <FaWhatsapp className="mr-2" /> WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleShare(`https://t.me/share/url?url=${url}`)}
        >
          <FaTelegramPlane className="mr-2" /> Telegram
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyLink}>
          <FaCopy className="mr-2" /> Copy Link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareButton;
