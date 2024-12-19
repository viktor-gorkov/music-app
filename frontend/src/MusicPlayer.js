import React, { useState, useRef } from "react";
import "./MusicPlayer.css";

const tracks = [
    {
        title: "Трек 1",
        artist: "Исполнитель 1",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    },
    {
        title: "Трек 2",
        artist: "Исполнитель 2",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    },
    {
        title: "Трек 3",
        artist: "Исполнитель 3",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    },
];

const MusicPlayer = ({ darkMode }) => {
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(50);
    const audioRef = useRef(null);

    const playTrack = () => {
        audioRef.current.play();
        setIsPlaying(true);
    };

    const pauseTrack = () => {
        audioRef.current.pause();
        setIsPlaying(false);
    };

    const nextTrack = () => {
        const nextIndex = (currentTrackIndex + 1) % tracks.length;
        setCurrentTrackIndex(nextIndex);
        setIsPlaying(false);
    };

    const prevTrack = () => {
        const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
        setCurrentTrackIndex(prevIndex);
        setIsPlaying(false);
    };

    const handleVolumeChange = (e) => {
        setVolume(e.target.value);
        audioRef.current.volume = e.target.value / 100;
    };

    return (
        <div className={`music-player ${darkMode ? "dark" : ""}`}>
            {/* Аудиоплеер */}
            <audio
                ref={audioRef}
                src={tracks[currentTrackIndex].src}
                onEnded={nextTrack}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                autoPlay={isPlaying}
            />

            {/* Информация о текущем треке */}
            <div className="track-info">
                <p>
                    <strong>{tracks[currentTrackIndex].title}</strong> — {tracks[currentTrackIndex].artist}
                </p>
            </div>

            {/* Управление воспроизведением */}
            <div className="controls">
                <button onClick={prevTrack}>⏪ </button>
                {isPlaying ? (
                    <button onClick={pauseTrack}>⏸ </button>
                ) : (
                    <button onClick={playTrack}>▶ </button>
                )}
                <button onClick={nextTrack}>⏩ </button>
            </div>

            {/* Регулировка громкости */}
            <div className="volume-control">
                <label>Громкость:</label>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                />
            </div>
        </div>
    );
};

export default MusicPlayer;

