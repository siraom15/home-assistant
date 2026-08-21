"use client";

import { useState } from "react";
import type { HAState } from "@/lib/home-assistant/types";
import { useHAState } from "@/hooks/useHAState";

interface LightCardProps {
  entityId: string;
  name: string;
  initialState: HAState;
}

export function LightCard({
  entityId,
  name,
  initialState,
}: LightCardProps) {
  const [loading, setLoading] = useState(false);
  const [pendingBrightness, setPendingBrightness] = useState<number | null>(
    null
  );

  const light = useHAState(initialState);

  const currentIsOn = light.state === "on";

  const rawBrightness = light.attributes.brightness;

  const haBrightness =
    typeof rawBrightness === "number"
      ? Math.round((rawBrightness / 255) * 100)
      : 100;

  const currentBrightness =
    pendingBrightness ?? haBrightness;

  async function controlLight(
    payload: Record<string, unknown>
  ) {
    setLoading(true);

    try {
      const response = await fetch("/api/lights/control", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.text();

        throw new Error(
          `Light control failed ${response.status}: ${body}`
        );
      }

      return await response.json();
    } finally {
      setLoading(false);
    }
  }

  async function turnOn() {
    try {
      await controlLight({
        entityId,
        action: "turn_on",
        brightnessPct: currentBrightness,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function turnOff() {
    try {
      await controlLight({
        entityId,
        action: "turn_off",
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function setBrightness(value: number) {
    try {
      await controlLight({
        entityId,
        action: "turn_on",
        brightnessPct: value,
      });

      setPendingBrightness(null);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div
      className={`
        relative overflow-hidden rounded-3xl border p-5
        transition-all duration-300
        ${
          currentIsOn
            ? "border-amber-300/40 bg-amber-50 shadow-lg shadow-amber-100"
            : "border-zinc-200 bg-white shadow-sm"
        }
      `}
    >
      {currentIsOn && (
        <div
          className="
            pointer-events-none
            absolute -right-10 -top-10
            h-32 w-32
            rounded-full
            bg-amber-300/30
            blur-3xl
          "
        />
      )}

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`
                flex h-12 w-12
                items-center justify-center
                rounded-2xl
                transition-colors
                ${
                  currentIsOn
                    ? "bg-amber-400 text-white"
                    : "bg-zinc-100 text-zinc-500"
                }
              `}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="
                    M9 18h6
                    m-5 3h4
                    m-7.5-8.5
                    A6 6 0 1 1 17.5 12.5
                    c-.9.8-1.5 1.7-1.8 2.5
                    h-7.4
                    c-.3-.8-.9-1.7-1.8-2.5Z
                  "
                />
              </svg>
            </div>

            <div>
              <h2 className="text-base font-semibold text-zinc-900">
                {name}
              </h2>

              <p className="mt-0.5 text-xs text-zinc-400">
                {entityId}
              </p>
            </div>
          </div>

          <div
            className={`
              rounded-full px-3 py-1
              text-xs font-semibold
              transition-colors
              ${
                currentIsOn
                  ? "bg-amber-100 text-amber-700"
                  : "bg-zinc-100 text-zinc-500"
              }
            `}
          >
            {currentIsOn ? "ON" : "OFF"}
          </div>
        </div>

        {/* Brightness */}
        <div className="mt-6">
          <div className="flex items-end justify-between">
            <div>
              <p
                className="
                  text-xs font-medium
                  uppercase tracking-wider
                  text-zinc-400
                "
              >
                Brightness
              </p>

              <p
                className="
                  mt-1 text-3xl
                  font-semibold tracking-tight
                  text-zinc-900
                "
              >
                {currentBrightness}

                <span className="ml-1 text-lg text-zinc-400">
                  %
                </span>
              </p>
            </div>

            {loading && (
              <span className="text-xs text-zinc-400">
                Updating...
              </span>
            )}
          </div>

          <input
            type="range"
            min={1}
            max={100}
            value={currentBrightness}
            disabled={loading}
            onChange={(event) => {
              setPendingBrightness(
                Number(event.target.value)
              );
            }}
            onMouseUp={(event) => {
              const value = Number(
                (event.target as HTMLInputElement).value
              );

              void setBrightness(value);
            }}
            onTouchEnd={(event) => {
              const value = Number(
                (event.target as HTMLInputElement).value
              );

              void setBrightness(value);
            }}
            className="
              mt-4 w-full
              cursor-pointer
              accent-amber-400
              disabled:cursor-not-allowed
            "
          />
        </div>

        {/* Controls */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={loading || currentIsOn}
            onClick={() => void turnOn()}
            className={`
              rounded-2xl
              px-4 py-3
              text-sm font-medium
              transition-all
              disabled:cursor-not-allowed
              disabled:opacity-50
              ${
                currentIsOn
                  ? "bg-amber-400 text-white"
                  : "bg-zinc-900 text-white hover:bg-zinc-800"
              }
            `}
          >
            Turn On
          </button>

          <button
            type="button"
            disabled={loading || !currentIsOn}
            onClick={() => void turnOff()}
            className="
              rounded-2xl
              border border-zinc-200
              bg-white
              px-4 py-3
              text-sm font-medium
              text-zinc-700
              transition-all
              hover:bg-zinc-50
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Turn Off
          </button>
        </div>
      </div>
    </div>
  );
}