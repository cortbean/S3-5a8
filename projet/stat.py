import psycopg2
from psycopg2 import sql
from faker import Faker
import random
import uuid

# Database connection parameters
DB_NAME = "postgres"
DB_USER = "postgres"
DB_PASSWORD = "postgres"
DB_HOST = "localhost"
DB_PORT = "5444"

# Number of users and commands to generate
NUM_USERS = 10
NUM_COMMANDS_PER_USER = 5

# Programmes and faculties
programmes = [
    'Droit',
    'Administration des affaires',
    'Éducation',
    'Génie civil',
    'Génie mécanique',
    'Génie électrique',
    'Lettres et sciences humaines',
    'Médecine',
    'Biologie',
    'Chimie',
    'Physique',
    'Informatique',
    'Sciences de lactivité physique'
]

# Product IDs mapped to their categories
product_categories = {
    'Al': list(range(2081, 2101)),
    'Bi': list(range(2061, 2081)),
    'Ba': list(range(2501, 2521)),
    'Co': list(range(2041, 2061)),
    'Ea': list(range(2261, 2281)),
    'Gi': list(range(2241, 2261)),
    'Li': list(range(2401, 2421)),
    'No': list(range(2001, 2021)),
    'Rh': list(range(2221, 2241)),
    'Sa': list(range(2301, 2321)),
    'Sh': list(range(2021, 2041)),
    'Vi': list(range(2101, 2121)),
    'Wh': list(range(2201, 2221))
}

# Initialize Faker
fake = Faker()

# Connect to the PostgreSQL database
try:
    conn = psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT
    )
    cur = conn.cursor()

    # Function to insert random users, commands, and products
    def add_users_commands_and_products(num_users, num_commands_per_user):
        for _ in range(num_users):
            # Generate random user data
            cip = fake.unique.bothify(text='????####')[:8]
            nom = fake.last_name()
            prenom = fake.first_name()
            courriel = fake.email()
            role = 'client'
            promotion = random.randint(65, 70)
            programme = random.choice(programmes)

            # Insert user into the database
            cur.execute(
                "INSERT INTO projet.Utilisateur (cip, Nom, Prenom, Courriel, role, promotion, Programme) VALUES (%s, %s, %s, %s, %s, %s, %s);",
                (cip, nom, prenom, courriel, role, promotion, programme)
            )

            # Generate and insert random commands for the user
            for _ in range(num_commands_per_user):
                id_commande = str(1000 + int(random.random() * 9000))
                date_commande = fake.date_time_this_year()
                status = random.choice(['terminee', 'en cours'])

                # Insert command into the database
                cur.execute(
                    "INSERT INTO projet.commande (id_commande, cip, date_commande, status) VALUES (%s, %s, %s, %s);",
                    (id_commande, cip, date_commande, status)
                )

                # Insert multiple products for each command
                num_products = random.randint(1, 5)
                for _ in range(num_products):
                    category = random.choice(list(product_categories.keys()))
                    product_id = random.choice(product_categories[category])
                    quantite = fake.random_int(min=1, max=10)

                    # Insert product into plusieurs table
                    cur.execute(
                        "INSERT INTO projet.plusieurs (id_Produit, id_commande, quantite) VALUES (%s, %s, %s);",
                        (product_id, id_commande, quantite)
                    )

        conn.commit()
        print(f"Added {NUM_USERS} users, {NUM_USERS * NUM_COMMANDS_PER_USER} commands, and multiple products to the database.")

    # Add users, commands, and products
    add_users_commands_and_products(NUM_USERS, NUM_COMMANDS_PER_USER)

except psycopg2.Error as e:
    print(f"Error: {e}")
finally:
    # Close cursor and connection
    if cur:
        cur.close()
    if conn:
        conn.close()
