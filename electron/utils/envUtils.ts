

function parseBoolean(value: string | undefined, defaultValue: boolean): boolean {
  if (value === undefined) {
    return defaultValue;
  }

  return value.trim().toLowerCase() === 'true';
}

function getEnvValue(primaryKey: string, fallbackKey: string, defaultValue = ''): string {
  return process.env[primaryKey] || process.env[fallbackKey] || defaultValue;
}


export { getEnvValue, parseBoolean };