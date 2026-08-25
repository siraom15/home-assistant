"use client"

import { useEffect, useState } from "react"

export default function AutoCounter() {
  const [seconds, setSeconds] = useState<number>(0)
  const [isRunning, setIsRunning] = useState<boolean>(false)

  function toggleRunning(): void {
    setIsRunning((previous) => !previous)
  }

  function reset(): void {
    setSeconds(0)
  }

  useEffect(() => {
    if (!isRunning) {
      return
    }

    const intervalId = window.setInterval(() => {
      setSeconds((previousSeconds) => previousSeconds + 1)
    }, 1000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [isRunning])

  return (
    <div>
      <h1>Auto Counter</h1>

      <p>Seconds: {seconds}</p>
      <p>Status: {isRunning ? "Running" : "Paused"}</p>

      <button onClick={toggleRunning}>
        {isRunning ? "Pause" : "Start"}
      </button>

      <button onClick={reset}>Reset</button>
    </div>
  )
}