DO $$ BEGIN
 CREATE TYPE "public"."type" AS ENUM('email', 'google', 'github');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."role" AS ENUM('member', 'admin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ldi_accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"accountType" "type" NOT NULL,
	"githubId" text,
	"googleId" text,
	"password" text,
	"salt" text,
	CONSTRAINT "ldi_accounts_githubId_unique" UNIQUE("githubId"),
	CONSTRAINT "ldi_accounts_googleId_unique" UNIQUE("googleId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ldi_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"projectId" serial NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"imageId" text,
	"startsOn" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ldi_following" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"foreignUserId" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ldi_invites" (
	"id" serial PRIMARY KEY NOT NULL,
	"token" text DEFAULT gen_random_uuid() NOT NULL,
	"projectId" serial NOT NULL,
	CONSTRAINT "ldi_invites_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ldi_magic_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"token" text,
	"tokenExpiresAt" timestamp,
	CONSTRAINT "ldi_magic_links_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ldi_membership" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"projectId" serial NOT NULL,
	"role" "role" DEFAULT 'member'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ldi_newsletter" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	CONSTRAINT "ldi_newsletter_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ldi_notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"projectId" serial NOT NULL,
	"postId" integer,
	"isRead" boolean DEFAULT false NOT NULL,
	"type" text NOT NULL,
	"message" text NOT NULL,
	"createdOn" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ldi_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"projectId" serial NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"createdOn" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ldi_profile" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"displayName" text,
	"imageId" text,
	"image" text,
	"bio" text DEFAULT '' NOT NULL,
	CONSTRAINT "ldi_profile_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ldi_project" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"isPublic" boolean DEFAULT false NOT NULL,
	"bannerId" text,
	"info" text DEFAULT '',
	"youtubeLink" text DEFAULT '',
	"discordLink" text DEFAULT '',
	"githubLink" text DEFAULT '',
	"xLink" text DEFAULT ''
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ldi_replies" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"postId" serial NOT NULL,
	"projectId" serial NOT NULL,
	"message" text NOT NULL,
	"createdOn" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ldi_reset_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"token" text,
	"tokenExpiresAt" timestamp,
	CONSTRAINT "ldi_reset_tokens_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ldi_session" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ldi_subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"stripeSubscriptionId" text NOT NULL,
	"stripeCustomerId" text NOT NULL,
	"stripePriceId" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "ldi_subscriptions_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ldi_user" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text,
	"emailVerified" timestamp,
	CONSTRAINT "ldi_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ldi_verify_email_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"token" text,
	"tokenExpiresAt" timestamp,
	CONSTRAINT "ldi_verify_email_tokens_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ldi_accounts" ADD CONSTRAINT "ldi_accounts_userId_ldi_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."ldi_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ldi_events" ADD CONSTRAINT "ldi_events_projectId_ldi_project_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."ldi_project"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ldi_following" ADD CONSTRAINT "ldi_following_userId_ldi_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."ldi_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ldi_following" ADD CONSTRAINT "ldi_following_foreignUserId_ldi_user_id_fk" FOREIGN KEY ("foreignUserId") REFERENCES "public"."ldi_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ldi_invites" ADD CONSTRAINT "ldi_invites_projectId_ldi_project_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."ldi_project"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ldi_membership" ADD CONSTRAINT "ldi_membership_userId_ldi_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."ldi_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ldi_membership" ADD CONSTRAINT "ldi_membership_projectId_ldi_project_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."ldi_project"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ldi_notifications" ADD CONSTRAINT "ldi_notifications_userId_ldi_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."ldi_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ldi_notifications" ADD CONSTRAINT "ldi_notifications_projectId_ldi_project_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."ldi_project"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ldi_posts" ADD CONSTRAINT "ldi_posts_userId_ldi_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."ldi_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ldi_posts" ADD CONSTRAINT "ldi_posts_projectId_ldi_project_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."ldi_project"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ldi_profile" ADD CONSTRAINT "ldi_profile_userId_ldi_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."ldi_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ldi_project" ADD CONSTRAINT "ldi_project_userId_ldi_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."ldi_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ldi_replies" ADD CONSTRAINT "ldi_replies_userId_ldi_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."ldi_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ldi_replies" ADD CONSTRAINT "ldi_replies_postId_ldi_posts_id_fk" FOREIGN KEY ("postId") REFERENCES "public"."ldi_posts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ldi_replies" ADD CONSTRAINT "ldi_replies_projectId_ldi_project_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."ldi_project"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ldi_reset_tokens" ADD CONSTRAINT "ldi_reset_tokens_userId_ldi_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."ldi_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ldi_session" ADD CONSTRAINT "ldi_session_userId_ldi_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."ldi_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ldi_subscriptions" ADD CONSTRAINT "ldi_subscriptions_userId_ldi_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."ldi_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ldi_verify_email_tokens" ADD CONSTRAINT "ldi_verify_email_tokens_userId_ldi_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."ldi_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
