import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const levelInfo = [
  {
    title: "Challenge 1",
    description:
      "HyperText Markup Language is the standard markup language for creating web pages.",
    challenge: "H_ML",
    answer: "T",
  },
  {
    title: "Challenge 2",
    description: "Cascading Style Sheet is used to style and layout web pages.",
    challenge: "_SS",
    answer: "C",
  },
  {
    title: "Challenge 3",
    description:
      "It is a programming language that enables interactive web pages.",
    challenge: "Java_cript",
    answer: "S",
  },
  {
    title: "Challenge 4",
    description: "An UI Library used to build best Frontends",
    challenge: "_eactJS",
    answer: "R",
  },
];

const mazeLayout = [
  [1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, "F"],
  [1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1],
  [0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
  [0, 0, 1, 0, 1, 1, 1, "q2", 1, 1, 1, 0, 0, 0, 1],
  [0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1],
  [1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0],
  [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0],
  [1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
  [1, "q1", 0, 0, 1, 0, 0, 0, 1, 1, "q3", 0, 1, 1, "q4"],
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
  const [currentChallenge, setCurrentChallenge] = useState(null);

  const restartGame = () => {
    setPlayerPosition({ x: 0, y: 0 });
    setCollectibles(
      levelInfo.map((_, index) => ({ ..._, collected: false, index }))
    );
    setProfile({ questsCollected: 0 });
    setInfo({ title: "", description: "" });
    setDialogVisible(false);
    setCurrentChallenge(null);
  };

  const movePlayer = (direction) => {
    if (currentChallenge !== null) return;

    const { x, y } = playerPosition;
    let newX = x,
      newY = y;

    if (direction === "ArrowRight" && x + 1 < mazeLayout[0].length) newX += 1;
    if (direction === "ArrowLeft" && x - 1 >= 0) newX -= 1;
    if (direction === "ArrowDown" && y + 1 < mazeLayout.length) newY += 1;
    if (direction === "ArrowUp" && y - 1 >= 0) newY -= 1;

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
    if (questIndex !== -1) {
      if (collectibles[questIndex].collected) return;

      if (questIndex === profile.questsCollected) {
        setCurrentChallenge(questIndex);
      } else {
        alert("You must collect the quests in order!");
      }
    }
  };

  const checkForFinish = (x, y) => {
    if (
      mazeLayout[y][x] === "F" &&
      profile.questsCollected === questKeys.length
    ) {
      alert("Vilayandathu pothum, screen paarunga frands😁 ");
    }
  };

  const collectConcept = (index, userAnswer) => {
    const correctAnswer = levelInfo[index].answer.toUpperCase();
    if (userAnswer.trim().toUpperCase() === correctAnswer) {
      setInfo(collectibles[index]);
      setDialogVisible(true);
      setCollectibles((prev) =>
        prev.map((c, i) => (i === index ? { ...c, collected: true } : c))
      );
      setProfile((prev) => ({
        ...prev,
        questsCollected: prev.questsCollected + 1,
      }));
      setCurrentChallenge(null);
    } else {
      alert("Incorrect answer! Try again.");
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      movePlayer(event.key);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playerPosition, currentChallenge]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-xl md:text-2xl font-bold mb-4 text-center">
        Maze Web Developer Roadmap
      </h1>
      <button
        onClick={restartGame}
        className="mb-4 px-4 py-2 bg-blue-500 rounded"
      >
        Restart Game
      </button>
      <div
        className="relative grid gap-1 p-4 bg-gray-800 rounded-lg shadow-lg"
        style={{
          gridTemplateColumns: `repeat(${mazeLayout[0].length}, minmax(20px, 1fr))`,
        }}
      >
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
                className={`flex items-center justify-center border ${
                  isPlayer
                    ? "bg-blue-500" // Player position
                    : isPath
                    ? "bg-green-500" // Path
                    : isBlocked
                    ? "bg-gray-700" // Blocked path
                    : "bg-yellow-500" // Quest or Finish
                }`}
                style={{
                  aspectRatio: "1 / 1", // Ensure square cells
                  minWidth: "20px", // Minimum size for small screens
                  minHeight: "20px",
                }}
              >
                {isQuest &&
                  !collectibles[questKeys.indexOf(cell)]?.collected && (
                    <motion.div
                      className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      <p className="text-black text-xs">
                        {questKeys.indexOf(cell) + 1}
                      </p>
                    </motion.div>
                  )}
                {isFinish && (
                  <div className="w-4 h-4 bg-red-500 rounded-full" />
                )}
              </div>
            );
          })
        )}
      </div>
      <div className="mt-4 text-lg text-center">
        Quests Collected: {profile.questsCollected} / {questKeys.length}
      </div>

      {/* Dialog for Challenges */}
      {currentChallenge !== null && (
        <div className="absolute top-20 bg-black bg-opacity-80 p-4 rounded-lg text-center">
          <h2 className="text-xl font-bold">
            {levelInfo[currentChallenge].title}
          </h2>
          <p className="mt-2">{levelInfo[currentChallenge].description}</p>
          <p className="mt-4 font-semibold">
            {levelInfo[currentChallenge].challenge}
          </p>
          <input
            type="text"
            maxLength={1} // Restrict input to a single character
            className="mt-2 px-2 py-1 rounded border border-gray-300 bg-gray-700 text-white w-12 text-center"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                collectConcept(currentChallenge, e.target.value);
              }
            }}
            autoFocus
          />
        </div>
      )}

      {/* Dialog for Information */}
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

      {/* Virtual Keypad for Mobile */}
      <div className=" bottom-4 left-0 right-0 flex flex-col items-center space-y-2">
        <div className="flex space-x-2">
          <button
            onClick={() => movePlayer("ArrowUp")}
            className="px-4 py-2 bg-blue-500 rounded"
          >
            ↑
          </button>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => movePlayer("ArrowLeft")}
            className="px-4 py-2 bg-blue-500 rounded"
          >
            ←
          </button>
          <button
            onClick={() => movePlayer("ArrowDown")}
            className="px-4 py-2 bg-blue-500 rounded"
          >
            ↓
          </button>
          <button
            onClick={() => movePlayer("ArrowRight")}
            className="px-4 py-2 bg-blue-500 rounded"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default MazeGame;
