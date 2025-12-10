# Doc

## Como criar um novo campo entre entidades e models

Seguir os passos abaixo:

1. Adicionar prop na entidade em `domain/entities`
2. Criar migração para adicionar prop ao db
3. Adicionar prop no model em `core/database/models`
4. Adicionar prop nas funções de mapeamento em `core/database/entities-mappers`
