export function getConcept(name: string) {
  const shortName =
    name.trim().split(" ").length > 1 ? name.split(" ")[0] : name;

  return `Pago de servicios de ${shortName}`;
}
