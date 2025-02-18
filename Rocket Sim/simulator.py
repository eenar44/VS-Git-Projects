import pygame
import math
import student  # Import student-defined variables and functions

# pygame setup
pygame.init()
WIDTH, HEIGHT = 600, 800
screen = pygame.display.set_mode((WIDTH, HEIGHT))
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

# colours
WHITE = (255, 255, 255)
RED = (255, 100, 0)
GREY = (180, 180, 180)

# rocket variables
rocket_x = WIDTH // 2
rocket_y = HEIGHT - 100
vx = 0 
vy = 0 
fuel = 100
angle = 90  # rocket starts pointing straight up

# Quit Button
quit_button = pygame.Rect(500, 20, 80, 40)

# game Loop
running = True
while running:
    screen.fill((0, 0, 20))

    # draw Moon
    pygame.draw.circle(screen, GREY, (WIDTH // 2, 150), 80)

    # handle Events
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.MOUSEBUTTONDOWN:
            if quit_button.collidepoint(event.pos):
                running = False  # Quit when button is clicked

    # apply Gravity
    vy += student.GRAVITY  # Gravity pulls the rocket down

    # handle Rotation (Left/Right)
    keys = pygame.key.get_pressed()
    
    if keys[pygame.K_LEFT]:  # Rotate left
        angle += 2
    if keys[pygame.K_RIGHT]:  # Rotate right
        angle -= 2

    # thrust Logic (Upward thrust applied in direction of rocket angle)
    thrust_active = keys[pygame.K_UP] or student.autopilot(rocket_y, vy)

    if thrust_active and fuel > 0:
        # Apply thrust based on rocket angle (correctly using sin/cos)

        if abs(angle - 90) < 1 or abs(angle - 270) < 1:  # Rocket is pointing straight up or down
            thrust_x = 0  # No horizontal thrust
            thrust_y = -student.THRUST if angle == 90 else student.THRUST  # Upward or downward

        elif angle < 90:  # For angles less than 90 degrees (Rocket pointing up and to the right)
            thrust_x = student.THRUST * math.sin(math.radians(angle))  # Positive horizontal thrust (right)
            thrust_y = -student.THRUST * math.cos(math.radians(angle))  # Vertical thrust (upward)
        else:  # For angles greater than 90 degrees (Rocket pointing up and to the left)
            thrust_x = student.THRUST * -math.sin(math.radians(angle))  # Negative horizontal thrust (left)
            thrust_y = student.THRUST * math.cos(math.radians(angle))  # Vertical thrust (upward)

        # Debugging thrust values
        # print("Angle:", angle, "Thrust X:", thrust_x, "Thrust Y:", thrust_y)

        # Update velocity with the thrust values
        vx += thrust_x  # Add horizontal component to velocity
        vy += thrust_y  # Add vertical component to velocity
        fuel -= 0.5  # Reduce fuel

    # update Position
    rocket_x += vx
    rocket_y += vy

    # collision with ground (when rocket reaches the bottom)
    if rocket_y >= HEIGHT - 100:
        rocket_y = HEIGHT - 100
        vy = 0  # Stop vertical movement
        vx = 0  # Stop horizontal movement

    # draw Rocket (Now it Rotates!)
    rocket_surface = pygame.Surface((40, 60), pygame.SRCALPHA)  # Create a blank surface
    pygame.draw.polygon(rocket_surface, RED, [(20, 0), (40, 30), (0, 30)])  # Triangle nose
    pygame.draw.rect(rocket_surface, RED, (10, 30, 20, 30))  # Body
    pygame.draw.polygon(rocket_surface, RED, [(0, 60), (40, 60), (20, 45)])  # Fins

    rotated_rocket = pygame.transform.rotate(rocket_surface, angle - 90)  # Rotate based on angle
    rect = rotated_rocket.get_rect(center=(rocket_x, rocket_y))

    screen.blit(rotated_rocket, rect.topleft)

    # display Information
    info_text = font.render(f"Alt: {HEIGHT - rocket_y:.0f} | Vel: {vy:.1f} | Fuel: {fuel:.0f}", True, WHITE)
    screen.blit(info_text, (20, 20))

    # draw Quit Button
    pygame.draw.rect(screen, (200, 50, 50), quit_button)
    quit_text = font.render("QUIT", True, WHITE)
    screen.blit(quit_text, (quit_button.x + 15, quit_button.y + 10))

    pygame.display.flip()
    clock.tick(30)

pygame.quit()
