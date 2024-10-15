all:
	@pnpm run dev

run:
	@pnpm run build && pnpm run start

format:
	@pnpm run format

sample:
	@tsc --resolveJsonModule --esModuleInterop scripts/create.ts && node scripts/create.js && rm scripts/*.js