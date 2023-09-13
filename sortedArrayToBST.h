#include <vector>
using namespace std;

 struct TreeNode {
     int val;
     TreeNode *left;
     TreeNode *right;
     TreeNode() : val(0), left(nullptr), right(nullptr) {}
     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
 };

class Solution {
public:
    TreeNode *arrayToBST(vector<int> arr, int comeco, int fim){
        if(comeco > fim) return nullptr;

        int meio = (comeco + fim) / 2;

        TreeNode *root = new TreeNode(arr[meio]);

        root->left = arrayToBST(arr, comeco, meio - 1);
        root->right = arrayToBST(arr, meio + 1, fim);

        return root;
    }
    TreeNode* sortedArrayToBST(vector<int>& nums) {
       return arrayToBST(nums, 0, nums.size() - 1); 
        
    }
};
