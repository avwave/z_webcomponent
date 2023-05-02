//Magic numbers to detect mimeType
const signatures = {
  JVBERi0: "application/pdf",
  R0lGODdh: "image/gif",
  R0lGODlh: "image/gif",
  iVBORw0KGgo: "image/png",
  "/9j/": "image/jpg"
}
export function getMimeType(str) {
  for (var s in signatures) {
    if (str.indexOf(s) === 0) return signatures[s];
  }
  return '';
}

