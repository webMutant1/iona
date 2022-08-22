'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'iona tandashvili',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'nika tandashvili',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'tornike tandashvili',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'taso tandashvili',
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

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

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
const image = document.querySelector('.iona-img');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
  <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov}€</div>
  </div>
  `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

displayMovements(account1.movements);

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + Math.abs(mov), 0);

  labelSumOut.textContent = `${out}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${interest}€`;
};

calcDisplaySummary(account1);
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  // acc.balance = balance
  labelBalance.textContent = `${acc.balance}€`;
};

// calcDisplayBalance(account1);

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(function (name) {
        return name[0];
      })
      .join('');
  });
};

createUsernames(accounts);

const updateUI = function (acc) {
  displayMovements(acc.movements);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

//event handlers
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `მოგესალმები, ${
      currentAccount.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = 100;

    inputLoginPin.value = inputLoginUsername.value = '';

    inputLoginPin.blur();

    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  if (
    amount > 0 &&
    recieverAcc &&
    currentAccount.balance >= amount &&
    recieverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount / 10)) {
    // Add movement
    currentAccount.movements.push(amount);

    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (Number(inputCloseUsername.value) >= 1900) {
    inputClosePin.textContent += 100;
    alert(
      'იონამ კრედიტი დაამატა და მოიგო აუქციონი, დააჭირეთ ოქეის რომ იხილოთ გახარებული იონა'
    );
    image.style.left = 0;
  } else if (Number(inputCloseUsername.value) < 6500) {
    inputClosePin.textContent = Number(inputCloseUsername.value) + 100;
  }
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const owners = ['Jonas', 'Zack', 'Adam', 'Martha'];
// console.log(owners.sort());

// movements.sort((a, b) => a - b);
// console.log(movements);

// movements.sort((a, b) => a - b);
// console.log(movements);

// const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, -1, -2, -3];

// console.log(numbers.sort((a, b) => b - a));
// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat());

// const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat(2));

// const overalBalance = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overalBalance);

// //flatMap

// const overalBalance2 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overalBalance2);
// //some
// // console.log(movements.includes(-130));
// console.log(movements.includes(-3));
// console.log(movements.some(mov => mov > 909990909));
// // console.log(movements.some(mov => mov === -130));

// // const anyDeposits = movements.some(mov => mov > 0);
// // console.log(anyDeposits);

// //every
// console.log(account4.movements.every(mov => mov > 0));
// console.log(movements.every(mov => mov > -9999999999));
// //seperate callback

// const deposit = mov => mov > 0;
// const dogsJulia = [3, 5, 2, 12, 7];
// const dogsKate = [4, 1, 15, 8, 3];

// const checkDogs = function (dogsJulia, dogsKate) {
//   const arr = [...dogsJulia.splice(1, 2), ...dogsKate];

//   console.log(arr);

//   arr.forEach(function (el, i) {
//     if (el > 3) {
//       console.log(`Dog is Adult and is ${el} Years Old`);
//     } else {
//       console.log(`Dog is still puppy and ${el} years old`);
//     }
//   });
// };
// checkDogs(dogsJulia, dogsKate);

// let array = [];
// const arr = [...dogsJulia.splice(1, 2), ...dogsKate];
// arr.forEach((ages, ha) => {
//   if (ages > 2) {
//     ha = ages * 4 + 16;
//     array.push(ha);
//   } else {
//     ha = 2 * ages;11111
//     array.push(ha);
//   }

//   // console.log(ages);
// });
// console.log(arr);
// const filted = array.filter(function (el) {
//   return el > 18;
// });
// console.log(filted);

// const a = filted.reduce(function (acc, el) {
//   return acc + el;
// }, 0);

// console.log(a / filted.length);
// const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(movements);
// console.log(firstWithdrawal);

// console.log(accounts);

// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

// let euroToUsd = 1.1;

// const totalDepositsUSD = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * euroToUsd)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(totalDepositsUSD);
// const data1 = [5, 2, 4, 1, 15, 8, 3];

// let arr = [];
// const c = function () {
//   data1.forEach(function (age) {
//     if (age > 2) {
//       arr.push(16 + 4 * age);
//     } else {
//       arr.push(age * 2);
//     }
//   });
//   let g = arr.filter(mov => mov > 18);
//   console.log(
//     arr.filter(mov => mov > 18).reduce((acc, mov) => acc + mov) / g.length
//   );
// };

// c();
// // console.log(arr);
// //მაქსიმუმი
// // const max = movements.reduce((acc, mov) => {
// //   if (acc > mov) {
// //     return acc;
// //   } else {
// //     return mov;
// //   }
// // }, movements[0]);

// // console.log(max);

// // const min = movements.reduce((acc, mov) => {
// //   if (acc < mov) return acc;
// //   else {
// //     return mov;
// //   }
// // }, movements[0]);

// // console.log(min);

// // // accumulator
// // const balance = movements.reduce(function (acc, cur, i, arr) {
// //   // console.log(`Iteration ${i}: ${acc}`);
// //   return acc + cur;
// // }, 0);

// // console.log(balance);

// // console.log('-----------------Coding Challange 2--------------------');

// // const array = [5, 2, 4, 1, 15, 8, 3];

// // let humanAge = [];

// // const calculateAverageHumanAge = array.map(function (ages) {
// //   if (ages <= 2) {
// //     humanAge.push(2 * ages);
// //   } else {
// //     humanAge.push(16 + 4 * ages);
// //   }
// });
// console.log(humanAge);

// const filted = humanAge.filter(function (age) {
//   return age > 18;
// });
// console.log(filted);

// const redued = filted.reduce(function (acc, age) {
//   return acc + age;
// });

// console.log(redued / filted.length);

// let balance2 = 0;

// for (const mov of movements) {
//   balance2 += mov;
// }
// console.log(balance2);

//
//------------------
// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });

// console.log(deposits);

// const depositsFor = [];
// for (const mov of movements) {
//   if (mov > 0) {
//     depositsFor.push(mov);
//   }
// }

// console.log(depositsFor);

// const withdrawals = movements.filter(function (mov) {
//   return mov < 0;
// });
// console.log(withdrawals);

// const createUsernames = function (accs) {
//   accs.forEach(function (acc) {
//     acc.username = acc.owner
//       .toLowerCase()
//       .split(' ')
//       .map(function (name) {
//         return name[0];
//       })
//       .join('');
//   });
// };

// createUsernames(accounts);
// console.log(accounts);

/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(function (name) {
        return name[0];
      })
      .join('');
  });
};

createUsernames(accounts);
console.log(accounts);
*/
/*
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(function (name) {
        return name[0];
      })
      .join('');
  });
};
createUsernames(accounts);

console.log(accounts);
*/
// const arr = [];
// for (const item of username) {
//   arr.push(item[0]);
// }

// console.log(arr.join(''));

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// // const gelToUsd = 3;

// const toEUR = 4;
// const movementsEUR = movements.map(function (mov, i) {
//   return `Movement ${i + 1} ${mov * toEUR}`;
// });

// // console.log(movementsEUR);

// // const movementsGEL = movements.map(function (mov, i) {
// //   return mov * gelToUsd;
// // });

// // console.log(movementsGEL);

// // const array = [];
// // for (const item of movements) {
// //   if (item > 0) {
// //     console.log(item);
// //   }
// // }

// const gelToUsd = 3;
// const movementsDescriptions = movements.map(function (mov, i) {
//   if (mov > 0) {
//     return `Movement ${i + 1}: You Deposited ${mov * gelToUsd}$`;
//   } else {
//     return `Movement ${i + 1}: You Withdrew ${Math.abs(mov * gelToUsd)}$`;
//   }
// });
// console.log(movementsDescriptions);
// /*
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const euroToUsd = 1.1;

// const movementsUSD = movements.map(function (mov) {
//   return mov * euroToUsd;
// });

// console.log(movements);
// console.log(movementsUSD);

// const movementsUSDfor = [];
// for (const mov of movements) {
//   movementsUSDfor.push(mov * euroToUsd);
// }
// console.log(movementsUSDfor);

// const movementsDescriptions = movements.map(function (mov, i, arr) {
//   return `Movement ${
//     i + 1
//   }: You ${mov > 0 ? 'deposit' : 'withdrew'} ${Math.abs(mov)}`;
//   // if (mov > 0) {
//   //   return `Movement ${i + 1}: You deposited ${mov}`;
//   // } else {
//   //   return `Movement ${i + 1}: You withdrew ${Math.abs(mov)}`;
//   // }
// });

// console.log(movementsDescriptions);

// */

/*
map -> return a new array containing the results of applying an operation on all original array elements
filter -> only elements which condition is true will included in new array
reduce -> boils all array elements to one single value 
*/

/////////////////////////////////////////////////
//forEach()
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`Movement ${i + 1} You Deposited ${movement}`);
//   } else {
//     console.log(`Movement ${i + 1}You withdrew ${Math.abs(movement)}`);
//   }
// }
// console.log('-----------------forEach-------------------');
// movements.forEach(function (mov, i, arr) {
//   if (mov > 0) {
//     console.log(`Movement ${i + 1}: you deposited ${mov}`);
//   } else {
//     console.log(`Movement ${i + 1}: you withdrew ${Math.abs(mov)}`);
//   }
// });

// //continue and break dont work in forEachs

// const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// array.forEach(function (el, i, arr) {
//   if (el > 5) {
//     console.log(`element more than 5`);
//   } else {
//     console.log(`element less than 5`);
//   }
// });

//----------------------------------
// at method

// const arr = [23, 11, 64];
// // console.log(arr[0]);

// console.log(arr.at(0));

// console.log(arr[arr.length - 1]);
// console.log(arr.slice(-1)[0]);
// console.log(arr.at(-1));
// console.log(arr.at(-2));

// let arr = ['a', 'b', 'c', 'd', 'e'];
// //slice
// console.log(arr.slice(2));
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-2));
// console.log(arr.slice(-1));
// console.log(arr.slice(1, -2));
// console.log(arr.slice());

// //splice (mutates original)
// // console.log(arr.splice(2)); //only 2 element,eft in arr
// arr.splice(-1);
// console.log(arr);
// arr.splice(1, 2);
// console.log(arr);

// //reverse (mutates original)
// arr = ['a', 'b', 'c', 'd', 'e'];
// const arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse());
// console.log(arr2);

// //concat

// const letters = arr.concat(arr2);
// console.log(letters);
// // same as console.log([...arr, ...arr2]);

// // join

// console.log(letters.join(' - '));

// arr.at()
// const arr = [23, 11, 64];
// console.log(arr[0]);
// console.log(arr.at(0));
// //getting the last array elements
// console.log(arr[arr.length - 1]);
// console.log(arr.slice(-1)[0]);
// console.log(arr.at(-1));

// console.log('jonas'.at(0));
// console.log('jonas'.at(-1));

//foreach (ich bin tornike)

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// //for of
// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`Movement ${i + 1} You Deposited ${movement}`);
//   } else {
//     console.log(`Movement ${i + 1} You Withdrew ${Math.abs(movement)}`);
//   }
// }

// console.log('--------  FOREACH  ---------');
// //forEach (element,index,array)
// movements.forEach(function (mov, i, arr) {
//   if (mov > 0) {
//     console.log(`Movement ${i + 1} You Deposited ${mov}`);
//   } else {
//     console.log(`Movement ${i + 1} You Withdrew ${Math.abs(mov)}`);
//   }
// });

// const gadaxda = [100, 200, 300, 400, 500, 600];
// gadaxda.forEach(function (price) {
//   if (price > 500) {
//     console.log('muhc');
//   } else {
//     console.log('low');
//   }
// });

// // //MAP
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });

// //set

// const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
// console.log(currenciesUnique);
// currenciesUnique.forEach(function (value, _, map) {
//   console.log(`${value}: ${value}`);
// });

// currencies.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });
// //SET
// const currenciesUnique = new Set(['USD', 'GPB', 'USD', 'EUR', 'EUR']);
// console.log(currenciesUnique);
// currenciesUnique.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });

/*

const codingChallange1 = function (arrJulia, arrKate) {
  const arrJuliaCorrect = arrJulia.slice(1, 3);
  const arrAll = [...arrJuliaCorrect, ...arrKate];
  arrAll.forEach(function (shit) {
    if (shit >= 3) {
      console.log(`Dog is adult and is ${shit} years old`);
    } else {
      console.log(`Its Still a puppy dickhead`);
    }
  });
};

codingChallange1([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
*/
/*
const euroToUsd = 1.1;
const movementsUSD = movements.map(mov => {
  return mov * euroToUsd;
});

console.log(movements);
console.log(movementsUSD);

const movementsUSDfor = [];
for (const mov of movements) {
  movementsUSDfor.push(mov * euroToUsd);
}
console.log(movementsUSDfor);

const movementsDescriptions = movements.map(
  (mov, i) =>
    `Movement ${i + 1} You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
      mov
    )}`
);

console.log(movementsDescriptions);
*/

const x = new Array(7);
console.log(x);
// console.log(x.map(() => 5));

x.fill(1, 3);
console.log(x);

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

arr.fill(23, 2, 3);
console.log(arr);

// Array.from

const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, (cur, i) => i + 1);
console.log(z);

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value')
  );
  console.log(movementsUI);
});
