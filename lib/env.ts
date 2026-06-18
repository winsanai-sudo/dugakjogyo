export function requireEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export function getMaxUploadBytes() {
  const mb = Number(process.env.MAX_UPLOAD_MB ?? "10");
  return Math.max(1, mb) * 1024 * 1024;
}
