import { relations } from "drizzle-orm"
import {
  timestamp,
  text,
  pgEnum,
  serial,
  boolean,
  pgTable,
  integer,
} from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const roleEnum = pgEnum("role", ["member", "admin"])
export const accountTypeEnum = pgEnum("type", ["email", "google", "github"])

export const users = pgTable("ldi_user", {
  id: serial("id").primaryKey(),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
})

export const accounts = pgTable("ldi_accounts", {
  id: serial("id").primaryKey(),
  userId: serial("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accountType: accountTypeEnum("accountType").notNull(),
  githubId: text("githubId").unique(),
  googleId: text("googleId").unique(),
  password: text("password"),
  salt: text("salt"),
})

export const magicLinks = pgTable("ldi_magic_links", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  token: text("token"),
  tokenExpiresAt: timestamp("tokenExpiresAt", { mode: "date" }),
})

export const resetTokens = pgTable("ldi_reset_tokens", {
  id: serial("id").primaryKey(),
  userId: serial("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  token: text("token"),
  tokenExpiresAt: timestamp("tokenExpiresAt", { mode: "date" }),
})

export const verifyEmailTokens = pgTable("ldi_verify_email_tokens", {
  id: serial("id").primaryKey(),
  userId: serial("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  token: text("token"),
  tokenExpiresAt: timestamp("tokenExpiresAt", { mode: "date" }),
})

export const profiles = pgTable("ldi_profile", {
  id: serial("id").primaryKey(),
  userId: serial("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  displayName: text("displayName"),
  imageId: text("imageId"),
  image: text("image"),
  bio: text("bio").notNull().default(""),
})

export const sessions = pgTable("ldi_session", {
  id: text("id").primaryKey(),
  userId: serial("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
})

export const subscriptions = pgTable("ldi_subscriptions", {
  id: serial("id").primaryKey(),
  userId: serial("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  stripeSubscriptionId: text("stripeSubscriptionId").notNull(),
  stripeCustomerId: text("stripeCustomerId").notNull(),
  stripePriceId: text("stripePriceId").notNull(),
  stripeCurrentPeriodEnd: timestamp("expires", { mode: "date" }).notNull(),
})

export const following = pgTable("ldi_following", {
  id: serial("id").primaryKey(),
  userId: serial("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  foreignUserId: serial("foreignUserId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
})

/**
 * newsletters - although the emails for the newsletter are tracked in Resend, it's beneficial to also track
 * sign ups in your own database in case you decide to move to another email provider.
 * The last thing you'd want is for your email list to get lost due to a
 * third party provider shutting down or dropping your data.
 */
export const newsletters = pgTable("ldi_newsletter", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
})

export const projects = pgTable("ldi_project", {
  id: serial("id").primaryKey(),
  userId: serial("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  isPublic: boolean("isPublic").notNull().default(false),
  bannerId: text("bannerId"),
  info: text("info").default(""),
  youtubeLink: text("youtubeLink").default(""),
  discordLink: text("discordLink").default(""),
  githubLink: text("githubLink").default(""),
  xLink: text("xLink").default(""),
})

export const memberships = pgTable("ldi_membership", {
  id: serial("id").primaryKey(),
  userId: serial("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  projectId: serial("projectId")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  role: roleEnum("role").default("member"),
})

export const invites = pgTable("ldi_invites", {
  id: serial("id").primaryKey(),
  token: text("token")
    .notNull()
    .default(sql`gen_random_uuid()`)
    .unique(),
  projectId: serial("projectId")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
})

export const events = pgTable("ldi_events", {
  id: serial("id").primaryKey(),
  projectId: serial("projectId")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageId: text("imageId"),
  startsOn: timestamp("startsOn", { mode: "date" }).notNull(),
})

export const notifications = pgTable("ldi_notifications", {
  id: serial("id").primaryKey(),
  userId: serial("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  projectId: serial("projectId")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  postId: integer("postId"),
  isRead: boolean("isRead").notNull().default(false),
  type: text("type").notNull(),
  message: text("message").notNull(),
  createdOn: timestamp("createdOn", { mode: "date" }).notNull(),
})

export const posts = pgTable("ldi_posts", {
  id: serial("id").primaryKey(),
  userId: serial("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  projectId: serial("projectId")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  message: text("message").notNull(),
  createdOn: timestamp("createdOn", { mode: "date" }).notNull(),
})

export const reply = pgTable("ldi_replies", {
  id: serial("id").primaryKey(),
  userId: serial("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  postId: serial("postId")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  projectId: serial("projectId")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  createdOn: timestamp("createdOn", { mode: "date" }).notNull(),
})

/**
 * RELATIONSHIPS
 *
 * Here you can define drizzle relationships between table which helps improve the type safety
 * in your code.
 */

export const projectRelations = relations(projects, ({ many }) => ({
  memberships: many(memberships),
}))

export const membershipRelations = relations(memberships, ({ one }) => ({
  user: one(users, { fields: [memberships.userId], references: [users.id] }),
  profile: one(profiles, {
    fields: [memberships.userId],
    references: [profiles.userId],
  }),
  project: one(projects, {
    fields: [memberships.projectId],
    references: [projects.id],
  }),
}))

export const postsRelationships = relations(posts, ({ one }) => ({
  user: one(users, { fields: [posts.userId], references: [users.id] }),
  project: one(projects, { fields: [posts.projectId], references: [projects.id] }),
}))

export const followingRelationship = relations(following, ({ one }) => ({
  foreignProfile: one(profiles, {
    fields: [following.foreignUserId],
    references: [profiles.userId],
  }),
  userProfile: one(profiles, {
    fields: [following.userId],
    references: [profiles.id],
  }),
}))

/**
 * TYPES
 *
 * You can create and export types from your schema to use in your application.
 * This is useful when you need to know the shape of the data you are working with
 * in a component or function.
 */
export type Subscription = typeof subscriptions.$inferSelect
export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert
export type Membership = typeof memberships.$inferSelect

export type Event = typeof events.$inferSelect
export type NewEvent = typeof events.$inferInsert

export type User = typeof users.$inferSelect
export type Profile = typeof profiles.$inferSelect

export type Notification = typeof notifications.$inferSelect

export type Post = typeof posts.$inferSelect
export type NewPost = typeof posts.$inferInsert

export type Reply = typeof reply.$inferSelect
export type NewReply = typeof reply.$inferInsert

export type Following = typeof following.$inferSelect

export type ProjectId = Project["id"]
