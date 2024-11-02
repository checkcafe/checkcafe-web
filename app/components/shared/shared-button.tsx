import { memo, useEffect, useState } from "react";
import {
  FaCopy,
  FaFacebookF,
  FaTelegramPlane,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";
import { FaShareNodes } from "react-icons/fa6";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

interface ShareButtonProps {
  initialUrl?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ initialUrl }) => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    setUrl(
      initialUrl ||
        (typeof window !== "undefined" ? window.location.href : null),
    );
  }, [initialUrl]);

  const getShareUrl = (platform: string) => {
    if (!url) return "";
    const encodedUrl = encodeURIComponent(url);
    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}`,
    };
    return shareUrls[platform] || "";
  };

  const handleShare = (platform: string) => {
    if (url) {
      const shareUrl = getShareUrl(platform);
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleCopyLink = async () => {
    if (navigator.clipboard && url) {
      try {
        await navigator.clipboard.writeText(url);
        toast("Link copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy link: ", err);
      }
    } else {
      console.warn("Clipboard API not available or URL is not set");
    }
  };

  if (!url) return null;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="p-0">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white p-0 text-black hover:opacity-50">
          <FaShareNodes className="h-6 w-6" />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleShare("facebook")}>
          <FaFacebookF className="mr-2" /> Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare("twitter")}>
          <FaTwitter className="mr-2" /> Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare("whatsapp")}>
          <FaWhatsapp className="mr-2" /> WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare("telegram")}>
          <FaTelegramPlane className="mr-2" /> Telegram
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyLink}>
          <FaCopy className="mr-2" /> Copy Link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default memo(ShareButton);
