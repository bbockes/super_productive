const schemaToDisplayNameMap: Record<string, string> = {};

export function getCategoryDisplayName(schemaCategory: string): string {
  return schemaToDisplayNameMap[schemaCategory] || schemaCategory;
}

export function getSchemaCategory(displayName: string): string {
  if (displayName === 'All') {
    return 'All';
  }
  
  for (const schemaName in schemaToDisplayNameMap) {
    if (schemaToDisplayNameMap[schemaName] === displayName) {
      return schemaName;
    }
  }
  
  return displayName;
}