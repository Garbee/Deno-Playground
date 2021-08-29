.DEFAULT_GOAL := run

run:
	@deno run ./src/main.ts
seed:
	@deno run --allow-read --allow-env --allow-net database/seed.ts