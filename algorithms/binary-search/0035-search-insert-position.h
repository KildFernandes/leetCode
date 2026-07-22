#include <vector>
using namespace std;
class Solution {
public:

    int searchInsert(vector<int>& nums, int target) {
        int comeco, meio, fim;
        // size retorna quantidade de elementos; índice final válido é size - 1.
        comeco = 0; fim = nums.size();
        if(target > nums[fim-1]) return fim;

        while (comeco <= fim) {
            meio = (comeco + fim) / 2;
            if(nums[meio] == target) return meio;

            if(target > nums[meio]){
                comeco = meio + 1;
            } else {
                fim = meio - 1;
            }
        }

        return comeco;



    }
};
