# Missing UI for Room Booking Frontend

## Current status
The frontend is no longer missing the entire room-booking foundation.

Already implemented:
- shared authenticated API client
- backend-aligned room booking DTO types
- room booking API wrapper for rooms, time slots, occupancy, and reservations
- admin room CRUD page
- admin time slot management page
- room reservation management page with create/update/confirm/cancel/delete actions
- admin occupancy viewer wired through the inventory dashboard

The remaining work is mostly about replacing mock-shaped UI assumptions, completing the booking flow around real availability, and cleaning up route separation.

## Remaining gaps

### 1. Availability-first student booking flow
A reservation page already exists, but it does not yet follow the full availability-based flow.

Current behavior:
- user chooses date
- user chooses room directly from all rooms
- user chooses time slot
- reservation is created

Still needed:
- load room availability from `GET /api/rooms/availability-room`
- choose date and time slot first
- only show rooms that are actually available for that selection
- surface seats left / full-state information from the backend

### 2. Profile reservation UI is still mock-shaped
The profile page still maps backend reservation data into placeholder frontend fields such as room number, room type, seat, and synthetic time labels.

Still needed:
- replace mock-shaped reservation view models with backend-aligned reservation types
- map real room and time slot information instead of synthetic placeholders
- redesign the reservation cards so they only depend on backend-supported fields
- connect modify/cancel actions only if the chosen UX should support them from the profile page

### 3. Remove leftover unsupported room viewer assumptions
Most room management is already wired to backend fields, but some leftover frontend assumptions still remain in the room viewer area.

Backend currently supports:
- `name`
- `description`
- `capacity`

Still needed:
- remove dead assumptions that imply unsupported room metadata or controls
- verify no UI still depends on fields like room type, icon, active state, locking, or operating hours
- keep forms and cards aligned to real backend fields only

### 4. Dedicated admin route structure is still loose
Admin room features exist, but they are spread across separate pages and partly embedded in the broader inventory dashboard.

Current routes/components already present:
- room management page
- time slot management page
- reservation management page
- occupancy viewer inside admin inventory

Still needed:
- decide whether occupancy monitoring should live on its own admin page
- decide whether reservation management is intended for admins only, students only, or both with different UIs
- tighten role-based route separation for student versus admin room-booking screens

### 5. Role-aware UI and navigation cleanup
Authentication headers already exist in the shared API layer, and some pages perform runtime admin checks.

Still needed:
- ensure room-booking pages render the correct experience for Student vs Admin
- hide or redirect admin-only screens consistently
- make navigation clearer so users can discover the intended booking and management flows

## Suggested implementation order
1. Rebuild the student booking flow around `GET /api/rooms/availability-room`
2. Replace mock-shaped profile reservation types and UI with backend-aligned data
3. Remove leftover unsupported room viewer assumptions
4. Separate and clarify admin-only versus student-facing routes
5. Decide whether occupancy monitoring needs a dedicated admin page
6. Polish role-based navigation and screen access

## Notes
- Shared room booking API layer already exists in `lib/room-booking-api.ts`
- Shared auth-aware fetch wrapper already exists in `lib/api.ts`
- Shared room booking DTO types already exist in `lib/room-booking-types.ts`
- This file should be updated again if room booking moves into dedicated student/admin route groups or if the profile reservation UI is rebuilt
