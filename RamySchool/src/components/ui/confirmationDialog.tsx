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
import { cn } from "@/lib/utils"
import { useState, ReactNode } from "react"

interface ConfirmDialogProps {
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  triggerLabel?: string
  onConfirm?: () => void
  onCancel?: () => void
  variant?: "green" | "normal" | "danger"
  children?: ReactNode
}

export function ConfirmDialog({
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  triggerLabel = "Open Dialog",
  onConfirm,
  onCancel,
  variant = "normal",
  children,
}: ConfirmDialogProps) {
  const [open, setOpen] = useState(false)

  const handleConfirm = () => {
    onConfirm?.()
    setOpen(false)
  }

  const handleCancel = () => {
    onCancel?.()
    setOpen(false)
  }

  const variantClasses = {
    normal: "bg-primary text-white hover:bg-primary/90",
    green: "bg-green-600 text-white hover:bg-green-700",
    danger: "bg-red-600 text-white hover:bg-red-700",
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{triggerLabel}</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {children && <div className="py-3">{children}</div>}

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>
            {cancelText}
          </Button>
          <Button
            className={cn(variantClasses[variant])}
            onClick={handleConfirm}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
