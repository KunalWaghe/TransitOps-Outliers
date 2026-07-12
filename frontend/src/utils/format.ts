export function formatDate(value: string | Date): string {
  const date =
    typeof value === "string"
      ? value.length === 10
        ? new Date(`${value}T00:00:00`)
        : new Date(value)
      : value
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}
