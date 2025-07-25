class DateService {
  public formatedTimestamp(newDate?: Date) {
    const d = newDate ?? new Date();
    console.log({ d });
    const date = d.toISOString().split("T")[0];
    const time = d.toTimeString().split(" ")[0].replace(/:/g, "-");
    return `${date} ${time}`;
  }

  public convertDate(dateString: string | null | undefined): Date {
    // If dateString is null or undefined, return current date as fallback
    if (!dateString) {
      return new Date();
    }

    try {
      const [datePart, timePart] = dateString.split(" ");

      // Additional validation to prevent errors
      if (!datePart || !timePart) {
        console.warn(
          `Invalid date format: ${dateString}, using current date instead`,
        );
        return new Date();
      }

      const timePartCorrected = timePart.replace(/-/g, ":");
      const isoDateString = `${datePart}T${timePartCorrected}Z`;

      const result = new Date(isoDateString);

      // Check if the result is a valid date
      if (Number.isNaN(result.getTime())) {
        console.warn(
          `Invalid date created from: ${dateString}, using current date instead`,
        );
        return new Date();
      }

      return result;
    } catch (error) {
      console.error(`Error converting date: ${dateString}`, error);
      return new Date();
    }
  }
}

export const dateService = new DateService();
