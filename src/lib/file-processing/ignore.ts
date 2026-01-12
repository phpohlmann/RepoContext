export function shouldIgnore(
  name: string, 
  isDirectory: boolean, 
  config?: { extensions: string[], filenames: string[], directories: string[] }
): boolean {
  const lowerName = name.toLowerCase();
  
  const dirs = config?.directories || ['node_modules', '.git', '.next', 'dist', 'build'];
  const files = config?.filenames || ['package-lock.json', 'yarn.lock', '.env'];
  const exts = config?.extensions || ['png', 'jpg', 'svg', 'ico', 'pdf'];

  if (isDirectory) {
    return dirs.includes(lowerName);
  }

  const extension = lowerName.split('.').pop() || '';
  
  return (
    files.includes(lowerName) ||
    exts.includes(extension)
  );
}