'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');
const logo = document.querySelector('.logo');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnCloseModal = document.querySelector('.close-modal');
const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//DOM manipulation starts here
const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};
//click on logo
logo.addEventListener('click', openModal);
// function to display the balance data
btnCloseModal.addEventListener('click', closeModal);

const displayMovements = function (movements, sort = false) {
  //clearing the hard coded html code
  containerMovements.innerHTML = '';
  //sorting the transactions
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  //using forEach() to loop over the transcation values of account 1
  movs.forEach(function (mov, i) {
    //knowing the type of transaction
    let type = mov > 0 ? 'deposit' : 'withdrawal';
    //changing the html code based on the type of deposit in the containerMovements
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">Ignore For Now</div>
    <div class="movements__value">${mov}€</div>
  </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//we can also read the html data of element using .innerhtml
// console.log(containerMovements.innerHTML);

//calculating the balance
const displayBalance = function (acc) {
  //creating balance field in the accounts object
  acc.balance = acc.movements.reduce(
    (accumulator, curr) => accumulator + curr,
    0
  );
  labelBalance.textContent = `${acc.balance}€`;
};

//calculting the summary
const displayBalanceSummary = function (acc) {
  //total deposits
  const income = acc.movements
    .filter(val => val > 0)
    .reduce((acc, curr) => acc + curr);
  labelSumIn.textContent = `${income}€`;
  //Total withdrawals
  const expenses = acc.movements
    .filter(val => val < 0)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumOut.textContent = `${Math.abs(expenses)}€`;
  //total Interest on deposits
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => mov * acc.interestRate) //The interest gets added if its more than one Euro
    .filter(int => int >= 1)
    .reduce((acc, curr) => acc + curr);
  labelSumInterest.textContent = `${interest}€`;
};

//creating usernames for each account wich is just the initials having first letter of their full names
//and creating a property inside the account objects, using foreach() and map()

const username = function (accounts) {
  //forEach() is used to loop over the accounts array and add a property in the account object
  accounts.forEach(function (accountName) {
    // .map is used to create the username initials
    accountName.username = accountName.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
username(accounts);
console.log(accounts);
const updateUI = function (acc) {
  //display summary
  displayBalanceSummary(acc);
  //display balance
  displayBalance(acc);
  //display the transactions
  displayMovements(acc.movements);
};
//Implementing the LOGIN functionality
let currentAccount; //using this to create current account

btnLogin.addEventListener('click', function (e) {
  //preventing the reloading on button click, since its a <form> button it reloads on clicking
  e.preventDefault();
  //finding for the username
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Displaying the welcome msg and changing the ui
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`; //only first name is displayed
    //we change the opacity of the <main> to 100 so that the ui appears only when someone logins
    containerApp.style.opacity = 100;
    // console.log('k');
    //Clearing the input fields after login
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur(); //takes of the cursor

    updateUI(currentAccount);
  }
});

//TRANSFERS
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  //Clear input fields
  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferAmount.blur();
  if (
    amount > 0 &&
    recieverAcc &&
    currentAccount.balance >= amount &&
    recieverAcc.username !== currentAccount.username
  ) {
    //TRANSFER LOGIC
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);
    //UPDATE UI
    updateUI(currentAccount);
  }
});

//LOAN FUNCTIONALITY: loan is given only if there is one deposit of atleat 10% of the requested loan amnt
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loan = Number(inputLoanAmount.value);
  //using .some() to check for the condition
  if (currentAccount.movements.some(mov => mov >= loan * 0.1) && loan > 0) {
    currentAccount.movements.push(loan);
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});
//Delete account function
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  //checking if the user input the current acc

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    console.log('entered if block');
    //finding the index of current account in the accounts array
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    //deleting the account
    accounts.splice(index, 1);
    //HIDE UI
    containerApp.style.opacity = 0;
  }
  //CLEARING FIELDS
  inputCloseUsername.value = inputClosePin.value = '';
  inputClosePin.blur();
});

//SORTING TRANSACTION
//state variable to check if sort is true or not
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
/*
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
///SIMPLE ARRAY METHODS
let arr = [1, 2, 3, 4, 5, 6, 7];
//slice()
console.log(arr.slice(2));
console.log(arr.slice(-1));
console.log(arr.slice(0, -2));
console.log(arr.slice());
///slice() doesnt mutate the original string, it creates a copy of the string
//splice()
console.log(arr.splice(1, 3));
console.log(arr);
arr = [1, 2, 3, 4, 5, 6, 7];
console.log(arr.reverse());

const arr2 = [8, 9, 10, 11];
console.log(arr.concat(arr2));
console.log(arr.join('--------'));
console.log(arr);

//forEach method
function callback(curr, index, array) {}
movements.forEach(function (curr, index, array) {
  if (curr > 0) {
    console.log(
      `Transaction number: ${index + 1}, ${curr}$ is credited to your account `
    );
  } else {
    console.log(
      `Transaction number: ${index + 1}, ${curr}$ is debited from your account `
    );
  }
});
//.map() practice
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const eurToUsd = 1.1;
const movementUSD = movements.map(currEle => currEle * eurToUsd);
// console.log(movementUSD);
//another example
const movementsDesc = movements.map(
  (mov, i) =>
    `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
      mov
    )}$`
);

// console.log(movementsDesc);

//.filter() practice

const deposits = movements.filter(function (mov) {
  return mov > 0; // the test condition that has to be passed , and the elements that pass the test will be returned
  // in a new array
});
console.log(deposits);
const totalBalance = movements.reduce(function (accumulator, current, index) {
  console.log(`Iteration : ${index}, acc:${accumulator}`);
  return accumulator + current;
}, 0);
console.log(totalBalance);

//calc the max number using the reduce()
const max = movements.reduce((acc, cur) => (acc > cur ? acc : cur));
console.log(max);

//.flat() method exercise
// calculate the overall balance of all the accounts
const overallBalance = accounts
  .map(mov => mov.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance);
//.flatMap()
const overallBalance2 = accounts
  .flatMap(x => x.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance2);

const allmovs = accounts.map(mov => mov.movements).flat();
console.log(allmovs);
allmovs.sort((a, b) => a - b); //simplest method of sorting in ascending
console.log(allmovs); //b-a for descending
*/
