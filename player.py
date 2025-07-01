import sys
import pygame

file_path = sys.argv[1]

pygame.mixer.init()
pygame.mixer.music.load(file_path)
pygame.mixer.music.play()

# Waits until music ends
while pygame.mixer.music.get_busy():
    pygame.time.Clock().tick(10)