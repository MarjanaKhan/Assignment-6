# ES6 Concepts – README

This file explains some important ES6 concepts in simple language.

---

## 1) Difference between var, let, and const

- **var**
  - Function-scoped
  - Hoisted and initialized with `undefined`
  - Can be re-declared
  - Can be re-assigned
  - Mostly used in older JavaScript (not recommended now)

- **let**
  - Block-scoped (limited within `{ }`)
  - Hoisted but not initialized
  - Cannot be re-declared in the same scope
  - Can be re-assigned
  - Useful for variables that change values

- **const**
  - Block-scoped
  - Hoisted but not initialized
  - Cannot be re-declared
  - Cannot be re-assigned
  - Used for constants (fixed values)

---

## 2) Difference between map(), forEach(), and filter()

- **map()**
  - Returns a new array
  - Transforms each item and returns the result  

- **forEach()**
  - Returns `undefined`
  - Only executes a function for each item (does not return anything)  

- **filter()**
  - Returns a new array
  - Keeps only the items that satisfy a condition  

**Example:**
```javascript
const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map(n => n * 2);     // [2, 4, 6, 8, 10]
numbers.forEach(n => console.log(n * 2));    // just prints values
const evens = numbers.filter(n => n % 2 === 0); // [2, 4]


3) Arrow Functions in ES6

Arrow functions provide a shorter and cleaner way to write functions

They don’t have their own this (they inherit it from the surrounding scope)

Example:

// Normal function
function add(a, b) {
  return a + b;
}

// Arrow function
const addArrow = (a, b) => a + b;

4) Destructuring Assignment in ES6

Destructuring allows extracting values from arrays or objects into separate variables.

Example:

// Array destructuring
const numbers = [10, 20, 30];
const [a, b] = numbers; // a=10, b=20

// Object destructuring
const person = { name: "Alice", age: 25 };
const { name, age } = person; // name="Alice", age=25

5) Template Literals in ES6

Template literals are written with backticks `

Support variable embedding with ${expression}

Support multiline strings

Example:

const name = "Alice";
const age = 25;

// String concatenation
const str1 = "My name is " + name + " and I am " + age + " years old.";

// Template literal
const str2 = `My name is ${name} and I am ${age} years old.`;

console.log(str1);
console.log(str2);


Difference: Template literals are easier to read, support multiline strings, and allow direct variable embedding without using +.