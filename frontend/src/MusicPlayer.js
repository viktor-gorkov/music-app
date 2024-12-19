import React, { useState, useRef } from "react"; // Импорт хуки из React
import "./MusicPlayer.css"; // Импортируем стили

// Список треков
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

// Плеер
const MusicPlayer = ({ darkMode }) => {
    // Состояние текущего трека (воспроизведение и громкость)
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0); // Индекс текущего трека
    const [isPlaying, setIsPlaying] = useState(false); // Флаг, воспроизводится ли трек
    const [volume, setVolume] = useState(50); // Уровень громкости

    // Ссылка на audio для управления воспроизведением
    const audioRef = useRef(null);

    // Функция воспроизведение трека
    const playTrack = () => {
        audioRef.current.play(); // Воспроизведение
        setIsPlaying(true); // Флаг - трек воспроизводится
    };

    // Функция паузы
    const pauseTrack = () => {
        audioRef.current.pause(); // Пауза
        setIsPlaying(false); // Флаг - трек на паузе
    };

    // Функция перехода к следующему треку
    const nextTrack = () => {
        const nextIndex = (currentTrackIndex + 1) % tracks.length; // Рассчитываем индекс следующего трека
        setCurrentTrackIndex(nextIndex); // Установка индекса следующего трека
        setIsPlaying(false); // Остановка воспроизведения
    };

    // Функция перехода к предыдущему треку
    const prevTrack = () => {
        const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length; // Рассчет индекса предыдущего трека
        setCurrentTrackIndex(prevIndex); // Установка индекса предыдущего трека
        setIsPlaying(false); // Остановка воспроизведения
    };

    // Функция изменения громкости
    const handleVolumeChange = (e) => {
        setVolume(e.target.value); // Обновление значения громкости
        audioRef.current.volume = e.target.value / 100; // Изменение громкости ползунком
    };

    return (
        <div className={`music-player ${darkMode ? "dark" : ""}`}> {/* Если включен темный режим - добавляется класс 'dark' */}
            <audio
                ref={audioRef} // Привязка ссылки к элементу audio
                src={tracks[currentTrackIndex].src} // Источник текущего трека
                onEnded={nextTrack} // Трек закончился - следующий трек
                onPlay={() => setIsPlaying(true)} // Трек воспроизводиться - флаг в true
                onPause={() => setIsPlaying(false)} // Трек на паузу - флаг в false
                autoPlay={isPlaying} // Автоматически воспроизводить если (isPlaying == true)
            />

            <div className="track-info">
                <p>
                    {/* Информация о текущем треке */}
                    <strong>{tracks[currentTrackIndex].title}</strong> — {tracks[currentTrackIndex].artist}
                </p>
            </div>

            <div className="controls">
                {/* Кнопки управления */}
                <button onClick={prevTrack}>⏪ </button> {/* Кнопка предыдущего трека */}
                {isPlaying ? (
                    <button onClick={pauseTrack}>⏸ </button> // Кнопка паузы, если трек воспроизводится
                ) : (
                    <button onClick={playTrack}>▶ </button> // Кнопка воспроизведения, если трек на паузе
                )}
                <button onClick={nextTrack}>⏩ </button> {/* Кнопка следующего трека */}
            </div>

            <div className="volume-control">
                <label>Громкость:</label>
                <input
                    type="range"
                    min="0" // Минимальное значение ползунка
                    max="100" // Максимальное значение ползунка
                    value={volume} // Текущее значение громкости
                    onChange={handleVolumeChange} // Обработка изменения громкости
                />
            </div>
        </div>
    );
};

export default MusicPlayer; // Экспорт MusicPlayer
