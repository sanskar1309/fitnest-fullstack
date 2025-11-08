import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export function BackToHomeButton() {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button asChild size="sm" className="rounded-full shadow-lg">
        <Link href="/" aria-label="Back to Home">
          <Home className="w-4 h-4" />
        </Link>
      </Button>
    </div>
  );
}
