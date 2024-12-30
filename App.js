import React, { useState, useEffect } from 'react';
import Bird from './components/Bird';
import Pipes from './components/Pipes';
import './App.css';

const App = () => {
    const [birdPosition, setBirdPosition] = useState({ x: 50, y: 200 });
    const [pipes, setPipes] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);

    const handleJump = () => {
        if (gameStarted && !gameOver) {
            setBirdPosition((prev) => ({ ...prev, y: prev.y - 60 }));
        } else if (!gameStarted && !gameOver) {
            setGameStarted(true);
        } else {
            setBirdPosition({ x: 50, y: 200 });
            setPipes([]);
            setGameOver(false);
            setGameStarted(true);
        }
    };

    const detectCollision = () => {
        const bird = { top: birdPosition.y, bottom: birdPosition.y + 50, left: birdPosition.x, right: birdPosition.x + 50 };
        pipes.forEach((pipe) => {
            const pipeBounds = { top: pipe.y, bottom: pipe.y + 600, left: pipe.x, right: pipe.x + 100 };
            const isHit = bird.right > pipeBounds.left && bird.left < pipeBounds.right && bird.bottom > pipeBounds.top && bird.top < pipeBounds.bottom;
            if (isHit) {
                if (bird.left > pipeBounds.left && bird.right < pipeBounds.right && bird.bottom < pipeBounds.bottom) {
                    setScore((prev) => prev + 1);
                } else {
                    setGameOver(true);
                    setGameStarted(false);
                }
            }
        });
        if (bird.bottom > 800 || bird.top < -170) {
            setGameOver(true);
            setGameStarted(false);
        }
    };

    useEffect(() => {
        detectCollision();
    }, [birdPosition, pipes]);

    useEffect(() => {
        const applyGravity = setInterval(() => {
            setBirdPosition((prev) => ({ ...prev, y: prev.y + 5 }));
            detectCollision();
        }, 30);

        const spawnPipes = setInterval(() => {
            if (!gameOver && gameStarted) {
                setPipes((prev) => [...prev, { x: 400, y: Math.floor(Math.random() * 300) }]);
            }
        }, 2000);

        const movePipes = setInterval(() => {
            if (!gameOver && gameStarted) {
                setPipes((prev) => prev.map((pipe) => ({ ...pipe, x: pipe.x - 5 })));
            }
        }, 30);

        return () => {
            clearInterval(applyGravity);
            clearInterval(spawnPipes);
            clearInterval(movePipes);
        };
    }, [gameOver, gameStarted]);

    return (
        <div className={`App ${gameOver ? 'game-over' : ''}`} onClick={handleJump}>
            <Bird birdPosition={birdPosition} />
            {pipes.map((pipe, index) => (
                <Pipes key={index} pipePosition={pipe} />
            ))}
            {gameOver && (
                <center>
                    <div className="game-over-message">
                        Game Over!
                        <br />
                        <p style={{ backgroundColor: 'blue', padding: '2px 6px', borderRadius: '5px' }}>
                            Click anywhere to Restart
                        </p>
                    </div>
                </center>
            )}
        </div>
    );
};

export default App;
