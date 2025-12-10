import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, FilterIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface FilterOption {
  label: string
  value: string
}

interface FilterProps {
  label?: string
  options: FilterOption[]
  value: string
  onChange: (value: string) => void
  className?: string
}

export function Filter({
  label = "Filter",
  options,
  value,
  onChange,
  className,
}: FilterProps) {
  const selected = options.find((opt) => opt.value === value)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          className={cn("flex items-center rounded-full gap-2 capitalize", className)}
        >
          Filter
          <FilterIcon className="h-4 w-4 opacity-70" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        <DropdownMenuLabel className="capitalize">{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {options.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              "capitalize cursor-pointer",
              opt.value === value && "bg-gray-100 font-medium"
            )}
          >
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
