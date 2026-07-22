# Plano de revisão LeetCode

Objetivo: reconhecer padrão, explicar solução, implementar sem consultar arquivo.
Cada arquivo já está no diretório do assunto correspondente.

## Ciclo de estudo

Para cada problema:

1. Leia enunciado e exemplos. Não abra solução.
2. Diga entrada, saída, casos extremos e estrutura adequada.
3. Tente por 25 minutos.
4. Se travar, abra solução e explique cada bloco com suas palavras.
5. Feche arquivo. Reescreva solução do zero.
6. Registre complexidade de tempo e memória.
7. Refaça em D+1, D+7 e D+30.

Não memorize linhas. Memorize sinais:

- vetor ordenado + posição: busca binária ou dois ponteiros;
- frequência, repetição ou pertencimento: hash table;
- escolha depende de resultado anterior: programação dinâmica;
- ponteiros `next`: lista encadeada;
- hierarquia `left`/`right`: árvore;
- conjunto de aberturas/fechamentos: pilha.

## Ordem

### 1. Arrays e hashing

Arquivos: `0026`, `0027`, `0066`, `0268`, `0136`, `0169`, `0217`, `0350`.

Aprenda:

- percorrer vetor com índice ou `for`;
- atualizar resposta durante uma passagem;
- diferença entre modificar vetor e criar outro;
- frequência com `unordered_map` ou vetor contador;
- ordenação como forma de aproximar valores iguais;
- complexidade: uma passagem costuma ser `O(n)`, ordenar costuma ser `O(n log n)`.

Perguntas antes de codar: dados podem ser negativos? intervalo é limitado? ordem importa?

### 2. Strings e pilha

Arquivos: `0013`, `0028`, `0242`, `2264`, `0020`.

Aprenda:

- `string` é sequência indexável; `s[i]` acessa caractere;
- comparar vizinhos e percorrer janelas de tamanho fixo;
- anagrama: mesmas frequências, não mesma ordem;
- pilha: último que entra é primeiro que sai (LIFO);
- parêntese de fechamento deve combinar com topo da pilha.

Casos extremos: string vazia, padrão maior que texto, um único caractere.

### 3. Dois ponteiros

Arquivos: `0088`, `0121`.

Aprenda:

- manter dois índices com papéis claros;
- começar pelo fim ao escrever em vetor que tem espaço livre no final;
- manter menor valor visto até agora para calcular melhor lucro posterior;
- provar por que cada ponteiro só avança, resultando em `O(n)`.

### 4. Busca binária

Arquivo: `0035`.

Aprenda:

- pré-condição: dados ordenados;
- intervalo de busca, meio e regra para descartar metade;
- escolher intervalo fechado `[left, right]` ou semiaberto `[left, right)` e não misturar;
- evitar acesso fora do vetor.

Invariante útil: alvo, se existir, permanece no intervalo ainda não descartado.

### 5. Programação dinâmica

Arquivos: `0509`, `0070`, `0118`, `0746`.

Aprenda:

- subproblemas repetidos;
- caso base;
- transição: como estado atual depende de estados anteriores;
- guardar somente estados necessários quando possível;
- diferença entre recursão ingênua e solução iterativa/memorizada.

Modelo: defina `dp[i]`, escreva relação, casos base, ordem de cálculo e resposta final.

`0118-pascals-triangle-attempt.h` é tentativa parcial. Revise depois da versão `0118` final.

### 6. Listas encadeadas

Arquivos: `0206`, `0021`, `0141`, `0160`, `0234`.

Aprenda:

- nó contém valor e ponteiro `next`;
- não há acesso por índice eficiente;
- salve próximo nó antes de sobrescrever `next`;
- ponteiros lento/rápido: lento anda um nó, rápido dois;
- ciclo: lento e rápido eventualmente se encontram;
- interseção: compare nós, não valores;
- lista palíndroma: encontre meio, inverta parte, compare.

Checklist: lista vazia? um nó? número par/ímpar de nós? ponteiro perdido?

### 7. Árvores binárias

Arquivos: `0104`, `0111`, `0100`, `0226`, `0110`, `0112`, `0094`, `0144`, `0145`, `0102`, `0199`.

Uma árvore é conjunto de nós. Cada nó possui `val`, `left`, `right`. Raiz é primeiro nó;
folha não possui filhos. Altura/profundidade é número de nós ou arestas até uma referência;
confirme definição do enunciado.

#### DFS: profundidade primeiro

DFS segue um ramo até onde puder antes de voltar. Recursão funciona porque cada chamada resolve
subárvore menor.

Caso base: `if (!root) ...`.

Três ordens:

- preorder: nó, esquerda, direita (`0144`);
- inorder: esquerda, nó, direita (`0094`);
- postorder: esquerda, direita, nó (`0145`).

Use DFS para profundidade, igualdade, inversão, soma de caminho e balanço. Para cada problema,
defina o que a função retorna para uma subárvore. Exemplos:

- profundidade: `1 + max(esquerda, direita)`;
- mesma árvore: valores iguais e ambas subárvores iguais;
- path sum: acumule valor até folha;
- balanceada: retorne altura; retorne sentinela `-1` se subárvore falhar.

#### BFS: nível primeiro

BFS usa `queue`. Coloque raiz, remova um nó, adicione filhos. É ideal para níveis e primeira/
última visão de cada nível. `0102` agrupa por nível; `0199` percorre direita antes para registrar
primeiro nó visto em cada profundidade.

Complexidade usual: cada nó visitado uma vez, `O(n)` tempo. Pilha recursiva usa `O(h)` memória,
onde `h` é altura; BFS pode usar `O(n)` na largura máxima.

Erros comuns: usar `min` quando filho ausente, esquecer caso de árvore vazia, confundir altura
com quantidade de níveis, alterar filhos antes de guardar referência necessária.

### 8. BST

Arquivos: `0700`, `0108`.

BST é árvore binária com regra: valores menores ficam à esquerda; maiores à direita. Esta regra
permite ignorar metade da árvore em cada comparação.

Para buscar valor:

1. Nó nulo: não existe.
2. Valor igual: encontrou.
3. Alvo menor: vá à esquerda.
4. Alvo maior: vá à direita.

Árvore balanceada dá busca `O(log n)`; árvore parecida com lista dá `O(n)`. Inorder de BST gera
valores em ordem crescente. Para construir BST balanceada a partir de vetor ordenado (`0108`),
use elemento do meio como raiz e repita nos lados. Isto mantém alturas próximas.

## Métodos STL encontrados

Comentários nos arquivos explicam uso local. Referência rápida:

- `sort(begin, end)`: reordena intervalo crescente; `O(n log n)`.
- `unique(begin, end)`: agrupa únicos no início e retorna novo fim lógico; não remove sozinho.
- `vector::erase(first, last)`: remove intervalo físico do vetor.
- `vector::push_back(x)`: adiciona `x` ao final.
- `stack::push/top/pop/empty`: inserir, consultar topo, remover topo, testar vazio.
- `queue::push/front/pop/empty`: inserir atrás, consultar frente, remover frente, testar vazio.
- `min` e `max`: retornam menor ou maior dos argumentos.
- `unordered_map[key]`: acessa valor da chave; se ausente, cria valor padrão.

## Critério de avanço

Avance de tópico quando conseguir resolver pelo menos 3 problemas do tópico sem abrir solução,
explicar complexidade e listar casos extremos. Se não conseguir, refaça problema mais simples
antes de tentar outro.
