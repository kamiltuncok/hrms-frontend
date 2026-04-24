import * as React from "react"
import { Check, ChevronsUpDown, MapPin } from "lucide-react"
import { cn } from "@/shared/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useCities, City } from "../../features/jobs/hooks/useReferenceData"

interface LocationSelectorProps {
  value?: number
  onChange: (value: number | undefined) => void
  className?: string
}

export function LocationSelector({ value, onChange, className }: LocationSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const { data: cities = [], isLoading } = useCities()

  const selectedCity = cities.find((city: City) => city.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between bg-background/50 border-border/50 hover:border-primary/50 transition-colors", className)}
          disabled={isLoading}
        >
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            {selectedCity ? selectedCity.name : "Şehir seçin..."}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput placeholder="Şehir ara..." className="h-9" />
          <CommandList>
            <CommandEmpty>Şehir bulunamadı.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  onChange(undefined)
                  setOpen(false)
                }}
                className="cursor-pointer"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === undefined ? "opacity-100" : "opacity-0"
                  )}
                />
                Tüm Şehirler
              </CommandItem>
              {cities.map((city: City) => (
                <CommandItem
                  key={city.id}
                  value={city.name}
                  onSelect={() => {
                    onChange(city.id)
                    setOpen(false)
                  }}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === city.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {city.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
