CREATE TABLE `bed_table` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`sow_date` text,
	`grid_width` integer,
	`grid_height` integer,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `grid_item_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`seed` text,
	`bed_id` text NOT NULL,
	FOREIGN KEY (`bed_id`) REFERENCES `bed_table`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `seeds_table` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`germination_type` text,
	`pre_sprout` integer,
	`sow_from` text,
	`sow_till` text,
	`plant_from` text,
	`plant_till` text,
	`harvest_from` text,
	`harvest_till` text,
	`expiration_date` text,
	`url` text,
	`plant_height` text,
	`number_of_seeds_per_grid_cell` integer,
	`variety` text,
	`days_to_maturity` integer,
	`notes` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `users_table` (
	`name` text NOT NULL,
	`email` text PRIMARY KEY NOT NULL,
	`avatar` text
);
