export class SpeechQueue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
  }

  add(message, priority) {
    // Remove any duplicate messages in the queue
    this.queue = this.queue.filter(m => m.text !== message.text);
    
    // Insert based on priority
    const index = this.queue.findIndex(m => m.priority < priority);
    if (index === -1) {
      this.queue.push({ text: message, priority });
    } else {
      this.queue.splice(index, 0, { text: message, priority });
    }
  }

  clear() {
    this.queue = [];
  }

  isEmpty() {
    return this.queue.length === 0;
  }

  next() {
    return this.queue.shift();
  }
}