import pygame
import student  # Import student-defined variables and functions

def run_simulation():
    pygame.init()
    WIDTH, HEIGHT = 800, 600
    screen = pygame.display.set_mode((WIDTH, HEIGHT))
    clock = pygame.time.Clock()
    font = pygame.font.Font(None, 36)

    # Colours
    WHITE = (255, 255, 255)
    RED = (255, 100, 0)
    GREY = (180, 180, 180)
    BLUE = (0, 100, 255)
    GREEN = (0, 255, 0)
    
    # Constants
    BASE_WEIGHT = 50  
    EARTH_POS = (WIDTH // 2 - 250, HEIGHT - 200)
    MOON_POS = (WIDTH // 2 + 250, 200)

    def calculate_arc(t):
        """Returns the (x, y) position along a quadratic arc."""
        x = (1 - t) * EARTH_POS[0] + t * MOON_POS[0]
        y = (1 - t) ** 2 * EARTH_POS[1] + 2 * (1 - t) * t * (HEIGHT // 15) + t ** 2 * MOON_POS[1]
        return x, y

    # Rocket variables
    t = 0  
    fuel = student.FUEL
    ROCKET_WEIGHT = BASE_WEIGHT + fuel
    running = True
    started = False
    simulation_failed = False
    simulation_success = False

    # Start Button
    start_button = pygame.Rect(WIDTH // 2 - 50, HEIGHT // 2, 100, 40)

    def check_success():
        nonlocal simulation_success, simulation_failed
        if t >= 1 and fuel <= 10:
            simulation_success = True
        elif t >= 1 and fuel > 10:
            simulation_failed = True

    while running:
        screen.fill((0, 0, 20))
        
        pygame.draw.circle(screen, BLUE, EARTH_POS, 50)
        pygame.draw.circle(screen, GREY, MOON_POS, 30)

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.MOUSEBUTTONDOWN:
                if start_button.collidepoint(event.pos):
                    started = True

        if started and not simulation_failed and not simulation_success:
            ROCKET_WEIGHT = BASE_WEIGHT + fuel
            effective_thrust = (student.THRUST / ROCKET_WEIGHT) * 20  

            if fuel > 0:
                fuel -= abs(student.THRUST) * 0.05  # More thrust = more fuel used
                t += effective_thrust * 0.01  
            else:
                simulation_failed = True  

            if t >= 1:
                check_success()
                t = 1

        rocket_x, rocket_y = calculate_arc(t)
        pygame.draw.polygon(screen, RED, [(rocket_x, rocket_y - 10), (rocket_x - 5, rocket_y + 10), (rocket_x + 5, rocket_y + 10)])

        if not started:
            pygame.draw.rect(screen, (50, 200, 50), start_button)
            start_text = font.render("START", True, WHITE)
            screen.blit(start_text, (start_button.x + 15, start_button.y + 10))
        
        if simulation_failed:
            fail_text = font.render("Simulation Failed!", True, RED)
            screen.blit(fail_text, (WIDTH // 2 - 100, HEIGHT // 2 - 20))
        
        if simulation_success:
            success_text = font.render("Simulation Succeeded!", True, GREEN)
            screen.blit(success_text, (WIDTH // 2 - 120, HEIGHT // 2 - 20))
        
        info_text = font.render(f"Fuel: {fuel:.0f}", True, WHITE)
        screen.blit(info_text, (20, 20))

        pygame.display.flip()
        clock.tick(30)

    pygame.quit()

# Ensure that it only runs when explicitly called
if __name__ == "__main__":
    run_simulation()
