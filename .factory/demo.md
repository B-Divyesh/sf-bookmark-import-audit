# Demo sandbox

Open `/demo` or `/?demo=1` to load the shipped sample bookmark library. It has
two `Research` folders, duplicate and variant links, one blank title, and one
malformed URL.

Demo audits use the `demo:bookmark-import-audit` IndexedDB database. Ordinary
audits use `bookmark-import-audit`; the demo never opens that database. The
persistent banner provides **Reset demo** and **Start for real**. Reset reseeds
only the demo database. Start for real deletes the demo audit, returns to the
ordinary audit, and does not carry demo data with it. Opening `/demo` again
then seeds a fresh copy of the shipped sample.
