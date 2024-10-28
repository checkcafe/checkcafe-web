import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

interface SelectHourProps {
  openTimeRef: React.RefObject<HTMLSelectElement>;
  closeTimeRef: React.RefObject<HTMLSelectElement>;
}

export default function SelectHour({
  openTimeRef,
  closeTimeRef,
}: SelectHourProps) {
  // Generate time options in 30-minute intervals
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
      {/* Select for Opening Time (From) */}
      <div className="w-full">
        <label>From</label>
        <Select
          onValueChange={value => {
            if (openTimeRef.current) openTimeRef.current.value = value;
          }}
          name="OpenTime"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="09:00" ref={openTimeRef} />
          </SelectTrigger>
          <SelectContent>
            {timeOptions.map(time => (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Select for Closing Time (To) */}
      <div className="w-full">
        <label>To</label>
        <Select
          onValueChange={value => {
            if (closeTimeRef.current) closeTimeRef.current.value = value;
          }}
          name="CloseTime"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="22:00" ref={closeTimeRef} />
          </SelectTrigger>
          <SelectContent>
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
