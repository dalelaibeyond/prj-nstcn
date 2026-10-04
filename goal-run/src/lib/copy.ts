// Copy is rendered from structured blocks. Escape text before supporting inline emphasis.
export function inlineCopy(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}
