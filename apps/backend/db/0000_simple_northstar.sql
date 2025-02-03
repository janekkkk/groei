CREATE TABLE `bed_table` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`grid_width` integer,
	`grid_height` integer,
	`updated_at` text DEFAULT (current_timestamp),
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`deleted_at` text DEFAULT (current_timestamp)
);
--> statement-breakpoint
CREATE TABLE `grid_item_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`index` integer NOT NULL,
	`updated_at` text DEFAULT (current_timestamp),
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`deleted_at` text DEFAULT (current_timestamp)
);
--> statement-breakpoint
CREATE TABLE `seeds_table` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`sow_from` text,
	`sow_till` text,
	`plant_from` text,
	`plant_till` text,
	`harvest_from` text,
	`harvest_till` text,
	`expiration_date` text,
	`url` text,
	`plant_height` text,
	`plant_distance` integer,
	`number_of_seeds_per_grid_cell` integer,
	`variety` text,
	`days_to_maturity` integer,
	`quantity` integer,
	`notes` text,
	`tags` text,
	`photo` text,
	`updated_at` text DEFAULT (current_timestamp),
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`deleted_at` text DEFAULT (current_timestamp)
);
--> statement-breakpoint
CREATE TABLE `users_table` (
	`name` text NOT NULL,
	`email` text PRIMARY KEY NOT NULL,
	`avatar` text
);
