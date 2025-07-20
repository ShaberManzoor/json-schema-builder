export function generateJSON(fields: any[]): any {
  const result: Record<string, any> = {};

  fields.forEach((field) => {
    if (!field.key) return;

    if (field.type === "nested") {
      result[field.key] = generateJSON(field.children || []);
    } else if (field.type === "string") {
      result[field.key] = field.value ?? "";
    } else if (field.type === "number") {
      result[field.key] = Number(field.value ?? 0);
    }
  });

  return result;
}
