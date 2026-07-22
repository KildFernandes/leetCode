export const competencies = [
  ['arrays','Arrays','sequence',[]], ['sorting','Ordenação','sequence',['arrays']],
  ['hashing','Hashing','sequence',['arrays']], ['strings','Strings','sequence',['arrays']],
  ['two-pointers','Dois ponteiros','sequence',['arrays']], ['sliding-window','Janela deslizante','sequence',['two-pointers']],
  ['binary-search','Busca binária','sequence',['sorting']], ['stack','Pilha','linear',['arrays']],
  ['queue','Fila','linear',['arrays']], ['linked-list','Lista encadeada','linear',['arrays']],
  ['recursion','Recursão','linear',['stack']], ['binary-tree-dfs','Árvore DFS','trees',['recursion']],
  ['binary-tree-bfs','Árvore BFS','trees',['queue','binary-tree-dfs']], ['bst','BST','trees',['binary-search','binary-tree-dfs']],
  ['heap','Heap','trees',['sorting','binary-tree-bfs']], ['graph-traversal','Travessia em grafos','trees',['binary-tree-dfs','binary-tree-bfs']],
  ['graph-shortest-path','Menor caminho','trees',['graph-traversal','heap']],
  ['backtracking','Backtracking','advanced',['recursion','binary-tree-dfs']], ['intervals','Intervalos','advanced',['sorting','two-pointers']],
  ['dynamic-programming','Programação dinâmica','advanced',['recursion','arrays']], ['greedy','Guloso','advanced',['sorting','dynamic-programming']],
  ['bit-manipulation','Manipulação de bits','advanced',['arrays','hashing']]
] as const;

export const errorTags = [
  ['pattern','Padrão'], ['implementation','Implementação'], ['edge-case','Caso extremo'],
  ['complexity','Complexidade'], ['stl','STL'], ['explanation','Explicação']
] as const;

export const directoryCompetencies: Record<string, string[]> = {
  'arrays-and-hashing': ['arrays','hashing'], 'two-pointers': ['two-pointers'],
  'binary-search': ['binary-search'], 'dynamic-programming': ['dynamic-programming'],
  'linked-list': ['linked-list'], 'strings': ['strings'], 'stack': ['stack'],
  'binary-tree': ['binary-tree-dfs','binary-tree-bfs'], 'binary-search-tree': ['bst']
};
