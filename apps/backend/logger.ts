
export function customLogger(message: string): void {
    const time = new Date().toLocaleString()

    console.log(`[${time}] ${message} [customLogger]`)
}
