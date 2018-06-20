#include<iostream>
#include<string>
#include<cmath>
#include<cstdlib>
#include<ctime>
using namespace std;

class Customer
{
  protected:
    string name;
    int calls, totalNumMin;
    int numMin;
    double total_fee;
    
  public:
         
    Customer() //default constructor
    {
     name = "XX";
    }
    
    Customer(string name1, int id) //constructor that sets the variables
    {
      name = name1;
      calls = id;   
      numMin = 3;              
    }
    
    string getName() //returns the basic customer's name
    {
      return name;      
    }
    
    virtual double Compute_Bill() //virtual function that computes the tariff of basic customer
    {
      total_fee = 10 + (calls * 0.50);
      return total_fee;
    } 
    
    bool operator< (Customer &x) //compares the objects of Customer class and Premium_Customer class 
    {
       double t1 = total_fee;
       double t2 = x.total_fee; 
       if(t1 < t2)
        {
          return true;
        }
       else 
        {
          return false;
        }
   }
 };
  
class Premium_Customer : public Customer
{  
   public:
    Premium_Customer(string name1, int id)//constructor to set the initial variables
     {
       name = name1;
       calls = id;
       numMin =3;
     } 

    int setMin(int min) //sets the random number generated in the main function
    {
      numMin = min; 
    } 
   string getName() //returns the name of the premium customer
    {
       return name;
    } 
 
  double Compute_Bill() //computes the tariff for the premium customer
  {
    totalNumMin = numMin*calls;
    total_fee = 20 + (calls * 0.05) + (totalNumMin * 0.10);
    return total_fee;
  }    
};

int main()
{
   int num_min;
   srand(time(0));
   Customer *c, c1("Kishore", 30), c2("Karthick", 60);
   Premium_Customer p1("Sri", 30), p2("Ram", 60);
   c = &c1;// the basic customer with 30 calls
   cout <<"The Basic customer bill for 30 calls: " << endl;
   cout << c->getName() << " is a basic customer and owes " << c->Compute_Bill() << " dollars.";
   c = &p1;// the premium customer with 60 calls
   cout << endl;
   cout << "The Premium customer bill for 30 calls: " << endl;
   cout << c->getName() << " is a premium customer and owes " << c->Compute_Bill() << " dollars.";
   if(c1<p1) //compares the plan for the basic and premium customers of 30 calls
     {
       cout << endl;
       cout << "The Basic plan is better for customers with 30 calls " << endl;
       cout << endl;
       cout << "##############################################################" <<endl;
     }
   else
   {
       cout << "The Premium plan is better for the customers with 30 calls " << endl;
   } 
   c = &c2;// the basic customer for 30 calls
   cout << endl;
   cout << "The Basic customer bill for 60 calls: " << endl;
   cout << c->getName() << " is a basic customer and owes " << c->Compute_Bill() << " dollars." << endl;
   c = &p2; //the premium customer with 60 calls
   cout << "The Premium customer bill for 60 calls: " << endl;
   cout << c->getName() << " is a premium customer and owes " << c->Compute_Bill() << " dollars." << endl;
   
   if(c2<p2) //compares the plan for the basic and premium customers of 60 calls
   {
     cout << "The Basic plan is better for customers with 60 calls " << endl;
   }
   else
   {
     cout << "The Premium plan is better for the customers with 60 calls " << endl;
   }
   
   cout << endl;
   cout << "####################### ---- BONUS PART----- ###################################" << endl;
   cout << "List of customers(basic and premium) with different number of calls and premium customers with random number of minutes:"<< endl;
   int n;// total large population of customers 
   int cal;// number of calls
   cout << "Enter the number of customers - basic and premium: " << endl;
   cin >> n; 
   Customer* list[n/2]; //halfing the total population into basic customers
   Premium_Customer* list1[n/2]; //halfing the total population into premium customers
   for(int i=0; i < n/2; i++)
   {
      cal = ((i+1)*10)%100;  
      if (cal == 0 ) 
       {
         cal = 100;
       }
      list[i] = new Customer("Basic Customer", cal);  
      list1[i] = new Premium_Customer("Premium Customer", cal);           
   }
   
   for(int i = 0; i<n/2; i++)
   {           
           cout << list[i]->getName() << " is a non-premium customer and owes " << list[i]->Compute_Bill() << " dollars." << endl;
   }
   
   cout << endl;
   for (int i = 0; i<n/2; i++)
   {
       num_min = rand()%6+2;
       list1[i]->setMin(num_min);
       cout << list1[i]->getName() << " is a premium customer and owes " << list1[i]->Compute_Bill() << " dollars." << endl;
  }
  double avg = 0.0;
  int i = 0;
  int basicCount = 0;
  int premiumCount = 0;
  double savings = 0.0;
  bool flag = false;
  
  while(i<n/2) //will compute the savings 
  {
          double basicBill = list[i]->Compute_Bill();
          double premiumBill = list1[i]->Compute_Bill();
          if(basicBill > premiumBill)
          {
              flag = true;
              savings = savings + basicBill - premiumBill;
              premiumCount++;
          }
          else
          {
              basicCount++;
          }
          i++;
  }
  
  if(basicCount > premiumCount)//decides which plan is better
   {
    cout <<"The Basic plan is better for most of the customers" << endl;
   }
  else
  {
    cout << "The Premium plan is better for most of the customers" << endl;
  }
  
  if(flag == true) //computes the average of the savings of premium customer
  {
    avg = savings/premiumCount;
  }
  else
  {     
    avg = 0.0;
  }
  cout <<"The total average savings of the premier customers when compared to the basic customers is " << avg << endl;
  system("pause");      
}

