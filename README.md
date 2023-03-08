# Pour commencer

1 - Tout d'abord, il faut récupérer le code 
via https :

https://github.com/Pierrot3d/formation.git

avec gh :

gh repo clone Pierrot3d/formation

2 - Puis installer l'ensemble des librairies :

npm install

# content.json

Le format utilisé est le suivant :

[
  {
    "name": "Text",
    "id": "id pour le menu",
    "title": "Titre",
    "image": "image.jpg",
    "full_page": true / false,
    "image_text": "Text",
    "isFullHeight": true / false,
    "text_height": "chiffre",
    "link": "lien vers une page"
    "is_carroussel": true / false,
    "text": "Text",
    "paragraphe": [
      {
        {
        "title": "Titre",
        "image": "image.jpg",
        "icon": "nom icone",
        "avertissement": "Text",
        "text": "Text",
        "text_link": "Text",
        "link": "https://lien.fr/"
        },
        "liste": [
          {
            "text": "Text",
            "bold": true / false,
            "italic": true / false,
            "isList": true / false,
            "isCenter": true / false
          },
          {
            "image": "image.png",
            "isSize": true / false,
            "width": "chiffre",
            "height": "chiffre"
          },
          {
            "text": "Text",
            "text_link": "Text",
            "link": "https://lien.fr",
            "isList": true / false,
            "isCenter": true / false
          },
        ]
      }
    ]
  },
]
