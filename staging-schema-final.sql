

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


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."magic_tokens" (
    "id" integer NOT NULL,
    "token" character varying(64) NOT NULL,
    "user_profile_id" integer,
    "email" character varying(255) NOT NULL,
    "course_id" character varying(255),
    "course_name" character varying(255),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "expires_at" timestamp with time zone NOT NULL,
    "used_at" timestamp with time zone,
    "is_active" boolean DEFAULT true
);


ALTER TABLE "public"."magic_tokens" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."magic_tokens_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."magic_tokens_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."magic_tokens_id_seq" OWNED BY "public"."magic_tokens"."id";



CREATE TABLE IF NOT EXISTS "public"."sessions" (
    "id" integer NOT NULL,
    "module_id" character varying(255) NOT NULL,
    "session_id" character varying(255) NOT NULL,
    "title" character varying(255),
    "description" "text",
    "content" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."sessions" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."sessions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."sessions_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."sessions_id_seq" OWNED BY "public"."sessions"."id";



CREATE TABLE IF NOT EXISTS "public"."user_profiles" (
    "id" integer NOT NULL,
    "email" character varying(255) NOT NULL,
    "first_name" character varying(255),
    "last_name" character varying(255),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "login_source" character varying(50) DEFAULT 'direct'::character varying,
    "created_via_webhook" boolean DEFAULT false,
    "magic_token" character varying(64),
    "magic_token_expires_at" timestamp with time zone
);


ALTER TABLE "public"."user_profiles" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."user_profiles_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."user_profiles_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."user_profiles_id_seq" OWNED BY "public"."user_profiles"."id";



CREATE TABLE IF NOT EXISTS "public"."user_progress" (
    "id" integer NOT NULL,
    "user_profile_id" integer,
    "session_id" integer,
    "completion_percentage" integer DEFAULT 0,
    "completed_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_progress" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."user_progress_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."user_progress_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."user_progress_id_seq" OWNED BY "public"."user_progress"."id";



ALTER TABLE ONLY "public"."magic_tokens" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."magic_tokens_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."sessions" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."sessions_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."user_profiles" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."user_profiles_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."user_progress" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."user_progress_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."magic_tokens"
    ADD CONSTRAINT "magic_tokens_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."magic_tokens"
    ADD CONSTRAINT "magic_tokens_token_key" UNIQUE ("token");



ALTER TABLE ONLY "public"."sessions"
    ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_progress"
    ADD CONSTRAINT "user_progress_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_magic_tokens_email" ON "public"."magic_tokens" USING "btree" ("email");



CREATE INDEX "idx_magic_tokens_expires" ON "public"."magic_tokens" USING "btree" ("expires_at");



CREATE INDEX "idx_magic_tokens_token" ON "public"."magic_tokens" USING "btree" ("token");



CREATE INDEX "idx_sessions_module_session" ON "public"."sessions" USING "btree" ("module_id", "session_id");



CREATE INDEX "idx_user_profiles_email" ON "public"."user_profiles" USING "btree" ("email");



CREATE INDEX "idx_user_profiles_magic_token" ON "public"."user_profiles" USING "btree" ("magic_token");



CREATE INDEX "idx_user_progress_session_id" ON "public"."user_progress" USING "btree" ("session_id");



CREATE INDEX "idx_user_progress_user_id" ON "public"."user_progress" USING "btree" ("user_profile_id");



ALTER TABLE ONLY "public"."magic_tokens"
    ADD CONSTRAINT "magic_tokens_user_profile_id_fkey" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_progress"
    ADD CONSTRAINT "user_progress_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_progress"
    ADD CONSTRAINT "user_progress_user_profile_id_fkey" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE CASCADE;



CREATE POLICY "Users can insert own progress" ON "public"."user_progress" FOR INSERT WITH CHECK ((("auth"."uid"())::"text" = ("user_profile_id")::"text"));



CREATE POLICY "Users can update own profile" ON "public"."user_profiles" FOR UPDATE USING ((("auth"."uid"())::"text" = ("id")::"text"));



CREATE POLICY "Users can update own progress" ON "public"."user_progress" FOR UPDATE USING ((("auth"."uid"())::"text" = ("user_profile_id")::"text"));



CREATE POLICY "Users can view own profile" ON "public"."user_profiles" FOR SELECT USING ((("auth"."uid"())::"text" = ("id")::"text"));



CREATE POLICY "Users can view own progress" ON "public"."user_progress" FOR SELECT USING ((("auth"."uid"())::"text" = ("user_profile_id")::"text"));



ALTER TABLE "public"."magic_tokens" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sessions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_progress" ENABLE ROW LEVEL SECURITY;


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON TABLE "public"."magic_tokens" TO "anon";
GRANT ALL ON TABLE "public"."magic_tokens" TO "authenticated";
GRANT ALL ON TABLE "public"."magic_tokens" TO "service_role";



GRANT ALL ON SEQUENCE "public"."magic_tokens_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."magic_tokens_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."magic_tokens_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."sessions" TO "anon";
GRANT ALL ON TABLE "public"."sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."sessions" TO "service_role";



GRANT ALL ON SEQUENCE "public"."sessions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."sessions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."sessions_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."user_profiles" TO "anon";
GRANT ALL ON TABLE "public"."user_profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."user_profiles" TO "service_role";



GRANT ALL ON SEQUENCE "public"."user_profiles_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_profiles_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_profiles_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."user_progress" TO "anon";
GRANT ALL ON TABLE "public"."user_progress" TO "authenticated";
GRANT ALL ON TABLE "public"."user_progress" TO "service_role";



GRANT ALL ON SEQUENCE "public"."user_progress_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_progress_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_progress_id_seq" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






RESET ALL;
