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

-- Create schema
CREATE SCHEMA IF NOT EXISTS projet;

-- Create tables within the schema
CREATE TABLE projet.Programme(
                                 Programme VARCHAR(50),
                                 faculte VARCHAR(50) NOT NULL,
                                 PRIMARY KEY(Programme)
);

CREATE TABLE projet.logs(
                            log_id SERIAL PRIMARY KEY,
                            table_name TEXT,
                            operation TEXT,
                            changed_data JSONB,
                            log_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projet.Categorie(
                                 id_categorie VARCHAR(50),
                                 description VARCHAR(50),
                                 PRIMARY KEY(id_categorie)
);

CREATE TABLE projet.Utilisateur(
                                   cip VARCHAR(8),
                                   Nom TEXT,
                                   Prenom TEXT,
                                   Courriel VARCHAR(255) NOT NULL,
                                   role VARCHAR(50),
                                   promotion VARCHAR(50),
                                   Programme VARCHAR(50) NOT NULL,
                                   PRIMARY KEY(cip),
                                   FOREIGN KEY(Programme) REFERENCES projet.Programme(Programme)
);

CREATE TABLE projet.Produit(
                               id_Produit INTEGER,
                               Nom VARCHAR(255) NOT NULL,
                               Prix NUMERIC(10,2) NOT NULL,
                               id_categorie VARCHAR(50),
                               PRIMARY KEY(id_Produit),
                               FOREIGN KEY(id_categorie) REFERENCES projet.Categorie(id_categorie)
);

CREATE TABLE projet.commande(
                                id_commande VARCHAR(50),
                                date_commande TIMESTAMP,
                                cip VARCHAR(8),
                                PRIMARY KEY(id_commande),
                                FOREIGN KEY(cip) REFERENCES projet.Utilisateur(cip)
);

CREATE TABLE projet.plusieurs(
                                 id_Produit INTEGER,
                                 id_commande VARCHAR(50),
                                 quantite VARCHAR(50),
                                 PRIMARY KEY(id_Produit, id_commande),
                                 FOREIGN KEY(id_Produit) REFERENCES projet.Produit(id_Produit),
                                 FOREIGN KEY(id_commande) REFERENCES projet.commande(id_commande)
);


ALTER TABLE projet.Utilisateur OWNER TO postgres;

CREATE VIEW projet.commande_produits AS
SELECT
    c.id_commande,
    p.Nom AS produit_nom,
    p.Prix AS produit_prix,
    pl.quantite
FROM
    projet.plusieurs pl
        JOIN
    projet.commande c ON pl.id_commande = c.id_commande
        JOIN
    projet.Produit p ON pl.id_Produit = p.id_Produit;


INSERT INTO projet.Programme (Programme, faculte) VALUES
                                                      ('Droit', 'Faculté de droit'),
                                                      ('Administration des affaires', 'École de gestion'),
                                                      ('Éducation', 'Faculté déducation'),
                                                      ('Génie civil', 'Faculté de génie'),
                                                      ('Génie informatique', 'Faculté de génie'),
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
                                                            ('Nourriture','Nourriture'),
                                                            ('Shooter','Shooter'),
                                                            ('Cocktails','Cocktails'),
                                                            ('Bieres','Bieres'),
                                                            ('Alcool fort', 'Alcool fort');



INSERT INTO projet.Produit(id_Produit, Nom, Prix, id_categorie) VALUES
                                                                    (1,'Pizza vegetalien', 3.5, 'Nourriture'),
                                                                    (2,'Pizza au poulet', 3.5, 'Nourriture'),
                                                                    (3, 'Sandwich au poulet', 3.5, 'Nourriture'),
                                                                    (4, 'wrap au poulet', 2.5, 'Nourriture'),
                                                                    (5,'Hot-Dog', 2.5, 'Nourriture'),
                                                                    (6,'Pogo', 3.00,'Nourriture'),
                                                                    (7, 'Biere', 3, 'Bieres'),
                                                                    (8, 'Cocktails', 3, 'Cocktails'),
                                                                    (9, 'Shooter', 3, 'Shooter');







