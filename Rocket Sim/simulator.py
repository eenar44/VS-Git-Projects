import pygame

# Pygame Setup
pygame.init()
WIDTH, HEIGHT = 600, 800
screen = pygame.display.set_mode((WIDTH, HEIGHT))
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

# Colours
WHITE = (255, 255, 255)
RED = (255, 100, 0)
GREY = (180, 180, 180)

# Rocket Variables
rocket_x = WIDTH // 2
rocket_y = HEIGHT - 100

# Physics Constants
GRAVITY = 0.5
THRUST = 1.2
velocity = 0
fuel = 100

# Quit Button
quit_button = pygame.Rect(500, 20, 80, 40)  # Position and size

# Game Loop
running = True
while running:
    screen.fill((0, 0, 20))  # Dark background

    # Draw Moon
    pygame.draw.circle(screen, GREY, (WIDTH // 2, 150), 80)

    # Handle Events
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.MOUSEBUTTONDOWN:
            if quit_button.collidepoint(event.pos):
                running = False  # Quit when button is clicked

    # Apply Gravity
    velocity += GRAVITY

    # Apply Thrust
    keys = pygame.key.get_pressed()
    thrust_active = keys[pygame.K_UP]

    if thrust_active and fuel > 0:
        velocity -= THRUST  # Push up
        fuel -= 0.5  # Burn fuel
    elif fuel <= 0:  # If fuel is empty
        fuel = 0  # Just to be safe
        thrust_active = False  # Stop thrust completely


    # Update Position
    rocket_y += velocity

    # Collision with Ground
    if rocket_y >= HEIGHT - 100:
        rocket_y = HEIGHT - 100
        velocity = 0

    # Draw Rocket (Triangle + Rectangle + Fins)
    body = pygame.Rect(rocket_x - 20, rocket_y, 40, 60)
    nose = [(rocket_x - 20, rocket_y), (rocket_x + 20, rocket_y), (rocket_x, rocket_y - 30)]
    fins = [(rocket_x - 30, rocket_y + 60), (rocket_x + 30, rocket_y + 60), (rocket_x, rocket_y + 40)]

    pygame.draw.polygon(screen, RED, nose)  # Rocket Nose
    pygame.draw.rect(screen, RED, body)  # Rocket Body
    pygame.draw.polygon(screen, RED, fins)  # Rocket Fins

    # Display Information
    info_text = font.render(f"Alt: {HEIGHT - rocket_y:.0f} | Vel: {velocity:.1f} | Fuel: {fuel:.0f}", True, WHITE)
    screen.blit(info_text, (20, 20))

    # Draw Quit Button
    pygame.draw.rect(screen, (200, 50, 50), quit_button)
    quit_text = font.render("QUIT", True, WHITE)
    screen.blit(quit_text, (quit_button.x + 15, quit_button.y + 10))

    pygame.display.flip()
    clock.tick(30)

pygame.quit()
