import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface AlertDialogProps {
  type?: "success" | "error"
  title?: string
  message?: string
  buttonText?: string
  triggerLabel?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function AlertDialog({
  type = "success",
  title,
  message,
  buttonText = "OK",
  triggerLabel,
  open: controlledOpen,
  onOpenChange,
}: AlertDialogProps) {
  const [open, setOpen] = useState(false)
  const isControlled = controlledOpen !== undefined

  const handleClose = () => {
    if (isControlled) onOpenChange?.(false)
    else setOpen(false)
  }

  const colors =
    type === "success"
      ? "text-green-600 border-green-500"
      : "text-red-600 border-red-500"

  const Icon = type === "success" ? CheckCircle2 : XCircle

  const dialogOpen = isControlled ? controlledOpen : open

  return (
    <Dialog open={dialogOpen} onOpenChange={isControlled ? onOpenChange : setOpen}>
      {triggerLabel && (
        <DialogTrigger asChild>
          <Button variant="outline">{triggerLabel}</Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-sm text-center">
        <DialogHeader>
          <div className="flex justify-center mb-2">
            <Icon className={cn("w-12 h-12", colors)} />
          </div>
          <DialogTitle className={cn("capitalize", colors)}>
            {title || (type === "success" ? "Success" : "Error")}
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            {message || (type === "success"
              ? "Your action was completed successfully."
              : "Something went wrong. Please try again.")}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-center mt-4">
          <Button
            className={cn(
              "px-6",
              type === "success" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700",
              "text-white"
            )}
            onClick={handleClose}
          >
            {buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
