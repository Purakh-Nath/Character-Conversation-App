
import React, { useState } from 'react';
import { GoogleGenerativeAI , HarmBlockThreshold, HarmCategory} from '@google/generative-ai';
import CharacterSelection from './components/CharacterSelection';
import Conversation from './components/Conversation';

function App() {
  const [conversation, setConversation] = useState([]);


  const generatePrompt = async (characters) => {
    if (characters.length === 2) {
      const prompt = `Generate a short rap roasting battle between two characters. Each character should have a couple of lines, and each line should be concise. Use the following placeholders for the characters' names: Character 1: ${characters[0]}, Character 2: ${characters[1]}. Do not use special characters like asterisks (*) or hashtags (#) in the response. The output should be plain text only.`;


      const apiKey = `${import.meta.env.VITE_GEMINI_URL}`;
      const genAI = new GoogleGenerativeAI(apiKey);

   

      const safetySettings = [
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_NONE'
        },
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_NONE'
        }
      ];

      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        safetySettings,
      });

      const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: 'text/plain',
      };

      const chatSession = model.startChat({ generationConfig });

      try {
        const result = await chatSession.sendMessage(prompt);

        if (result.response.text) {
          console.log(result)
          setConversation(result.response.text().split('\n')); 
        } else {
          console.error('Empty response from API');
        }
      } catch (error) {
        console.error('Error generating conversation:', error);
    
        if (error.message.includes('SAFETY')) {
          alert('The content generated was blocked due to safety concerns.');
        }
      }
    }
  };

  // Function to handle text-to-speech API calls
  const handleTTS = (text) => {
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
        // console.log("APP JS",data)
        if (data.audio_link) {
          console.log("APP JS",data)
          setAudioUrl(data.audio_link); 
        } else {
          console.error('No audio link returned from TTS API');
        }
      })
      .catch((error) => {
        console.error('Error fetching TTS audio:', error);
      });
  };

  return (
    <div>
      <h1 className='text-[#A342FF] font-bold text-3xl text-center m-5'>Character Conversation App</h1>
      <CharacterSelection onSelect={generatePrompt} />
      <Conversation conversation={conversation} setConversation={setConversation}  onPlayAudio={handleTTS} />
    </div>
  );
}

export default App;
