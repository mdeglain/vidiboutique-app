Ajoute une fonctionnalité qui permet à l'utilisateur connecter de gérer ses commandes par défaut.
Ses commandes par défaut seront accessibles depuis la page profil.

Lorsque l'utilisateur est sur la page principale avec les liste des produits, il doit pouvoir cliquer sur un bouton pour ajouter le produit à une de ses commandes par défaut.
Il doit aussi pouvoir ajouter un produit depuis la page d'un produit.

Dans la page de profil, il doit pouvoir voir ses commandes par défaut et pouvoir mettre à jour leur nom et modifier la quantité d'un produit ou supprimer le produit.

Il doit aussi pouvoir créer une nouvelle commande par défaut ou en supprimer une.

# Default Orders API

Cette API permet aux utilisateurs de gérer leurs commandes par défaut. Une commande par défaut est une liste de produits avec leurs quantités qui peut être réutilisée pour créer rapidement de nouvelles commandes.

## Endpoints

### GET /default-orders

Récupère toutes les commandes par défaut de l'utilisateur connecté.

**Réponse**

```json
[
    {
        "public_id": "string",
        "name": "Ma commande par défaut",
        "items": [
            {
                "public_id": "string",
                "product": {
                    "id": 1,
                    "name": "Produit 1"
                    // ... autres détails du produit
                },
                "quantity": 2
            }
        ]
    }
]
```

### POST /default-orders

Crée une nouvelle commande par défaut.

**Corps de la requête**

```json
{
    "name": "Ma commande par défaut"
}
```

### GET /default-orders/{public_id}

Récupère les détails d'une commande par défaut spécifique.

**Réponse**

```json
{
    "public_id": "string",
    "name": "Ma commande par défaut",
    "items": [
        {
            "public_id": "string",
            "product": {
                "id": 1,
                "name": "Produit 1"
            },
            "quantity": 2
        }
    ]
}
```

### PUT /default-orders/{public_id}

Met à jour une commande par défaut existante.

**Corps de la requête**

```json
{
    "name": "Nouveau nom"
}
```

### DELETE /default-orders/{public_id}

Supprime une commande par défaut (soft delete).

### POST /default-orders/{public_id}/items

Ajoute un produit à une commande par défaut.

**Corps de la requête**

```json
{
    "product_id": 1,
    "quantity": 2
}
```

### PUT /default-orders/{public_id}/items/{product_id}

Met à jour la quantité d'un produit dans une commande par défaut.

**Corps de la requête**

```json
{
    "product_id": 1,
    "quantity": 3
}
```

### DELETE /default-orders/{public_id}/items/{product_id}

Supprime un produit d'une commande par défaut.

## Autorisations

Cette API est accessible aux utilisateurs ayant les rôles suivants :

-   SUPERADMIN
-   ADMIN
-   SUPPLIER
-   PROVISIONNER

## Exemples d'utilisation

### Créer une commande par défaut et ajouter des produits

```python
# 1. Créer une commande par défaut
response = requests.post(
    "/default-orders",
    headers={"Authorization": f"Bearer {token}"},
    json={"name": "Commande hebdomadaire"}
)
order = response.json()

# 2. Ajouter des produits
products = [
    {"product_id": 1, "quantity": 5},
    {"product_id": 2, "quantity": 3}
]

for product in products:
    requests.post(
        f"/default-orders/{order['public_id']}/items",
        headers={"Authorization": f"Bearer {token}"},
        json=product
    )
```

### Mettre à jour une commande

```python
# 1. Récupérer une commande
response = requests.get(
    "/default-orders",
    headers={"Authorization": f"Bearer {token}"}
)
orders = response.json()
order = orders[0]

# 2. Mettre à jour le nom
requests.put(
    f"/default-orders/{order['public_id']}",
    headers={"Authorization": f"Bearer {token}"},
    json={"name": "Nouveau nom"}
)

# 3. Mettre à jour la quantité d'un produit
requests.put(
    f"/default-orders/{order['public_id']}/items/1",
    headers={"Authorization": f"Bearer {token}"},
    json={"product_id": 1, "quantity": 10}
)
```
