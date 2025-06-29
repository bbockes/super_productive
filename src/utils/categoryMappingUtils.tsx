const schemaToDisplayNameMap: Record<string, string> = {
  'Time-Saving Tools': '→ Saving Time',
  'Design & Creativity': '→ Creating and Designing',
  'Developer Tools': '→ Building Faster',
  'AI & Machine Learning': '→ Working with AI',
  'Marketing & Sales': '→ Growing Your Audience',
  'Finance & Crypto': '→ Managing Money',
  'Health & Wellness': '→ Feeling Better',
  'Learning & Education': '→ Learning New Skills',
  'Remote Work & Collaboration': '→ Working Together',
  'Consumer & Lifestyle': '→ Everyday Life',
};

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