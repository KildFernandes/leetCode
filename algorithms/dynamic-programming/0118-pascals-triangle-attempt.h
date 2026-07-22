#include <algorithm>
#include <iostream>
#include <vector>

using namespace std;

class Solution {
public:
    vector<vector<int>> generate(int numRows) {
        vector<vector<int>> r;
        vector<int> atual = {1};
        // push_back copia valor ao fim do vector; aqui cada chamada adiciona uma linha/elemento.
        r.push_back(atual);
        atual.push_back(1);
        r.push_back(atual);
        return r;
    }
};
