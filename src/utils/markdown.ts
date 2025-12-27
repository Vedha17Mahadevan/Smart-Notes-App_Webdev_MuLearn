export function parseMarkdown(text: string): string {
  let html = text;

  html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mb-2">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mb-2">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-3">$1</h1>');

  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');

  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 underline" target="_blank" rel="noopener noreferrer">$1</a>');

  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">$1</code>');

  html = html.replace(/^\* (.+)$/gim, '<li class="ml-4">$1</li>');
  html = html.replace(/^- (.+)$/gim, '<li class="ml-4">$1</li>');
  html = html.replace(/(<li class="ml-4">.*<\/li>)/s, '<ul class="list-disc mb-2">$1</ul>');

  html = html.replace(/\n\n/g, '</p><p class="mb-2">');
  html = '<p class="mb-2">' + html + '</p>';

  return html;
}
