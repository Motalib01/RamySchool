import * as React from "react";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";

export default function ViewButton({ onClick }: { onClick: () => void }) {
  return (
    <Button 
      variant="outline"
      size="icon" 
      onClick={onClick} 
      className="flex rounded-full items-center gap-1"
    >
      <EyeIcon className="w-5 h-5" />
    </Button>
  );
}
