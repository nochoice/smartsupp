# Zadanie

textovy editor na generovanie bootstrap layoutu, moznost vratit sa spat a dopredu ako to byva zvyk v kazdom editore.
generovat layout bootstrapu ako nahled (vhodne zobrazit aby bolo vidiet vysledny layout). Nahled by mal byt aktualizovany vzdy pri editacii. 
Moznost preddefinovat si bloky pomocou klucoveho slova block. Bloky je potom mozne znovupouzivat.


## Features

- textarea odsadzovanie pomocou tabulatorov
- vsetky nedefinovane stringy povazovat za class atributy
- generovane elementy vsetky ako DIV 


## Example

takto by mohol vyzerat vstup do textarea:

```
block mainRow
    row
        col-md-6
        col-md-6

page-header mainRow
page-content row
    col-md-6
        mainRow
    col-md-6
        sections
page-footer mainRow

block sections
    row
        col-md-4 col-sm-6
        col-md-4 col-sm-6
        col-md-4 col-sm-6
```