DROP TABLE IF EXISTS "event";
DROP SEQUENCE IF EXISTS event_id_seq;
CREATE SEQUENCE event_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."event" (
    "id" integer DEFAULT nextval('event_id_seq') NOT NULL,
    "date" character varying NOT NULL,
    "title" character varying NOT NULL,
    "description" character varying NOT NULL,
    CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id")
) WITH (oids = false);

INSERT INTO "event" ("id", "date", "title", "description") VALUES
(1,	'2024-12-13T08:00:00.000Z',	'Démo Ynov',	'Démo finale pour le cours de Web Services');

DROP TABLE IF EXISTS "event_users_user";
CREATE TABLE "public"."event_users_user" (
    "eventId" integer NOT NULL,
    "userId" integer NOT NULL,
    CONSTRAINT "PK_ed194d1b2bd458933bdcd2cc81d" PRIMARY KEY ("eventId", "userId")
) WITH (oids = false);

CREATE INDEX "IDX_a79703c5a43b536a49e3e4713e" ON "public"."event_users_user" USING btree ("userId");

CREATE INDEX "IDX_ddfe947d856e921a02d7ab2369" ON "public"."event_users_user" USING btree ("eventId");

INSERT INTO "event_users_user" ("eventId", "userId") VALUES
(1,	2),
(1,	3);

DROP TABLE IF EXISTS "user";
DROP SEQUENCE IF EXISTS user_id_seq;
CREATE SEQUENCE user_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."user" (
    "id" integer DEFAULT nextval('user_id_seq') NOT NULL,
    "email" character varying NOT NULL,
    "password" character varying NOT NULL,
    "role" character varying NOT NULL,
    "resetPasswordToken" character varying,
    CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"),
    CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")
) WITH (oids = false);

INSERT INTO "user" ("id", "email", "password", "role", "resetPasswordToken") VALUES
(1,	'admin@test.fr',	'$2b$10$lOa90zO5j9hHlCxRaWC7ce9xi2ePHJ/1kAsRiwbs8DOLT0wkWekpe',	'ADMIN',	NULL),
(2,	'user1@test.fr',	'$2b$10$aq/QbmTuAiCjI7a5CCovxejODXnJtYHQ2YcdENVULBm4Ym3HpijMa',	'USER',	NULL),
(3,	'user2@test.fr',	'$2b$10$cySQ0eYq4HqY.HIij1lRz.qdqORZEgRXaF8GaUd2AD0SZIX/xHB9O',	'USER',	NULL),
(4,	'user3@test.fr',	'$2b$10$sXuvek1q7DN8P7njfWvR4.gl6ZC5NifnVeiVApt6PdZoCtr5K6ffy',	'USER',	NULL);

ALTER TABLE ONLY "public"."event_users_user" ADD CONSTRAINT "FK_a79703c5a43b536a49e3e4713ea" FOREIGN KEY ("userId") REFERENCES "user"(id) NOT DEFERRABLE;
ALTER TABLE ONLY "public"."event_users_user" ADD CONSTRAINT "FK_ddfe947d856e921a02d7ab2369e" FOREIGN KEY ("eventId") REFERENCES event(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;
