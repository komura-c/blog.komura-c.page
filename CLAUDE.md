# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

This is an Astro-based blog site. Use pnpm as the package manager.

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build

## Architecture Overview

This is a personal blog that aggregates content from multiple sources:

### Content Sources
- **Internal posts**: Markdown files in `src/content/posts/` managed by Astro's content collections
- **External feeds**: RSS feeds from Hatena Blog, Voicy, Zenn, and Qiita fetched at build time

### Key Components
- **BlogFetcher.ts**: RSS parser that fetches external articles with hostname-specific filtering
- **GetAllOuterPosts.ts**: Manages external feed aggregation with caching and promise coordination
- **Article type**: Unified interface for both internal and external posts with `isMySite` flag

### Content Flow
1. Index page combines internal posts (from content collections) and external posts (from RSS feeds)
2. All posts are sorted by publication date in descending order
3. External posts display with platform-specific icons (Zenn, Qiita, Hatena)
4. Internal posts use Astro's view transitions for smooth navigation

### Styling
- Uses SCSS with mixins in `src/styles/_mixins.scss`
- CSS custom properties for theming
- Responsive grid layout with hover animations

The site is deployed at `https://blog.komura-c.page` with sitemap generation enabled.