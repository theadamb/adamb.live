const audioContext = new (window.AudioContext || window.webkitAudioContext)();

export const playChime = () => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Set a pleasant frequency for the chime
  oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5 note

  // Set volume
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
  gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1);

  // Start and stop
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 1);
};
