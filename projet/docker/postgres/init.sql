-- Début du dump de la base de données PostgreSQL

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

-- Création du schéma projet
CREATE SCHEMA projet;

ALTER SCHEMA projet OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

-- Création des séquences pour la génération des identifiants
CREATE SEQUENCE projet.role_id_seq;
CREATE SEQUENCE projet.faculte_id_seq;
CREATE SEQUENCE projet.permission_id_seq;
CREATE SEQUENCE projet.produit_id_seq;
CREATE SEQUENCE projet.programme_id_seq;
CREATE SEQUENCE projet.authentification_id_seq;
CREATE SEQUENCE projet.utilisateur_id_seq;
CREATE SEQUENCE projet.commande_id_seq;
CREATE SEQUENCE projet.categorie_id_seq;

-- Création des tables
CREATE TABLE projet.Commande (
                                 id_Cmd INTEGER,
                                 DateCommande TIMESTAMP WITH TIME ZONE NOT NULL,
                                 CodeDeLaCommande INTEGER NOT NULL,
                                 PRIMARY KEY(id_Cmd)
);

CREATE TABLE projet.Faculte (
                                id_Fac INTEGER,
                                Nom VARCHAR(255) NOT NULL,
                                PRIMARY KEY(id_Fac)
);

CREATE TABLE projet.Programme (
                                  id_Prog INTEGER,
                                  Nom VARCHAR(255) NOT NULL,
                                  id_Fac INTEGER NOT NULL,
                                  PRIMARY KEY(id_Prog),
                                  FOREIGN KEY(id_Fac) REFERENCES projet.Faculte(id_Fac)
);

CREATE TABLE projet.Categorie (
                                  id_Cat INTEGER,
                                  Nom VARCHAR(255) NOT NULL,
                                  PRIMARY KEY(id_Cat)
);

CREATE TABLE projet.Logs (
                             id_logs INTEGER,
                             TableName VARCHAR(255) NOT NULL,
                             Operation VARCHAR(255) NOT NULL,
                             ChangeData JSONB NOT NULL,
                             LogTime TIMESTAMP NOT NULL,
                             PRIMARY KEY(id_logs)
);

CREATE TABLE projet.Utilisateur (
                                    cip VARCHAR(8),
                                    Nom VARCHAR(255) NOT NULL,
                                    Prenom VARCHAR(255) NOT NULL,
                                    Courriel VARCHAR(255) NOT NULL,
                                    id_Prog INTEGER NOT NULL,
                                    id_Cmd INTEGER,
                                    PRIMARY KEY(Cip),
                                    UNIQUE(Courriel),
                                    FOREIGN KEY(id_Prog) REFERENCES projet.Programme(id_Prog),
                                    FOREIGN KEY(id_Cmd) REFERENCES projet.Commande(id_Cmd)
);

CREATE TABLE projet.Produit (
                                id_Pro INTEGER,
                                Nom VARCHAR(255) NOT NULL,
                                Prix NUMERIC(10,2) NOT NULL,
                                id_Cat INTEGER NOT NULL,
                                PRIMARY KEY(id_Pro),
                                FOREIGN KEY(id_Cat) REFERENCES projet.Categorie(id_Cat)
);

CREATE TABLE projet.de (
                           id_Cmd INTEGER,
                           id_Pro INTEGER,
                           Quantite INTEGER NOT NULL,
                           PRIMARY KEY(id_Cmd, id_Pro),
                           FOREIGN KEY(id_Cmd) REFERENCES projet.Commande(id_Cmd),
                           FOREIGN KEY(id_Pro) REFERENCES projet.Produit(id_Pro)
);

-- Insertion des données dans la table Faculte
INSERT INTO projet.Faculte (id_Fac, Nom) VALUES
                                             (1, 'Faculté d''administration'),
                                             (2, 'Faculté de droit'),
                                             (3, 'Faculté d''éducation'),
                                             (4, 'Faculté de génie'),
                                             (5, 'Faculté des lettres et sciences humaines'),
                                             (6, 'Faculté de médecine et des sciences de la santé'),
                                             (7, 'Faculté des sciences'),
                                             (8, 'Faculté des sciences de l''activité physique'),
                                             (9, 'Faculté des sciences de l''éducation'),
                                             (10, 'Faculté des sciences sociales'),
                                             (11, 'École de gestion'),
                                             (12, 'École de musique');

-- Insertion des données dans la table Programme
INSERT INTO projet.Programme (id_Prog, Nom, id_Fac) VALUES
                                                        (1, 'Administration des affaires', 1),
                                                        (2, 'Certificat en administration', 1),
                                                        (3, 'Maîtrise en administration', 1),
                                                        (4, 'MBA', 1),
                                                        (5, 'Doctorat en administration', 1),
                                                        (6, 'Droit', 2),
                                                        (7, 'Certificat en droit', 2),
                                                        (8, 'Maîtrise en droit', 2),
                                                        (9, 'Doctorat en droit', 2),
                                                        (10, 'Enseignement au préscolaire et au primaire', 3),
                                                        (11, 'Enseignement en adaptation scolaire et sociale', 3),
                                                        (12, 'Enseignement secondaire', 3),
                                                        (13, 'Certificat en éducation', 3),
                                                        (14, 'Maîtrise en sciences de l''éducation', 3),
                                                        (15, 'Doctorat en éducation', 3),
                                                        (16, 'Génie biotechnologique', 4),
                                                        (17, 'Génie chimique', 4),
                                                        (18, 'Génie civil', 4),
                                                        (19, 'Génie électrique', 4),
                                                        (20, 'Génie informatique', 4),
                                                        (21, 'Génie mécanique', 4),
                                                        (22, 'Génie robotique', 4),
                                                        (23, 'Maîtrise en génie', 4),
                                                        (24, 'Doctorat en génie', 4),
                                                        (25, 'Études littéraires et culturelles', 5),
                                                        (26, 'Histoire', 5),
                                                        (27, 'Philosophie', 5),
                                                        (28, 'Certificat en lettres et sciences humaines', 5),
                                                        (29, 'Maîtrise en lettres et sciences humaines', 5),
                                                        (30, 'Doctorat en lettres et sciences humaines', 5),
                                                        (31, 'Médecine', 6),
                                                        (32, 'Sciences infirmières', 6),
                                                        (33, 'Physiothérapie', 6),
                                                        (34, 'Maîtrise en sciences de la santé', 6),
                                                        (35, 'Doctorat en sciences de la santé', 6),
                                                        (36, 'Biochimie', 7),
                                                        (37, 'Biologie', 7),
                                                        (38, 'Chimie', 7),
                                                        (39, 'Informatique', 7),
                                                        (40, 'Mathématiques', 7),
                                                        (41, 'Physique', 7),
                                                        (42, 'Maîtrise en sciences', 7),
                                                        (43, 'Doctorat en sciences', 7),
                                                        (44, 'Kinésiologie', 8),
                                                        (45, 'Enseignement de l''éducation physique et à la santé', 8),
                                                        (46, 'Maîtrise en sciences de l''activité physique', 8),
                                                        (47, 'Doctorat en sciences de l''activité physique', 8),
                                                        (48, 'Psychologie', 10),
                                                        (49, 'Travail social', 10),
                                                        (50, 'Maîtrise en sciences sociales', 10),
                                                        (51, 'Doctorat en sciences sociales', 10),
                                                        (52, 'Gestion des ressources humaines', 11),
                                                        (53, 'Gestion internationale', 11),
                                                        (54, 'Certificat en gestion', 11),
                                                        (55, 'Maîtrise en gestion', 11),
                                                        (56, 'Doctorat en gestion', 11),
                                                        (57, 'Musique', 12),
                                                        (58, 'Certificat en musique', 12),
                                                        (59, 'Maîtrise en musique', 12),
                                                        (60, 'Doctorat en musique', 12);

-- Fin du dump de la base de données PostgreSQL