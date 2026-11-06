# My Group Escape

Free escape-room games for group chats and families. One person picks a room and shares the link, everyone joins on their own phone, and the clues are split between the phones, so nobody can solve it alone.

Live at **https://mygroupescape.com**

- No accounts, no app, no sign-up
- Play around the same table or apart on a video call
- 17 rooms in collections: Thanksgiving, Christmas Adventures, Mysteries & Heists, Spooky Nights, Explorers, Science & Space
- Room of the Week with a weekly leaderboard
- Scheduled game nights with a countdown and calendar invite
- Emoji reactions that show on every phone
- Custom rooms for families (birthdays, proposals, reunions) and missions for work teams, by enquiry

## How a room works

Each room has six locks, released in waves of 3, 2 and 1. The first three locks open together. Two more unlock once two are solved. The final lock opens last, and its answer is spelled by the letter tiles won from the first five.

In a group, the clue cards for each lock are dealt out between the players' phones. When someone solves a lock, it opens for everyone at once.

## Files

| File | What it does |
|---|---|
| `index.html` | Every screen: menu, room intro, lobby, game, finale, info pages, pop-ups |
| `engine.js` | Menu rows, routing, game logic, group play, scheduling, reactions, ratings |
| `engine.css` | All styling |
| `net.js` | Live sync (Supabase realtime), leaderboard, feedback, message and enquiry forms |
| `config.js` | Site settings: Supabase keys, site URL, form key, donate link, custom price |
| `supabase.js` | Bundled supabase-js v2 |
| `exp/<room>.js` | One file per room: story, locks, clues, answers |
| `assets/<room>/` | Artwork for each room, with a `CREDITS.txt` |

## Links

| Link | Opens |
|---|---|
| `/` | The menu |
| `/#<roomId>` | That room's intro |
| `/#<roomId>--<CODE>` | A group's lobby |
| `/#custom` | Custom rooms page |
| `/#teams` | Missions for work page |

## Running it locally

It's a plain static site with no build step:

```
python3 -m http.server 8765
```

Then open http://localhost:8765. If `supabaseUrl` in `config.js` is blank, the site runs in local test mode: each browser tab acts as a separate player and they sync with each other.

## Adding a room

1. Copy an existing file in `exp/` and give it a new id.
2. Write the six locks. The final answer must be an anagram of the five tiles, and the tiles must not appear in an order that already spells it.
3. Put any artwork in `assets/<id>/` and add a `CREDITS.txt`.
4. Add a `<script>` tag for it in `index.html` before `engine.js`, and add its id to a collection in `engine.js`.
5. Test it with `node test/play.js <id>`.

## Deploying

The site is hosted on Netlify and deploys automatically from this repository. Push to `main` and it's live in about a minute.

## Data

Only nicknames, team names, room progress and leaderboard times are stored. No emails, phone numbers or tracking. Rooms delete themselves after 7 days.

## Credits

Much of the room artwork comes from Google's Santa Tracker (https://github.com/google/santa-tracker-web), used under the Creative Commons Attribution 4.0 licence (CC BY 4.0). Credit is shown on the site via the Credits link and in each `assets/<room>/CREDITS.txt`.
