# Catalog Design Rules

## Direction
Build catalog-related surfaces like a warm editorial reading room, not a high-contrast admin dashboard. The tone is calm, tactile, and shelf-inspired: rounded panels, soft beige backgrounds, restrained green accents, and generous whitespace.

## Palette
Use the semantic catalog tokens already defined in `app/globals.css`.

- `--catalog-bg`: page background
- `--catalog-panel`: primary surface
- `--catalog-panel-muted`: secondary panel or inset surface
- `--catalog-border`: default border
- `--catalog-border-strong`: emphasized border or separators
- `--catalog-text`: primary text
- `--catalog-text-muted`: supporting text
- `--catalog-accent`: primary action color
- `--catalog-accent-soft`: subtle accent fill
- `--catalog-warm-accent`: decorative warm highlight

### Rules
- Prefer semantic variables over raw hex values.
- Use `--catalog-accent` for important actions only.
- Keep most surfaces light and quiet; let covers and content provide contrast.
- Avoid returning to bright red as the dominant catalog color.

## Layout
- Keep the existing authenticated app shell from `components/header.tsx`.
- Use a two-level structure for catalog pages:
  1. editorial hero / summary section
  2. inner browsing layout with filter rail on the left and results on the right
- On desktop, the catalog filter should feel like a stack of soft cards, not a thin toolbar.
- On mobile, collapse into a single-column flow without losing section clarity.

## Sidebar
- The global sidebar sets the visual tone first.
- Navigation items should use soft active states and muted inactive states.
- Use icon tiles and rounded containers instead of harsh borders.
- Keep one accent-heavy action at most in the sidebar.

## Cards
- Book cards should emphasize the cover first, then title, author, and concise metadata.
- Use large radii: `rounded-[1.35rem]` to `rounded-[2rem]`.
- Hover effects should feel lifted and soft, not aggressive.
- Availability badges should stay compact and easy to scan.

## Typography
- Headlines should use `font-headline` with tight tracking.
- Support text should stay warm and muted.
- Eyebrow labels should be uppercase, compact, and widely tracked.

## Buttons and controls
- Use `catalog-accent-button` for primary actions.
- Use `catalog-outline-button` for secondary actions.
- Search and filter controls should sit on muted surfaces with gentle focus rings.
- Prefer rounded-full or softly rounded controls over sharp rectangles.

## Do
- Reuse existing catalog behavior and handlers.
- Reuse `CatalogFilter`, `BookCard`, and pagination patterns when possible.
- Keep surfaces layered with subtle gradients, soft shadows, and quiet separators.
- Preserve clear hierarchy between hero, filters, results header, and grid.

## Don’t
- Don’t create a second global app sidebar.
- Don’t mix the old red-heavy dashboard language into new catalog surfaces unless there is a clear semantic reason.
- Don’t flatten the page into one undifferentiated white container.
- Don’t add decorative effects that compete with the book covers.
