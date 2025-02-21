import simulator

# 🚀 Student-editable settings
FUEL = 15
THRUST = .2

def emergency_boost(fuel, thrust):
    if fuel < 5:
        return fuel, thrust  # Not enough fuel, no boost
    fuel -= 5  # Use extra fuel
    thrust += 100  # Temporary boost in thrust
    print(f"Boosted! Fuel: {fuel}, Thrust: {thrust}")
    return fuel, thrust


# Run the simulation when this file is executed
if __name__ == "__main__":
    simulator.run_simulation()


'''
Answers: FUEL = 25, THRUST = 2, REM = 8
         FUEL = 25, THRUST = 5, REM = 8
         FUEL = 15, THRUST = .5, REM = .6
         FUEL = 15, THRUST = .1, REM = 
'''