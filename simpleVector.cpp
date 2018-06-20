#include<iostream>
#include<string>
#include<cmath>
#include<cstdlib>
#include<ctime>
using namespace std;

template <class T>
class SimpleVector
{
   T *s1; // pointer to specific template data type
   int arraySize, iType; 
   
   public:
   SimpleVector() //default constructor sets the pointer to null and arraySize to 0
   {
     s1 = NULL;
     arraySize = 0;
   }
   
  SimpleVector(int size) //one parameterized constructor that creates a dynamic array using the size given by user
  {
    arraySize = size;    
    s1 = new T [arraySize];
  }
  
  SimpleVector(const SimpleVector &sv) // copy constructor that performs deep copy
  {
     T *s2;
     arraySize = sv.arraySize;  //creates a dynamic array and copies the elements from other array that was passed as an argument 
     s2 = new T [arraySize];     // to copy constructor
     for(int i =0; i<arraySize; i++)
     {
       s2[i] = sv.s1[i];
     }          
  }
  
  void getInput()  // gets the elements from the user
  {
    for (int i =0; i<arraySize; i++)
    {
      cin >> s1[i];
    }
  } 
  
  T getElementAt(int pos) //returns the element at the index 
  {
      return s1[pos];  
  }
  
  T operator[](int index) //returns the element at the index using [] overloading
  { 
    return s1[index];
  }
  
  int set_iType(int iType1)
  {
      iType = iType1;
  }
  
  ~SimpleVector()
  {            //destructor that deallocates the memory allocated to the dynamic memory
    cout << "Destructor called" << endl;
    if(iType == 3)
    {           //  deallocates the memory allocated for string
     for(int i =0; i<arraySize; i++)
      {
              delete &s1[i];          
      }
     } 
    else  // deallocates the memory allocated for integer and double
    {
     delete [] s1;
    }
  }
  
};

int main()
{
    char ch;
    do
    {
    int iType, arrSize, index;
    cout << "Enter the type of data to be entered in the array :" << endl;
    cout << "Press the numbers from the following" <<  endl << "1 for  integer" << endl << "2 for double" << endl << "3 for strings" << endl;
    cin >> iType; 
   switch(iType)
    {
      case 1:   // handles the integer 
          {     
           cout << "Enter the size of the array" << endl;
           cin >> arrSize;
           SimpleVector<int> sv1(arrSize); //sv1 object invokes the constructor by setting the array size
           sv1.set_iType(iType);
           cout << "Enter the elements in the array" <<  endl;
           sv1.getInput(); // invokes the method in the class to get the elements
           cout << "Enter the index to get the value at that index" << endl;
           cin >> index;
           cout << "The element at the given index is " << sv1.getElementAt(index) << endl; //invokes the method to get the element at given index
           cout << "The element at the given index is using [] overloading " << sv1[index] << endl;//overloads the [] operator and gets the element at given index
           SimpleVector<int> svNew1(sv1);        
           break;
           }
     case 2:
          {  
           cout << "Enter the size of the array" << endl;
           cin >> arrSize;
           SimpleVector<double> sv2(arrSize); //sv2 object invokes the constructor by setting the array size
           cout << "Enter the elements in the array" <<  endl;
           sv2.getInput();// invokes the method in the class to get the elements
           sv2.set_iType(iType);
           cout << "Enter the index to get the value at that index" << endl;
           cin >> index;
           cout << "The element at the given index is " << sv2.getElementAt(index) << endl; //invokes the method to get the element at given index
           cout << "The element at the given index is using [] overloading " << sv2[index] << endl; //overloads the [] operator and gets the element at given index
           SimpleVector<double> svNew2(sv2);  // invokes the copy constructor
           break;       
         }
           
     case 3:
         {
           cout << "Enter the size of the array" << endl;
           cin >> arrSize;
           SimpleVector<string> sv3(arrSize); //sv3 object invokes the constructor by setting the array size
           cout << "Enter the elements to be entered in the array" <<  endl;
           sv3.getInput(); // invokes the method in the class to get the elements
           sv3.set_iType(iType);
           cout << "Enter the index to get the element at that index" << endl;
           cin >> index;
           cout << "The element at the given index is " << sv3.getElementAt(index) << endl; //invokes the method to get the element at given index
           cout << "The element at the given index is using [] overloading " << sv3[index] << endl; //overloads the [] operator and gets the element at given index
           SimpleVector<string> svNew3; 
           svNew3=sv3; //invokes the copy constructor
           break;
         }
    default:
         {
          cout << "Please enter a valid data type" << endl; 
          break;
         }
  } 

    cout << "If you do not want to continue the loop -  hit 'N' or 'n':" << endl;
    cin >> ch;
}while(ch!='n');
 system("pause");
}
   
   
   
