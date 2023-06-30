#include <iostream>
#include <unordered_map>
#include <stack>

using namespace std;

class Solution {
public:
    bool isValid(string s) {
        stack<char> stk;
        char top;
        for ( char c : s){
           if ( c == '(' || c == '{' || c == '[') stk.push(c); 
           else {
               if(stk.empty()) return false;
               top = stk.top();
               switch (c) {
                   case ')': if (top == '(') stk.pop(); else return false; break;
                   
                   case '}': if (top == '{') stk.pop(); else return false; break;
                   
                   case ']': if (top == '[') stk.pop(); else return false; break;
                    
                   default: return false;
               }
           }
        }
        return stk.empty();
    }
};
