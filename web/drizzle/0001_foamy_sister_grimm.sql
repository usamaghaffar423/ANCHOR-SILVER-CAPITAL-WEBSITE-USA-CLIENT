CREATE TABLE `ghl_tokens` (
	`id` text PRIMARY KEY NOT NULL,
	`location_id` text,
	`company_id` text,
	`user_id` text,
	`access_token` text NOT NULL,
	`refresh_token` text NOT NULL,
	`token_type` text DEFAULT 'Bearer' NOT NULL,
	`scope` text,
	`expires_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
