--
-- PostgreSQL database cluster dump
--

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Drop databases
--

DROP DATABASE db;




--
-- Drop roles
--

DROP ROLE postgres;
DROP ROLE "user";


--
-- Roles
--

CREATE ROLE postgres;
ALTER ROLE postgres WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS;
CREATE ROLE "user";
ALTER ROLE "user" WITH SUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'md57f409a7c046daea1c2c60502d7e2becc';






--
-- Database creation
--

CREATE DATABASE db WITH TEMPLATE = template0 OWNER = postgres;
REVOKE CONNECT,TEMPORARY ON DATABASE template1 FROM PUBLIC;
GRANT CONNECT ON DATABASE template1 TO PUBLIC;


\connect db

SET default_transaction_read_only = off;

--
-- PostgreSQL database dump
--

-- Dumped from database version 10.4 (Debian 10.4-2.pgdg90+1)
-- Dumped by pg_dump version 10.4 (Debian 10.4-2.pgdg90+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: task_timestamp_create(); Type: FUNCTION; Schema: public; Owner: user
--

CREATE FUNCTION public.task_timestamp_create() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
      -- Remember who changed the payroll when
      NEW.created_at := current_timestamp;
      NEW.updated_at := current_timestamp;
      RETURN NEW;
    END;
    $$;


ALTER FUNCTION public.task_timestamp_create() OWNER TO "user";

--
-- Name: task_timestamp_update(); Type: FUNCTION; Schema: public; Owner: user
--

CREATE FUNCTION public.task_timestamp_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
      -- Remember who changed the payroll when
      NEW.updated_at := current_timestamp;
      RETURN NEW;
    END;
    $$;


ALTER FUNCTION public.task_timestamp_update() OWNER TO "user";

--
-- Name: user_task_timestamp_create(); Type: FUNCTION; Schema: public; Owner: user
--

CREATE FUNCTION public.user_task_timestamp_create() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
      -- Remember who changed the payroll when
      NEW.created_at := current_timestamp;
      NEW.updated_at := current_timestamp;
      RETURN NEW;
    END;
    $$;


ALTER FUNCTION public.user_task_timestamp_create() OWNER TO "user";

--
-- Name: user_task_timestamp_update(); Type: FUNCTION; Schema: public; Owner: user
--

CREATE FUNCTION public.user_task_timestamp_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
      -- Remember who changed the payroll when
      NEW.updated_at := current_timestamp;
      RETURN NEW;
    END;
    $$;


ALTER FUNCTION public.user_task_timestamp_update() OWNER TO "user";

--
-- Name: user_timestamp_create(); Type: FUNCTION; Schema: public; Owner: user
--

CREATE FUNCTION public.user_timestamp_create() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
      -- Remember who changed the payroll when
      NEW.created_at := current_timestamp;
      NEW.updated_at := current_timestamp;
      RETURN NEW;
    END;
    $$;


ALTER FUNCTION public.user_timestamp_create() OWNER TO "user";

--
-- Name: user_timestamp_update(); Type: FUNCTION; Schema: public; Owner: user
--

CREATE FUNCTION public.user_timestamp_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
      -- Remember who changed the payroll when
      NEW.updated_at := current_timestamp;
      RETURN NEW;
    END;
    $$;


ALTER FUNCTION public.user_timestamp_update() OWNER TO "user";

--
-- Name: withdraw_timestamp_create(); Type: FUNCTION; Schema: public; Owner: user
--

CREATE FUNCTION public.withdraw_timestamp_create() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
      -- Remember who changed the payroll when
      NEW.created_at := current_timestamp;
      NEW.updated_at := current_timestamp;
      RETURN NEW;
    END;
    $$;


ALTER FUNCTION public.withdraw_timestamp_create() OWNER TO "user";

--
-- Name: withdraw_timestamp_update(); Type: FUNCTION; Schema: public; Owner: user
--

CREATE FUNCTION public.withdraw_timestamp_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
      -- Remember who changed the payroll when
      NEW.updated_at := current_timestamp;
      RETURN NEW;
    END;
    $$;


ALTER FUNCTION public.withdraw_timestamp_update() OWNER TO "user";

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: image; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.image (
    id uuid NOT NULL,
    user_id uuid,
    ext text
);


ALTER TABLE public.image OWNER TO "user";

--
-- Name: migrations; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    data jsonb NOT NULL
);


ALTER TABLE public.migrations OWNER TO "user";

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.sessions (
    id uuid NOT NULL,
    user_id uuid
);


ALTER TABLE public.sessions OWNER TO "user";

--
-- Name: task_user; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.task_user (
    id uuid NOT NULL,
    user_id uuid,
    task_id uuid,
    status boolean NOT NULL,
    turn integer NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.task_user OWNER TO "user";

--
-- Name: tasks; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.tasks (
    id uuid NOT NULL,
    description text,
    name text,
    reward integer NOT NULL,
    priority integer NOT NULL,
    type_task text NOT NULL,
    related_data text,
    unlock_link text,
    list_posts text[],
    max_turn integer NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.tasks OWNER TO "user";

--
-- Name: users; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    email text,
    password text NOT NULL,
    telephone text NOT NULL,
    name text NOT NULL,
    address text,
    is_admin boolean NOT NULL,
    balance integer NOT NULL,
    user_social_id text NOT NULL,
    related_data text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.users OWNER TO "user";

--
-- Name: withdraw; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.withdraw (
    id uuid NOT NULL,
    user_id uuid,
    status integer NOT NULL,
    amount integer NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.withdraw OWNER TO "user";

--
-- Data for Name: image; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.image (id, user_id, ext) FROM stdin;
1f586593-259a-4047-a507-a45385f6a68d	391a3129-ce1d-4fee-ae14-3f672a230864	jpg
4f567b57-92d6-4fee-be8d-12793d73c57c	391a3129-ce1d-4fee-ae14-3f672a230864	jpg
38e58642-29b9-49fd-a52a-13e416ceab24	391a3129-ce1d-4fee-ae14-3f672a230864	jpg
bd905434-e72f-49ac-b47e-85303343b3b2	39a8ace4-23fd-4347-886c-53fe96d7f887	jpg
8e88266e-13d0-426d-a204-229181511b35	39a8ace4-23fd-4347-886c-53fe96d7f887	jpg
14459c38-d868-41d2-bc9e-2d07bd221c2d	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	jpeg
e07cc6c3-d142-4564-bb9c-5fa1d19977c7	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	jpeg
40170a20-1c96-4cee-8a90-73846e25bedc	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	png
6524559d-1e1a-4658-b408-e64a1f8a8cec	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	png
a232cf15-6988-4dad-9b04-4324b15f6830	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	png
4a754f36-a3ae-4968-ae7e-e159a6526c74	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	png
55b1c5a8-4583-4aca-a8dc-79101c797e60	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	jpeg
b1ea2246-f7e7-4399-8782-b966948a09f4	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	jpeg
61df3809-73b1-49c9-ba9c-0232469fa14c	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	jpeg
956a3dcc-1544-4ac0-92f9-047f8aeb3437	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	jpeg
439c7203-553c-42a3-bcdd-103927aa6a4c	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	jpeg
1b1d3f5d-231d-43ff-aa49-ce890c22211a	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	jpeg
986671d7-ff36-4e65-b412-81ceada3d51a	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	jpeg
60d99a79-50ef-474d-8199-98d678f5474e	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	png
d106d70e-7139-4f58-9d65-cb4b6223f38d	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	png
b6cd3be8-0977-407e-b3ce-9720d2372e02	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	jpeg
f013c586-2515-4d76-b208-c3ebd4426375	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	jpeg
d3f7620f-f989-4dfb-bb6a-8fee2f989c6b	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	jpeg
05a803db-60b6-4d3e-8527-f61acf42b158	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	jpeg
43917d6c-a89f-45eb-8477-804f15901f8b	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	jpeg
c66ca10c-22d1-44ec-b138-9b92d00e2b69	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	png
b25e6a7b-d2f1-4f60-b563-9c9932d8a9d3	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	jpeg
9bf60278-f7c7-45d7-b427-24fec74d53aa	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	jpg
b284475c-c5d7-4c9e-9064-fa347d848ddf	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	jpg
0aaba227-8fbd-40be-b8c3-bdf0b6feeb7f	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	jpg
65688c04-09ea-49c7-8211-615959a1cc13	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	jpg
633f177b-93ab-45f8-9403-913db6968197	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	jpg
dcbff277-46fe-404f-8735-ae09a1611844	4bedec79-f30d-43a7-9311-4adcbb4b9441	png
6a486533-217e-4479-80d5-9df0ddc6bfe3	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	jpg
13ada699-baa4-4064-867f-8707777c2ec5	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	jpg
68869f71-975a-4d50-94a3-9ff58ffe743c	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	jpg
f2a1d900-de72-4b54-8db8-b21f6358b9d7	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	png
9c9705bc-819b-466a-9719-8ff952dd0220	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	jpg
4352e774-451d-4174-8e61-bc45b0e73677	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	jpg
ea42ed88-bac0-412d-a1e7-931e2c3326a9	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	jpg
4c2f1553-3567-4900-98c6-93df719188f8	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	jpg
e10541d7-7975-44e5-a5f1-dec88e3f963a	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	png
f45ab9ed-713d-441e-a161-3544fab41468	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	jpg
f7784f86-2291-4592-888a-34d4c006db27	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	png
56def79b-cdf0-43ab-b302-195c0d75edf8	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	png
735b4548-87e7-44bd-866f-82350e84c1cb	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	png
dfa5822d-cefb-46d5-9eb4-98f22faf6461	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	png
965b32ad-6f01-43ba-87c8-41c78fae6662	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	png
c260b65b-dd45-4698-a884-adfdd8d98ebe	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	png
c5863fd3-f78c-46dd-8061-1768ec9b3b89	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	png
4b62f504-a682-4a0e-82d7-307b576ceab0	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	png
ab5a1625-78a6-49d6-afb1-6721e51359b0	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	png
2710637b-4b10-4e58-8dc8-c70f4a88e59b	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	jpg
bf27f853-838d-41e3-a19d-f97a771f3072	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	jpg
cbdfbcb9-f138-45f2-acdf-b654588eb88b	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	jpg
bd5282fd-c458-4b84-aad2-aca470914493	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	jpg
00829322-8776-4426-bf73-8f43e9222391	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	jpg
6e71ef62-fb78-49aa-9c8c-424f3958b4be	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	jpg
ee77326a-bcec-4f1b-811e-11a9eed324c3	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	jpg
63611ffd-20df-45f1-8a17-5ef062d21be5	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	jpg
758eb776-df37-45ff-80b2-cecbc4866ceb	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	jpg
270fed09-f650-46e9-a758-097c3ea6a982	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	jpg
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.migrations (id, data) FROM stdin;
1	{"lastRun": "1645279394091-image.js", "migrations": [{"title": "1550969025172-authentication.js", "timestamp": 1647349160290}, {"title": "1642932039810-task.js", "timestamp": 1647349160315}, {"title": "1643514495081-task-user.js", "timestamp": 1647349160337}, {"title": "1643514968328-withdraw.js", "timestamp": 1647349160371}, {"title": "1645279394091-image.js", "timestamp": 1647349160396}]}
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.sessions (id, user_id) FROM stdin;
a6e75fe9-4226-479b-9dc3-c42c482ea985	391a3129-ce1d-4fee-ae14-3f672a230864
9bbe02f2-2f72-4fc1-a176-daf3409f34c2	391a3129-ce1d-4fee-ae14-3f672a230864
a82a8225-eb5c-4f67-babf-cf2b4bf92640	6b996d7a-f2c6-4e61-ad0e-cde95c9fecde
8acf1ab5-d1aa-4d29-a1b1-996b8c2d9a42	6b996d7a-f2c6-4e61-ad0e-cde95c9fecde
3443afc3-428a-4c1f-8d59-8256e58c101b	6b996d7a-f2c6-4e61-ad0e-cde95c9fecde
a4a87e18-dc86-4c39-9347-ff6b18dff9ce	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0
614cdb06-d997-4e32-9aaa-36e8104e285f	4bedec79-f30d-43a7-9311-4adcbb4b9441
13411338-4e8a-47d4-86ce-6ad03409785b	391a3129-ce1d-4fee-ae14-3f672a230864
c2515dae-a7d4-4962-a33b-c25f717abfc0	4bedec79-f30d-43a7-9311-4adcbb4b9441
6286ce3b-6083-4202-8286-36a3a10ef1c8	4bedec79-f30d-43a7-9311-4adcbb4b9441
c8afcda9-86ad-4ffd-916c-c483b4604a4e	4bedec79-f30d-43a7-9311-4adcbb4b9441
3ea72d5f-549b-4969-a5cc-3528dfbe169b	4bedec79-f30d-43a7-9311-4adcbb4b9441
4cb20e06-0c4d-4778-9928-a7df638eb76c	6b996d7a-f2c6-4e61-ad0e-cde95c9fecde
f49e2bde-e39d-4d5f-8b67-76fe2e3d8fd7	6b996d7a-f2c6-4e61-ad0e-cde95c9fecde
bd4b4981-46e1-466b-aa21-5dbfe3653ce1	551ec266-070f-4104-80f6-885d82184b47
805b30b1-c6ea-4750-a902-6ade1ccf0d23	551ec266-070f-4104-80f6-885d82184b47
16a1ba48-a18c-4c73-8ab3-6569bd15e6a0	4bedec79-f30d-43a7-9311-4adcbb4b9441
7235cd38-c35d-4a2e-b65c-37e8fc635e08	4bedec79-f30d-43a7-9311-4adcbb4b9441
597e64da-6547-422b-bb39-afc03ea373d0	551ec266-070f-4104-80f6-885d82184b47
21cc17ec-7d30-4397-b773-44377f68aece	391a3129-ce1d-4fee-ae14-3f672a230864
5fdd39e3-48f1-4fd6-8085-080be4c5ff40	391a3129-ce1d-4fee-ae14-3f672a230864
6ffcabd8-358a-4c84-afe3-60d4cce312cd	391a3129-ce1d-4fee-ae14-3f672a230864
8acf74a7-c70a-4aee-b975-d78f1083b754	391a3129-ce1d-4fee-ae14-3f672a230864
5db941a3-71bf-49b8-9c55-a02743226934	391a3129-ce1d-4fee-ae14-3f672a230864
22ccf73c-6dbf-4532-9d16-b1b778a270cd	391a3129-ce1d-4fee-ae14-3f672a230864
d3717338-e17b-492d-9c1a-082ebcd56db6	391a3129-ce1d-4fee-ae14-3f672a230864
299bee2b-2806-4828-b7d6-1314cc4b7efa	551ec266-070f-4104-80f6-885d82184b47
cd8492b8-b094-4a9a-a71c-e7314aad4345	551ec266-070f-4104-80f6-885d82184b47
1d470917-2f4c-4fa0-a920-cf76405f325b	391a3129-ce1d-4fee-ae14-3f672a230864
974d87ce-ab17-4b2e-ac53-75ee643e06fe	391a3129-ce1d-4fee-ae14-3f672a230864
49338e9c-b268-4410-9ed8-dc45f2ac89d9	391a3129-ce1d-4fee-ae14-3f672a230864
690b8fbb-63bc-4437-ae06-9c90c8cb3dbe	391a3129-ce1d-4fee-ae14-3f672a230864
8eeae309-a558-4556-8dd6-0758646a46de	391a3129-ce1d-4fee-ae14-3f672a230864
b15732a2-8a8b-40c7-8eff-28702863f154	391a3129-ce1d-4fee-ae14-3f672a230864
6497574c-9d53-4a42-be80-18b2c1639a99	391a3129-ce1d-4fee-ae14-3f672a230864
f6b2de3e-e6fa-4d0d-a0e3-6b901dd15e14	391a3129-ce1d-4fee-ae14-3f672a230864
ad5cd576-83a5-43fa-bd3b-fe2048bfcb03	391a3129-ce1d-4fee-ae14-3f672a230864
ff51cb18-b0b8-4724-8812-f37d123d31a6	391a3129-ce1d-4fee-ae14-3f672a230864
56af58e6-3c19-4e3f-827e-530f343df627	391a3129-ce1d-4fee-ae14-3f672a230864
cfeeb3a4-c68b-4afe-bd27-467514f6cc87	391a3129-ce1d-4fee-ae14-3f672a230864
5edaff8e-f065-41e5-b0d1-cc98944be72a	391a3129-ce1d-4fee-ae14-3f672a230864
c087dd08-b24a-4ff4-a882-60e518148074	391a3129-ce1d-4fee-ae14-3f672a230864
4de54e88-abe8-48da-97dc-e6a6d1a08919	391a3129-ce1d-4fee-ae14-3f672a230864
40760d81-9f5d-4bf5-a321-68899cdea3ff	391a3129-ce1d-4fee-ae14-3f672a230864
627f5f66-6583-4ab9-b2bf-8a32d007cc5f	391a3129-ce1d-4fee-ae14-3f672a230864
6a0a2e7d-0fd0-493d-8805-01bcc6a41588	391a3129-ce1d-4fee-ae14-3f672a230864
2132a8bc-8e23-4d61-8f34-409bc7aee887	391a3129-ce1d-4fee-ae14-3f672a230864
aeed105d-b03f-45a3-9a3f-34ba7939b7d8	391a3129-ce1d-4fee-ae14-3f672a230864
1f13ced8-1dd3-4fa7-9024-b48d57aa6532	391a3129-ce1d-4fee-ae14-3f672a230864
faf63452-5334-4545-ae8d-8b9940b0d596	4bedec79-f30d-43a7-9311-4adcbb4b9441
7e10c825-828d-4c9b-a03b-a5a70d5aca20	4bedec79-f30d-43a7-9311-4adcbb4b9441
c0fbd7b1-bd16-414a-8bd2-0e6654428757	36cde200-0bef-4da8-aa95-871660548d8e
93a67e13-7cd3-442e-8575-d20cf2b03fdd	391a3129-ce1d-4fee-ae14-3f672a230864
bffb5ac6-5ff4-498d-b32a-9b1f5bfb962d	391a3129-ce1d-4fee-ae14-3f672a230864
06d1d815-dc13-431a-acc5-5e896d095149	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0
6ed2c39c-962d-448b-a32b-b15c73b00d20	6b996d7a-f2c6-4e61-ad0e-cde95c9fecde
fa2668f6-01bc-49c7-91e5-9eb91dff897b	8dee6d20-26d9-4cf1-a4f4-ed8a47ed4dca
5d761252-c9ca-4f53-9c71-212baa214fbf	6b996d7a-f2c6-4e61-ad0e-cde95c9fecde
07710d91-1bae-491d-81d5-0301df802349	391a3129-ce1d-4fee-ae14-3f672a230864
225e25a0-59c5-41d5-b5f2-889a0a6660a4	391a3129-ce1d-4fee-ae14-3f672a230864
6939a835-9e60-4984-acc0-83473729be33	551ec266-070f-4104-80f6-885d82184b47
d9995f5a-fa44-4aeb-b336-18dea4571034	4bedec79-f30d-43a7-9311-4adcbb4b9441
65a0d9f1-155a-4d44-a437-5b4c1274664e	51f1099c-54f2-4cb9-b616-01b4df3909d5
dd4397ff-e2da-42a1-953f-4a4ef88d3c91	51f1099c-54f2-4cb9-b616-01b4df3909d5
50b42eb2-c552-4e21-81ee-5ca4a66db44b	3f299f9c-3c30-4111-b2b4-d693a9a01e4a
1eb72f50-e2c7-4a96-b8cf-994052a2999d	551ec266-070f-4104-80f6-885d82184b47
6e954a84-cb60-4d4e-a9a1-dd60362cb01d	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0
40789bc9-fd19-43f2-baca-dffd55006316	4bedec79-f30d-43a7-9311-4adcbb4b9441
94a5df1b-6283-4bb6-babd-1b36ea5ff3c1	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0
a7ebdc89-3f39-4c8c-aa4b-e7914a5679b1	551ec266-070f-4104-80f6-885d82184b47
027baccb-6037-41b6-902d-67eeeaf4722c	551ec266-070f-4104-80f6-885d82184b47
4cd06b59-f551-4e90-983c-7eb553b5d769	551ec266-070f-4104-80f6-885d82184b47
2ebcf9d1-2643-4220-b52f-65971c946bc3	8186b039-3b54-4a08-8e3d-ce7d75ed6b47
fd9e56b8-1bc5-461a-be3a-c3bf4d680a71	8186b039-3b54-4a08-8e3d-ce7d75ed6b47
273c8964-ccdd-4648-b03f-2baff808286f	8186b039-3b54-4a08-8e3d-ce7d75ed6b47
44d00d9a-ceca-441d-a2fa-0f8832fa7a2c	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0
80a162ba-ac5d-4214-ae74-998d9ed5fccd	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0
415dc34d-3af6-44cd-bd4c-d6c2d6036134	6b996d7a-f2c6-4e61-ad0e-cde95c9fecde
e2fdf5fa-9c58-4fd4-b0a5-3a71a3fe6de7	4bedec79-f30d-43a7-9311-4adcbb4b9441
f51928a1-6a27-441d-8d4d-4205503cb50c	6b996d7a-f2c6-4e61-ad0e-cde95c9fecde
41d8f2fd-ec09-4b67-80d0-c42b6571bd9c	b99844d7-0913-4069-8ede-f32f167ad734
5df69527-65f6-484a-b5ee-879de9e4443b	b99844d7-0913-4069-8ede-f32f167ad734
49ccdeb3-bec7-4986-ba75-de9e61488c16	b99844d7-0913-4069-8ede-f32f167ad734
c9015eac-c31d-482f-b042-83923339b36a	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0
393aa6b3-c06f-417d-be1d-495ccafc8190	4bedec79-f30d-43a7-9311-4adcbb4b9441
66f10202-3d51-44a1-a4bb-5e93b3fc6f29	50885fd2-d9ad-4b09-8074-fa5d7eeea4d0
bc9cfacf-b83a-4bd4-90b4-4337ebc49b1e	4bedec79-f30d-43a7-9311-4adcbb4b9441
85535bb7-34fc-4f2d-9617-3046ca7a5b4c	6b996d7a-f2c6-4e61-ad0e-cde95c9fecde
0e376793-9edf-4cf6-9010-21ac23501e82	6b996d7a-f2c6-4e61-ad0e-cde95c9fecde
\.


--
-- Data for Name: task_user; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.task_user (id, user_id, task_id, status, turn, created_at, updated_at) FROM stdin;
758fc196-4a74-49b0-a4d1-86d7c9aa9064	4bedec79-f30d-43a7-9311-4adcbb4b9441	23cae8f0-6c16-45f1-93e8-31a9e2820f83	t	15	2022-03-26 11:51:34.25238+00	2022-03-26 11:53:29.440251+00
18716607-cae9-4128-a9f4-a03c37832e8b	4bedec79-f30d-43a7-9311-4adcbb4b9441	93b28ef8-eb1b-4dc1-b196-2baaf14496a8	f	16	2022-03-26 12:50:27.029156+00	2022-03-26 12:50:27.029156+00
aef66141-8f61-465a-9c0c-4644306e5a5b	4bedec79-f30d-43a7-9311-4adcbb4b9441	23cae8f0-6c16-45f1-93e8-31a9e2820f83	t	6	2022-03-17 10:48:49.056988+00	2022-03-17 10:50:34.351494+00
d10bd5a5-9816-4a1a-a517-619751331b25	4bedec79-f30d-43a7-9311-4adcbb4b9441	23cae8f0-6c16-45f1-93e8-31a9e2820f83	t	8	2022-03-17 11:05:35.587559+00	2022-03-17 13:52:14.423329+00
f3883d3d-9f60-48df-b69c-b06172807654	4bedec79-f30d-43a7-9311-4adcbb4b9441	93b28ef8-eb1b-4dc1-b196-2baaf14496a8	t	9	2022-03-17 13:52:19.520947+00	2022-03-17 13:53:36.009709+00
c3472c84-afb1-486a-ba94-62f28c306e10	4bedec79-f30d-43a7-9311-4adcbb4b9441	23cae8f0-6c16-45f1-93e8-31a9e2820f83	t	14	2022-03-19 01:38:02.85181+00	2022-03-21 03:35:45.856737+00
2df2a13f-4120-423f-b0b4-f32d8c89e9a6	3f299f9c-3c30-4111-b2b4-d693a9a01e4a	23cae8f0-6c16-45f1-93e8-31a9e2820f83	f	2	2022-03-17 16:45:27.087305+00	2022-03-17 16:45:27.087305+00
b2498570-12e0-4b36-8722-e08632dba040	4bedec79-f30d-43a7-9311-4adcbb4b9441	f2ab23ef-077f-474e-aa6a-955f5b0d5fd9	t	11	2022-03-18 03:38:32.66444+00	2022-03-18 03:39:03.338447+00
6a2619fe-2e57-4046-b86a-86ba2c01748e	4bedec79-f30d-43a7-9311-4adcbb4b9441	f2ab23ef-077f-474e-aa6a-955f5b0d5fd9	t	12	2022-03-18 03:39:09.917634+00	2022-03-18 03:39:31.938125+00
6585cc7b-9fc4-4170-87ef-486ff6603a91	4bedec79-f30d-43a7-9311-4adcbb4b9441	f2ab23ef-077f-474e-aa6a-955f5b0d5fd9	t	13	2022-03-18 03:39:35.838727+00	2022-03-18 03:39:44.754973+00
\.


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.tasks (id, description, name, reward, priority, type_task, related_data, unlock_link, list_posts, max_turn, created_at, updated_at) FROM stdin;
6978bf12-a131-4896-88b5-8499c002720e	Đây là nhiệm vụ tìm từ khóa trên google.com và truy cập website:\nCác bước thực hiện gồm:\nBước 1: Bắt buộc phải lên Google.com\nBước 2: Nhập từ khóa "akuba", (bấm nút COPY từ khóa bên dưới)\nBước 3: Vào website như hình bên dưới\nBước 4: Kéo từ từ xuống dưới và đợi lấy Mã\nBước 5: Copy Key và dán hoàn tất nhiệm vụ	akuba - Akuba.vn	2000	10	TRAFFIC	{"image":["d106d70e-7139-4f58-9d65-cb4b6223f38d","b6cd3be8-0977-407e-b3ce-9720d2372e02"],"origin":"https://akuba.vn/","key_word":"akuba","linkSocial":"","key":"1de04ae7-9872-4fed-9fa1-3d22ccb6bb77"}		{}	5	2022-03-19 07:53:13.410088+00	2022-03-19 07:53:13.410088+00
7a992db4-0d93-442e-b23b-4f9fec58bdfe	Đây là nhiệm vụ tìm từ khóa trên google.com và truy cập website:\nCác bước thực hiện gồm:\nBước 1: Bắt buộc phải lên Google.com hoặc Google.com.vn\nBước 2: Nhập từ khóa "akuba", (bấm nút COPY từ khóa bên dưới)\nBước 3: Vào website như hình bên dưới\nBước 4: Kéo từ từ xuống dưới và đợi lấy Mã\nBước 5: Copy Key và dán hoàn tất nhiệm vụ	vuagiay.vn - Vuagiay	2000	5	TRAFFIC	{"image":["f013c586-2515-4d76-b208-c3ebd4426375","d3f7620f-f989-4dfb-bb6a-8fee2f989c6b"],"origin":"https://vuagiay.vn/","key_word":"vuagiay.vn","linkSocial":"","key":"17319ef1-f8ab-4f91-aa80-b7fecc06e1b6"}		{}	3	2022-03-19 07:59:37.130395+00	2022-03-19 07:59:37.130395+00
0a3c0a7f-0bec-4f67-a4e1-b50a6e1698af	Đây là nhiệm vụ tìm từ khóa trên google.com và truy cập website:\nCác bước thực hiện gồm:\nBước 1: Bắt buộc phải lên Google.com\nBước 2: Nhập từ khóa "Fin24.vn", (bấm nút COPY từ khóa bên dưới)\nBước 3: Vào website như hình bên dưới\nBước 4: Kéo từ từ xuống dưới và đợi lấy Key\nBước 5: Copy Key và dán hoàn tất nhiệm vụ	fin24.vn - Fin24.vn	3000	10	TRAFFIC	{"image":["55b1c5a8-4583-4aca-a8dc-79101c797e60","b1ea2246-f7e7-4399-8782-b966948a09f4"],"origin":"https://fin24.vn/","key_word":"fin24.vn","linkSocial":"","key":"bdd13d80-dedd-42e0-a9c6-3b98b17859c4"}		{}	5	2022-03-18 09:46:21.031677+00	2022-03-18 09:46:21.031677+00
c2c64fd8-da71-4d6c-8ac6-74fe019d1aa7	Đây là nhiệm vụ tìm từ khóa trên google.com và truy cập website:\nCác bước thực hiện gồm:\nBước 1: Bắt buộc phải lên Google.com\nBước 2: Nhập từ khóa "denis.vn", (bấm nút COPY từ khóa bên dưới)\nBước 3: Vào website như hình bên dưới\nBước 4: Kéo từ từ xuống dưới và đợi lấy Mã\nBước 5: Copy Key và dán hoàn tất nhiệm vụ	denis.vn - Denis	2000	8	TRAFFIC	{"image":["05a803db-60b6-4d3e-8527-f61acf42b158","43917d6c-a89f-45eb-8477-804f15901f8b"],"origin":"https://denis.vn/","key_word":"denis.vn","linkSocial":"","key":"5df8afb2-388a-4330-837a-14eb02bf11ce"}		{}	5	2022-03-19 08:37:35.808504+00	2022-03-19 08:37:35.808504+00
f6a47fc6-2c04-45e0-befb-fbb1b73380e7	Đây là nhiệm vụ tìm từ khóa trên google.com và truy cập website:\nCác bước thực hiện gồm:\nBước 1: Bắt buộc phải lên Google.com\nBước 2: Nhập từ khóa "zacsport.vn", (bấm nút COPY từ khóa bên dưới)\nBước 3: Vào website như hình bên dưới\nBước 4: Kéo từ từ xuống dưới và đợi lấy Mã\nBước 5: Copy Key và dán hoàn tất nhiệm vụ	zacsport.vn - ZacSport	1000	3	TRAFFIC	{"image":["c66ca10c-22d1-44ec-b138-9b92d00e2b69","b25e6a7b-d2f1-4f60-b563-9c9932d8a9d3"],"origin":"http://zacsport.vn/","key_word":"zacsport.vn","linkSocial":"","key":"5627a666-9f47-4cc1-82f1-3a8635226e5b"}		{}	5	2022-03-19 08:53:03.524759+00	2022-03-19 08:53:03.524759+00
23cae8f0-6c16-45f1-93e8-31a9e2820f83	Đây là nhiệm vụ Like/Follow Fanpage Denis\nB1: Bấm vào làm nhiệm vụ ngay\nB2: Bấm vào nút "Like" \nB3: Chọn Like hoặc Follow Fanpage (Hệ thống sẽ kiểm tra bạn đã làm theo yêu cầu chưa)\nB4: Quay lại và chọn nút "Đã mở khóa" để lấy mã hoàn thành nhiệm vụ	Like Fanpage Denis	1000	10	LIKE_PAGE	{"image":["a232cf15-6988-4dad-9b04-4324b15f6830"],"origin":"https://www.facebook.com/giaydenis.vn","key_word":"Giày Denis","linkSocial":"","key":"6746"}	https://docs.google.com/document/d/16aVgqDfIT6iRvtkpdsiMijRP6hCSpXlqgCXobXbQEq0/edit?usp=sharing	{}	1	2022-03-17 08:58:14.190663+00	2022-03-26 11:49:40.536125+00
f2ab23ef-077f-474e-aa6a-955f5b0d5fd9	Tham gia nhóm	Tham gia Nhóm	1000	10	JOIN_GROUP	{"image":["4a754f36-a3ae-4968-ae7e-e159a6526c74"],"origin":"https://www.facebook.com/groups/332393775469504","key_word":"CỘNG ĐỒNG DÂN CƯ HÀ NỘI","linkSocial":"","key":"6746"}	https://docs.google.com/document/d/16aVgqDfIT6iRvtkpdsiMijRP6hCSpXlqgCXobXbQEq0/edit	{}	1	2022-03-17 09:02:50.467784+00	2022-03-17 09:02:50.467784+00
93b28ef8-eb1b-4dc1-b196-2baaf14496a8	Sub Denis	Sub Denis	1000	10	SUB_YOUTUBE	{"image":["e07cc6c3-d142-4564-bb9c-5fa1d19977c7","40170a20-1c96-4cee-8a90-73846e25bedc"],"origin":"https://www.youtube.com/channel/UCiqeCczeUZbsmrzkkUYnvoQ","key_word":"Giày Denis","linkSocial":"","key":"790"}		{}	10	2022-03-17 08:28:34.765625+00	2022-03-17 09:53:04.467044+00
cb948985-f534-40f3-abed-39c3e5a4eaab	Đây là Nhiệm vụ Viết đánh giá theo mẫu có sẵn. Tạo 1 tài khoản mạng xã hội theo yêu cầu (nếu chưa có). Copy nội dung có sẵn và đăng bài đánh giá. Sau đó nhấp và link bài viết mới đăng để lấy mã hoàn thành nhiệm vụ. Tuy nhiên mở tài khoản MXH mới thì sẽ giúp bạn dễ dàng hơn cho những nhiệm vụ sau.\n>> *Lưu ý: Nếu phát hiện gian lận hệ thống sẽ khóa tài khoản của bạn và xóa toàn bộ tiền đã làm trước đó	Nhiệm vụ đánh giá trên Twitter - Fin24	3000	1	REVIEW_SOCIAL	{"image":["6a486533-217e-4479-80d5-9df0ddc6bfe3","13ada699-baa4-4064-867f-8707777c2ec5","68869f71-975a-4d50-94a3-9ff58ffe743c","f2a1d900-de72-4b54-8db8-b21f6358b9d7","9c9705bc-819b-466a-9719-8ff952dd0220"],"origin":"https://fin24.vn/vay-the-chap/","key_word":"","linkSocial":"https://twitter.com/","key":"a202da44-b4db-4df9-8fae-1f6a6fff9c58"}		{"@Fin24vn là đơn vị cho vay tiền online cực kỳ uy tín và nhanh chóng. Chỉ cần có CMND và đăng ký vay online mà không gặp mặt. Vào đây để xem ngay: bit.ly/3iisYd1","Mình chưa biết vay tiền ở đâu. Mình có tham khảo #Fin24vn và thấy rất nhiều người khen. Không biết có nên vay ở Fin24vn không?. Vào đây để xem ngay: bit.ly/3wmTpXg","Chỉ cần có CMND/CCCD là có thể đăng ký vay ngay tại trên website @Fin24vn mà không cần phải gặp trược tiếp. Rất hữu ích. Vào đây để xem ngay: bit.ly/3JjA8tr"}	3	2022-03-24 01:55:59.913667+00	2022-03-24 01:55:59.913667+00
0815c79a-c622-4540-8a2e-0b03b56f9c26	Đây là nhiệm vụ Like/Follow Fanpage AKUBA 1979\nB1: Bấm vào LÀM NHIỆM VỤ NGAY\nB2: Bấm vào nút "Like" \nB3: Chọn Like hoặc Follow Fanpage (Hệ thống sẽ kiểm tra bạn đã làm theo yêu cầu chưa)\nB4: Quay lại và chọn nút "Đã mở khóa" để lấy mã hoàn thành nhiệm vụ	Like Fanpage AKUBA 1979	1000	10	LIKE_PAGE	{"image":["f7784f86-2291-4592-888a-34d4c006db27","56def79b-cdf0-43ab-b302-195c0d75edf8","735b4548-87e7-44bd-866f-82350e84c1cb"],"origin":"https://www.facebook.com/akuba1979","key_word":"","linkSocial":"","key":"83025"}	https://docs.google.com/document/d/1xEpNcsyB2kSKW13oYLKaM7QupohTBQp2eY2GsPwnq1k/edit?usp=sharing	{}	1	2022-03-26 12:44:04.394214+00	2022-03-26 12:44:04.394214+00
e9d95ff0-0e8c-41dd-a4df-68b39eeec81c	Đây là nhiệm vụ Like/Follow Fanpage Sơ Mi Nam AKUBA\nB1: Bấm vào LÀM NHIỆM VỤ NGAY\nB2: Bấm vào nút "Like" \nB3: Chọn Like hoặc Follow Fanpage (Hệ thống sẽ kiểm tra bạn đã làm theo yêu cầu chưa)\nB4: Quay lại và chọn nút "Đã mở khóa" để lấy mã hoàn thành nhiệm vụ	Like Fanpage Sơ Mi Nam AKUBA	1000	1	LIKE_PAGE	{"image":["dfa5822d-cefb-46d5-9eb4-98f22faf6461","965b32ad-6f01-43ba-87c8-41c78fae6662","c260b65b-dd45-4698-a884-adfdd8d98ebe"],"origin":"https://www.facebook.com/sominamakuba","key_word":"","linkSocial":"","key":"56721"}	https://docs.google.com/document/d/1kz1bG3Z08cZHKl4kvbCbwNjA54DoRaW190Ts6FpB130/edit?usp=sharing	{}	1	2022-03-26 14:03:41.814377+00	2022-03-26 14:03:41.814377+00
6e28df18-519a-49f6-a78a-3163684b7a7a	Đây là nhiệm vụ Like/Follow Fanpage Quần Tây AKUBA\nB1: Bấm vào LÀM NHIỆM VỤ NGAY\nB2: Bấm vào nút "Like" \nB3: Chọn Like hoặc Follow Fanpage (Hệ thống sẽ kiểm tra bạn đã làm theo yêu cầu chưa)\nB4: Quay lại và chọn nút "Đã mở khóa" để lấy mã hoàn thành nhiệm vụ	Like Fanpage Quần Tây AKUBA	1000	1	LIKE_PAGE	{"image":["c5863fd3-f78c-46dd-8061-1768ec9b3b89","4b62f504-a682-4a0e-82d7-307b576ceab0","ab5a1625-78a6-49d6-afb1-6721e51359b0"],"origin":"https://m.facebook.com/quantaynamakuba","key_word":"","linkSocial":"","key":"59821"}	https://docs.google.com/document/d/1BnX1Ffcr57WsrQJgTu0c57xTluPrdZdbkQRBvCEFObs/edit?usp=sharing	{}	1	2022-03-26 14:17:01.519429+00	2022-03-26 14:17:01.519429+00
93d5dd17-6b53-4b41-b818-e230f5092578	Đây là nhiệm vụ Like/Follow Fanpage Quần Jean AKUBA\nB1: Bấm vào LÀM NHIỆM VỤ NGAY\nB2: Bấm vào nút "Like" \nB3: Chọn Like hoặc Follow Fanpage (Hệ thống sẽ kiểm tra bạn đã làm theo yêu cầu chưa)\nB4: Quay lại và chọn nút "Đã mở khóa" để lấy mã hoàn thành nhiệm vụ	Like Fanpage Quần Jean AKUBA	1000	1	LIKE_PAGE	{"image":["2710637b-4b10-4e58-8dc8-c70f4a88e59b","bf27f853-838d-41e3-a19d-f97a771f3072","cbdfbcb9-f138-45f2-acdf-b654588eb88b","bd5282fd-c458-4b84-aad2-aca470914493","00829322-8776-4426-bf73-8f43e9222391"],"origin":"https://link1s.com/NG3yT6","key_word":"","linkSocial":"","key":"89641"}	https://docs.google.com/document/d/1F5ZON0sVUh1zgc2-avaDSTdxH7Lu2WjhSkajNGkF6v0/edit?usp=sharing	{}	1	2022-03-26 14:49:39.371244+00	2022-03-26 14:49:39.371244+00
074f74a5-675d-4822-a81a-458bf5ef30d2	Đây là nhiệm vụ Like/Follow Fanpage Áo Khoác Nam AKUBA\nB1: Bấm vào LÀM NHIỆM VỤ NGAY\nB2: Bấm vào nút "Like" >> làm theo hướng dẫn để vào Fanpage\nB3: Chọn Like hoặc Follow Fanpage (Hệ thống sẽ kiểm tra bạn đã làm theo yêu cầu chưa)\nB4: Quay lại và chọn nút "Mở Khóa" để lấy mã hoàn thành nhiệm vụ	Like/Follow Fanpage Áo Khoác Nam AKUBA	1000	1	LIKE_PAGE	{"image":["6e71ef62-fb78-49aa-9c8c-424f3958b4be","ee77326a-bcec-4f1b-811e-11a9eed324c3","63611ffd-20df-45f1-8a17-5ef062d21be5","758eb776-df37-45ff-80b2-cecbc4866ceb","270fed09-f650-46e9-a758-097c3ea6a982"],"origin":"https://link1s.com/stiIhld","key_word":"","linkSocial":"","key":"43642"}	https://docs.google.com/document/d/1QLh4bfKqhaRnVmbDLWVYv45hivMboihc6AtFyCTslRw/edit?usp=sharing	{}	1	2022-03-27 07:29:02.385914+00	2022-03-27 07:29:02.385914+00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.users (id, email, password, telephone, name, address, is_admin, balance, user_social_id, related_data, created_at, updated_at) FROM stdin;
50885fd2-d9ad-4b09-8074-fa5d7eeea4d0	hieuhoang.fimar@gmail.com	$2b$10$ahacCh1s2APEZOg2wu4FruvCuTeWjEXr1bE2HOfacRLPdM/ciNXnm	0367495260	Hoàng Trung Hiếu	Vinhomes	t	0	272628766	{"bank_number":"12345678","bank_name":"vpbank"}	2022-03-15 13:26:57.866604+00	2022-03-15 13:38:53.09799+00
6b996d7a-f2c6-4e61-ad0e-cde95c9fecde	phamtienluc512@gmail.com	$2b$10$.IR/EvcZIaYMuvdSgWe8rewCe0otugGRpB6NzF.gXzRVnfUOlqlJO	0961507512	Phạm Tiến Lực	02 Lê Duẩn	t	0	038099015915	{"bank_number":"16867567","bank_name":"ACB"}	2022-03-15 13:22:54.976771+00	2022-03-15 13:38:53.09799+00
551ec266-070f-4104-80f6-885d82184b47	Chuong@gmail.com	$2b$10$Kywa9peteA.VDQzVfsU/g.dHptFYJP0x.ndTRkARz/ZRgLk.Mgso6	0988822772	Chuong	Ha noi	f	0	737272	{"bank_number":"828228","bank_name":"Ha noi"}	2022-03-15 14:29:21.224729+00	2022-03-15 14:29:21.224729+00
36cde200-0bef-4da8-aa95-871660548d8e	phamtienluc100299@gmail.com	$2b$10$fIAWaWkXVQBB0O83m3RGcOxRMxwWHT0ECwVIlzjpo3RAeoWH.cCw2	0797898339	Phạm Tiến Lực	Aa1908	f	0	273681803	{"bank_number":"397922222268","bank_name":"ACB"}	2022-03-16 02:13:11.571641+00	2022-03-16 02:13:11.571641+00
8dee6d20-26d9-4cf1-a4f4-ed8a47ed4dca	clone12345672@gmail.com	$2b$10$klPAXBDkdgsBoP28rpOPfexsI7ztvTF0giOaNhTgOugRxuza4cFdO	0934013777	Tran Minh Tuan Minh	123 ABC	f	0	077092003000	{"bank_number":"14310000077800","bank_name":"BIDV"}	2022-03-16 06:04:42.295514+00	2022-03-16 06:04:42.295514+00
2f3b9be2-c952-464e-83c5-fb6eeda554e6	clone12345673@gmail.com	$2b$10$5hl7vPvW34R8DYMyBbrH.emYtNp.I6kl1VcptuK1ptuvvgasnyi16	0898984599	Nguyen Tuan	AAAAAA	f	0	077092003010	{"bank_number":"14411234588487","bank_name":"BIDV"}	2022-03-16 06:05:59.567103+00	2022-03-16 06:05:59.567103+00
b6c35eb8-e529-4af2-9d0c-bbf15270103e	clone12345674@gmail.com	$2b$10$l5tZW/YPLhZD9sVYNZDWz.E1nVJYFq156rOI0PjeqLAtH7r2kfwjK	0941234588	Tuan Minh A	AAAAA	f	0	077092000021	{"bank_number":"1441123456789","bank_name":"ACB"}	2022-03-16 06:12:23.223328+00	2022-03-16 06:12:23.223328+00
43beb34b-51a6-4b3a-b0a5-ca55bd399603	clone12345675@gmail.com	$2b$10$jIF7Ez0OD1REKqfOgOnbv.gO9NmBobeI1fInKQCYPeKgYLAKDt8Ci	0123456789	Tuan Minh A	qweqwewqe	f	0	000000000000	{"bank_number":"00000000000000","bank_name":"ACB"}	2022-03-16 06:13:36.918016+00	2022-03-16 06:13:36.918016+00
391a3129-ce1d-4fee-ae14-3f672a230864	hoang@gmail.com	$2b$10$Vy7gNDdoynMqzVzmtnEvIuPH5w7rTGtXQza/EtQU0FHRDG8h03OSm	0123182731	Vu Le Hoang	TTT	t	0	3123123123	{"bank_number":"12987274","bank_name":"Workbank"}	2022-03-15 12:59:50.469268+00	2022-03-16 16:16:30.949728+00
39a8ace4-23fd-4347-886c-53fe96d7f887	chuongadmin@gmail.com	$2b$10$focYPGB0vIfzsjTNLPyxk.W8qFoDZB6dFsMn8qSPGXgASZoxDH/3S	0927282822	chuong admin	ha noi	t	0	9292	{"bank_number":"1818","bank_name":"ha noi"}	2022-03-16 16:15:36.935778+00	2022-03-16 16:20:19.640652+00
51f1099c-54f2-4cb9-b616-01b4df3909d5	Facephu696@gmail.com	$2b$10$70nt1DfPv2LDwTSyifkvZ.PBSsdZ6GgXDaSSuXeEhVk/XiDm29W0G	0367777727	Minh phu	58/1 le hong phong, phường 2, quận 5	f	0	381943190	{"bank_number":"070081422670","bank_name":"Sacombank"}	2022-03-17 09:28:37.022604+00	2022-03-17 09:28:37.022604+00
8186b039-3b54-4a08-8e3d-ce7d75ed6b47	nguyengin99@gmail.com	$2b$10$aTdX7H6jsAelFW.aoOBXBOrH3b6.UZ/dQMu9xFXjt7vykNT6lz9FW	0869039016	NGUYỄN THỊ LAN HƯƠNG	14 đường số 4	f	0	273681804	{"bank_number":"19038019084017","bank_name":"Techcombank"}	2022-03-18 12:24:59.382973+00	2022-03-18 12:24:59.382973+00
3f299f9c-3c30-4111-b2b4-d693a9a01e4a	qltnvamt04@gmail.com	$2b$10$RZFHw4WApNfMOxKNgCZOouONi2Cwiih3sB1m06hPkMkGrqp8ph6YW	0797898338	Pham tien luc	14/1 duong so 4	f	10000	038089015913	{"bank_number":"101199","bank_name":"Acb"}	2022-03-17 09:49:17.699337+00	2022-03-17 09:52:43.926533+00
b99844d7-0913-4069-8ede-f32f167ad734	Cuoiduong10@gmail.com	$2b$10$ThYJgwLrJyJQmsHaG.VaD.Wt/zdugycpXTQTlpxmAxRz7ANshSrqK	0356171042	Dương Gia Huy	70 đường 7 phường Phước Bình quận 9	f	0	079099005757	{"bank_number":"05256293701","bank_name":"TMCP Tiên Phong - TPBANK"}	2022-03-22 06:59:24.386078+00	2022-03-22 06:59:24.386078+00
4bedec79-f30d-43a7-9311-4adcbb4b9441	hoang123@gmail.com	$2b$10$vWfWEMdFAHfup8A1Gr08/.HZbmEcGQE/cdcJsUl7VjRQZKeN5bHBm	0367292627	Hieu	Vinhome	f	2000	272683988	{"bank_number":"1728394729","bank_name":"Vpbank","image":"dcbff277-46fe-404f-8735-ae09a1611844"}	2022-03-15 14:16:19.377681+00	2022-03-26 11:53:29.447952+00
\.


--
-- Data for Name: withdraw; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.withdraw (id, user_id, status, amount, created_at, updated_at) FROM stdin;
f0efa508-247c-4e3c-ad7c-35b4c53bfc84	4bedec79-f30d-43a7-9311-4adcbb4b9441	1	40000	2022-03-21 03:40:05.646634+00	2022-03-21 03:41:05.590249+00
\.


--
-- Name: image image_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.image
    ADD CONSTRAINT image_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: task_user task_user_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.task_user
    ADD CONSTRAINT task_user_pkey PRIMARY KEY (id);


--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_user_social_id_key; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_user_social_id_key UNIQUE (user_social_id);


--
-- Name: withdraw withdraw_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.withdraw
    ADD CONSTRAINT withdraw_pkey PRIMARY KEY (id);


--
-- Name: sessions_user; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX sessions_user ON public.sessions USING btree (user_id);


--
-- Name: task_user_idx; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX task_user_idx ON public.task_user USING btree (id);


--
-- Name: tasks_idx; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX tasks_idx ON public.tasks USING btree (id);


--
-- Name: users_email; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX users_email ON public.users USING btree (email);


--
-- Name: withdraw_idx; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX withdraw_idx ON public.withdraw USING btree (id);


--
-- Name: tasks task_timestamp_create; Type: TRIGGER; Schema: public; Owner: user
--

CREATE TRIGGER task_timestamp_create BEFORE INSERT ON public.tasks FOR EACH ROW EXECUTE PROCEDURE public.task_timestamp_create();


--
-- Name: tasks task_timestamp_update; Type: TRIGGER; Schema: public; Owner: user
--

CREATE TRIGGER task_timestamp_update BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE PROCEDURE public.task_timestamp_update();


--
-- Name: task_user user_task_timestamp_create; Type: TRIGGER; Schema: public; Owner: user
--

CREATE TRIGGER user_task_timestamp_create BEFORE INSERT ON public.task_user FOR EACH ROW EXECUTE PROCEDURE public.user_task_timestamp_create();


--
-- Name: task_user user_task_timestamp_update; Type: TRIGGER; Schema: public; Owner: user
--

CREATE TRIGGER user_task_timestamp_update BEFORE UPDATE ON public.task_user FOR EACH ROW EXECUTE PROCEDURE public.user_task_timestamp_update();


--
-- Name: users user_timestamp_create; Type: TRIGGER; Schema: public; Owner: user
--

CREATE TRIGGER user_timestamp_create BEFORE INSERT ON public.users FOR EACH ROW EXECUTE PROCEDURE public.user_timestamp_create();


--
-- Name: users user_timestamp_update; Type: TRIGGER; Schema: public; Owner: user
--

CREATE TRIGGER user_timestamp_update BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE public.user_timestamp_update();


--
-- Name: withdraw withdraw_timestamp_create; Type: TRIGGER; Schema: public; Owner: user
--

CREATE TRIGGER withdraw_timestamp_create BEFORE INSERT ON public.withdraw FOR EACH ROW EXECUTE PROCEDURE public.withdraw_timestamp_create();


--
-- Name: withdraw withdraw_timestamp_update; Type: TRIGGER; Schema: public; Owner: user
--

CREATE TRIGGER withdraw_timestamp_update BEFORE UPDATE ON public.withdraw FOR EACH ROW EXECUTE PROCEDURE public.withdraw_timestamp_update();


--
-- Name: image image_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.image
    ADD CONSTRAINT image_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: task_user task_user_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.task_user
    ADD CONSTRAINT task_user_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: task_user task_user_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.task_user
    ADD CONSTRAINT task_user_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: withdraw withdraw_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.withdraw
    ADD CONSTRAINT withdraw_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\connect postgres

SET default_transaction_read_only = off;

--
-- PostgreSQL database dump
--

-- Dumped from database version 10.4 (Debian 10.4-2.pgdg90+1)
-- Dumped by pg_dump version 10.4 (Debian 10.4-2.pgdg90+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE postgres; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON DATABASE postgres IS 'default administrative connection database';


--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- PostgreSQL database dump complete
--

\connect template1

SET default_transaction_read_only = off;

--
-- PostgreSQL database dump
--

-- Dumped from database version 10.4 (Debian 10.4-2.pgdg90+1)
-- Dumped by pg_dump version 10.4 (Debian 10.4-2.pgdg90+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE template1; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON DATABASE template1 IS 'default template for new databases';


--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database cluster dump complete
--

