import emojiRegex from 'emoji-regex';

export const isEmojiOnly = (text: string): boolean => {
  const regex = emojiRegex();
  const strippedText = text.trim();
  const matches = strippedText.match(regex) || [];
  const joinedEmojis = matches.join('');
  return joinedEmojis === strippedText;
};

export const validateUsername = (username: string): { valid: boolean; message?: string } => {
  if (!username) {
    return { valid: false, message: 'Username is required' };
  }
  
  if (!isEmojiOnly(username)) {
    return { valid: false, message: 'Username must contain only emojis' };
  }
  
  const regex = emojiRegex();
  const emojiCount = (username.match(regex) || []).length;
  
  if (emojiCount > 8) {
    return { valid: false, message: 'Username cannot be longer than 8 emojis' };
  }
  
  return { valid: true };
};

export const validateMessage = (message: string): { valid: boolean; message?: string } => {
  if (!message) {
    return { valid: false, message: 'Message is required' };
  }
  
  if (!isEmojiOnly(message)) {
    return { valid: false, message: 'Messages must contain only emojis' };
  }
  
  if (message.length > 20) {
    return { valid: false, message: 'Message cannot be longer than 20 emojis' };
  }
  
  return { valid: true };
};
