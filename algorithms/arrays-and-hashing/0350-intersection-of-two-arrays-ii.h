#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> intersect(vector<int>& nums1, vector<int>& nums2) {
       // vector(tamanho, valor) cria contador com 1001 posições, todas iniciadas em 0.
       vector<int> table(1001, 0);

       for(int i : nums1){
           table[i]++;
       }
       vector<int> result;
       for(int i : nums2){
           if(table[i] != 0){
               // push_back adiciona elemento ao fim do vetor.
               result.push_back(i);
               table[i]--;
           }
       }
       return result;
    }
};
