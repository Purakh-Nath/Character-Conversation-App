
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
const characters = [
  'Donald Trump',
  'Peter Griffin',
  'Kamala Harris',
  'Ryan Reynolds (Deadpool)',
  'Hugh Jackman (Wolverine)',
];

function CharacterSelection({ onSelect }) {
  const [selectedCharacters, setSelectedCharacters] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleCharacter = (character) => {
    if (selectedCharacters.includes(character)) {
      setSelectedCharacters(selectedCharacters.filter((c) => c !== character));
    } else if (selectedCharacters.length < 2) {
      setSelectedCharacters([...selectedCharacters, character]);
    }
  };

  const handleSelection = async () => {
    setLoading(true);
    await onSelect(selectedCharacters);
    setLoading(false);
  };

  return (
    <div>
      <h3 className='text-center font-light text-4xl m-5'>Select up to 2 Characters</h3>
      <div className="flex justify-center items-center bg-dark">
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-1 sm:space-y-0 overflow-x-auto">
          {characters.map((character) => (
            <div className="flex items-center space-x-2 bg-white p-4 rounded-lg shadow-md" key={character}>
              <input
                type="checkbox"
                checked={selectedCharacters.includes(character)}
                onChange={() => toggleCharacter(character)}
                className="form-checkbox h-5 w-5 text-indigo-600"
              />
              <label className="text-gray-900">{character}</label>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center items-center m-5">
      {/* <button class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary-foreground bg-gradient-to-r from-[#AB40FF] to-[#4D5EFF] h-14 px-10 mt-4 rounded-full">Get Started</button> */}
        <Button onClick={handleSelection} variant="destructive">
          {loading ? (
            <span className="flex items-center">
              <span className="loader mr-2"></span> Generating...
            </span>
          ) : (
            'Generate Prompt'
          )}
        </Button>
      </div>
    </div>
  );
}

export default CharacterSelection;

