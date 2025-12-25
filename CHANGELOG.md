# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-12-25
### Added
- Initial stable release of my-blog (backend + frontend).
- User model: `username` (unique), `bio`, `avatar`, `followersCount`, `followingCount`.
- Post model: `title`, `subtitle` (optional), `content`, `coverImage` (optional), `slug` (unique), `readTime` (default 0), `published` (boolean), `publishedAt`.
- Tag model: `name` (unique), `followersCount`.
- Relations:
  - User ↔ Posts (author relation)
  - Posts ↔ Tags (many-to-many via `PostTag` join)
  - User ↔ User (followers via `UserFollow` join)

### Infrastructure
- Prisma (MongoDB) schema with indexes on foreign keys.
- Backend build scripts and dev tooling.
- Frontend React + Vite scaffolding.

### Notes
- `published` is a boolean flag (draft vs published); `subtitle` is optional; excerpt is computed at runtime when needed.
