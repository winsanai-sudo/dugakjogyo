export const mbtiTypes = [
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP"
] as const;

export const allowedResumeExtensions = [".pdf", ".doc", ".docx", ".hwp"];
export const allowedSolutionExtensions = [".pdf", ".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"];

export function normalizePhone(phone: string) {
  return phone.replace(/[^\d]/g, "");
}

export function isValidKoreanPhone(phone: string) {
  const digits = normalizePhone(phone);
  return /^01[016789]\d{7,8}$/.test(digits) || /^0\d{8,10}$/.test(digits);
}

export function getFileExtension(fileName: string) {
  const dotIndex = fileName.lastIndexOf(".");
  if (dotIndex < 0) {
    return "";
  }

  return fileName.slice(dotIndex).toLowerCase();
}

export function isAllowedResumeFile(fileName: string) {
  return allowedResumeExtensions.includes(getFileExtension(fileName));
}

export function isAllowedSolutionFile(fileName: string) {
  return allowedSolutionExtensions.includes(getFileExtension(fileName));
}
