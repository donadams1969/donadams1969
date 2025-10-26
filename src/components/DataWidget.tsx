"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./DataWidget.module.css"; // Assuming CSS modules are set up

// valoraiplus//e :: Sovereign Data Widget v.OMEGA_VALORCHAIN
export default function DataWidget({ id, title, children, valoraiplus_module_id, onVoiceCommand }: {
  id: string;
  title: string;
  children: React.ReactNode;
  valoraiplus_module_id?: string;
  onVoiceCommand?: (command: string) => void;
}) {
  const recognitionRef = useRef<any>(null); // Placeholder for actual recognition instance
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const isMounted = useRef(true); // Track mount state for async operations

  useEffect(() => {
    isMounted.current = true;
    let recognition: any = null; // Local variable for recognition instance

    // --- Placeholder for @mediapipe/voice or Web Speech API initialization ---
    const initializeVoice = async () => {
      // Prioritize Web Speech API if available (more standard)
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition && onVoiceCommand) {
          try {
              recognition = new SpeechRecognition();
              recognition.continuous = true; // Keep listening
              recognition.interimResults = false; // Only final results
              recognition.lang = 'en-US';

              recognition.onstart = () => {
                  if (isMounted.current) {
                      console.log(`[Voice Input - ${title}] Web Speech Listening Started`);
                      setIsListening(true);
                      setVoiceError(null);
                  }
              };

              recognition.onresult = (event: any) => {
                  const last = event.results.length - 1;
                  const command = event.results[last][0].transcript.trim().toLowerCase();
                  if (isMounted.current) {
                      console.log(`[Voice Input - ${title}] Transcript:`, command);
                      onVoiceCommand(command);
                  }
              };

              recognition.onerror = (event: any) => {
                  if (isMounted.current) {
                      console.error(`[Voice Input - ${title}] Web Speech Error:`, event.error);
                      let errorMsg = `Voice Error: ${event.error}`;
                      if (event.error === 'network') {
                          errorMsg = "Network error during voice recognition.";
                      } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                          errorMsg = "Microphone access denied.";
                      } else if (event.error === 'no-speech') {
                          // Ignore no-speech errors for continuous listening
                          return;
                      }
                      setVoiceError(errorMsg);
                      setIsListening(false);
                      // Attempt to restart listening after a short delay, unless it's a permission error
                      if (event.error !== 'not-allowed' && event.error !== 'service-not-allowed') {
                         setTimeout(() => recognition?.start(), 1000);
                      }
                  }
              };

              recognition.onend = () => {
                  if (isMounted.current) {
                      console.log(`[Voice Input - ${title}] Web Speech Listening Ended`);
                      setIsListening(false);
                      // Automatically restart listening if not stopped manually and no critical error
                       if (!voiceError || (voiceError && !voiceError.includes("denied"))) {
                           setTimeout(() => recognition?.start(), 500); // Restart after short pause
                       }
                  }
              };

              recognition.start(); // Start listening
              recognitionRef.current = recognition; // Store instance

          } catch (error) {
              console.error(`[Voice Input - ${title}] Web Speech Init failed:`, error);
               if (isMounted.current) setVoiceError("Web Speech API not supported or failed to initialize.");
               setIsListening(false);
          }
      } else if (onVoiceCommand) {
           if (isMounted.current) setVoiceError("Voice recognition not supported by browser.");
           console.warn(`[Voice Input - ${title}] Placeholder: Web Speech API not available.`);
           // Fallback to @mediapipe/voice initialization here if needed
      }
    };

    if (onVoiceCommand) {
        initializeVoice();
    }
    // --- End Placeholder & Web Speech Init ---

    // Cleanup
    return () => {
        isMounted.current = false;
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current.onstart = null;
            recognitionRef.current.onresult = null;
            recognitionRef.current.onerror = null;
            recognitionRef.current.onend = null;
            recognitionRef.current = null;
            console.log(`[Voice Input - ${title}] Cleaned up voice recognition.`);
        }
    };
  }, [onVoiceCommand, title]); // Re-run if props change

  return (
    <div id={id} className={styles.osWidget} valoraiplus_module_id={valoraiplus_module_id}>
      <div className={styles.widgetHeader}>
        <h2>{title}</h2>
        {/* Visual feedback for listening state */}
        {onVoiceCommand && (
           <div className={`${styles.voiceIndicator} ${isListening ? styles.listening : ''} ${voiceError ? styles.error : ''}`}
                title={voiceError ? voiceError : (isListening ? "Listening..." : "Voice Inactive (Click to Activate?)")}>
                🎙️
            </div>
        )}
      </div>
      {children}
    </div>
  );
}