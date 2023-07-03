#include <iostream>
using namespace std;

struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

class Solution {
public:
    bool isPalindrome(ListNode* head) {
        ListNode *slow=head, *fast=head;
        while (fast && fast->next) {
            slow = slow->next;
            fast = fast->next->next;
        }
        ListNode *anterior, *temporario;
        anterior = slow; slow = slow->next; anterior->next = nullptr;
        while (slow) {
            temporario = slow->next; 
            slow->next = anterior;
            anterior = slow;
            slow = temporario;
        }
        fast = head, slow = anterior;
        while (slow) {
            if(fast->val != slow->val) return false;
            else { fast = fast->next; slow = slow->next;}
        }
        return true;

    }
};
