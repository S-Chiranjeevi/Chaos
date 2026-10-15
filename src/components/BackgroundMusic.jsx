import React, { useEffect, useRef, useState } from 'react'
import { Music2, Pause, Play, Volume2, VolumeX } from 'lucide-react'

const MUSIC_SOURCE = `${import.meta.env.BASE_URL}audio/soothing-background.mpeg`

/** A user-controlled ambient audio player. Audio only starts after a visitor chooses Play. */
export function BackgroundMusic() {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.22)
  const [message, setMessage] = useState('Soothing music is off')

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  useEffect(() => () => {
    audioRef.current?.pause()
  }, [])

  async function togglePlayback() {
    const audio = audioRef.current
    if (!audio) return

    if (audio.paused) {
      try {
        await audio.play()
        setIsPlaying(true)
        setMessage('Soothing music is playing')
      } catch {
        setMessage('Music could not start. Try the play button again.')
      }
      return
    }

    audio.pause()
    setIsPlaying(false)
    setMessage('Soothing music is paused')
  }

  function toggleMute() {
    const nextVolume = volume > 0 ? 0 : 0.22
    setVolume(nextVolume)
    setMessage(nextVolume === 0 ? 'Soothing music is muted' : 'Soothing music volume is restored')
  }

  return (
    <aside className="background-music" aria-label="Soothing background music">
      <audio ref={audioRef} loop preload="metadata">
        <source src={MUSIC_SOURCE} type="audio/mpeg" />
      </audio>
      <div className="background-music-copy">
        <Music2 size={18} aria-hidden="true" />
        <div><strong>Soothing music</strong><span role="status">{message}</span></div>
      </div>
      <div className="background-music-controls">
        <button type="button" className="music-icon-button" onClick={togglePlayback} aria-label={isPlaying ? 'Pause soothing music' : 'Play soothing music'}>
          {isPlaying ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
        </button>
        <button type="button" className="music-icon-button" onClick={toggleMute} aria-label={volume > 0 ? 'Mute soothing music' : 'Restore soothing music volume'}>
          {volume > 0 ? <Volume2 size={18} aria-hidden="true" /> : <VolumeX size={18} aria-hidden="true" />}
        </button>
        <label className="music-volume-label">
          <span className="sr-only">Music volume</span>
          <input type="range" min="0" max="0.5" step="0.05" value={volume} onChange={(event) => setVolume(Number(event.target.value))} />
        </label>
      </div>
    </aside>
  )
}

export default BackgroundMusic
