import sys
import pygame
import os

pygame.init()
pygame.mixer.init()
clock = pygame.time.Clock()

paused = False

def load_and_play(file_path):
    global paused
    if pygame.mixer.music.get_busy():
        pygame.mixer.music.stop()
    pygame.mixer.music.load(file_path)
    pygame.mixer.music.play()
    paused = False

print("READY", flush=True)

while True:
    try:
        command = sys.stdin.readline()
        if not command:
            continue
        command = command.strip()

        if command.startswith("load "):
            file_path = command[5:].strip()
            print(f"DEBUG: {repr(file_path)}", flush=True)

            if not os.path.exists(file_path):
                print(f"ERROR: File not found - {file_path}", flush=True)
                continue

            load_and_play(file_path)
            print(f"PLAYING {file_path}", flush=True)

        elif command == "pause":
            if pygame.mixer.music.get_busy() and not paused:
                pygame.mixer.music.pause()
                paused = True
                print("PAUSED", flush=True)

        elif command == "resume":
            if paused:
                pygame.mixer.music.unpause()
                paused = False
                print("RESUMED", flush=True)

        elif command == "stop":
            pygame.mixer.music.stop()
            paused = False
            print("STOPPED", flush=True)

        elif command.startswith("volume "):
            try:
                volume = int(command.split()[1])
                volume = max(0, min(volume, 100))
                pygame.mixer.music.set_volume(volume / 100.0)
                print(f"VOLUME SET TO {volume}", flush=True)
            except Exception as e:
                print(f"VOLUME ERROR: {e}", flush=True)

        clock.tick(10)

    except Exception as e:
        print(f"ERROR: {str(e)}", flush=True)
