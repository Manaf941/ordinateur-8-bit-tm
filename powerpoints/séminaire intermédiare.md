---
theme: uncover
marp: true
paginate: true
math: katex
class: invert
style: |
  section.unlead {
    text-align: left;
    display: block
  }
  .columns {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }

---
<!-- _paginate: false -->

## Création d'un ordinateur 8 bits

#### Manaf Mhamdi Alaoui

Séminaire Intérmediaire

---
<!-- _class: unlead invert -->
### Sommaire

1. Introduction
2. Design
3. Assembleur/Émulateur
4. PCB
5. Conclusion

---

# 1. Introduction

---
<!-- class: unlead invert -->
### Objectifs
- Schématiser un ordinateur 8 bits
- Écrire les outils de développement nécessaires
- Fabriquer le PCB de l'ordinateur
- En apprendre plus sur l'architecture des ordinateurs

---
### Plan
1. Design du Schéma
    - Logisim Evolution
2. Assembleur/Émulateur
    - TypeScript
    - NodeJS
3. Adaptation pour PCB
    - KiCad
---
<!-- _class: invert -->
<!-- _color: black -->
<!-- _paginate: false -->
# 2. Design du Schéma
![bg blur:3px](https://i.le-bunker.ch/4h3b1gWP.png)

---
<!-- _class: unlead invert -->
### Objectifs
- Schématiser l'ordinateur
- Créer une table d'instructions

---
### Méthodologie
1. Prise en main de Logisim Evolution
2. Création d'une spécification (instructions, registres, etc.)
3. Création d'un schéma de base
4. Écriture de programmes de test
5. Amélioration constante du schéma
---
### Problèmes rencontrés
- Complexité du schéma
    - Généralisation du circuit

![bg fit right](https://i.le-bunker.ch/YVYHXFVU.png)

---
### Problèmes rencontrés
- Complexité du schéma
    - Généralisation du circuit

![bg fit right](https://i.le-bunker.ch/4h3b1gWP.png)

---
### Problèmes rencontrés
- Nombre de registres
    - 3
    - 4
    - 8
        - Réécriture de la table d'instructions

---
### Problèmes rencontrés
- Adresses 16 bits
    - 2 registres de 8 bits

---
<!-- _backgroundColor: white -->
<!-- _color: black -->
![bg fit](https://i.le-bunker.ch/4h3b1gWP.png)

---
<!-- _class: invert -->
# 3. Assembleur/Émulateur
![bg blur:3px](https://i.le-bunker.ch/mCp84b1I.png)

---
<!-- _class: unlead invert -->
### Objectifs
- Écrire un assembleur
    - Écrire des programmes facilement
- Écrire un émulateur
    - Tester/Debugger facilement

---
### Langage Assembleur
```py
a = 255
f = 20

# while f != 0
tag loop
jumpz f end

a = a - f

# f--
d = 1
f = f-d
jump loop

tag end
# a == 45
```

---
##### [Exemple Fibonacci](https://fr.wikipedia.org/wiki/Suite_de_Fibonacci)

<div class="columns">
<div>

###### Code
```py
# 12 is the max before overflow
f = 12 # terms

# default value, saves 2 instruction by omitting it          
# a = 0 #n1
b = 1 #n2

tag loop
# while(f !== 0){
jumpz f end

# nth = n1+n2
d = a + b
# n1 = n2
a = b
# n2 = nth
b = d

# f--
d = 1
f = f-d
jump loop

tag end
```

</div>
<div>

###### Équivalent Python
```py
terms = 12
n1 = 0
n2 = 1

while terms > 0:
    nth = n1 + n2
    n1 = n2
    n2 = nth
    terms -= 1

assert n1 == 144
assert n2 == 233
```

</div>
</div>

---

<!-- _class: invert -->
<!-- _paginate: false -->

# 4. PCB
![bg blur:3px](https://i.le-bunker.ch/dYzbVrtU.png)

---

### Plan
- Convertir le schéma en PCB
- Trouver les bons composants
- Commander le PCB et les composants
- Souder les composants

L'échéance visée est Septembre

---

# Conclusion
- La partie logicielle et la partie schématique sont terminées
- PCB en cours de conception
