--
-- PostgreSQL database dump
--

-- Dumped from database version 13.6 (Debian 13.6-1.pgdg110+1)
-- Dumped by pg_dump version 14.1

-- Started on 2022-05-25 18:13:12 EDT

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 6 (class 2615 OID 16385)
-- Name: app; Type: SCHEMA; Schema: -; Owner: postgres
--


-- Create schema projet
CREATE SCHEMA projet;
ALTER SCHEMA projet OWNER TO postgres;
SET default_tablespace = '';

SET default_table_access_method = heap;

-- Additional tables in schema projet

CREATE TABLE projet.Programme (
                                  Programme VARCHAR(50),
                                  faculte VARCHAR(50) NOT NULL,
                                  PRIMARY KEY(Programme)
);

CREATE TABLE projet.logs (
                             log_id INTEGER,
                             table_name TEXT,
                             operation TEXT,
                             changed_data JSONB,
                             log_time TIMESTAMP,
                             PRIMARY KEY(log_id)
);

CREATE TABLE projet.commande (
                                 id_commande VARCHAR(50),
                                 date_commande TIMESTAMP,
                                 PRIMARY KEY(id_commande)
);

CREATE TABLE projet.Categorie (
                                  id_categorie VARCHAR(50),
                                  description VARCHAR(50),
                                  PRIMARY KEY(id_categorie)
);

CREATE TABLE projet.Utilisateur (
                                    cip VARCHAR(8),
                                    Nom TEXT,
                                    Prenom TEXT,
                                    Courriel VARCHAR(255) NOT NULL,
                                    role VARCHAR(50),
                                    promotion VARCHAR(50),
                                    id_commande VARCHAR(50),
                                    Programme VARCHAR(50) NULL,
                                    PRIMARY KEY(cip),
                                    FOREIGN KEY(id_commande) REFERENCES projet.commande(id_commande),
                                    FOREIGN KEY(Programme) REFERENCES projet.Programme(Programme)
);

CREATE TABLE projet.Produit (
                                id_Produit INTEGER,
                                Nom VARCHAR(255) NOT NULL,
                                Prix NUMERIC(10,2) NOT NULL,
                                id_categorie VARCHAR(50),
                                PRIMARY KEY(id_Produit),
                                FOREIGN KEY(id_categorie) REFERENCES projet.Categorie(id_categorie)
);

CREATE TABLE projet.plusieurs (
                                  id_Produit INTEGER,
                                  id_commande VARCHAR(50),
                                  quantite VARCHAR(50),
                                  PRIMARY KEY(id_Produit, id_commande),
                                  FOREIGN KEY(id_Produit) REFERENCES projet.Produit(id_Produit),
                                  FOREIGN KEY(id_commande) REFERENCES projet.commande(id_commande)
);

ALTER TABLE projet.Utilisateur OWNER TO postgres;


INSERT INTO projet.Programme (Programme, faculte) VALUES
                                                      ('Droit', 'Faculté de droit'),
                                                      ('Administration des affaires', 'École de gestion'),
                                                      ('Éducation', 'Faculté déducation'),
                                                      ('Génie civil', 'Faculté de génie'),
                                                      ('Génie mécanique', 'Faculté de génie'),
                                                      ('Génie électrique', 'Faculté de génie'),
                                                      ('Lettres et sciences humaines', 'Faculté de lettres et sciences humaines'),
                                                      ('Médecine', 'Faculté de médecine et des sciences de la santé'),
                                                      ('Biologie', 'Faculté des sciences'),
                                                      ('Chimie', 'Faculté des sciences'),
                                                      ('Physique', 'Faculté des sciences'),
                                                      ('Informatique', 'Faculté des sciences'),
                                                      ('Sciences de lactivité physique', 'Faculté des sciences de lactivité physique');


INSERT INTO projet.Categorie(id_categorie, description) VALUES
                                                            ('Nourriture', 'Nourriture'),
                                                            ('Shooter', 'Shooter'),
                                                            ('Cocktails', 'Cocktails'),
                                                            ('Bieres', 'Bieres'),
                                                            ('Alcool fort', 'Alcool fort');

INSERT INTO projet.Produit(id_Produit, Nom, Prix, id_categorie) VALUES
                                                                    (1, 'Pizza vegetariana', 3.00, 'Nourriture'),
                                                                    (2, 'Pizza Chicken', 3.00, 'Nourriture'),
                                                                    (3, 'Pizza Pepperoni', 3.00, 'Nourriture'),
                                                                    (4, 'Pizza Margherita', 3.00, 'Nourriture'),
                                                                    (5, 'Sandwich au poulet', 3.00, 'Nourriture'),
                                                                    (6, 'wrap au poulet', 3.00, 'Nourriture'),
                                                                    (7, 'Hot-Dog', 3.00, 'Nourriture'),
                                                                    (8, 'Pogo', 3.00, 'Nourriture'),
                                                                    (9, 'Tequila', 3.00, 'Shooter'),
                                                                    (10, 'Jagerbomb', 3.00, 'Shooter'),
                                                                    (11, 'B-52', 3.00, 'Shooter'),
                                                                    (12, 'Kamikaze', 3.00, 'Shooter'),
                                                                    (13, 'Lemon Drop', 3.00, 'Shooter'),
                                                                    (14, 'Irish Car Bomb', 3.00, 'Shooter'),
                                                                    (15, 'Sambuca', 3.00, 'Shooter'),
                                                                    (16, 'Buttery Nipple', 3.00, 'Shooter'),
                                                                    (17, 'Margarita', 3.00, 'Cocktails'),
                                                                    (18, 'Mojito', 3.00, 'Cocktails'),
                                                                    (19, 'Martini', 3.00, 'Cocktails'),
                                                                    (20, 'Old Fashioned', 3.00, 'Cocktails'),
                                                                    (21, 'Cosmopolitan', 3.00, 'Cocktails'),
                                                                    (22, 'Pina Colada', 3.00, 'Cocktails'),
                                                                    (23, 'Bloody Mary', 3.00, 'Cocktails'),
                                                                    (24, 'Negroni', 3.00, 'Cocktails'),
                                                                    (25, 'Pale Lager', 3.00, 'Bieres'),
                                                                    (26, 'Pilsner', 3.00, 'Bieres'),
                                                                    (27, 'Amber Lager', 3.00, 'Bieres'),
                                                                    (28, 'Dark Lager', 3.00, 'Bieres'),
                                                                    (29, 'Pale Ale', 3.00, 'Bieres'),
                                                                    (30, 'Brown Ale', 3.00, 'Bieres'),
                                                                    (31, 'Hefeweizen', 3.00, 'Bieres'),
                                                                    (32, 'Witbier', 3.00, 'Bieres'),
                                                                    (33, 'Vodka', 3.00, 'Alcool fort'),
                                                                    (34, 'Rhum', 3.00, 'Alcool fort'),
                                                                    (35, 'Whisky', 3.00, 'Alcool fort'),
                                                                    (36, 'Gin', 3.00, 'Alcool fort'),
                                                                    (37, 'Tequila', 3.00, 'Alcool fort'),
                                                                    (38, 'Brandy', 3.00, 'Alcool fort'),
                                                                    (39, 'Absinthe', 3.00, 'Alcool fort'),
                                                                    (40, 'Rhum épicé', 3.00, 'Alcool fort');






