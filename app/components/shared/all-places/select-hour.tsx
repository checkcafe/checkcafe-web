import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

interface SelectHourProps {
  defaultOpenTime: string;
  defaultCloseTime: string;
}

export default function SelectHour({
  defaultOpenTime,
  defaultCloseTime,
}: SelectHourProps) {
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        options.push(time);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  return (
    <div className="flex gap-6">
      <div className="w-full">
        <label>From</label>
        <Select defaultValue={defaultOpenTime} name="openTime">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="09:00" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none" className="hidden"></SelectItem>
            {timeOptions.map(time => (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full">
        <label>To</label>
        <Select defaultValue={defaultCloseTime} name="closeTime">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="22:00" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none" className="hidden"></SelectItem>
            {timeOptions.map(time => (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
