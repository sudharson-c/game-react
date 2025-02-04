import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const levelInfo = [
  {
    title: "What is HTML?",
    description: "HTML is the standard markup language for creating web pages.",
  },
  {
    title: "What is CSS?",
    description: "CSS is used to style and layout web pages.",
  },
  {
    title: "What is JavaScript?",
    description:
      "JavaScript is a programming language that enables interactive web pages.",
  },
  {
    title: "What is React?",
    description: "React is a JavaScript library for building user interfaces.",
  },
  {
    title: "What is Node.js?",
    description:
      "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine.",
  },
];

// Maze layout where 1 = path, 0 = blocked path, "qX" = quest, "F" = finish
const mazeLayout = [
  [1, 0, "q3", 1, 1, 0, "q4", 1, "F"],
  [1, 0, 0, 0, 1, 0, 0, 1, 0],
  [1, 0, 0, 1, 1, 1, 0, 1, 1],
  [1, 1, 1, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 1, 0, 0, 1, 0, 1],
  [1, 0, 0, 1, "q2", 0, 1, 0, 1],
  [1, "q1", 0, 0, 0, 0, 1, 1, 1],
];

const questKeys = ["q1", "q2", "q3", "q4"];

const MazeGame = () => {
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [collectibles, setCollectibles] = useState(
    levelInfo.map((_, index) => ({ ..._, collected: false, index }))
  );
  const [info, setInfo] = useState({ title: "", description: "" });
  const [dialogVisible, setDialogVisible] = useState(false);
  const [profile, setProfile] = useState({ questsCollected: 0 });

  const handleKeyDown = (event) => {
    const { x, y } = playerPosition;
    let newX = x,
      newY = y;

    if (event.key === "ArrowRight" && x + 1 < mazeLayout[0].length) newX += 1;
    if (event.key === "ArrowLeft" && x - 1 >= 0) newX -= 1;
    if (event.key === "ArrowDown" && y + 1 < mazeLayout.length) newY += 1;
    if (event.key === "ArrowUp" && y - 1 >= 0) newY -= 1;

    if (canMove(newX, newY)) {
      setPlayerPosition({ x: newX, y: newY });
      checkForCollectibles(newX, newY);
      checkForFinish(newX, newY);
    }
  };

  const canMove = (x, y) => {
    return (
      mazeLayout[y] &&
      (mazeLayout[y][x] === 1 || typeof mazeLayout[y][x] === "string")
    );
  };

  const checkForCollectibles = (x, y) => {
    const questIndex = questKeys.indexOf(mazeLayout[y][x]);
    if (questIndex !== -1 && !collectibles[questIndex].collected) {
      collectConcept(questIndex);
    }
  };

  const checkForFinish = (x, y) => {
    if (
      mazeLayout[y][x] === "F" &&
      profile.questsCollected === questKeys.length
    ) {
      alert("Congratulations! You've completed the maze!");
    }
  };

  const collectConcept = (index) => {
    setInfo(collectibles[index]);
    setDialogVisible(true);
    setCollectibles((prev) =>
      prev.map((c, i) => (i === index ? { ...c, collected: true } : c))
    );
    setProfile((prev) => ({
      ...prev,
      questsCollected: prev.questsCollected + 1,
    }));
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playerPosition]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-4">Maze Learning Game</h1>
      <div className="relative grid grid-cols-9 gap-1 p-4 bg-gray-800 rounded-lg shadow-lg">
        {mazeLayout.map((row, y) =>
          row.map((cell, x) => {
            const isPlayer = playerPosition.x === x && playerPosition.y === y;
            const isPath = cell === 1;
            const isBlocked = cell === 0;
            const isQuest = questKeys.includes(cell);
            const isFinish = cell === "F";

            return (
              <div
                key={`${x}-${y}`}
                className={`w-12 h-12 flex items-center justify-center border ${
                  isPlayer
                    ? "bg-white" // Player position
                    : isPath
                    ? "bg-green-500" // Path
                    : isBlocked
                    ? "bg-gray-700" // Blocked path
                    : "bg-green-500" // Quest or Finish
                }`}
              >
                {isQuest &&
                  !collectibles[questKeys.indexOf(cell)]?.collected && (
                    <motion.div
                      className="w-6 h-6 bg-yellow-400 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    />
                  )}
                {isFinish && (
                  <div className="w-6 h-6 bg-red-500 rounded-full" />
                )}
              </div>
            );
          })
        )}
      </div>
      <div className="mt-4 text-lg">
        Quests Collected: {profile.questsCollected} / {questKeys.length}
      </div>
      {dialogVisible && (
        <div className="absolute top-20 bg-black bg-opacity-80 p-4 rounded-lg text-center">
          <h2 className="text-xl font-bold">{info.title}</h2>
          <p className="mt-2">{info.description}</p>
          <button
            onClick={() => setDialogVisible(false)}
            className="mt-3 px-4 py-2 bg-blue-500 rounded"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default MazeGame;
