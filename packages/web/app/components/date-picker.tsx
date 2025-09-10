import { format } from "date-fns"
import { sv } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"

import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import { Calendar } from "~/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { useTranslation } from "~/context/translation"

interface DatePickerProps {
  date: Date
  setDate: (date: Date | undefined) => void
}

export function DatePicker({ date, setDate }: DatePickerProps) {
  const { language, t } = useTranslation()
  
  const formatDate = (date: Date) => {
    return format(date, "PPP", { locale: language === 'sv' ? sv : undefined })
  }
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? formatDate(date) : <span>{t('common.pickDate')}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar 
          mode="single" 
          selected={date} 
          onSelect={setDate} 
          initialFocus 
          locale={language === 'sv' ? sv : undefined}
        />
      </PopoverContent>
    </Popover>
  )
}
