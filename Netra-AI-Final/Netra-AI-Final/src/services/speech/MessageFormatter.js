export class MessageFormatter {
  static formatNavigationMessage(message, threatLevel) {
    // Keep the exact same message text for consistency
    return message;
  }
  
  static getPriority(message) {
    if (message.includes('Stop!')) return 'high';
    if (message.includes('Move')) return 'medium';
    return 'low';
  }
}