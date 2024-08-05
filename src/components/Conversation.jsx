
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";

function Conversation({ conversation = [], setConversation }) {
  const [audioUrls, setAudioUrls] = useState({});
  const [loading, setLoading] = useState({});
  const audioRefs = useRef({});

  const handleTTS = (text, index) => {
    setLoading((prev) => ({ ...prev, [index]: true }));
    fetch(`${import.meta.env.VITE_TTS_URL}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_TTS_AUTH}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {
          text,
          language: 'en',
          model_id: `${import.meta.env.VITE_TTS_ID}`,
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.s3_path) {
          setAudioUrls((prev) => ({ ...prev, [index]: data.s3_path }));
        } else {
          console.error('No audio link returned from TTS API');
        }
        setLoading((prev) => ({ ...prev, [index]: false }));
      })
      .catch((error) => {
        console.error('Error fetching TTS audio:', error);
        setLoading((prev) => ({ ...prev, [index]: false }));
      });
  };

  const togglePlayPause = (index) => {
    const audio = audioRefs.current[index];
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  };

  const updateProgressBar = (index) => {
    const audio = audioRefs.current[index];
    const progress = (audio.currentTime / audio.duration) * 100;
    document.getElementById(`progress-bar-${index}`).style.width = `${progress}%`;
  };

  return (
    <div className="p-4 bg-dark rounded-lg shadow-lg overflow-y-auto max-h-[80vh]">
      {conversation.length > 0 && conversation.map((line, index) => (
        line.trim() !== '' && (
          <div key={index} className={`mb-4 flex ${index % 2 === 0 ? 'flex-row-reverse' : ''} items-start`}>
            <div className={`chat-bubble p-4 ${index % 2 === 0 ? 'bg-gray-800 text-white' : 'bg-gray-900 text-gray-200'} rounded-lg shadow-md mb-2 w-full max-w-[75%]`}>
              <textarea
                className={`w-full bg-transparent border-none resize-none focus:outline-none ${index % 2 === 0 ? 'text-white' : 'text-gray-200'} font-semibold`}
                value={line}
                onChange={(e) => {
                  const updatedConversation = [...conversation];
                  updatedConversation[index] = e.target.value;
                  setConversation(updatedConversation);
                }}
              />
              <div className="text-xs text-gray-400 mt-1 text-right">
               
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            <div className={`flex items-center space-x-4 ${index % 2 === 0 ? 'justify-end' : 'justify-start'} w-full`}>
              <Button onClick={() => handleTTS(line, index)} variant="outline" className="mr-2">
                {loading[index] ? (
                  <span className="flex items-center">
                    <span className="loader mr-2"></span> Loading...
                  </span>
                ) : (
                  'Play Audio'
                )}
              </Button>
              {audioUrls[index] && (
                <div className="audio-control flex items-center space-x-2">
                  <button
                    onClick={() => togglePlayPause(index)}
                    className="play-pause-btn bg-blue-600 text-white p-2 rounded-full hover:bg-blue-800"
                  >
                    Play/Pause
                  </button>
                  <audio
                    ref={(el) => (audioRefs.current[index] = el)}
                    src={audioUrls[index]}
                    className="hidden"
                    onTimeUpdate={() => updateProgressBar(index)}
                  />
                  <div className="progress-bar-container w-full rounded h-2 bg-gray-600 relative">
                    <div id={`progress-bar-${index}`} className="progress h-2 bg-blue-600 rounded absolute top-0 left-0" style={{ width: '0%' }}></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      ))}
    </div>
  );
}

export default Conversation;
