class DateService {
  public formatedTimestamp(newDate?: Date) {
    const d = newDate ?? new Date();
    console.log({ d });
    const date = d.toISOString().split("T")[0];
    const time = d.toTimeString().split(" ")[0].replace(/:/g, "-");
    return `${date} ${time}`;
  }

  public convertDate(dateString: string): Date {
    const [datePart, timePart] = dateString.split(" ");
    const timePartCorrected = timePart.replace(/-/g, ":");
    const isoDateString = `${datePart}T${timePartCorrected}Z`;
    return new Date(isoDateString);
  }
}

export const dateService = new DateService();
