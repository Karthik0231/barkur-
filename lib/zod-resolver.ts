export function zodResolver(schema: any) {
  return async (values: any) => {
    const result = schema.safeParse(values)
    if (result.success) {
      return { values: result.data, errors: {} }
    }
    const fieldErrors: Record<string, any> = {}
    if (result.error && result.error.issues) {
      for (const issue of result.error.issues) {
        const path = issue.path.join(".")
        if (!fieldErrors[path]) {
          fieldErrors[path] = { message: issue.message, type: issue.code }
        }
      }
    }
    return { values, errors: fieldErrors }
  }
}
