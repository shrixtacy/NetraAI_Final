import { VOICE_CONFIG } from '../../config/voiceConfig';

export function formatGreeting() {
  const { WELCOME, MODE_SELECTION, MODES } = VOICE_CONFIG.MESSAGES;
  return `${WELCOME}\n${MODE_SELECTION}\n${MODES.join('\n')}`;
}