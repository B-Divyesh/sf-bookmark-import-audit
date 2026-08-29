# Demo sandbox

Open `/?demo=1` (or `/demo`) to load the shipped sample bookmark library. It has
two `Research` folders, duplicate and variant links, one blank title, and one
malformed URL.

Demo audits use the `demo:bookmark-import-audit` IndexedDB database. Ordinary
audits use `bookmark-import-audit`; the demo never opens that database. The
persistent banner provides **Reset demo** and **Start for real**. Reset reseeds
only the demo database. Start for real deletes the demo audit, returns to the
ordinary audit, and does not carry demo data with it. Opening `/demo` again
then seeds a fresh copy of the shipped sample.

The first demo viewport starts with the populated result, including the file
name, counts, all four finding categories, and both exports. The **Importing
into** selector defaults to Generic audit. Its selection stays inside the demo
database and is removed with the rest of the demo state.
