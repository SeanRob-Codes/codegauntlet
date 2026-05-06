export type QuestionType =
  | "choice"
  | "typed"
  | "fill"
  | "scratch"
  | "bugfix"
  | "bigO"      // choice — select Big-O complexity of given snippet
  | "predict"   // typed — predict the output of a snippet
  | "tradeoff"  // choice — when would you use X vs Y
  | "design"    // long-form — system design / architecture, keyword-group graded
  | "mock";     // long-form — mock interview thought process, keyword-group graded

export interface Question {
  lang: string;
  level: number;
  q: string;
  code: string | null;
  type?: QuestionType; // defaults to "choice"
  options: string[];   // used for "choice" type
  answer: number;      // used for "choice" type
  accept?: string[];   // accepted answers for "typed" and "fill" types (case-insensitive, trimmed)
  hint?: string;       // optional hint
  explain: string;
  // For "scratch" and "bugfix": list of regex source strings; ALL must match (case-insensitive, multiline).
  mustMatch?: string[];
  // For "scratch" and "bugfix": regex patterns that must NOT appear (e.g. forbidden shortcuts).
  mustNotMatch?: string[];
  // For "scratch": starter prompt requirements text shown to user.
  requirements?: string[];
  // For "bugfix": the buggy code shown (overrides `code` for editing); user edits and submits the full snippet.
  buggyCode?: string;
  // Reference solution shown after the user submits.
  solution?: string;
  // For "explain-back": after correct, ask why. Keywords (any one) needed in their answer.
  explainKeywords?: string[];
  // For "design"/"mock"/long-form: groups of keywords; user must hit ≥1 per group.
  // Score = % of groups covered (must be >= passThreshold to count as correct).
  keywordGroups?: string[][];
  passThreshold?: number; // 0..1, default 0.6
  // For "chain": id grouping multi-step build-up questions (run sequentially when one fires).
  chainId?: string;
  chainStep?: number;
}

export const LANG_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  HTML:        { bg: "hsl(15 60% 10%)", border: "hsl(14 100% 57%)", text: "hsl(14 100% 70%)" },
  CSS:         { bg: "hsl(210 60% 12%)", border: "hsl(210 78% 56%)", text: "hsl(210 90% 72%)" },
  JavaScript:  { bg: "hsl(50 80% 8%)", border: "hsl(50 98% 47%)", text: "hsl(49 96% 53%)" },
  SQL:         { bg: "hsl(0 60% 10%)", border: "hsl(0 84% 60%)", text: "hsl(0 91% 71%)" },
  Python:      { bg: "hsl(145 45% 8%)", border: "hsl(142 71% 45%)", text: "hsl(142 69% 58%)" },
  Java:        { bg: "hsl(30 100% 8%)", border: "hsl(38 92% 55%)", text: "hsl(45 93% 57%)" },
  PHP:         { bg: "hsl(240 30% 12%)", border: "hsl(240 60% 63%)", text: "hsl(240 70% 76%)" },
  "How To":    { bg: "hsl(170 40% 8%)", border: "hsl(170 60% 50%)", text: "hsl(170 70% 65%)" },
  "W3.CSS":    { bg: "hsl(120 35% 8%)", border: "hsl(120 50% 45%)", text: "hsl(120 60% 60%)" },
  C:           { bg: "hsl(215 60% 12%)", border: "hsl(217 91% 60%)", text: "hsl(214 95% 78%)" },
  "C++":       { bg: "hsl(200 50% 12%)", border: "hsl(200 70% 55%)", text: "hsl(200 80% 70%)" },
  "C#":        { bg: "hsl(260 40% 14%)", border: "hsl(263 70% 58%)", text: "hsl(263 87% 78%)" },
  Bootstrap:   { bg: "hsl(280 45% 12%)", border: "hsl(280 67% 55%)", text: "hsl(280 80% 72%)" },
  React:       { bg: "hsl(193 60% 10%)", border: "hsl(193 95% 55%)", text: "hsl(193 95% 68%)" },
  MySQL:       { bg: "hsl(200 50% 10%)", border: "hsl(200 80% 50%)", text: "hsl(200 90% 65%)" },
  jQuery:      { bg: "hsl(210 50% 10%)", border: "hsl(210 65% 55%)", text: "hsl(210 80% 70%)" },
  Excel:       { bg: "hsl(145 50% 10%)", border: "hsl(145 75% 40%)", text: "hsl(145 85% 55%)" },
  XML:         { bg: "hsl(35 50% 10%)", border: "hsl(35 80% 50%)", text: "hsl(35 90% 65%)" },
  Django:      { bg: "hsl(160 40% 8%)", border: "hsl(160 55% 40%)", text: "hsl(160 65% 55%)" },
  NumPy:       { bg: "hsl(215 50% 10%)", border: "hsl(215 75% 55%)", text: "hsl(215 85% 70%)" },
  Pandas:      { bg: "hsl(260 35% 12%)", border: "hsl(260 50% 55%)", text: "hsl(260 65% 72%)" },
  "Node.js":   { bg: "hsl(120 40% 8%)", border: "hsl(120 55% 45%)", text: "hsl(120 65% 60%)" },
  DSA:         { bg: "hsl(340 40% 10%)", border: "hsl(340 65% 55%)", text: "hsl(340 80% 70%)" },
  TypeScript:  { bg: "hsl(200 60% 12%)", border: "hsl(199 89% 61%)", text: "hsl(199 92% 74%)" },
  Angular:     { bg: "hsl(350 50% 10%)", border: "hsl(350 80% 55%)", text: "hsl(350 90% 70%)" },
  AngularJS:   { bg: "hsl(5 50% 10%)", border: "hsl(5 75% 55%)", text: "hsl(5 85% 70%)" },
  Git:         { bg: "hsl(24 60% 10%)", border: "hsl(25 95% 53%)", text: "hsl(24 95% 61%)" },
  PostgreSQL:  { bg: "hsl(210 45% 12%)", border: "hsl(210 60% 55%)", text: "hsl(210 75% 70%)" },
  MongoDB:     { bg: "hsl(140 45% 8%)", border: "hsl(140 65% 45%)", text: "hsl(140 75% 60%)" },
  "ASP.NET":   { bg: "hsl(260 40% 14%)", border: "hsl(271 81% 56%)", text: "hsl(263 96% 73%)" },
  AI:          { bg: "hsl(270 50% 12%)", border: "hsl(270 75% 60%)", text: "hsl(270 85% 75%)" },
  R:           { bg: "hsl(210 40% 12%)", border: "hsl(210 55% 50%)", text: "hsl(210 70% 65%)" },
  Go:          { bg: "hsl(190 50% 10%)", border: "hsl(190 75% 50%)", text: "hsl(190 85% 65%)" },
  Kotlin:      { bg: "hsl(270 40% 12%)", border: "hsl(270 60% 55%)", text: "hsl(270 75% 70%)" },
  Swift:       { bg: "hsl(15 60% 10%)", border: "hsl(15 85% 55%)", text: "hsl(15 95% 68%)" },
  Sass:        { bg: "hsl(330 45% 10%)", border: "hsl(330 65% 55%)", text: "hsl(330 80% 70%)" },
  Vue:         { bg: "hsl(153 45% 8%)", border: "hsl(153 70% 45%)", text: "hsl(153 80% 60%)" },
  "Gen AI":    { bg: "hsl(290 40% 12%)", border: "hsl(290 65% 58%)", text: "hsl(290 80% 73%)" },
  SciPy:       { bg: "hsl(215 40% 10%)", border: "hsl(215 55% 50%)", text: "hsl(215 70% 65%)" },
  AWS:         { bg: "hsl(30 60% 8%)", border: "hsl(30 90% 50%)", text: "hsl(30 95% 63%)" },
  Cybersecurity: { bg: "hsl(0 45% 10%)", border: "hsl(0 70% 50%)", text: "hsl(0 80% 65%)" },
  "Data Science": { bg: "hsl(200 40% 10%)", border: "hsl(200 60% 50%)", text: "hsl(200 75% 65%)" },
  "Intro to Programming": { bg: "hsl(180 40% 8%)", border: "hsl(180 55% 45%)", text: "hsl(180 70% 60%)" },
  "HTML & CSS": { bg: "hsl(25 50% 10%)", border: "hsl(25 75% 55%)", text: "hsl(25 85% 68%)" },
  Bash:        { bg: "hsl(75 60% 8%)", border: "hsl(82 78% 55%)", text: "hsl(86 92% 81%)" },
  Rust:        { bg: "hsl(20 55% 10%)", border: "hsl(20 75% 48%)", text: "hsl(20 85% 63%)" },
  Tools:       { bg: "hsl(45 40% 10%)", border: "hsl(45 60% 50%)", text: "hsl(45 75% 65%)" },
};

export const LANGS = [
  "HTML","CSS","JavaScript","SQL","Python","Java","PHP","How To","W3.CSS",
  "C","C++","C#","Bootstrap","React","MySQL","jQuery","Excel","XML",
  "Django","NumPy","Pandas","Node.js","DSA","TypeScript","Angular","AngularJS",
  "Git","PostgreSQL","MongoDB","ASP.NET","AI","R","Go","Kotlin","Swift",
  "Sass","Vue","Gen AI","SciPy","AWS","Cybersecurity","Data Science",
  "Intro to Programming","HTML & CSS","Bash","Rust","Tools"
];

export const ALL_QUESTIONS: Question[] = [
  // ===== HTML =====
  {lang:"HTML",level:1,q:"What does HTML stand for?",code:null,options:["Hyper Text Markup Language","High Tech Modern Language","Hyper Transfer Markup Language","Home Tool Markup Language"],answer:0,explain:"HTML stands for Hyper Text Markup Language — the standard language for web pages."},
  {lang:"HTML",level:1,q:"Which tag creates a paragraph?",code:null,options:["<p>","<para>","<text>","<pg>"],answer:0,explain:"The `<p>` tag defines a paragraph in HTML."},
  {lang:"HTML",level:1,q:"Which tag is used for the largest heading?",code:null,options:["<h6>","<heading>","<h1>","<head>"],answer:2,explain:"`<h1>` is the largest heading. Headings range from `<h1>` (biggest) to `<h6>` (smallest)."},
  {lang:"HTML",level:2,q:"What does the `alt` attribute do on an `<img>` tag?",code:null,options:["Sets the image size","Provides alternative text for accessibility","Links to another page","Adds a border"],answer:1,explain:"The `alt` attribute provides text for screen readers and when the image fails to load."},
  {lang:"HTML",level:2,q:"Which tag creates a hyperlink?",code:null,options:["<link>","<a>","<href>","<url>"],answer:1,explain:"The `<a>` (anchor) tag creates hyperlinks using the `href` attribute."},
  {lang:"HTML",level:3,q:"What is the purpose of semantic HTML?",code:null,options:["Makes pages load faster","Gives meaning to content for accessibility and SEO","Adds styling","Enables JavaScript"],answer:1,explain:"Semantic tags like `<article>`, `<nav>`, `<header>` convey meaning to browsers and screen readers."},
  {lang:"HTML",level:3,q:"What does the `<form>` element do?",code:null,options:["Displays a table","Creates an interactive form for user input","Formats text","Creates a footer"],answer:1,explain:"The `<form>` element collects user input and can submit data to a server."},
  {lang:"HTML",level:4,q:"What is the difference between `<div>` and `<section>`?",code:null,options:["No difference","<div> is generic; <section> is semantic and groups related content","<section> is deprecated","<div> is semantic"],answer:1,explain:"`<section>` is semantic — it groups thematically related content. `<div>` is a generic container."},

  // ===== CSS =====
  {lang:"CSS",level:1,q:"What does CSS stand for?",code:null,options:["Creative Style Sheets","Cascading Style Sheets","Computer Style Syntax","Colorful Style Sheets"],answer:1,explain:"CSS stands for Cascading Style Sheets — used to style HTML elements."},
  {lang:"CSS",level:1,q:"Which property changes text color?",code:null,options:["text-color","font-color","color","foreground"],answer:2,explain:"The `color` property sets the text color in CSS."},
  {lang:"CSS",level:1,q:"How do you select an element by ID in CSS?",code:null,options:[".myId","#myId","*myId","@myId"],answer:1,explain:"The `#` selector targets elements by their ID attribute."},
  {lang:"CSS",level:2,q:"What is the CSS Box Model?",code:null,options:["A 3D rendering model","Content + padding + border + margin around every element","A grid system","A responsive framework"],answer:1,explain:"Every element is a box with content, padding, border, and margin."},
  {lang:"CSS",level:2,q:"What does `display: flex` do?",code:null,options:["Hides the element","Enables flexbox layout for easy alignment","Makes text bold","Creates a grid"],answer:1,explain:"Flexbox provides a flexible layout model for arranging items in rows or columns."},
  {lang:"CSS",level:3,q:"What is the difference between `position: relative` and `position: absolute`?",code:null,options:["No difference","Relative offsets from its normal position; absolute positions relative to the nearest positioned ancestor","Absolute is always relative to the viewport","Relative removes from flow"],answer:1,explain:"Relative keeps the element in flow but offsets it. Absolute removes it from flow."},
  {lang:"CSS",level:3,q:"What does `z-index` control?",code:null,options:["Font size","The stacking order of overlapping elements","Zoom level","Horizontal position"],answer:1,explain:"`z-index` controls which elements appear in front of or behind others."},
  {lang:"CSS",level:4,q:"What is CSS specificity?",code:null,options:["How fast CSS loads","The algorithm that determines which CSS rule wins when multiple rules match","File size of CSS","Browser compatibility"],answer:1,explain:"Specificity determines which rule applies: inline > ID > class > element."},

  // ===== JavaScript =====
  {lang:"JavaScript",level:1,q:"What does `console.log()` do?",code:null,options:["Saves a file","Prints to the browser/terminal console","Runs a loop","Declares a variable"],answer:1,explain:"`console.log()` prints values to the developer console."},
  {lang:"JavaScript",level:1,q:"Which keyword declares a variable that can't be reassigned?",code:null,options:["let","var","const","def"],answer:2,explain:"`const` prevents reassignment. `let` allows it. Both are block-scoped."},
  {lang:"JavaScript",level:1,q:"What does `typeof 'hello'` return?",code:null,options:["'text'","'string'","'char'","string (no quotes)"],answer:1,explain:"`typeof` returns a string describing the type."},
  {lang:"JavaScript",level:2,q:"What is the output?",code:"const nums = [1, 2, 3];\nconst doubled = nums.map(n => n * 2);\nconsole.log(doubled);",options:["[1, 2, 3]","[2, 4, 6]","6","undefined"],answer:1,explain:"`.map()` creates a new array by applying a function to each element."},
  {lang:"JavaScript",level:2,q:"What does `===` check compared to `==`?",code:null,options:["Same thing","=== checks value AND type; == only checks value","== is stricter","=== only works for numbers"],answer:1,explain:"`===` checks both value and type with no type coercion. Always prefer `===`."},
  {lang:"JavaScript",level:2,q:"What is the output?",code:"console.log(typeof null);",options:["'null'","'object'","'undefined'","'none'"],answer:1,explain:"This is a famous JS quirk — `typeof null` returns `'object'`."},
  {lang:"JavaScript",level:3,q:"What does `async/await` do in JavaScript?",code:null,options:["Makes code run faster","Allows writing asynchronous code in a synchronous style","Runs on multiple threads","Always blocks the UI"],answer:1,explain:"`async/await` is syntactic sugar over Promises."},
  {lang:"JavaScript",level:3,q:"What is a Promise in JavaScript?",code:null,options:["A guaranteed value","An object representing the eventual result of an async operation","A function type","A data structure"],answer:1,explain:"A Promise represents a value that will be available in the future."},
  {lang:"JavaScript",level:4,q:"What is the JavaScript event loop?",code:null,options:["A for loop in the browser","A mechanism that handles async callbacks after the call stack is empty","A DOM element iterator","A timer function"],answer:1,explain:"The event loop picks up callbacks from the queue when the call stack is empty."},
  {lang:"JavaScript",level:4,q:"What is closure in JavaScript?",code:null,options:["Closing the browser window","A function that retains access to its outer scope even after that scope returns","A loop that closes on break","A catch block"],answer:1,explain:"A closure is a function bundled with references to its surrounding state."},

  // ===== SQL =====
  {lang:"SQL",level:1,q:"Which SQL statement retrieves data?",code:null,options:["GET","FETCH","SELECT","RETRIEVE"],answer:2,explain:"`SELECT` is the core SQL command for reading data from tables."},
  {lang:"SQL",level:1,q:"What does `WHERE` do in SQL?",code:null,options:["Sorts results","Filters rows based on a condition","Groups rows","Joins tables"],answer:1,explain:"`WHERE` filters rows — only rows where the condition is true are returned."},
  {lang:"SQL",level:2,q:"What is a PRIMARY KEY?",code:null,options:["The first column added","A unique identifier for each row","A foreign table reference","An index on text columns"],answer:1,explain:"A PRIMARY KEY uniquely identifies each row. It must be unique and never null."},
  {lang:"SQL",level:2,q:"What does `COUNT(*)` do?",code:null,options:["Counts only non-null values","Counts all rows including nulls","Counts distinct values","Returns the average"],answer:1,explain:"`COUNT(*)` counts all rows in the result set."},
  {lang:"SQL",level:3,q:"What does INNER JOIN return?",code:null,options:["All rows from both tables","Only rows with matching values in both tables","Unmatched rows only","Duplicate-free rows"],answer:1,explain:"INNER JOIN returns only rows where there's a match in both tables."},
  {lang:"SQL",level:3,q:"Difference between `DELETE` and `TRUNCATE`?",code:null,options:["No difference","DELETE removes specific rows; TRUNCATE removes all rows faster","TRUNCATE only works on temp tables","DELETE is faster"],answer:1,explain:"DELETE can target specific rows. TRUNCATE removes all rows instantly."},
  {lang:"SQL",level:4,q:"Difference between `HAVING` and `WHERE`?",code:null,options:["No difference","`HAVING` filters before aggregation","`WHERE` filters rows before aggregation; `HAVING` filters groups after","HAVING only works with strings"],answer:2,explain:"`WHERE` filters rows before grouping. `HAVING` filters groups after `GROUP BY`."},
  {lang:"SQL",level:4,q:"What is an index in SQL?",code:null,options:["A row number","A data structure that speeds up queries at the cost of slower writes","A backup copy of a table","A type of JOIN"],answer:1,explain:"Indexes allow the DB engine to find rows quickly without scanning the whole table."},

  // ===== Python =====
  {lang:"Python",level:1,q:"How do you print 'Hello' in Python?",code:null,options:["echo 'Hello'","print('Hello')","console.log('Hello')","System.out.println('Hello')"],answer:1,explain:"Python uses `print()` for output."},
  {lang:"Python",level:1,q:"Which keyword defines a function in Python?",code:null,options:["function","func","def","fn"],answer:2,explain:"Python uses `def` to define functions."},
  {lang:"Python",level:2,q:"What is the output?",code:"nums = [1, 2, 3, 4, 5]\nprint(nums[1:4])",options:["[1, 2, 3]","[2, 3, 4]","[2, 3, 4, 5]","[1, 2, 3, 4]"],answer:1,explain:"Slicing `[1:4]` returns indices 1, 2, 3 — elements 2, 3, 4."},
  {lang:"Python",level:2,q:"What does a dictionary store?",code:null,options:["Only strings","Key-value pairs","Ordered numbers only","Only unique values"],answer:1,explain:"A `dict` stores key-value pairs. Keys must be hashable."},
  {lang:"Python",level:3,q:"What is a decorator in Python?",code:null,options:["A comment style","A function that wraps another function to extend its behavior","A CSS rule","A type of loop"],answer:1,explain:"Decorators wrap functions to add behavior — used for logging, auth, caching, etc."},
  {lang:"Python",level:3,q:"What does `*args` do in a function?",code:null,options:["Declares a pointer","Accepts any number of positional arguments as a tuple","Multiplies arguments","Is a syntax error"],answer:1,explain:"`*args` collects extra positional arguments into a tuple."},
  {lang:"Python",level:4,q:"What does `__init__` do in a class?",code:null,options:["Deletes an object","Imports a module","Initializes a new instance when created","Makes a function private"],answer:2,explain:"`__init__` is the constructor — runs when you create an instance."},
  {lang:"Python",level:4,q:"What is a generator in Python?",code:null,options:["A list that generates random numbers","A function using `yield` that produces values lazily","A class that creates classes","A thread pool"],answer:1,explain:"Generators use `yield` to produce values one at a time — memory efficient."},

  // ===== Java =====
  {lang:"Java",level:1,q:"What is the entry point of a Java program?",code:null,options:["public void start()","public static void main(String[] args)","init()","run()"],answer:1,explain:"Java programs start at `public static void main(String[] args)`."},
  {lang:"Java",level:1,q:"Which keyword defines a class in Java?",code:null,options:["def","struct","class","object"],answer:2,explain:"The `class` keyword defines a class in Java."},
  {lang:"Java",level:2,q:"Difference between `==` and `.equals()` for Strings?",code:null,options:["No difference","`==` compares references; `.equals()` compares content","`.equals()` compares references","`==` always throws an error"],answer:1,explain:"`==` checks object identity. `.equals()` compares string content."},
  {lang:"Java",level:2,q:"What is the difference between `int` and `Integer`?",code:null,options:["No difference","int is a primitive; Integer is an object wrapper","Integer is smaller","int can be null"],answer:1,explain:"`int` is a primitive type. `Integer` is its object wrapper — needed for collections."},
  {lang:"Java",level:3,q:"What is an interface in Java?",code:null,options:["A class with public fields","A contract defining method signatures a class must implement","A type of array","A singleton class"],answer:1,explain:"An interface defines a contract — method signatures that implementing classes must fulfill."},
  {lang:"Java",level:3,q:"What does `@Override` do?",code:null,options:["Creates a new method","Tells the compiler the method overrides a parent method","Makes a method static","Prevents inheritance"],answer:1,explain:"`@Override` annotates a method that overrides a superclass/interface method."},
  {lang:"Java",level:4,q:"What does `synchronized` do in Java?",code:null,options:["Speeds up code","Ensures only one thread executes a block at a time","Copies objects","Declares constants"],answer:1,explain:"`synchronized` ensures mutual exclusion — prevents race conditions."},
  {lang:"Java",level:4,q:"What is a lambda expression in Java?",code:null,options:["A type of class","An anonymous function shorthand","A loop construct","A data type"],answer:1,explain:"Lambdas are anonymous functions: `(n) -> n * 2`."},

  // ===== PHP =====
  {lang:"PHP",level:1,q:"What does PHP stand for?",code:null,options:["Personal Home Page","PHP: Hypertext Preprocessor","Pre-Hyper Processing","Page Hosting Protocol"],answer:1,explain:"PHP is a recursive acronym: PHP: Hypertext Preprocessor."},
  {lang:"PHP",level:1,q:"How do you start a PHP block?",code:null,options:["<php>","<?php","<script php>","{% php %}"],answer:1,explain:"PHP code starts with `<?php` and ends with `?>`."},
  {lang:"PHP",level:2,q:"How do you declare a variable in PHP?",code:null,options:["var x = 5;","let x = 5;","$x = 5;","int x = 5;"],answer:2,explain:"PHP variables start with `$` followed by the name."},
  {lang:"PHP",level:2,q:"What does `echo` do in PHP?",code:null,options:["Reads input","Outputs one or more strings","Creates a variable","Imports a file"],answer:1,explain:"`echo` outputs strings to the browser or terminal."},
  {lang:"PHP",level:3,q:"What is the difference between `==` and `===` in PHP?",code:null,options:["Same thing","== compares value; === compares value AND type","=== is slower","== checks type too"],answer:1,explain:"`==` does type coercion. `===` checks both value and type strictly."},
  {lang:"PHP",level:3,q:"What does `$_GET` contain in PHP?",code:null,options:["POST form data","URL query string parameters","Cookie data","Session data"],answer:1,explain:"`$_GET` is a superglobal array containing URL query parameters."},
  {lang:"PHP",level:4,q:"What is a namespace in PHP?",code:null,options:["A file extension","A way to organize code and avoid naming conflicts","A type of variable","A database connection"],answer:1,explain:"Namespaces group classes/functions to avoid name collisions in large projects."},
  {lang:"PHP",level:4,q:"What is Composer in PHP?",code:null,options:["A text editor","A dependency manager for PHP","A web server","A PHP framework"],answer:1,explain:"Composer manages PHP dependencies, similar to npm for JavaScript."},

  // ===== How To =====
  {lang:"How To",level:1,q:"How do you add a comment in most programming languages?",code:null,options:["<!-- comment -->","// comment or # comment","** comment","@@ comment"],answer:1,explain:"Most languages use `//` (C-style) or `#` (Python/Shell) for single-line comments."},
  {lang:"How To",level:1,q:"How do you create a responsive web page?",code:null,options:["Use only px units","Use the viewport meta tag and relative units","Use tables for layout","Write separate sites for each device"],answer:1,explain:"The viewport meta tag and relative units (%, rem, vw) enable responsive design."},
  {lang:"How To",level:2,q:"How do you center a div horizontally with CSS?",code:null,options:["text-align: center","margin: 0 auto with a set width","float: center","padding: auto"],answer:1,explain:"`margin: 0 auto` with a defined width centers a block element horizontally."},
  {lang:"How To",level:2,q:"How do you redirect to another page with JavaScript?",code:null,options:["document.redirect('url')","window.location.href = 'url'","page.goto('url')","navigate('url')"],answer:1,explain:"`window.location.href = 'url'` navigates to a new page."},
  {lang:"How To",level:3,q:"How do you debounce a function?",code:null,options:["Call it twice","Delay execution until input stops for a specified time","Run it in a loop","Cache its result"],answer:1,explain:"Debouncing delays execution until a pause in events — common for search inputs."},
  {lang:"How To",level:4,q:"How do you implement lazy loading for images?",code:null,options:["Use display: none","Use loading='lazy' attribute or Intersection Observer API","Use setTimeout","Compress images only"],answer:1,explain:"The `loading='lazy'` attribute or Intersection Observer defers loading until visible."},

  // ===== W3.CSS =====
  {lang:"W3.CSS",level:1,q:"What is W3.CSS?",code:null,options:["A JavaScript library","A free CSS framework by W3Schools","A browser","A programming language"],answer:1,explain:"W3.CSS is a free, lightweight CSS framework developed by W3Schools."},
  {lang:"W3.CSS",level:1,q:"How do you add a W3.CSS class for a container?",code:null,options:["class='box'","class='w3-container'","class='container'","class='wrapper'"],answer:1,explain:"W3.CSS uses `w3-container` for padding and alignment."},
  {lang:"W3.CSS",level:2,q:"Which class creates a card in W3.CSS?",code:null,options:["w3-box","w3-card","w3-panel","w3-block"],answer:1,explain:"`w3-card` or `w3-card-4` creates a card with shadow effect."},
  {lang:"W3.CSS",level:2,q:"How do you make a responsive grid in W3.CSS?",code:null,options:["Use <table>","Use w3-row and w3-col classes","Use float only","Use w3-grid"],answer:1,explain:"W3.CSS uses `w3-row` and `w3-col` with size classes for responsive grids."},
  {lang:"W3.CSS",level:3,q:"How do you add a modal in W3.CSS?",code:null,options:["Use alert()","Use w3-modal class","Use w3-popup","Use JavaScript only"],answer:1,explain:"The `w3-modal` class creates a modal overlay with `w3-modal-content` inside."},
  {lang:"W3.CSS",level:4,q:"What advantage does W3.CSS have over larger frameworks?",code:null,options:["More features","Smaller file size and no JavaScript dependency","Better animations","More themes"],answer:1,explain:"W3.CSS is very lightweight (~21KB) and requires no JavaScript to function."},

  // ===== C =====
  {lang:"C",level:1,q:"What does `printf` do in C?",code:null,options:["Prints formatted output to stdout","Reads input from user","Allocates memory","Declares a variable"],answer:0,explain:"`printf` prints formatted text to standard output."},
  {lang:"C",level:1,q:"Which symbol declares a pointer?",code:null,options:["&","*","#","@"],answer:1,explain:"`*` declares a pointer variable. `&` gives the address."},
  {lang:"C",level:2,q:"What is `malloc` used for?",code:null,options:["Math operations","Dynamic memory allocation on the heap","Declaring arrays","String manipulation"],answer:1,explain:"`malloc` allocates memory on the heap at runtime."},
  {lang:"C",level:2,q:"What does `&` do with a variable?",code:null,options:["Dereferences a pointer","Returns the memory address","Multiplies values","Bitwise AND only"],answer:1,explain:"`&variable` gives the memory address of that variable."},
  {lang:"C",level:3,q:"What is a segmentation fault?",code:null,options:["A divide-by-zero error","Accessing memory your program doesn't own","A stack overflow","An infinite loop"],answer:1,explain:"A segfault occurs when accessing memory without permission."},
  {lang:"C",level:3,q:"What does `sizeof(int)` return on most 64-bit systems?",code:null,options:["2 bytes","4 bytes","8 bytes","Varies per compiler"],answer:1,explain:"On most 64-bit systems `sizeof(int)` is 4 bytes."},
  {lang:"C",level:4,q:"What is undefined behavior in C?",code:null,options:["A runtime exception","Code the standard says has no defined output","A syntax error","A segfault only"],answer:1,explain:"UB means the C standard gives no guarantees — anything can happen."},
  {lang:"C",level:4,q:"What does `volatile` tell the compiler?",code:null,options:["Variable is constant","Don't optimize reads/writes — value may change externally","Variable is on the heap","It's thread-safe"],answer:1,explain:"`volatile` prevents caching — essential for hardware registers and signal handlers."},

  // ===== C++ =====
  {lang:"C++",level:1,q:"What does C++ add to C?",code:null,options:["Nothing","Object-oriented programming, classes, and templates","A different syntax","Garbage collection"],answer:1,explain:"C++ extends C with classes, OOP, templates, RAII, and the STL."},
  {lang:"C++",level:1,q:"What is `cout` used for?",code:null,options:["Reading input","Printing output to the console","File operations","Memory allocation"],answer:1,explain:"`std::cout` is the standard output stream in C++."},
  {lang:"C++",level:2,q:"What is a reference in C++?",code:"int x = 5;\nint& ref = x;",options:["A pointer","An alias for an existing variable","A copy of x","A new variable"],answer:1,explain:"A reference (`int&`) is an alias — another name for the same variable."},
  {lang:"C++",level:2,q:"What is RAII in C++?",code:null,options:["A design pattern for REST APIs","Resource Acquisition Is Initialization — managing resources via object lifetime","A random number generator","A type of inheritance"],answer:1,explain:"RAII ties resource management to object lifetime — resources are released in destructors."},
  {lang:"C++",level:3,q:"What are templates in C++?",code:null,options:["HTML templates","Generic programming — write code that works with any type","CSS frameworks","Design patterns"],answer:1,explain:"Templates enable generic programming: `template<typename T>` works with any type."},
  {lang:"C++",level:3,q:"What is the difference between `new` and `malloc`?",code:null,options:["Same thing","new calls constructors and is type-safe; malloc just allocates raw memory","malloc is C++ only","new doesn't allocate memory"],answer:1,explain:"`new` allocates memory AND calls the constructor. `malloc` only allocates raw bytes."},
  {lang:"C++",level:4,q:"What are smart pointers in C++?",code:null,options:["Regular pointers","Objects that manage memory automatically (unique_ptr, shared_ptr)","Pointers that run faster","AI-powered pointers"],answer:1,explain:"Smart pointers (`unique_ptr`, `shared_ptr`) automatically manage memory to prevent leaks."},
  {lang:"C++",level:4,q:"What is move semantics in C++?",code:null,options:["Moving files","Transferring ownership of resources instead of copying for efficiency","A design pattern","Thread migration"],answer:1,explain:"Move semantics transfer resources from one object to another without copying."},

  // ===== C# =====
  {lang:"C#",level:1,q:"What is `Console.WriteLine()` used for?",code:null,options:["Reading input","Printing output with a newline","Creating a file","Declaring a variable"],answer:1,explain:"`Console.WriteLine()` prints text to the terminal with a newline."},
  {lang:"C#",level:1,q:"What keyword creates a new object in C#?",code:null,options:["create","new","make","init"],answer:1,explain:"The `new` keyword instantiates a class and calls its constructor."},
  {lang:"C#",level:2,q:"What is a `List<T>` in C#?",code:null,options:["A fixed-size array","A linked list only","A dynamic resizable collection","A dictionary"],answer:2,explain:"`List<T>` resizes dynamically, unlike arrays which are fixed at creation."},
  {lang:"C#",level:2,q:"What does `var` do in C#?",code:null,options:["Creates a variant type","Tells the compiler to infer the type","Declares a global variable","Makes a variable nullable"],answer:1,explain:"`var` uses type inference — the compiler determines the type at compile time."},
  {lang:"C#",level:3,q:"What does `async/await` enable in C#?",code:null,options:["Multi-threading always","Non-blocking asynchronous code","Faster CPU tasks","Replaces loops"],answer:1,explain:"`async/await` lets you write async code that doesn't block the thread."},
  {lang:"C#",level:3,q:"Class vs struct in C#?",code:null,options:["No difference","Classes are reference types; structs are value types","Structs have methods; classes don't","Classes are stack-allocated"],answer:1,explain:"Classes are heap-allocated reference types. Structs are value types."},
  {lang:"C#",level:4,q:"What is LINQ?",code:null,options:["A database","Language-Integrated Query for querying collections","A web framework","A testing tool"],answer:1,explain:"LINQ lets you query collections, databases, and XML using C# syntax."},
  {lang:"C#",level:4,q:"What is `IDisposable` for?",code:null,options:["Serialization","Defining Dispose() for releasing unmanaged resources","Immutability","Async operations"],answer:1,explain:"`IDisposable` lets you clean up unmanaged resources deterministically."},

  // ===== Bootstrap =====
  {lang:"Bootstrap",level:1,q:"What is Bootstrap?",code:null,options:["A programming language","A CSS framework for responsive web design","A JavaScript engine","A database"],answer:1,explain:"Bootstrap is a popular CSS framework for building responsive, mobile-first websites."},
  {lang:"Bootstrap",level:1,q:"How many columns does Bootstrap's grid have?",code:null,options:["6","10","12","16"],answer:2,explain:"Bootstrap uses a 12-column grid system."},
  {lang:"Bootstrap",level:2,q:"What does `class='btn btn-primary'` create?",code:null,options:["A text input","A styled primary button","A navigation link","A card"],answer:1,explain:"`btn btn-primary` creates a styled button with the primary theme color."},
  {lang:"Bootstrap",level:2,q:"What does `class='container'` do?",code:null,options:["Creates a full-width div","Creates a responsive fixed-width container","Hides the element","Adds a border"],answer:1,explain:"`container` provides a responsive, centered, fixed-width wrapper."},
  {lang:"Bootstrap",level:3,q:"What are Bootstrap breakpoints?",code:null,options:["JavaScript errors","Screen width thresholds where layout changes (sm, md, lg, xl)","CSS animations","Color variables"],answer:1,explain:"Breakpoints define responsive behavior: sm (576px), md (768px), lg (992px), xl (1200px)."},
  {lang:"Bootstrap",level:3,q:"What does `class='d-flex justify-content-center'` do?",code:null,options:["Hides the element","Creates a flexbox container and centers its children","Adds a border","Creates a dropdown"],answer:1,explain:"Bootstrap utility classes for flexbox layout and centering."},
  {lang:"Bootstrap",level:4,q:"How do you customize Bootstrap's theme colors?",code:null,options:["Edit the CDN file","Override Sass variables before importing Bootstrap","Use inline styles","You can't customize it"],answer:1,explain:"Override `$primary`, `$secondary`, etc. Sass variables before importing Bootstrap."},
  {lang:"Bootstrap",level:4,q:"What is Bootstrap's utility API?",code:null,options:["A REST API","A system to generate and extend utility classes via Sass","A JavaScript plugin","A CDN service"],answer:1,explain:"The utility API generates utility classes and lets you create custom ones."},

  // ===== React =====
  {lang:"React",level:1,q:"What is React?",code:null,options:["A CSS framework","A JavaScript library for building user interfaces","A database","A programming language"],answer:1,explain:"React is a JavaScript library for building component-based UIs."},
  {lang:"React",level:1,q:"What is JSX?",code:null,options:["A new language","A syntax extension that lets you write HTML-like code in JavaScript","A CSS preprocessor","A bundler"],answer:1,explain:"JSX lets you write HTML-like markup inside JavaScript files."},
  {lang:"React",level:2,q:"What is `useState` used for?",code:null,options:["Routing","Managing component state","Making API calls","Styling"],answer:1,explain:"`useState` is a React Hook for adding state to functional components."},
  {lang:"React",level:2,q:"What are props in React?",code:null,options:["CSS properties","Data passed from parent to child components","State variables","Event handlers only"],answer:1,explain:"Props (properties) are read-only data passed from parent to child."},
  {lang:"React",level:3,q:"What does `useEffect` do?",code:null,options:["Adds CSS effects","Runs side effects (API calls, subscriptions) after render","Creates animations","Handles errors"],answer:1,explain:"`useEffect` runs side effects after rendering — data fetching, subscriptions, etc."},
  {lang:"React",level:3,q:"What is the virtual DOM?",code:null,options:["A virtual machine","A lightweight copy of the real DOM that React uses for efficient updates","A CSS technique","A testing framework"],answer:1,explain:"React's virtual DOM diffing enables efficient, minimal real DOM updates."},
  {lang:"React",level:4,q:"What is `useMemo` used for?",code:null,options:["State management","Memoizing expensive computations to avoid re-calculation on re-render","Routing","API calls"],answer:1,explain:"`useMemo` caches computed values and only recalculates when dependencies change."},
  {lang:"React",level:4,q:"What is React Context?",code:null,options:["A routing solution","A way to pass data through the component tree without prop drilling","A state manager like Redux","A testing utility"],answer:1,explain:"Context provides a way to share values between components without passing props."},

  // ===== MySQL =====
  {lang:"MySQL",level:1,q:"What is MySQL?",code:null,options:["A programming language","A relational database management system","A web server","A CSS framework"],answer:1,explain:"MySQL is an open-source relational database management system."},
  {lang:"MySQL",level:1,q:"Which command shows all databases?",code:null,options:["LIST DATABASES","SHOW DATABASES","GET DATABASES","VIEW DATABASES"],answer:1,explain:"`SHOW DATABASES;` lists all databases on the MySQL server."},
  {lang:"MySQL",level:2,q:"What does `AUTO_INCREMENT` do?",code:null,options:["Increases column width","Automatically generates a unique number for new rows","Speeds up queries","Creates an index"],answer:1,explain:"`AUTO_INCREMENT` generates a unique sequential number for each new row."},
  {lang:"MySQL",level:2,q:"What is the difference between CHAR and VARCHAR?",code:null,options:["Same thing","CHAR is fixed-length; VARCHAR is variable-length","VARCHAR is faster","CHAR can hold more data"],answer:1,explain:"CHAR pads to fixed length. VARCHAR stores only the actual characters used."},
  {lang:"MySQL",level:3,q:"What is a stored procedure?",code:null,options:["A saved query","A reusable set of SQL statements stored on the server","A backup file","A type of index"],answer:1,explain:"Stored procedures are precompiled SQL that can accept parameters."},
  {lang:"MySQL",level:4,q:"What is query optimization in MySQL?",code:null,options:["Writing shorter queries","Using EXPLAIN, indexes, and query restructuring to improve performance","Compressing data","Using more RAM"],answer:1,explain:"EXPLAIN shows the execution plan. Proper indexes and query structure improve speed."},

  // ===== jQuery =====
  {lang:"jQuery",level:1,q:"What is jQuery?",code:null,options:["A CSS framework","A fast, small JavaScript library for DOM manipulation","A database","A programming language"],answer:1,explain:"jQuery simplifies DOM manipulation, event handling, and AJAX."},
  {lang:"jQuery",level:1,q:"What does `$` represent in jQuery?",code:null,options:["A variable name","The jQuery function/selector","A PHP variable","A CSS selector only"],answer:1,explain:"`$` is an alias for the jQuery function used to select and manipulate elements."},
  {lang:"jQuery",level:2,q:"What does `$('#myId').hide()` do?",code:null,options:["Deletes the element","Hides the element with ID 'myId'","Shows the element","Changes its color"],answer:1,explain:"`.hide()` sets `display: none` on the selected element."},
  {lang:"jQuery",level:2,q:"What does `$(document).ready()` do?",code:null,options:["Loads jQuery","Runs code after the DOM is fully loaded","Creates a new document","Validates HTML"],answer:1,explain:"`.ready()` ensures code runs only after the DOM is completely loaded."},
  {lang:"jQuery",level:3,q:"What does `.ajax()` do in jQuery?",code:null,options:["Adds animations","Performs asynchronous HTTP requests","Creates elements","Validates forms"],answer:1,explain:"`$.ajax()` makes async HTTP requests — the foundation of jQuery's AJAX."},
  {lang:"jQuery",level:4,q:"Why is jQuery less commonly used in modern development?",code:null,options:["It's too expensive","Modern JS (querySelector, fetch, frameworks) handles what jQuery solved","It's no longer maintained","It's too slow"],answer:1,explain:"Native JS APIs and frameworks like React/Vue have replaced most jQuery use cases."},

  // ===== Excel =====
  {lang:"Excel",level:1,q:"What does `=SUM(A1:A5)` do?",code:null,options:["Counts cells","Adds values in cells A1 through A5","Finds the average","Sorts the range"],answer:1,explain:"`SUM` adds all numeric values in the specified range."},
  {lang:"Excel",level:1,q:"What is a cell reference?",code:null,options:["A hyperlink","The address of a cell like A1, B3","A formula name","A chart type"],answer:1,explain:"A cell reference (like A1) identifies a specific cell by column letter and row number."},
  {lang:"Excel",level:2,q:"What does `=VLOOKUP` do?",code:null,options:["Sorts data","Searches for a value in the first column and returns a value from another column","Creates a chart","Merges cells"],answer:1,explain:"VLOOKUP searches vertically in a table and returns a matching value from a specified column."},
  {lang:"Excel",level:2,q:"What is the difference between relative and absolute references?",code:null,options:["Same thing","Relative (A1) changes when copied; absolute ($A$1) stays fixed","Absolute is slower","Relative doesn't work in formulas"],answer:1,explain:"Use `$` to lock a reference. `$A$1` won't change when the formula is copied."},
  {lang:"Excel",level:3,q:"What does `=IF(A1>10, 'Yes', 'No')` do?",code:null,options:["Always returns Yes","Returns 'Yes' if A1 > 10, otherwise 'No'","Creates a loop","Formats the cell"],answer:1,explain:"IF evaluates a condition and returns one value if true, another if false."},
  {lang:"Excel",level:4,q:"What is a pivot table?",code:null,options:["A rotated spreadsheet","A tool for summarizing, analyzing, and exploring large datasets","A chart type","A macro"],answer:1,explain:"Pivot tables dynamically summarize data by grouping, filtering, and aggregating."},

  // ===== XML =====
  {lang:"XML",level:1,q:"What does XML stand for?",code:null,options:["Extra Markup Language","eXtensible Markup Language","External Modern Language","eXecutable Markup Language"],answer:1,explain:"XML stands for eXtensible Markup Language — designed to store and transport data."},
  {lang:"XML",level:1,q:"Is XML a replacement for HTML?",code:null,options:["Yes","No — XML is for data, HTML is for display","They are the same","XML replaces CSS"],answer:1,explain:"XML stores/transports data. HTML displays it. Different purposes."},
  {lang:"XML",level:2,q:"What is a well-formed XML document?",code:null,options:["Any text file","XML that follows syntax rules: proper nesting, closing tags, single root","XML with CSS","XML with no attributes"],answer:1,explain:"Well-formed XML has proper syntax: matching tags, proper nesting, one root element."},
  {lang:"XML",level:3,q:"What is an XML Schema (XSD)?",code:null,options:["A CSS file","A document that defines the structure, content, and data types of XML","A parser","A database"],answer:1,explain:"XSD defines and validates the structure of XML documents."},
  {lang:"XML",level:4,q:"What is XSLT?",code:null,options:["An XML editor","A language for transforming XML into other formats like HTML","A validator","A database query language"],answer:1,explain:"XSLT transforms XML documents into HTML, text, or other XML formats."},

  // ===== Django =====
  {lang:"Django",level:1,q:"What is Django?",code:null,options:["A JavaScript framework","A high-level Python web framework","A CSS library","A database"],answer:1,explain:"Django is a Python web framework that follows the 'batteries included' philosophy."},
  {lang:"Django",level:1,q:"What pattern does Django follow?",code:null,options:["MVC","MVT (Model-View-Template)","MVVM","Observer"],answer:1,explain:"Django uses MVT: Model (data), View (logic), Template (presentation)."},
  {lang:"Django",level:2,q:"What is a Django model?",code:null,options:["An HTML template","A Python class that defines database table structure","A URL pattern","A CSS framework"],answer:1,explain:"Models are Python classes that map to database tables via Django's ORM."},
  {lang:"Django",level:2,q:"What does `python manage.py migrate` do?",code:null,options:["Starts the server","Applies database schema changes","Creates a new app","Runs tests"],answer:1,explain:"`migrate` applies pending migrations to update the database schema."},
  {lang:"Django",level:3,q:"What is Django's ORM?",code:null,options:["A template engine","Object-Relational Mapping — interact with the database using Python","A REST API","A URL router"],answer:1,explain:"Django's ORM lets you query and manipulate databases using Python instead of raw SQL."},
  {lang:"Django",level:4,q:"What is Django middleware?",code:null,options:["Database code","Code that processes requests/responses globally before reaching views","A template tag","A form validator"],answer:1,explain:"Middleware hooks into Django's request/response cycle for auth, CORS, logging, etc."},

  // ===== NumPy =====
  {lang:"NumPy",level:1,q:"What is NumPy?",code:null,options:["A web framework","A Python library for numerical computing with arrays","A database","A CSS tool"],answer:1,explain:"NumPy provides efficient multi-dimensional arrays and mathematical functions."},
  {lang:"NumPy",level:1,q:"How do you create a NumPy array?",code:null,options:["np.list([1,2,3])","np.array([1,2,3])","np.create([1,2,3])","np.new([1,2,3])"],answer:1,explain:"`np.array()` creates a NumPy array from a Python list."},
  {lang:"NumPy",level:2,q:"What does `np.zeros((3,3))` create?",code:null,options:["A list of zeros","A 3x3 array filled with zeros","An empty array","A 3x3 identity matrix"],answer:1,explain:"`np.zeros((3,3))` creates a 3×3 array filled with 0.0."},
  {lang:"NumPy",level:2,q:"What is broadcasting in NumPy?",code:null,options:["Sending data over network","Automatic expansion of arrays with different shapes for element-wise operations","A print function","A sorting algorithm"],answer:1,explain:"Broadcasting lets NumPy perform operations on arrays of different shapes."},
  {lang:"NumPy",level:3,q:"What does `arr.reshape(2, 3)` do?",code:null,options:["Deletes elements","Changes the array's shape to 2 rows × 3 columns without changing data","Sorts the array","Creates a copy"],answer:1,explain:"`reshape` changes the array's dimensions while keeping the same data."},
  {lang:"NumPy",level:4,q:"What is vectorization in NumPy?",code:null,options:["Adding arrows to plots","Performing operations on entire arrays without Python loops for speed","Converting to SVG","A compression algorithm"],answer:1,explain:"Vectorization replaces slow Python loops with fast C-level array operations."},

  // ===== Pandas =====
  {lang:"Pandas",level:1,q:"What is Pandas?",code:null,options:["An animal database","A Python library for data manipulation and analysis","A web framework","A plotting tool"],answer:1,explain:"Pandas provides DataFrames and Series for working with structured data."},
  {lang:"Pandas",level:1,q:"What is a DataFrame?",code:null,options:["A CSS grid","A 2D labeled data structure with columns of different types","A Python list","A JSON file"],answer:1,explain:"A DataFrame is like a spreadsheet — rows and columns of labeled data."},
  {lang:"Pandas",level:2,q:"How do you read a CSV file?",code:null,options:["pd.open('file.csv')","pd.read_csv('file.csv')","pd.load('file.csv')","pd.import('file.csv')"],answer:1,explain:"`pd.read_csv()` reads a CSV file into a DataFrame."},
  {lang:"Pandas",level:2,q:"What does `df.head()` return?",code:null,options:["Column names","The first 5 rows of the DataFrame","The last row","Data types"],answer:1,explain:"`head()` returns the first 5 rows by default. Use `head(n)` for n rows."},
  {lang:"Pandas",level:3,q:"What does `df.groupby('col').mean()` do?",code:null,options:["Sorts by column","Groups rows by 'col' values and calculates the mean of each group","Filters rows","Renames columns"],answer:1,explain:"`groupby` splits data into groups, then `mean()` calculates averages per group."},
  {lang:"Pandas",level:4,q:"What is the difference between `merge` and `concat`?",code:null,options:["Same thing","merge joins on keys (like SQL JOIN); concat stacks DataFrames","concat is for strings","merge is slower"],answer:1,explain:"`merge` does SQL-style joins on columns. `concat` stacks along an axis."},

  // ===== Node.js =====
  {lang:"Node.js",level:1,q:"What is Node.js?",code:null,options:["A browser","A JavaScript runtime built on Chrome's V8 engine for server-side code","A CSS framework","A database"],answer:1,explain:"Node.js lets you run JavaScript outside the browser — on servers."},
  {lang:"Node.js",level:1,q:"What is npm?",code:null,options:["A programming language","Node Package Manager for installing JavaScript packages","A web server","A database tool"],answer:1,explain:"npm is the default package manager for Node.js."},
  {lang:"Node.js",level:2,q:"What does `require()` do?",code:null,options:["Installs a package","Imports a module into the current file","Creates a server","Reads a file"],answer:1,explain:"`require()` loads CommonJS modules in Node.js."},
  {lang:"Node.js",level:2,q:"What is `package.json`?",code:null,options:["A database file","A manifest file with project metadata, dependencies, and scripts","A log file","A config for CSS"],answer:1,explain:"`package.json` defines project info, dependencies, and npm scripts."},
  {lang:"Node.js",level:3,q:"What is the event-driven architecture of Node.js?",code:null,options:["Multi-threaded processing","Non-blocking I/O using an event loop and callbacks","Synchronous execution","GPU-based computing"],answer:1,explain:"Node.js uses a single-threaded event loop with non-blocking I/O for high concurrency."},
  {lang:"Node.js",level:4,q:"What are streams in Node.js?",code:null,options:["Video players","Objects for reading/writing data piece by piece without loading all into memory","Database connections","WebSocket connections"],answer:1,explain:"Streams process data in chunks — efficient for large files and real-time data."},

  // ===== DSA =====
  // -- Arrays & Strings --
  {lang:"DSA",level:1,q:"What is an array?",code:null,options:["A function","A collection of elements stored at contiguous memory locations","A type of loop","A class"],answer:1,explain:"Arrays store elements in contiguous memory, allowing O(1) access by index."},
  {lang:"DSA",level:1,q:"What is the time complexity of accessing an element in an array by index?",code:null,options:["O(n)","O(log n)","O(1)","O(n²)"],answer:2,explain:"Array index access is O(1) because elements are at contiguous, calculated memory addresses."},
  {lang:"DSA",level:1,q:"What is Big O notation?",code:null,options:["A math equation","A way to describe algorithm time/space complexity as input grows","A sorting algorithm","A data type"],answer:1,explain:"Big O describes how an algorithm's performance scales with input size."},
  {lang:"DSA",level:1,q:"What is the difference between a linear and non-linear data structure?",code:null,options:["There's no difference","Linear structures store data sequentially (arrays, lists); non-linear store hierarchically (trees, graphs)","Non-linear is always faster","Linear uses more memory"],answer:1,explain:"Linear = sequential traversal. Non-linear = branching/hierarchical access."},
  {lang:"DSA",level:2,q:"What is the time complexity of inserting at the beginning of an array?",code:null,options:["O(1)","O(log n)","O(n)","O(n²)"],answer:2,explain:"All existing elements must shift right, so insertion at index 0 is O(n)."},
  {lang:"DSA",level:2,q:"What is a two-pointer technique?",code:null,options:["Using two mice","Using two indices to scan a sorted array/string from different positions to solve problems efficiently","A database method","A recursion pattern"],answer:1,explain:"Two pointers move toward each other or in the same direction to reduce O(n²) to O(n)."},

  // -- Linked Lists --
  {lang:"DSA",level:1,q:"What is a linked list?",code:null,options:["An array with links","A linear data structure where each node points to the next","A hash table","A tree"],answer:1,explain:"Linked lists use nodes with data and a pointer to the next node."},
  {lang:"DSA",level:2,q:"What is the advantage of a linked list over an array?",code:null,options:["Faster index access","O(1) insertion/deletion at the head without shifting elements","Uses less memory","Faster searching"],answer:1,explain:"Linked lists allow O(1) insert/delete at the head since no shifting is needed."},
  {lang:"DSA",level:2,q:"What is a doubly linked list?",code:null,options:["A list with two elements","A linked list where each node has pointers to both the next and previous nodes","Two separate lists","A circular array"],answer:1,explain:"Doubly linked lists enable traversal in both directions via prev and next pointers."},
  {lang:"DSA",level:3,q:"How do you detect a cycle in a linked list?",code:null,options:["Sort it first","Use Floyd's cycle detection (tortoise and hare) — one pointer moves 2x speed","Check every node against all others","Use a tree"],answer:1,explain:"Floyd's algorithm uses slow/fast pointers — if they meet, there's a cycle. O(n) time, O(1) space."},
  {lang:"DSA",level:3,q:"How do you reverse a singly linked list?",code:null,options:["Copy to an array","Iteratively redirect each node's next pointer to the previous node","Use a stack always","Sort it"],answer:1,explain:"Iterate through, redirecting each next pointer. Three pointers: prev, current, next. O(n) time, O(1) space."},

  // -- Stacks & Queues --
  {lang:"DSA",level:1,q:"What is a stack?",code:null,options:["A tree structure","A LIFO data structure where elements are added/removed from the top","A sorted array","A graph"],answer:1,explain:"Stacks follow Last-In-First-Out: push adds to top, pop removes from top."},
  {lang:"DSA",level:1,q:"What is a queue?",code:null,options:["Same as a stack","A FIFO data structure where elements are added at the back and removed from the front","A sorted list","A hash table"],answer:1,explain:"Queues follow First-In-First-Out: enqueue at back, dequeue from front."},
  {lang:"DSA",level:2,q:"What is the difference between a stack and a queue?",code:null,options:["Same thing","Stack is LIFO (last in, first out); Queue is FIFO (first in, first out)","Stack is faster","Queue uses more memory"],answer:1,explain:"Stack: LIFO (push/pop from top). Queue: FIFO (enqueue at back, dequeue from front)."},
  {lang:"DSA",level:2,q:"What data structure is used to evaluate postfix expressions?",code:"3 4 + 2 *  → ?",options:["Queue","Stack","Linked list","Tree"],answer:1,explain:"Push operands, pop two on operator, push result. Stack naturally handles order of operations."},
  {lang:"DSA",level:3,q:"What is a priority queue?",code:null,options:["A regular queue","A queue where each element has a priority and higher-priority elements are dequeued first","A stack","A sorted array"],answer:1,explain:"Priority queues serve the highest-priority element first, often implemented with a heap."},

  // -- Hash Tables --
  {lang:"DSA",level:2,q:"What is a hash table?",code:null,options:["A sorted array","A data structure that maps keys to values using a hash function for O(1) average lookup","A binary tree","A queue"],answer:1,explain:"Hash tables provide near-constant time lookup by hashing keys to array indices."},
  {lang:"DSA",level:2,q:"What is a hash collision?",code:null,options:["A crash","When two different keys produce the same hash index","A missing key","A sorting error"],answer:1,explain:"Collisions occur when different keys hash to the same index — resolved by chaining or open addressing."},
  {lang:"DSA",level:3,q:"What is the worst-case time complexity of hash table lookup?",code:null,options:["O(1)","O(log n)","O(n)","O(n²)"],answer:2,explain:"Worst case all keys collide to one bucket → O(n) linear search. Average is O(1)."},

  // -- Trees --
  {lang:"DSA",level:2,q:"What is a binary tree?",code:null,options:["A tree with any number of children","A tree where each node has at most two children (left and right)","A sorted array","A graph"],answer:1,explain:"Binary trees have at most two children per node, forming the basis for BSTs, heaps, and more."},
  {lang:"DSA",level:2,q:"What is a Binary Search Tree (BST)?",code:null,options:["A random tree","A binary tree where left child < parent < right child for every node","A heap","A balanced array"],answer:1,explain:"BST property: left subtree values < node < right subtree values, enabling O(log n) search."},
  {lang:"DSA",level:2,q:"What are the three depth-first tree traversal orders?",code:null,options:["Fast, medium, slow","In-order, Pre-order, Post-order","Left, right, center","BFS, DFS, A*"],answer:1,explain:"In-order (L,N,R), Pre-order (N,L,R), Post-order (L,R,N) — all are DFS traversals."},
  {lang:"DSA",level:3,q:"What does in-order traversal of a BST produce?",code:null,options:["Random order","Elements in sorted ascending order","Reverse order","Level order"],answer:1,explain:"In-order traversal of a BST visits left, node, right — yielding sorted output."},
  {lang:"DSA",level:3,q:"What is a balanced binary tree?",code:null,options:["A tree with equal values","A tree where the height difference between left and right subtrees is at most 1","A tree with only leaves","A complete graph"],answer:1,explain:"Balanced trees (AVL, Red-Black) maintain O(log n) height for efficient operations."},
  {lang:"DSA",level:4,q:"What is a Red-Black tree?",code:null,options:["A colored graph","A self-balancing BST with color properties ensuring O(log n) operations","A sorting algorithm","A hash structure"],answer:1,explain:"Red-Black trees use node coloring rules and rotations to stay balanced after insertions/deletions."},

  // -- Heaps --
  {lang:"DSA",level:2,q:"What is a heap?",code:null,options:["A stack of memory","A complete binary tree where parent is always greater (max-heap) or smaller (min-heap) than children","A sorted list","A hash table"],answer:1,explain:"Heaps maintain the heap property: parent ≥ children (max-heap) or ≤ (min-heap). Used for priority queues."},
  {lang:"DSA",level:3,q:"What is the time complexity of inserting into a heap?",code:null,options:["O(1)","O(n)","O(log n)","O(n²)"],answer:2,explain:"Insert at the end then bubble up — at most log n swaps along the tree height."},
  {lang:"DSA",level:3,q:"What algorithm uses a heap to sort?",code:null,options:["Quicksort","Heapsort","Mergesort","Bubblesort"],answer:1,explain:"Heapsort builds a heap then repeatedly extracts the max/min. O(n log n) time, O(1) space."},

  // -- Graphs --
  {lang:"DSA",level:2,q:"What is a graph?",code:null,options:["A chart","A collection of vertices (nodes) connected by edges","A tree only","An array of arrays"],answer:1,explain:"Graphs model relationships — nodes connected by edges, which can be directed or undirected."},
  {lang:"DSA",level:2,q:"What is the difference between BFS and DFS?",code:null,options:["Same thing","BFS explores level by level (queue); DFS explores as deep as possible first (stack)","BFS is always faster","DFS uses more memory"],answer:1,explain:"BFS uses a queue for level-order traversal. DFS uses a stack (or recursion) to go deep first."},
  {lang:"DSA",level:3,q:"What data structure does BFS use?",code:null,options:["Stack","Queue","Heap","Hash table"],answer:1,explain:"BFS uses a queue to visit nodes level by level, ensuring shortest path in unweighted graphs."},
  {lang:"DSA",level:3,q:"What is Dijkstra's algorithm used for?",code:null,options:["Sorting","Finding the shortest path from a source to all vertices in a weighted graph","Searching strings","Balancing trees"],answer:1,explain:"Dijkstra's uses a priority queue to greedily find shortest paths. O((V+E) log V)."},
  {lang:"DSA",level:4,q:"What is a topological sort?",code:null,options:["Sorting by size","A linear ordering of vertices in a DAG such that every edge u→v has u before v","Alphabetical sort","A heap sort variant"],answer:1,explain:"Topological sort orders DAG vertices respecting dependencies — used in build systems, scheduling."},
  {lang:"DSA",level:4,q:"What is the difference between an adjacency matrix and adjacency list?",code:null,options:["Same thing","Matrix uses O(V²) space for fast edge lookup; list uses O(V+E) space, better for sparse graphs","List is always better","Matrix is always faster"],answer:1,explain:"Matrix: O(V²) space, O(1) edge check. List: O(V+E) space, O(degree) edge check. Choose based on graph density."},

  // -- Sorting --
  {lang:"DSA",level:1,q:"What is bubble sort?",code:null,options:["A fast sort","A simple sort that repeatedly swaps adjacent elements if they're in the wrong order","A divide and conquer sort","A hash-based sort"],answer:1,explain:"Bubble sort compares adjacent elements and swaps — O(n²) average/worst, but O(n) best when sorted."},
  {lang:"DSA",level:2,q:"What is the time complexity of merge sort?",code:null,options:["O(n)","O(n log n)","O(n²)","O(log n)"],answer:1,explain:"Merge sort divides, recursively sorts, then merges — always O(n log n) but needs O(n) extra space."},
  {lang:"DSA",level:2,q:"What sorting algorithm is divide-and-conquer and sorts in-place on average?",code:null,options:["Bubble sort","Quicksort","Insertion sort","Counting sort"],answer:1,explain:"Quicksort picks a pivot, partitions, and recurses. Average O(n log n), in-place with O(log n) stack."},
  {lang:"DSA",level:3,q:"Which sort is stable: merge sort or quicksort?",code:null,options:["Quicksort","Neither","Merge sort","Both"],answer:2,explain:"Merge sort is stable (preserves equal-element order). Standard quicksort is not stable."},
  {lang:"DSA",level:4,q:"What is the time complexity of quicksort on average?",code:null,options:["O(n)","O(n log n)","O(n²)","O(log n)"],answer:1,explain:"Quicksort averages O(n log n) but worst case is O(n²)."},

  // -- Searching --
  {lang:"DSA",level:1,q:"What is linear search?",code:null,options:["A sort","Checking each element one by one until the target is found — O(n)","Binary search","A hash lookup"],answer:1,explain:"Linear search iterates through all elements. Simple but O(n) time."},
  {lang:"DSA",level:2,q:"What is the time complexity of binary search?",code:null,options:["O(n)","O(log n)","O(n²)","O(1)"],answer:1,explain:"Binary search halves the search space each step — O(log n). Requires sorted input."},
  {lang:"DSA",level:3,q:"What is the prerequisite for binary search?",code:null,options:["Unsorted data","The data must be sorted","Data must be in a linked list","Data must be numeric"],answer:1,explain:"Binary search only works on sorted data so it can eliminate half the search space."},

  // -- Recursion & Dynamic Programming --
  {lang:"DSA",level:2,q:"What is recursion?",code:null,options:["A loop construct","A function that calls itself with a smaller subproblem until reaching a base case","A data structure","A sorting method"],answer:1,explain:"Recursion breaks problems into smaller instances. Every recursive function needs a base case to stop."},
  {lang:"DSA",level:2,q:"What is a base case in recursion?",code:null,options:["The first call","The condition that stops recursion and returns a value without further recursive calls","A variable","An error handler"],answer:1,explain:"Without a base case, recursion continues infinitely (stack overflow)."},
  {lang:"DSA",level:3,q:"What is memoization?",code:null,options:["Writing notes","Caching previously computed results to avoid redundant calculations in recursive problems","A sorting technique","Memory allocation"],answer:1,explain:"Memoization stores results of expensive function calls — key technique in top-down DP."},
  {lang:"DSA",level:3,q:"What is dynamic programming?",code:null,options:["Writing code dynamically","Solving problems by breaking into overlapping subproblems and caching results","A type of recursion only","Parallel processing"],answer:1,explain:"DP stores solutions to subproblems to avoid redundant computation."},
  {lang:"DSA",level:4,q:"What is the difference between top-down and bottom-up DP?",code:null,options:["Same approach","Top-down uses recursion + memoization; bottom-up uses iteration + tabulation","Top-down is always faster","Bottom-up uses more memory"],answer:1,explain:"Top-down: recursive with cache. Bottom-up: iterative, filling a table from smallest subproblems up."},
  {lang:"DSA",level:4,q:"What is the time complexity of the naive recursive Fibonacci?",code:"fib(n) = fib(n-1) + fib(n-2)",options:["O(n)","O(n²)","O(2^n)","O(log n)"],answer:2,explain:"Naive recursion recomputes subproblems exponentially — O(2^n). DP reduces it to O(n)."},

  // -- Advanced --
  {lang:"DSA",level:3,q:"What is a trie?",code:null,options:["A tree typo","A tree-like structure for storing strings where each node represents a character","A sorting algorithm","A graph algorithm"],answer:1,explain:"Tries enable O(m) string lookup (m = length) and are used for autocomplete and spell checking."},
  {lang:"DSA",level:4,q:"What is amortized analysis?",code:null,options:["Average case","Analyzing the average cost per operation over a worst-case sequence of operations","Best case analysis","Space analysis only"],answer:1,explain:"Amortized analysis shows that even if some operations are expensive, the average over many is cheap (e.g., dynamic array resize)."},
  {lang:"DSA",level:4,q:"What is the time complexity of finding the shortest path in an unweighted graph using BFS?",code:null,options:["O(V²)","O(V + E)","O(V log V)","O(E²)"],answer:1,explain:"BFS visits each vertex and edge once — O(V + E) — and finds shortest paths in unweighted graphs."},

  // ===== TypeScript =====
  {lang:"TypeScript",level:1,q:"TypeScript is a superset of which language?",code:null,options:["Java","Python","JavaScript","C#"],answer:2,explain:"TypeScript is JavaScript + static types."},
  {lang:"TypeScript",level:1,q:"What does TypeScript add to JavaScript?",code:null,options:["Runtime speed","Static typing and compile-time error checking","New runtime APIs","A different syntax"],answer:1,explain:"TypeScript adds a type system that catches errors at compile time."},
  {lang:"TypeScript",level:2,q:"What is an `interface` in TypeScript?",code:null,options:["A class with no methods","A compile-time contract describing the shape of an object","A runtime type checker","Same as a class"],answer:1,explain:"Interfaces define the shape objects must have — compile time only."},
  {lang:"TypeScript",level:2,q:"What does `?` mean in `name?: string`?",code:null,options:["Name could be null","Name is optional","Name must be a string","Ternary operator"],answer:1,explain:"The `?` marks a property as optional."},
  {lang:"TypeScript",level:3,q:"What is a union type?",code:"type ID = string | number;",options:["A combination of two classes","A type that can be one of several types","A required field","An intersection of types"],answer:1,explain:"Union types (`A | B`) mean the value can be either type A or type B."},
  {lang:"TypeScript",level:4,q:"What is a generic in TypeScript?",code:"function identity<T>(arg: T): T { return arg; }",options:["A template string","A type parameter making functions work with any type safely","A wildcard that disables checking","Only works with arrays"],answer:1,explain:"Generics `<T>` let you write reusable code that preserves type info."},
  {lang:"TypeScript",level:4,q:"What is `unknown` vs `any`?",code:null,options:["Same thing","unknown is safe — must narrow before using; any skips all checking","any is safer","unknown only works with objects"],answer:1,explain:"`any` opts out of checking. `unknown` is the type-safe alternative."},

  // ===== Angular =====
  {lang:"Angular",level:1,q:"What is Angular?",code:null,options:["A database","A TypeScript-based web application framework by Google","A CSS library","A Node.js module"],answer:1,explain:"Angular is a full-featured web framework built with TypeScript by Google."},
  {lang:"Angular",level:1,q:"What language does Angular primarily use?",code:null,options:["JavaScript only","TypeScript","Python","Java"],answer:1,explain:"Angular is built with and primarily uses TypeScript."},
  {lang:"Angular",level:2,q:"What is a component in Angular?",code:null,options:["A CSS file","A building block with a template, class, and metadata","A database table","A routing module"],answer:1,explain:"Components are the main building blocks — each has a template, class, and decorator."},
  {lang:"Angular",level:2,q:"What is two-way data binding?",code:null,options:["Only view to model","Automatic sync between model and view using [(ngModel)]","One-way only","A CSS feature"],answer:1,explain:"Two-way binding (`[(ngModel)]`) keeps the model and view in sync automatically."},
  {lang:"Angular",level:3,q:"What is dependency injection in Angular?",code:null,options:["Importing CSS","A pattern where Angular provides class dependencies automatically","Manual imports","A security feature"],answer:1,explain:"Angular's DI system creates and injects service instances into components."},
  {lang:"Angular",level:4,q:"What are Angular pipes?",code:null,options:["Linux commands","Functions that transform data in templates (date, currency, etc.)","HTTP connections","Test utilities"],answer:1,explain:"Pipes transform displayed values in templates: `{{ date | date:'short' }}`."},

  // ===== AngularJS =====
  {lang:"AngularJS",level:1,q:"What is AngularJS?",code:null,options:["Same as Angular","The original JavaScript-based MVC framework by Google (version 1.x)","A CSS framework","A Node module"],answer:1,explain:"AngularJS (1.x) is the original JavaScript MVC framework — different from Angular 2+."},
  {lang:"AngularJS",level:2,q:"What is `$scope` in AngularJS?",code:null,options:["A CSS property","The binding between HTML view and JavaScript controller","A routing object","A service"],answer:1,explain:"`$scope` is the glue between controller and view in AngularJS."},
  {lang:"AngularJS",level:2,q:"What does `ng-model` do?",code:null,options:["Creates a model file","Binds an input element to a scope variable for two-way binding","Defines a route","Imports a module"],answer:1,explain:"`ng-model` creates two-way data binding between input and scope."},
  {lang:"AngularJS",level:3,q:"What are directives in AngularJS?",code:null,options:["CSS classes","Markers on DOM elements that extend HTML behavior (ng-repeat, ng-if)","Database queries","Node modules"],answer:1,explain:"Directives extend HTML with custom attributes and elements like `ng-repeat`."},
  {lang:"AngularJS",level:4,q:"Why was AngularJS replaced by Angular?",code:null,options:["It still isn't","Angular 2+ was rewritten for better performance, TypeScript, and component architecture","Legal reasons","It was too fast"],answer:1,explain:"Angular was a complete rewrite with components, TypeScript, and better performance."},

  // ===== Git =====
  {lang:"Git",level:1,q:"What does `git commit` do?",code:null,options:["Uploads to GitHub","Saves a snapshot of staged changes to the local repo","Creates a branch","Merges branches"],answer:1,explain:"`git commit` saves staged changes as a snapshot in the local repository."},
  {lang:"Git",level:1,q:"What is a branch in Git?",code:null,options:["A copy of GitHub","A pointer to a commit enabling parallel development","A backup file","A remote server"],answer:1,explain:"A branch is a lightweight pointer to a commit."},
  {lang:"Git",level:2,q:"What does `git merge` do?",code:null,options:["Deletes a branch","Combines changes from one branch into another","Pulls from remote","Creates a commit"],answer:1,explain:"`git merge` integrates changes from one branch into the current branch."},
  {lang:"Git",level:2,q:"What does `git stash` do?",code:null,options:["Deletes changes","Temporarily saves uncommitted changes","Commits everything","Pushes to remote"],answer:1,explain:"`git stash` saves dirty working directory. Retrieve with `git stash pop`."},
  {lang:"Git",level:3,q:"What is a merge conflict?",code:null,options:["A syntax error","When two branches changed the same part of a file differently","A failed push","A deleted branch"],answer:1,explain:"Merge conflicts occur when Git can't auto-merge conflicting changes."},
  {lang:"Git",level:3,q:"What does `git rebase` do?",code:null,options:["Same as merge","Moves commits on top of another branch for linear history","Reverts all commits","Copies a branch"],answer:1,explain:"Rebase replays commits onto a different base — cleaner than merge."},
  {lang:"Git",level:4,q:"Difference between `git reset` and `git revert`?",code:null,options:["Same thing","reset rewrites history (dangerous); revert adds a new undo commit (safe)","revert is destructive","reset only unstages"],answer:1,explain:"`reset` rewrites history. `revert` creates a new commit that undoes changes."},

  // ===== PostgreSQL =====
  {lang:"PostgreSQL",level:1,q:"What is PostgreSQL?",code:null,options:["A NoSQL database","An advanced open-source relational database","A web server","A JavaScript framework"],answer:1,explain:"PostgreSQL is a powerful, open-source object-relational database system."},
  {lang:"PostgreSQL",level:1,q:"What does PSQL stand for?",code:null,options:["A programming language","PostgreSQL's interactive terminal","A PHP tool","A testing framework"],answer:1,explain:"psql is the command-line interface for interacting with PostgreSQL."},
  {lang:"PostgreSQL",level:2,q:"What is a schema in PostgreSQL?",code:null,options:["A backup file","A namespace that contains tables, views, functions","A user account","A log file"],answer:1,explain:"Schemas organize database objects into logical groups within a database."},
  {lang:"PostgreSQL",level:2,q:"What data type stores JSON in PostgreSQL?",code:null,options:["TEXT only","JSON and JSONB","VARCHAR","BLOB"],answer:1,explain:"PostgreSQL has native `JSON` (text) and `JSONB` (binary, indexable) types."},
  {lang:"PostgreSQL",level:3,q:"What is a CTE (Common Table Expression)?",code:null,options:["A table type","A temporary named result set defined with WITH clause","A constraint","An index type"],answer:1,explain:"CTEs (`WITH name AS (...)`) create readable, reusable subqueries."},
  {lang:"PostgreSQL",level:4,q:"What is MVCC in PostgreSQL?",code:null,options:["A version control system","Multi-Version Concurrency Control — allows concurrent reads/writes without locking","A backup method","A replication type"],answer:1,explain:"MVCC lets multiple transactions see consistent snapshots without blocking each other."},

  // ===== MongoDB =====
  {lang:"MongoDB",level:1,q:"What type of database is MongoDB?",code:null,options:["Relational","A NoSQL document-oriented database","Graph database","Key-value only"],answer:1,explain:"MongoDB stores data as flexible JSON-like documents (BSON)."},
  {lang:"MongoDB",level:1,q:"What format does MongoDB store data in?",code:null,options:["Tables and rows","BSON (Binary JSON) documents","XML","CSV"],answer:1,explain:"MongoDB uses BSON — a binary representation of JSON-like documents."},
  {lang:"MongoDB",level:2,q:"What is a collection in MongoDB?",code:null,options:["A table with fixed columns","A group of documents (equivalent to a SQL table)","A database","An index"],answer:1,explain:"Collections group documents together, similar to tables in relational databases."},
  {lang:"MongoDB",level:2,q:"How do you insert a document?",code:null,options:["INSERT INTO","db.collection.insertOne({name: 'Alice'})","ADD DOCUMENT","db.push()"],answer:1,explain:"`insertOne()` adds a single document to a collection."},
  {lang:"MongoDB",level:3,q:"What is the aggregation pipeline?",code:null,options:["A backup tool","A framework for transforming and analyzing data through stages ($match, $group, etc.)","A connection pool","A replication method"],answer:1,explain:"The aggregation pipeline processes documents through stages for complex queries."},
  {lang:"MongoDB",level:4,q:"What is sharding in MongoDB?",code:null,options:["Deleting old data","Distributing data across multiple servers for horizontal scaling","Compression","Indexing"],answer:1,explain:"Sharding partitions data across servers to handle large datasets and high throughput."},

  // ===== ASP.NET =====
  {lang:"ASP.NET",level:1,q:"What does ASP.NET Core run on?",code:null,options:["Windows only","Cross-platform via .NET runtime","Linux only","Java Virtual Machine"],answer:1,explain:"ASP.NET Core is cross-platform — runs on Windows, Linux, and macOS."},
  {lang:"ASP.NET",level:2,q:"What does a Controller do in ASP.NET Core?",code:null,options:["Manages the database","Handles HTTP requests and returns responses","Renders HTML directly","Stores business logic only"],answer:1,explain:"Controllers receive HTTP requests, process them, and return responses."},
  {lang:"ASP.NET",level:2,q:"What is a Razor page?",code:null,options:["A CSS file","A page combining C# and HTML for server-side rendering","A JavaScript module","A database migration"],answer:1,explain:"Razor pages use `.cshtml` files — C# mixed with HTML for server-side rendering."},
  {lang:"ASP.NET",level:3,q:"What is Dependency Injection in .NET?",code:null,options:["Hardcoding dependencies","A pattern where dependencies are passed in rather than created internally","SQL injection","Only for testing"],answer:1,explain:"DI passes dependencies from outside, making code testable and flexible."},
  {lang:"ASP.NET",level:3,q:"What is Entity Framework Core?",code:null,options:["A UI library","An ORM for databases using C# objects","A routing tool","A logger"],answer:1,explain:"EF Core maps C# classes to database tables via object-relational mapping."},
  {lang:"ASP.NET",level:4,q:"What is middleware in ASP.NET Core?",code:null,options:["A database layer","Software in the HTTP request/response pipeline","A type of controller","A CSS framework"],answer:1,explain:"Middleware components process requests and responses in a configurable pipeline."},

  // ===== AI =====
  {lang:"AI",level:1,q:"What does AI stand for?",code:null,options:["Automated Internet","Artificial Intelligence","Advanced Integration","Analog Interface"],answer:1,explain:"AI stands for Artificial Intelligence — machines that can learn and make decisions."},
  {lang:"AI",level:1,q:"What is machine learning?",code:null,options:["Memorizing data","A subset of AI where systems learn from data without explicit programming","A programming language","A database"],answer:1,explain:"ML algorithms learn patterns from data to make predictions or decisions."},
  {lang:"AI",level:2,q:"What is supervised learning?",code:null,options:["Learning without data","Training with labeled data to predict outputs from inputs","Unsupervised clustering","Reinforcement only"],answer:1,explain:"Supervised learning uses labeled examples to learn input→output mappings."},
  {lang:"AI",level:2,q:"What is a neural network?",code:null,options:["A computer network","A computing system inspired by biological brains with layers of connected nodes","A database schema","A sorting algorithm"],answer:1,explain:"Neural networks process data through layers of interconnected nodes (neurons)."},
  {lang:"AI",level:3,q:"What is overfitting?",code:null,options:["Too much data","When a model performs well on training data but poorly on new data","A hardware issue","A type of neural network"],answer:1,explain:"Overfitting means the model memorized training data instead of learning general patterns."},
  {lang:"AI",level:4,q:"What is the difference between classification and regression?",code:null,options:["Same thing","Classification predicts categories; regression predicts continuous values","Regression is for text only","Classification uses unsupervised learning"],answer:1,explain:"Classification: discrete categories (spam/not). Regression: continuous values (price)."},

  // ===== R =====
  {lang:"R",level:1,q:"What is R primarily used for?",code:null,options:["Web development","Statistical computing and data visualization","Mobile apps","System programming"],answer:1,explain:"R is a language and environment for statistical computing and graphics."},
  {lang:"R",level:1,q:"How do you assign a value in R?",code:null,options:["x = 5 only","x <- 5","x := 5","let x = 5"],answer:1,explain:"R uses `<-` as the primary assignment operator (= also works but <- is preferred)."},
  {lang:"R",level:2,q:"What is a data frame in R?",code:null,options:["A picture frame","A table-like structure with rows and columns of different types","A vector","A matrix only"],answer:1,explain:"Data frames are R's primary structure for tabular data — like a spreadsheet."},
  {lang:"R",level:2,q:"What does `ggplot2` do?",code:null,options:["Machine learning","Creates elegant data visualizations using grammar of graphics","File I/O","Web scraping"],answer:1,explain:"`ggplot2` is R's most popular visualization package based on grammar of graphics."},
  {lang:"R",level:3,q:"What does the pipe operator `%>%` do?",code:null,options:["Division","Passes the result of one function as input to the next","Comparison","Assignment"],answer:1,explain:"`%>%` (from magrittr/dplyr) chains operations: `data %>% filter() %>% select()`."},
  {lang:"R",level:4,q:"What is the tidyverse?",code:null,options:["A database","A collection of R packages for data science (dplyr, ggplot2, tidyr, etc.)","An IDE","A version control system"],answer:1,explain:"The tidyverse is an opinionated collection of R packages sharing design philosophy."},

  // ===== Go =====
  {lang:"Go",level:1,q:"What is Go (Golang)?",code:null,options:["A game","A statically typed, compiled language by Google","A JavaScript framework","A database"],answer:1,explain:"Go is a fast, statically typed language designed for simplicity and concurrency."},
  {lang:"Go",level:1,q:"What is the entry point of a Go program?",code:null,options:["func start()","func main() in package main","func init()","func run()"],answer:1,explain:"Go programs start at `func main()` in `package main`."},
  {lang:"Go",level:2,q:"What is a goroutine?",code:null,options:["A type of loop","A lightweight concurrent function launched with the `go` keyword","A data type","A package"],answer:1,explain:"Goroutines are lightweight threads managed by Go's runtime — `go func()`."},
  {lang:"Go",level:2,q:"What are channels in Go?",code:null,options:["TV channels","Typed conduits for sending values between goroutines","File handles","HTTP connections"],answer:1,explain:"Channels enable safe communication between goroutines: `ch <- value`."},
  {lang:"Go",level:3,q:"Does Go have classes?",code:null,options:["Yes","No — Go uses structs with methods and interfaces instead","Only abstract classes","Only in Go 2.0"],answer:1,explain:"Go uses structs, methods, and interfaces — no class-based inheritance."},
  {lang:"Go",level:4,q:"What is `defer` in Go?",code:null,options:["Delays compilation","Schedules a function call to run when the surrounding function returns","Cancels a goroutine","A loop keyword"],answer:1,explain:"`defer` ensures cleanup code runs when the function exits — like closing files."},

  // ===== Kotlin =====
  {lang:"Kotlin",level:1,q:"What is Kotlin?",code:null,options:["A database","A modern programming language that runs on the JVM, official for Android","A CSS framework","A JavaScript library"],answer:1,explain:"Kotlin is a modern JVM language and Google's preferred language for Android."},
  {lang:"Kotlin",level:1,q:"How do you declare a read-only variable?",code:null,options:["const x = 5","val x = 5","var x = 5","let x = 5"],answer:1,explain:"`val` declares an immutable variable. `var` is mutable."},
  {lang:"Kotlin",level:2,q:"What is null safety in Kotlin?",code:null,options:["Ignoring nulls","The type system distinguishes nullable (String?) from non-nullable (String) types","Runtime null checks","A testing feature"],answer:1,explain:"Kotlin's type system prevents null pointer exceptions at compile time."},
  {lang:"Kotlin",level:2,q:"What are data classes?",code:null,options:["Database tables","Classes that automatically generate equals, hashCode, toString, copy","Abstract classes","Singleton objects"],answer:1,explain:"`data class User(val name: String)` auto-generates utility methods."},
  {lang:"Kotlin",level:3,q:"What are coroutines in Kotlin?",code:null,options:["Threads","Lightweight concurrency primitives for async programming","A design pattern","A testing framework"],answer:1,explain:"Coroutines enable non-blocking async code that looks synchronous."},
  {lang:"Kotlin",level:4,q:"What is a sealed class?",code:null,options:["A final class","A restricted class hierarchy where all subclasses are known at compile time","An abstract class","A data class variant"],answer:1,explain:"Sealed classes restrict inheritance — all subclasses must be defined in the same file."},

  // ===== Swift =====
  {lang:"Swift",level:1,q:"What is Swift?",code:null,options:["A web framework","Apple's programming language for iOS, macOS, and beyond","A database","A CSS preprocessor"],answer:1,explain:"Swift is Apple's modern, safe, fast language for Apple platforms."},
  {lang:"Swift",level:1,q:"How do you declare a constant in Swift?",code:null,options:["const x = 5","let x = 5","var x = 5","final x = 5"],answer:1,explain:"`let` declares a constant. `var` declares a variable."},
  {lang:"Swift",level:2,q:"What are optionals in Swift?",code:null,options:["Optional parameters","Types that can hold a value or nil, enforced by the type system","Default values","A testing feature"],answer:1,explain:"Optionals (`String?`) safely represent the absence of a value."},
  {lang:"Swift",level:2,q:"What is `guard let` used for?",code:null,options:["Error handling","Early exit from a scope if an optional is nil","Loop control","Memory management"],answer:1,explain:"`guard let` unwraps an optional or exits the scope — keeps happy path unindented."},
  {lang:"Swift",level:3,q:"What are protocols in Swift?",code:null,options:["Network protocols","Blueprints defining methods and properties a type must implement (like interfaces)","A testing framework","A design pattern"],answer:1,explain:"Protocols define a contract of methods/properties — similar to interfaces."},
  {lang:"Swift",level:4,q:"What is ARC in Swift?",code:null,options:["A compression format","Automatic Reference Counting — manages memory by tracking object references","An animation framework","A build tool"],answer:1,explain:"ARC automatically frees memory when an object has no more strong references."},

  // ===== Sass =====
  {lang:"Sass",level:1,q:"What is Sass?",code:null,options:["A JavaScript library","A CSS preprocessor that adds variables, nesting, and mixins","A database","A web framework"],answer:1,explain:"Sass extends CSS with powerful features that compile to standard CSS."},
  {lang:"Sass",level:1,q:"What is the difference between Sass and SCSS?",code:null,options:["Different languages","Same language — SCSS uses braces/semicolons, Sass uses indentation","SCSS is newer and better","Sass is for Python"],answer:1,explain:"SCSS is the newer, CSS-compatible syntax. Sass (indented) is the original."},
  {lang:"Sass",level:2,q:"How do you create a variable in SCSS?",code:null,options:["var color = red","$color: red;","@color: red;","--color: red;"],answer:1,explain:"SCSS variables use `$`: `$primary: #3498db;`."},
  {lang:"Sass",level:2,q:"What is nesting in Sass?",code:null,options:["Using div inside div","Writing child selectors inside parent selectors to mirror HTML structure","A loop","An import"],answer:1,explain:"Nesting lets you write `.nav { .link { color: blue; } }` instead of `.nav .link`."},
  {lang:"Sass",level:3,q:"What is a mixin in Sass?",code:null,options:["A color blend","A reusable group of CSS declarations that can accept arguments","A variable type","A media query"],answer:1,explain:"Mixins (`@mixin name($arg) { ... }`) create reusable CSS blocks."},
  {lang:"Sass",level:4,q:"What does `@extend` do in Sass?",code:null,options:["Extends the page","Lets a selector inherit styles from another selector","Adds responsive breakpoints","Imports a file"],answer:1,explain:"`@extend .btn` inherits all of `.btn`'s styles — but can lead to unexpected CSS."},

  // ===== Vue =====
  {lang:"Vue",level:1,q:"What is Vue.js?",code:null,options:["A database","A progressive JavaScript framework for building UIs","A CSS library","A Node module"],answer:1,explain:"Vue.js is a progressive framework for building user interfaces."},
  {lang:"Vue",level:1,q:"What is a Vue component?",code:null,options:["A CSS class","A reusable, self-contained piece of UI with template, script, and style","A server endpoint","A database table"],answer:1,explain:"Vue components encapsulate template, logic, and styles in a single file (SFC)."},
  {lang:"Vue",level:2,q:"What does `v-bind` do?",code:null,options:["Creates a variable","Dynamically binds an attribute to an expression","Handles events","Loops over data"],answer:1,explain:"`v-bind:src='url'` (or `:src='url'`) dynamically sets HTML attributes."},
  {lang:"Vue",level:2,q:"What is the `v-for` directive?",code:null,options:["A conditional","Renders a list by iterating over an array","An event handler","A CSS animation"],answer:1,explain:"`v-for='item in items'` renders an element for each item in an array."},
  {lang:"Vue",level:3,q:"What is Vuex / Pinia?",code:null,options:["A router","State management libraries for sharing state across components","A CSS framework","A testing tool"],answer:1,explain:"Vuex/Pinia provide centralized state management for Vue applications."},
  {lang:"Vue",level:4,q:"What is the Composition API?",code:null,options:["A REST API","A function-based API using setup() for organizing component logic","A build tool","A routing system"],answer:1,explain:"The Composition API uses `setup()` and composables for better logic reuse."},

  // ===== Gen AI =====
  {lang:"Gen AI",level:1,q:"What is Generative AI?",code:null,options:["A database","AI that can create new content like text, images, code, and music","A programming language","A web browser"],answer:1,explain:"Generative AI creates new content by learning patterns from training data."},
  {lang:"Gen AI",level:1,q:"What is a Large Language Model (LLM)?",code:null,options:["A translation dictionary","An AI model trained on vast text data to understand and generate human language","A database engine","A compression algorithm"],answer:1,explain:"LLMs like GPT are trained on billions of text tokens to generate human-like text."},
  {lang:"Gen AI",level:2,q:"What is a prompt?",code:null,options:["A command line","The input text given to a generative AI model to guide its output","A database query","An error message"],answer:1,explain:"Prompts are instructions that tell the AI what kind of output you want."},
  {lang:"Gen AI",level:2,q:"What is 'hallucination' in AI?",code:null,options:["A visual effect","When an AI generates confident but factually incorrect information","A training technique","A model architecture"],answer:1,explain:"Hallucinations are plausible-sounding but false outputs — a key limitation."},
  {lang:"Gen AI",level:3,q:"What is fine-tuning?",code:null,options:["Adjusting volume","Training a pre-trained model further on specific data for a particular task","Debugging code","Compressing a model"],answer:1,explain:"Fine-tuning adapts a general model to excel at a specific domain or task."},
  {lang:"Gen AI",level:4,q:"What is RAG (Retrieval-Augmented Generation)?",code:null,options:["A file format","Combining retrieval of relevant documents with AI generation for accurate answers","A training method","A compression technique"],answer:1,explain:"RAG retrieves relevant context from a knowledge base before generating, reducing hallucinations."},

  // ===== SciPy =====
  {lang:"SciPy",level:1,q:"What is SciPy?",code:null,options:["A web framework","A Python library for scientific and technical computing built on NumPy","A CSS tool","A database"],answer:1,explain:"SciPy provides algorithms for optimization, integration, interpolation, and more."},
  {lang:"SciPy",level:2,q:"What does `scipy.optimize` provide?",code:null,options:["CSS optimization","Functions for finding minima/maxima of mathematical functions","Image processing","Web scraping"],answer:1,explain:"`scipy.optimize` has root finding, curve fitting, and minimization algorithms."},
  {lang:"SciPy",level:2,q:"What module handles linear algebra in SciPy?",code:null,options:["scipy.math","scipy.linalg","scipy.matrix","scipy.algebra"],answer:1,explain:"`scipy.linalg` provides linear algebra routines (decompositions, solvers, etc.)."},
  {lang:"SciPy",level:3,q:"What does `scipy.stats` provide?",code:null,options:["Website analytics","Statistical distributions, tests, and descriptive statistics","Database stats","Network statistics"],answer:1,explain:"`scipy.stats` has probability distributions, hypothesis tests, and more."},
  {lang:"SciPy",level:4,q:"What is `scipy.integrate.quad` used for?",code:null,options:["Creating graphs","Computing definite integrals of functions numerically","Sorting data","File compression"],answer:1,explain:"`quad` performs numerical integration (quadrature) of a function."},

  // ===== AWS =====
  {lang:"AWS",level:1,q:"What does AWS stand for?",code:null,options:["Advanced Web System","Amazon Web Services","Automated Web Server","Application Web Stack"],answer:1,explain:"AWS (Amazon Web Services) is the world's largest cloud computing platform."},
  {lang:"AWS",level:1,q:"What is EC2?",code:null,options:["A database","Elastic Compute Cloud — virtual servers in the cloud","A storage service","A DNS service"],answer:1,explain:"EC2 provides resizable virtual servers (instances) in the cloud."},
  {lang:"AWS",level:2,q:"What is S3?",code:null,options:["A server type","Simple Storage Service — scalable object storage","A compute service","A database"],answer:1,explain:"S3 stores files (objects) with high durability, availability, and scalability."},
  {lang:"AWS",level:2,q:"What is an IAM role?",code:null,options:["A user account","A set of permissions that define what AWS services an entity can access","A server type","A network configuration"],answer:1,explain:"IAM roles grant temporary permissions to AWS services and users."},
  {lang:"AWS",level:3,q:"What is Lambda?",code:null,options:["A programming language","A serverless compute service that runs code without managing servers","A database","A container service"],answer:1,explain:"Lambda runs code in response to events — you pay only for compute time used."},
  {lang:"AWS",level:4,q:"What is a VPC?",code:null,options:["A programming concept","Virtual Private Cloud — an isolated network within AWS","A file format","A deployment tool"],answer:1,explain:"A VPC is a logically isolated section of AWS where you launch resources."},

  // ===== Cybersecurity =====
  {lang:"Cybersecurity",level:1,q:"What is a firewall?",code:null,options:["A physical wall","A system that monitors and controls network traffic based on security rules","A virus","An encryption tool"],answer:1,explain:"Firewalls filter network traffic to block unauthorized access."},
  {lang:"Cybersecurity",level:1,q:"What is phishing?",code:null,options:["Fishing online","A social engineering attack using fake communications to steal data","A type of malware","A network protocol"],answer:1,explain:"Phishing uses deceptive emails/sites to trick users into revealing sensitive info."},
  {lang:"Cybersecurity",level:2,q:"What is encryption?",code:null,options:["Deleting data","Converting data into a coded format that can only be read with a key","Compressing files","Backing up data"],answer:1,explain:"Encryption transforms readable data into ciphertext — only decryptable with the right key."},
  {lang:"Cybersecurity",level:2,q:"What is SQL injection?",code:null,options:["Adding SQL to a database","An attack that inserts malicious SQL through user input to manipulate databases","A backup method","A SQL feature"],answer:1,explain:"SQL injection exploits unvalidated input to execute unauthorized database commands."},
  {lang:"Cybersecurity",level:3,q:"What is the CIA triad?",code:null,options:["A government agency model","Confidentiality, Integrity, Availability — core principles of information security","A network protocol","A type of encryption"],answer:1,explain:"CIA: keep data private (confidentiality), accurate (integrity), and accessible (availability)."},
  {lang:"Cybersecurity",level:4,q:"What is a zero-day vulnerability?",code:null,options:["A fixed bug","A security flaw unknown to the vendor with no available patch","An old vulnerability","A testing technique"],answer:1,explain:"Zero-day vulnerabilities have no patch — attackers can exploit them before a fix exists."},

  // ===== Data Science =====
  {lang:"Data Science",level:1,q:"What is Data Science?",code:null,options:["Database administration","An interdisciplinary field using statistics, programming, and domain knowledge to extract insights from data","Web development","Network engineering"],answer:1,explain:"Data Science combines statistics, programming, and domain expertise to analyze data."},
  {lang:"Data Science",level:1,q:"What is a dataset?",code:null,options:["A database server","A structured collection of data, often in rows and columns","A programming language","A web API"],answer:1,explain:"A dataset is organized data — typically tabular with rows (observations) and columns (features)."},
  {lang:"Data Science",level:2,q:"What is data cleaning?",code:null,options:["Deleting all data","The process of fixing or removing incorrect, incomplete, or duplicate data","Encrypting data","Compressing files"],answer:1,explain:"Data cleaning handles missing values, duplicates, and inconsistencies before analysis."},
  {lang:"Data Science",level:2,q:"What is the difference between correlation and causation?",code:null,options:["Same thing","Correlation is a statistical relationship; causation means one thing directly causes another","Causation is weaker","Correlation implies causation"],answer:1,explain:"Correlation ≠ causation. Two variables can be correlated without one causing the other."},
  {lang:"Data Science",level:3,q:"What is feature engineering?",code:null,options:["Building features for an app","Creating new input variables from existing data to improve model performance","Database design","Data collection"],answer:1,explain:"Feature engineering transforms raw data into informative features for ML models."},
  {lang:"Data Science",level:4,q:"What is cross-validation?",code:null,options:["Checking data types","A technique that splits data into folds to evaluate model performance and prevent overfitting","A security check","Data deduplication"],answer:1,explain:"Cross-validation trains/tests on different data subsets to get reliable performance estimates."},

  // ===== Intro to Programming =====
  {lang:"Intro to Programming",level:1,q:"What is a variable?",code:null,options:["A fixed value","A named container for storing data that can change","A function","A loop"],answer:1,explain:"Variables store data values that your program can use and modify."},
  {lang:"Intro to Programming",level:1,q:"What is a loop?",code:null,options:["A variable type","A structure that repeats a block of code multiple times","A function call","An error"],answer:1,explain:"Loops (for, while) repeat code until a condition is met."},
  {lang:"Intro to Programming",level:2,q:"What is a function?",code:null,options:["A variable","A reusable block of code that performs a specific task","A data type","A file"],answer:1,explain:"Functions encapsulate reusable logic — call them by name with arguments."},
  {lang:"Intro to Programming",level:2,q:"What is a conditional statement?",code:null,options:["A loop","Code that executes different actions based on whether a condition is true or false","A variable declaration","A comment"],answer:1,explain:"Conditionals (if/else) let programs make decisions based on conditions."},
  {lang:"Intro to Programming",level:3,q:"What is debugging?",code:null,options:["Adding bugs","The process of finding and fixing errors in code","Writing documentation","Testing performance"],answer:1,explain:"Debugging is identifying and resolving errors (bugs) in your code."},
  {lang:"Intro to Programming",level:4,q:"What is recursion?",code:null,options:["A loop type","When a function calls itself to solve a smaller version of the same problem","An error handling method","A variable scope"],answer:1,explain:"Recursion solves problems by breaking them into smaller instances of the same problem."},

  // ===== HTML & CSS =====
  {lang:"HTML & CSS",level:1,q:"What is the purpose of HTML?",code:null,options:["Styling","Structuring web page content","Programming logic","Database management"],answer:1,explain:"HTML provides the structure and content of web pages using elements and tags."},
  {lang:"HTML & CSS",level:1,q:"What is CSS used for?",code:null,options:["Structure","Styling and layout of HTML elements","Server-side logic","Database queries"],answer:1,explain:"CSS controls the visual presentation — colors, fonts, spacing, layout."},
  {lang:"HTML & CSS",level:2,q:"How do you link a CSS file to HTML?",code:null,options:["<style src='style.css'>","<link rel='stylesheet' href='style.css'>","<css>style.css</css>","<script src='style.css'>"],answer:1,explain:"The `<link>` tag in `<head>` connects an external CSS stylesheet to HTML."},
  {lang:"HTML & CSS",level:2,q:"What does `class` attribute do in HTML?",code:null,options:["Creates a JavaScript class","Assigns one or more CSS class names to an element for styling","Defines a variable","Sets an ID"],answer:1,explain:"The `class` attribute lets you apply CSS styles to multiple elements."},
  {lang:"HTML & CSS",level:3,q:"What is Flexbox?",code:null,options:["A JavaScript library","A CSS layout model for arranging items in rows or columns with alignment control","An HTML tag","A font family"],answer:1,explain:"Flexbox makes it easy to align and distribute space among items in a container."},
  {lang:"HTML & CSS",level:4,q:"What is CSS Grid?",code:null,options:["A table element","A 2D layout system for creating complex row-and-column layouts","A JavaScript plugin","A responsive image format"],answer:1,explain:"CSS Grid enables complex two-dimensional layouts with rows and columns."},

  // ===== Bash =====
  {lang:"Bash",level:1,q:"What does `ls` do?",code:null,options:["Lists processes","Lists files and directories","Loads a script","Shows disk usage"],answer:1,explain:"`ls` lists directory contents. `ls -la` shows hidden files and permissions."},
  {lang:"Bash",level:1,q:"What does `cd` do?",code:null,options:["Creates a directory","Changes the current directory","Copies a file","Deletes a file"],answer:1,explain:"`cd path` changes the current working directory."},
  {lang:"Bash",level:2,q:"What does `chmod 755 file.sh` do?",code:null,options:["Deletes the file","Sets permissions: owner rwx; group and others rx","Hides the file","Compresses it"],answer:1,explain:"755 = owner: read/write/execute, group: read/execute, others: read/execute."},
  {lang:"Bash",level:2,q:"What does `grep 'error' log.txt` do?",code:null,options:["Deletes 'error' lines","Searches and prints lines containing 'error'","Replaces 'error'","Creates a file"],answer:1,explain:"`grep` prints lines matching a pattern — fundamental for text searching."},
  {lang:"Bash",level:3,q:"What does `|` (pipe) do?",code:null,options:["Logical OR","Sends one command's output as input to the next","Runs in parallel","Redirects to file"],answer:1,explain:"Pipes connect commands: `ls | grep .txt` filters ls output."},
  {lang:"Bash",level:3,q:"What does `ps aux` show?",code:null,options:["Disk space","All currently running processes","Network connections","File permissions"],answer:1,explain:"`ps aux` lists all running processes with details."},
  {lang:"Bash",level:4,q:"What does `sudo` do?",code:null,options:["Creates a user","Runs a command with superuser privileges","Saves a file","Shows docs"],answer:1,explain:"`sudo` executes a command as root/superuser."},
  {lang:"Bash",level:4,q:"What is a shebang (`#!/bin/bash`)?",code:null,options:["A comment","The first line of a script that specifies which interpreter to use","An error","A variable"],answer:1,explain:"The shebang tells the OS which interpreter to use when running the script."},

  // ===== Rust =====
  {lang:"Rust",level:1,q:"What is Rust?",code:null,options:["A web framework","A systems programming language focused on safety and performance","A database","A CSS preprocessor"],answer:1,explain:"Rust guarantees memory safety without garbage collection through its ownership system."},
  {lang:"Rust",level:1,q:"What is ownership in Rust?",code:null,options:["File permissions","A system where each value has one owner, and memory is freed when the owner goes out of scope","A design pattern","A package manager"],answer:1,explain:"Ownership is Rust's core memory management concept — no GC needed."},
  {lang:"Rust",level:2,q:"What is borrowing in Rust?",code:null,options:["Copying data","Temporarily accessing data without taking ownership, using references","Stealing memory","A loop construct"],answer:1,explain:"Borrowing (`&`) lets you reference data without taking ownership."},
  {lang:"Rust",level:2,q:"What does `let mut x = 5` mean?",code:null,options:["x is constant","x is a mutable variable that can be reassigned","x is a function","x is deleted"],answer:1,explain:"`mut` makes a variable mutable. Without it, variables are immutable by default."},
  {lang:"Rust",level:3,q:"What is a `match` expression?",code:null,options:["String matching","Rust's powerful pattern matching that must handle all cases exhaustively","A loop","An import"],answer:1,explain:"`match` is like a switch but enforces exhaustive pattern coverage."},
  {lang:"Rust",level:3,q:"What is `Option<T>` in Rust?",code:null,options:["A settings file","An enum representing either Some(value) or None — Rust's null alternative","A collection type","A string type"],answer:1,explain:"`Option<T>` forces you to handle the absence of a value — no null pointer exceptions."},
  {lang:"Rust",level:4,q:"What is the borrow checker?",code:null,options:["A linting tool","The compiler component that enforces ownership and borrowing rules at compile time","A runtime checker","A testing framework"],answer:1,explain:"The borrow checker prevents data races, dangling references, and use-after-free at compile time."},
  {lang:"Rust",level:4,q:"What are lifetimes in Rust?",code:null,options:["Variable duration","Annotations that tell the compiler how long references are valid to prevent dangling refs","Memory limits","Thread durations"],answer:1,explain:"Lifetimes (`'a`) ensure references don't outlive the data they point to."},

  // ===== Tools =====
  {lang:"Tools",level:1,q:"What is an IDE?",code:null,options:["A programming language","An Integrated Development Environment — a code editor with debugging, autocomplete, etc.","A database","A web browser"],answer:1,explain:"IDEs like VS Code, IntelliJ, and WebStorm provide comprehensive coding tools."},
  {lang:"Tools",level:1,q:"What is a package manager?",code:null,options:["A delivery app","A tool that automates installing, updating, and managing software dependencies","A code editor","A version control system"],answer:1,explain:"Package managers (npm, pip, cargo) handle project dependencies."},
  {lang:"Tools",level:2,q:"What is Docker?",code:null,options:["A programming language","A platform for building and running applications in containers","A database","A CSS framework"],answer:1,explain:"Docker containers package code with dependencies for consistent deployment anywhere."},
  {lang:"Tools",level:2,q:"What is a linter?",code:null,options:["A compiler","A tool that analyzes code for potential errors, style issues, and bugs","A debugger","A bundler"],answer:1,explain:"Linters (ESLint, Pylint) catch errors and enforce coding standards."},
  {lang:"Tools",level:3,q:"What is CI/CD?",code:null,options:["A programming language","Continuous Integration/Continuous Deployment — automating testing and deployment","A database pattern","A CSS methodology"],answer:1,explain:"CI/CD automates building, testing, and deploying code changes."},
  {lang:"Tools",level:3,q:"What is Webpack?",code:null,options:["A web server","A module bundler that compiles JavaScript, CSS, and assets for the browser","A testing tool","A database"],answer:1,explain:"Webpack bundles modules and assets into optimized files for production."},
  {lang:"Tools",level:4,q:"What is Kubernetes?",code:null,options:["A programming language","A container orchestration platform for automating deployment and scaling","A database","A CI tool"],answer:1,explain:"Kubernetes (K8s) manages containerized applications at scale across clusters."},
  {lang:"Tools",level:4,q:"What is Terraform?",code:null,options:["A game","Infrastructure as Code tool for provisioning cloud resources declaratively","A web framework","A testing library"],answer:1,explain:"Terraform lets you define infrastructure in code and provision it across cloud providers."},

  // ===== TYPED QUESTIONS (type: "typed") =====

  // HTML typed
  {lang:"HTML",level:2,q:"What tag do you use to create a line break in HTML?",code:null,type:"typed",options:[],answer:0,accept:["<br>","<br/>","<br />","br"],explain:"The `<br>` tag creates a line break. It's a void element — no closing tag needed."},
  {lang:"HTML",level:3,q:"Write the HTML attribute that specifies an image's alternate text.",code:'<img src="photo.jpg" ____="A sunset">',type:"typed",options:[],answer:0,accept:["alt"],explain:"The `alt` attribute provides alternative text for images."},
  {lang:"HTML",level:2,q:"What tag creates an unordered (bulleted) list?",code:null,type:"typed",options:[],answer:0,accept:["<ul>","ul"],explain:"`<ul>` creates an unordered list with bullet points."},

  // CSS typed
  {lang:"CSS",level:2,q:"What CSS property makes text bold?",code:null,type:"typed",options:[],answer:0,accept:["font-weight","font-weight: bold","font-weight: bold;"],explain:"The `font-weight` property controls text boldness. Common values: `bold`, `700`."},
  {lang:"CSS",level:2,q:"What CSS property adds space inside an element's border?",code:null,type:"typed",options:[],answer:0,accept:["padding"],explain:"`padding` adds space between the content and the border."},
  {lang:"CSS",level:3,q:"Write the CSS to center text horizontally.",code:null,type:"typed",options:[],answer:0,accept:["text-align: center","text-align: center;","text-align:center","text-align:center;"],explain:"`text-align: center` horizontally centers inline/text content."},

  // JavaScript typed
  {lang:"JavaScript",level:1,q:"What keyword declares a constant variable in JavaScript?",code:null,type:"typed",options:[],answer:0,accept:["const"],explain:"`const` declares a block-scoped variable that can't be reassigned."},
  {lang:"JavaScript",level:2,q:"What method converts a string to uppercase?",code:'let s = "hello";\ns.____();',type:"typed",options:[],answer:0,accept:["toUpperCase","toUpperCase()"],explain:"`.toUpperCase()` returns a new string with all characters uppercased."},
  {lang:"JavaScript",level:2,q:"What array method adds an element to the end?",code:null,type:"typed",options:[],answer:0,accept:["push",".push","push()"],explain:"`.push()` adds one or more elements to the end of an array."},
  {lang:"JavaScript",level:3,q:"What method converts a JSON string to a JavaScript object?",code:null,type:"typed",options:[],answer:0,accept:["JSON.parse","JSON.parse()"],explain:"`JSON.parse()` parses a JSON string into a JavaScript object."},

  // Python typed
  {lang:"Python",level:1,q:"What keyword defines a function in Python?",code:null,type:"typed",options:[],answer:0,accept:["def"],explain:"`def` defines a function in Python."},
  {lang:"Python",level:2,q:"What built-in function returns the length of a list?",code:null,type:"typed",options:[],answer:0,accept:["len","len()"],explain:"`len()` returns the number of items in a sequence."},
  {lang:"Python",level:2,q:"What method adds an element to the end of a list?",code:null,type:"typed",options:[],answer:0,accept:["append",".append","append()"],explain:"`.append()` adds a single element to the end of a list."},
  {lang:"Python",level:3,q:"What keyword is used to handle exceptions in Python?",code:null,type:"typed",options:[],answer:0,accept:["try","try/except","try except"],explain:"`try`/`except` blocks catch and handle exceptions."},

  // SQL typed
  {lang:"SQL",level:1,q:"What SQL keyword retrieves data from a table?",code:null,type:"typed",options:[],answer:0,accept:["SELECT","select"],explain:"`SELECT` is the fundamental command for querying data."},
  {lang:"SQL",level:2,q:"What SQL clause sorts results?",code:null,type:"typed",options:[],answer:0,accept:["ORDER BY","order by"],explain:"`ORDER BY` sorts result rows by one or more columns."},
  {lang:"SQL",level:3,q:"What SQL keyword removes duplicate rows from results?",code:null,type:"typed",options:[],answer:0,accept:["DISTINCT","distinct"],explain:"`SELECT DISTINCT` returns only unique rows."},

  // C typed
  {lang:"C",level:2,q:"What function allocates dynamic memory in C?",code:null,type:"typed",options:[],answer:0,accept:["malloc","malloc()"],explain:"`malloc()` allocates a block of memory on the heap."},
  {lang:"C",level:2,q:"What function frees dynamically allocated memory in C?",code:null,type:"typed",options:[],answer:0,accept:["free","free()"],explain:"`free()` releases memory previously allocated by `malloc`."},

  // Java typed
  {lang:"Java",level:1,q:"What keyword creates a new object instance in Java?",code:null,type:"typed",options:[],answer:0,accept:["new"],explain:"`new` instantiates a class and calls its constructor."},
  {lang:"Java",level:2,q:"What method prints text to the console in Java?",code:null,type:"typed",options:[],answer:0,accept:["System.out.println","System.out.println()","println","System.out.print"],explain:"`System.out.println()` prints text with a newline to standard output."},

  // Git typed
  {lang:"Git",level:1,q:"What git command stages all changes for commit?",code:null,type:"typed",options:[],answer:0,accept:["git add .","git add -A","git add --all","git add"],explain:"`git add .` or `git add -A` stages all changes in the working directory."},
  {lang:"Git",level:2,q:"What git command shows the commit history?",code:null,type:"typed",options:[],answer:0,accept:["git log","git log --oneline"],explain:"`git log` shows the commit history of the current branch."},

  // Bash typed
  {lang:"Bash",level:1,q:"What command creates a new directory in the terminal?",code:null,type:"typed",options:[],answer:0,accept:["mkdir"],explain:"`mkdir dirname` creates a new directory."},
  {lang:"Bash",level:2,q:"What command removes a file in Linux/Mac?",code:null,type:"typed",options:[],answer:0,accept:["rm"],explain:"`rm filename` removes (deletes) a file."},

  // TypeScript typed
  {lang:"TypeScript",level:2,q:"What keyword makes a property optional in a TypeScript interface?",code:null,type:"typed",options:[],answer:0,accept:["?"],explain:"The `?` after a property name marks it as optional: `name?: string`."},

  // React typed
  {lang:"React",level:2,q:"What React hook manages component state?",code:null,type:"typed",options:[],answer:0,accept:["useState","usestate"],explain:"`useState` is the React Hook for adding state to functional components."},
  {lang:"React",level:3,q:"What React hook runs side effects after render?",code:null,type:"typed",options:[],answer:0,accept:["useEffect","useeffect"],explain:"`useEffect` runs side effects like API calls after the component renders."},

  // Rust typed
  {lang:"Rust",level:1,q:"What keyword makes a variable mutable in Rust?",code:null,type:"typed",options:[],answer:0,accept:["mut","let mut"],explain:"`mut` marks a variable as mutable: `let mut x = 5;`."},
  {lang:"Rust",level:2,q:"What Rust macro prints to the console with a newline?",code:null,type:"typed",options:[],answer:0,accept:["println!","println"],explain:"`println!` is a macro that prints formatted text with a newline."},

  // Go typed
  {lang:"Go",level:1,q:"What keyword declares a function in Go?",code:null,type:"typed",options:[],answer:0,accept:["func"],explain:"`func` declares a function in Go: `func main() { }`."},
  {lang:"Go",level:2,q:"What keyword launches a goroutine in Go?",code:null,type:"typed",options:[],answer:0,accept:["go"],explain:"The `go` keyword starts a concurrent goroutine: `go myFunc()`."},

  // PHP typed
  {lang:"PHP",level:1,q:"What symbol prefixes every variable in PHP?",code:null,type:"typed",options:[],answer:0,accept:["$"],explain:"PHP variables always start with `$`: `$name = 'Alice';`."},

  // Kotlin typed
  {lang:"Kotlin",level:1,q:"What keyword declares an immutable variable in Kotlin?",code:null,type:"typed",options:[],answer:0,accept:["val"],explain:"`val` declares a read-only variable. `var` is mutable."},

  // Swift typed
  {lang:"Swift",level:1,q:"What keyword declares a constant in Swift?",code:null,type:"typed",options:[],answer:0,accept:["let"],explain:"`let` declares an immutable constant in Swift."},

  // Sass typed
  {lang:"Sass",level:1,q:"What symbol prefixes variables in SCSS?",code:null,type:"typed",options:[],answer:0,accept:["$"],explain:"SCSS variables use `$`: `$primary: #3498db;`."},

  // DSA typed
  {lang:"DSA",level:1,q:"What data structure uses LIFO (Last In, First Out)?",code:null,type:"typed",options:[],answer:0,accept:["stack","a stack"],explain:"A stack follows LIFO — the last element pushed is the first popped."},
  {lang:"DSA",level:1,q:"What data structure uses FIFO (First In, First Out)?",code:null,type:"typed",options:[],answer:0,accept:["queue","a queue"],explain:"A queue follows FIFO — the first element enqueued is the first dequeued."},
  {lang:"DSA",level:2,q:"What is the time complexity of binary search?",code:null,type:"typed",options:[],answer:0,accept:["O(log n)","O(logn)","o(log n)","log n","logn"],explain:"Binary search halves the search space each step — O(log n)."},
  {lang:"DSA",level:2,q:"What sorting algorithm has the best average AND worst-case time complexity of O(n log n)?",code:null,type:"typed",options:[],answer:0,accept:["merge sort","mergesort"],explain:"Merge sort guarantees O(n log n) in all cases, unlike quicksort which is O(n²) worst case."},
  {lang:"DSA",level:2,q:"What traversal of a BST gives elements in sorted order?",code:null,type:"typed",options:[],answer:0,accept:["in-order","inorder","in order"],explain:"In-order traversal (Left, Node, Right) of a BST produces sorted ascending output."},
  {lang:"DSA",level:2,q:"What data structure does BFS use to track nodes to visit?",code:null,type:"typed",options:[],answer:0,accept:["queue","a queue"],explain:"BFS uses a queue to process nodes level by level."},
  {lang:"DSA",level:2,q:"What data structure does DFS typically use (or simulate via recursion)?",code:null,type:"typed",options:[],answer:0,accept:["stack","a stack","call stack"],explain:"DFS uses a stack — either explicitly or via the call stack in recursion."},
  {lang:"DSA",level:3,q:"What technique stores previously computed results to avoid redundant work in recursive algorithms?",code:null,type:"typed",options:[],answer:0,accept:["memoization","memoisation","caching","memo"],explain:"Memoization caches function results — converting exponential recursion to polynomial time."},
  {lang:"DSA",level:3,q:"What is the worst-case time complexity of quicksort?",code:null,type:"typed",options:[],answer:0,accept:["O(n^2)","O(n²)","o(n^2)","n^2","n²"],explain:"Quicksort degrades to O(n²) when the pivot is always the smallest/largest element."},
  {lang:"DSA",level:3,q:"What tree-like data structure stores strings character by character and is used for autocomplete?",code:null,type:"typed",options:[],answer:0,accept:["trie","a trie","prefix tree"],explain:"A trie stores strings as paths from root to leaf, enabling O(m) lookup for a string of length m."},
  {lang:"DSA",level:3,q:"What algorithm finds the shortest path in a weighted graph with non-negative edges?",code:null,type:"typed",options:[],answer:0,accept:["dijkstra","dijkstra's","dijkstras","dijkstra's algorithm"],explain:"Dijkstra's algorithm uses a priority queue to greedily find shortest paths."},
  {lang:"DSA",level:4,q:"What is the time complexity of BFS/DFS on a graph with V vertices and E edges?",code:null,type:"typed",options:[],answer:0,accept:["O(V+E)","O(V + E)","o(v+e)","V+E"],explain:"Both BFS and DFS visit each vertex and edge once — O(V + E)."},
  {lang:"DSA",level:4,q:"What is the time complexity of naive recursive Fibonacci?",code:"fib(n) = fib(n-1) + fib(n-2)",type:"typed",options:[],answer:0,accept:["O(2^n)","O(2^N)","o(2^n)","2^n","exponential"],explain:"Without memoization, each call branches into two — exponential O(2^n) growth."},

  // ===== FILL-IN-THE-BLANK QUESTIONS (type: "fill") =====
  // Code has ____ where the user must type what's missing

  // Java fill
  {lang:"Java",level:1,q:"Complete the statement to print 'Hello World' to the console.",code:'System.____("Hello World");',type:"fill",options:[],answer:0,accept:["out.println","out.print"],hint:"It's a method on the 'out' object of System",explain:"`System.out.println()` prints text to the console with a newline."},
  {lang:"Java",level:2,q:"Complete the main method signature.",code:'public static void ____(String[] args) {',type:"fill",options:[],answer:0,accept:["main"],hint:"Every Java program starts from this method",explain:"`main` is the entry point for Java applications."},
  {lang:"Java",level:2,q:"Fill in the keyword to create a new ArrayList.",code:'ArrayList<String> list = ____ ArrayList<>();',type:"fill",options:[],answer:0,accept:["new"],hint:"This keyword creates object instances",explain:"`new` instantiates a class and calls its constructor."},
  {lang:"Java",level:3,q:"Complete the loop to iterate from 0 to 9.",code:'for (int i = 0; i < 10; ____) {',type:"fill",options:[],answer:0,accept:["i++","i+=1","i = i + 1","++i"],hint:"How do you increment i by 1?",explain:"`i++` increments i by 1 each iteration."},
  {lang:"Java",level:3,q:"Fill in the keyword to handle an exception.",code:'try {\n  riskyMethod();\n} ____ (Exception e) {\n  e.printStackTrace();\n}',type:"fill",options:[],answer:0,accept:["catch"],hint:"This keyword follows try",explain:"`catch` handles exceptions thrown in the try block."},

  // JavaScript fill
  {lang:"JavaScript",level:1,q:"Complete the code to log 'Hello' to the console.",code:'____.log("Hello");',type:"fill",options:[],answer:0,accept:["console"],hint:"This object provides debugging methods in the browser",explain:"`console.log()` outputs messages to the browser console."},
  {lang:"JavaScript",level:1,q:"Fill in the keyword to declare a constant variable.",code:'____ PI = 3.14159;',type:"fill",options:[],answer:0,accept:["const"],hint:"This keyword prevents reassignment",explain:"`const` declares a variable that cannot be reassigned."},
  {lang:"JavaScript",level:2,q:"Complete the arrow function syntax.",code:'const add = (a, b) ____ a + b;',type:"fill",options:[],answer:0,accept:["=>","=> {return","=>{ return"],hint:"Two characters that make an arrow function",explain:"`=>` is the arrow function syntax: `(params) => expression`."},
  {lang:"JavaScript",level:2,q:"Fill in the method to convert a JSON object to a string.",code:'const str = JSON.____(myObject);',type:"fill",options:[],answer:0,accept:["stringify"],hint:"The opposite of JSON.parse()",explain:"`JSON.stringify()` converts a JavaScript object to a JSON string."},
  {lang:"JavaScript",level:3,q:"Complete the code to destructure 'name' from an object.",code:'const { ____ } = person;',type:"fill",options:[],answer:0,accept:["name"],hint:"Extract the 'name' property",explain:"Destructuring extracts properties from objects: `const { name } = person`."},
  {lang:"JavaScript",level:3,q:"Fill in the method to filter array elements.",code:'const evens = numbers.____(n => n % 2 === 0);',type:"fill",options:[],answer:0,accept:["filter"],hint:"Returns a new array with elements that pass a test",explain:"`.filter()` creates a new array with elements that pass the callback's test."},
  {lang:"JavaScript",level:4,q:"Complete the async function declaration.",code:'____ function fetchData() {\n  const res = await fetch(url);\n  return res.json();\n}',type:"fill",options:[],answer:0,accept:["async"],hint:"This keyword enables the use of 'await' inside",explain:"`async` marks a function as asynchronous, allowing `await` inside it."},

  // Python fill
  {lang:"Python",level:1,q:"Complete the code to print 'Hello World'.",code:'____("Hello World")',type:"fill",options:[],answer:0,accept:["print"],hint:"The most basic output function",explain:"`print()` outputs text to the console in Python."},
  {lang:"Python",level:1,q:"Fill in the keyword to define a function.",code:'____ greet(name):\n  return f"Hello, {name}"',type:"fill",options:[],answer:0,accept:["def"],hint:"Short for 'define'",explain:"`def` defines a function in Python."},
  {lang:"Python",level:2,q:"Complete the list comprehension.",code:'squares = [x**2 ____ x in range(10)]',type:"fill",options:[],answer:0,accept:["for"],hint:"Iteration keyword",explain:"List comprehensions use `for` to iterate: `[expr for item in iterable]`."},
  {lang:"Python",level:2,q:"Fill in the keyword to import a module.",code:'____ random\nprint(random.randint(1, 10))',type:"fill",options:[],answer:0,accept:["import"],hint:"How you bring in external modules",explain:"`import` loads a module into the current namespace."},
  {lang:"Python",level:3,q:"Complete the class definition with inheritance.",code:'class Dog(____):\n  def speak(self):\n    return "Woof!"',type:"fill",options:[],answer:0,accept:["Animal","object"],hint:"The parent class name goes in parentheses",explain:"Classes inherit by placing the parent class in parentheses: `class Child(Parent)`."},
  {lang:"Python",level:3,q:"Fill in the method to open a file for reading.",code:'with ____(\"data.txt\", \"r\") as f:\n  content = f.read()',type:"fill",options:[],answer:0,accept:["open"],hint:"The built-in function for file I/O",explain:"`open()` returns a file object. Using `with` ensures it's properly closed."},

  // HTML fill
  {lang:"HTML",level:1,q:"Complete the tag to create a clickable link.",code:'<____ href="https://example.com">Click me</__>',type:"fill",options:[],answer:0,accept:["a"],hint:"Single letter, stands for 'anchor'",explain:"The `<a>` (anchor) tag creates hyperlinks."},
  {lang:"HTML",level:1,q:"Fill in the attribute to set an image source.",code:'<img ____="photo.jpg" alt="A photo">',type:"fill",options:[],answer:0,accept:["src"],hint:"Short for 'source'",explain:"The `src` attribute specifies the URL/path of an image."},
  {lang:"HTML",level:2,q:"Complete the tag for a text input field.",code:'<____ type="text" placeholder="Enter name">',type:"fill",options:[],answer:0,accept:["input"],hint:"A self-closing form element",explain:"The `<input>` tag creates interactive form controls."},
  {lang:"HTML",level:2,q:"Fill in the attribute to make an input required.",code:'<input type="email" ____>',type:"fill",options:[],answer:0,accept:["required"],hint:"Boolean attribute — the form won't submit without this field",explain:"The `required` attribute prevents form submission if the field is empty."},

  // CSS fill
  {lang:"CSS",level:1,q:"Complete the property to change text color.",code:'h1 {\n  ____: red;\n}',type:"fill",options:[],answer:0,accept:["color"],hint:"The property name is just... the color word",explain:"`color` sets the text color of an element."},
  {lang:"CSS",level:2,q:"Fill in the property to make an element a flex container.",code:'.container {\n  ____: flex;\n}',type:"fill",options:[],answer:0,accept:["display"],hint:"This property controls how an element is rendered",explain:"`display: flex` turns an element into a flexbox container."},
  {lang:"CSS",level:2,q:"Complete the property to center flex items horizontally.",code:'.container {\n  display: flex;\n  ____: center;\n}',type:"fill",options:[],answer:0,accept:["justify-content"],hint:"This property aligns items along the main axis",explain:"`justify-content: center` centers items along the main (horizontal) axis."},
  {lang:"CSS",level:3,q:"Fill in the value to make an element take full viewport height.",code:'.hero {\n  height: ____;\n}',type:"fill",options:[],answer:0,accept:["100vh","100%"],hint:"'vh' stands for viewport height",explain:"`100vh` makes an element the full height of the browser viewport."},

  // SQL fill
  {lang:"SQL",level:1,q:"Complete the query to select all columns from a table.",code:'____ * FROM users;',type:"fill",options:[],answer:0,accept:["SELECT","select"],hint:"The keyword that retrieves data",explain:"`SELECT *` retrieves all columns from the specified table."},
  {lang:"SQL",level:2,q:"Fill in the clause to filter results.",code:'SELECT * FROM orders\n____ total > 100;',type:"fill",options:[],answer:0,accept:["WHERE","where"],hint:"This clause specifies conditions",explain:"`WHERE` filters rows based on a condition."},
  {lang:"SQL",level:2,q:"Complete the statement to add a new row.",code:'____ INTO users (name, email)\nVALUES (\"Alice\", \"alice@mail.com\");',type:"fill",options:[],answer:0,accept:["INSERT","insert"],hint:"The opposite of DELETE",explain:"`INSERT INTO` adds a new row to a table."},
  {lang:"SQL",level:3,q:"Fill in the join type that returns all rows from both tables.",code:'SELECT * FROM a\n____ JOIN b ON a.id = b.a_id;',type:"fill",options:[],answer:0,accept:["FULL OUTER","FULL","full outer","full"],hint:"Combines LEFT and RIGHT joins",explain:"`FULL OUTER JOIN` returns all rows from both tables, with NULLs where there's no match."},

  // C fill
  {lang:"C",level:1,q:"Complete the include statement for standard I/O.",code:'#include <____>',type:"fill",options:[],answer:0,accept:["stdio.h"],hint:"Standard Input/Output header",explain:"`stdio.h` provides printf, scanf, and other I/O functions."},
  {lang:"C",level:2,q:"Fill in the format specifier to print an integer.",code:'printf("Value: ____\\n", num);',type:"fill",options:[],answer:0,accept:["%d","%i"],hint:"Starts with % followed by a letter for decimal",explain:"`%d` or `%i` is the format specifier for integers in printf."},
  {lang:"C",level:3,q:"Complete the pointer declaration.",code:'int x = 10;\nint ____ = &x;',type:"fill",options:[],answer:0,accept:["*p","*ptr","*pointer"],hint:"Use the dereference operator before the name",explain:"`int *p = &x` declares a pointer p that stores the address of x."},

  // C++ fill
  {lang:"C++",level:1,q:"Complete the output statement.",code:'____ << "Hello World" << endl;',type:"fill",options:[],answer:0,accept:["cout","std::cout"],hint:"The standard output stream object",explain:"`cout` (character output) prints to the console in C++."},
  {lang:"C++",level:2,q:"Fill in the keyword to get user input.",code:'int age;\n____ >> age;',type:"fill",options:[],answer:0,accept:["cin","std::cin"],hint:"The standard input stream object",explain:"`cin` (character input) reads from the keyboard in C++."},

  // React fill
  {lang:"React",level:2,q:"Complete the hook to manage state.",code:'const [count, setCount] = ____<number>(0);',type:"fill",options:[],answer:0,accept:["useState","React.useState"],hint:"The most common React hook for local state",explain:"`useState` creates a state variable and its setter function."},
  {lang:"React",level:2,q:"Fill in the hook to run code after render.",code:'____(( ) => {\n  document.title = `Count: ${count}`;\n}, [count]);',type:"fill",options:[],answer:0,accept:["useEffect","React.useEffect"],hint:"Runs side effects after rendering",explain:"`useEffect` runs side effects like API calls or DOM updates after render."},
  {lang:"React",level:3,q:"Complete the JSX to conditionally render a component.",code:'{isLoggedIn ____ <Dashboard /> }',type:"fill",options:[],answer:0,accept:["&&","?"],hint:"A logical operator that short-circuits",explain:"`&&` short-circuit renders: if left is true, render right side."},

  // TypeScript fill
  {lang:"TypeScript",level:2,q:"Complete the type annotation for a function parameter.",code:'function greet(name: ____): string {\n  return `Hello, ${name}`;\n}',type:"fill",options:[],answer:0,accept:["string"],hint:"The most basic text type",explain:"`string` is the TypeScript type for text values."},
  {lang:"TypeScript",level:3,q:"Fill in the generic type parameter.",code:'function identity<____>(arg: T): T {\n  return arg;\n}',type:"fill",options:[],answer:0,accept:["T"],hint:"Convention uses a single uppercase letter",explain:"`T` is the conventional generic type parameter name."},

  // Git fill
  {lang:"Git",level:1,q:"Complete the command to initialize a new repository.",code:'git ____',type:"fill",options:[],answer:0,accept:["init"],hint:"Short for 'initialize'",explain:"`git init` creates a new Git repository in the current directory."},
  {lang:"Git",level:2,q:"Fill in the command to create a new branch.",code:'git ____ feature-login',type:"fill",options:[],answer:0,accept:["branch","checkout -b","switch -c"],hint:"The command to create/list branches",explain:"`git branch <name>` creates a new branch."},
  {lang:"Git",level:2,q:"Complete the command to save staged changes.",code:'git ____ -m "Add login feature"',type:"fill",options:[],answer:0,accept:["commit"],hint:"Records a snapshot of staged changes",explain:"`git commit -m` saves staged changes with a message."},

  // Rust fill
  {lang:"Rust",level:1,q:"Complete the code to print to the console.",code:'____("Hello, world!");',type:"fill",options:[],answer:0,accept:["println!"],hint:"A macro (ends with !) for printing with newline",explain:"`println!` is a macro that prints formatted text with a newline."},
  {lang:"Rust",level:2,q:"Fill in the keyword to make a variable mutable.",code:'let ____ x = 5;\nx = 10;',type:"fill",options:[],answer:0,accept:["mut"],hint:"Short for 'mutable'",explain:"`mut` allows a variable to be changed after declaration."},

  // Go fill
  {lang:"Go",level:1,q:"Complete the function declaration keyword.",code:'____ main() {\n  fmt.Println("Hello")\n}',type:"fill",options:[],answer:0,accept:["func"],hint:"Short for 'function'",explain:"`func` declares a function in Go."},
  {lang:"Go",level:2,q:"Fill in the package for the main entry point.",code:'package ____\n\nimport "fmt"',type:"fill",options:[],answer:0,accept:["main"],hint:"Every executable Go program starts here",explain:"`package main` defines the entry point package for a Go executable."},

  // Kotlin fill
  {lang:"Kotlin",level:1,q:"Complete the function declaration.",code:'____ main() {\n  println("Hello")\n}',type:"fill",options:[],answer:0,accept:["fun"],hint:"Short for 'function' in Kotlin",explain:"`fun` declares a function in Kotlin."},
  {lang:"Kotlin",level:2,q:"Fill in the keyword for a null-safe call.",code:'val length = name____length',type:"fill",options:[],answer:0,accept:["?.","?.",".?"],hint:"Two characters: question mark and dot",explain:"`?.` is the safe call operator — returns null instead of throwing if the object is null."},

  // Swift fill
  {lang:"Swift",level:1,q:"Complete the print statement.",code:'____("Hello, World!")',type:"fill",options:[],answer:0,accept:["print"],hint:"The simplest output function",explain:"`print()` outputs text to the console in Swift."},
  {lang:"Swift",level:2,q:"Fill in the keyword to declare a variable.",code:'____ name = "Alice"',type:"fill",options:[],answer:0,accept:["var","let"],hint:"'var' for mutable, 'let' for immutable",explain:"`var` declares a mutable variable, `let` declares an immutable constant."},

  // PHP fill
  {lang:"PHP",level:1,q:"Complete the opening PHP tag.",code:'____\necho "Hello World";\n?>',type:"fill",options:[],answer:0,accept:["<?php"],hint:"Less-than, question mark, then the language name",explain:"`<?php` opens a PHP code block."},
  {lang:"PHP",level:2,q:"Fill in the function to output text.",code:'____ "Hello World";',type:"fill",options:[],answer:0,accept:["echo","print"],hint:"The most common PHP output statement",explain:"`echo` outputs one or more strings in PHP."},

  // Node.js fill
  {lang:"Node.js",level:2,q:"Complete the code to import a module.",code:'const fs = ____("fs");',type:"fill",options:[],answer:0,accept:["require"],hint:"The CommonJS import function",explain:"`require()` imports modules in Node.js (CommonJS)."},
  {lang:"Node.js",level:2,q:"Fill in the method to create an HTTP server.",code:'const server = http.____((req, res) => {\n  res.end("Hello");\n});',type:"fill",options:[],answer:0,accept:["createServer"],hint:"Method name describes what it does — creates a server",explain:"`http.createServer()` creates an HTTP server that handles requests."},

  // DSA fill
  {lang:"DSA",level:2,q:"Complete the binary search comparison.",code:'if (arr[mid] ____ target) {\n  return mid;\n}',type:"fill",options:[],answer:0,accept:["===","==","===" ],hint:"Equality comparison operator",explain:"Binary search returns when the middle element equals the target."},
  {lang:"DSA",level:3,q:"Complete the recursive base case for factorial.",code:'function factorial(n) {\n  if (n ____ 1) return 1;\n  return n * factorial(n - 1);\n}',type:"fill",options:[],answer:0,accept:["<=","===","==","<= 1","=== 1","== 1","<"],hint:"When should recursion stop?",explain:"The base case stops recursion — factorial(0) = factorial(1) = 1."},
  {lang:"DSA",level:3,q:"Fill in the data structure used for BFS traversal.",code:'const ____ = [startNode];\nwhile (____.length > 0) {\n  const node = ____.shift();\n}',type:"fill",options:[],answer:0,accept:["queue","q"],hint:"FIFO data structure",explain:"BFS uses a queue — nodes are processed in the order they're discovered."},

  // ===== MORE FILL-THE-BLANK: Multi-token code completion =====

  // JavaScript - function bodies & loops
  {lang:"JavaScript",level:3,q:"Complete the arrow function that doubles a number.",code:'const double = (n) => ____;',type:"fill",options:[],answer:0,accept:["n * 2","n*2","2 * n","2*n"],hint:"Multiply the parameter by 2",explain:"Arrow functions can have expression bodies: `(n) => n * 2`."},
  {lang:"JavaScript",level:3,q:"Fill in the array method to keep only even numbers.",code:'const evens = nums.____(n => n % 2 === 0);',type:"fill",options:[],answer:0,accept:["filter"],hint:"This method creates a new array with elements that pass a test",explain:"`filter()` creates a new array with elements that pass the callback test."},
  {lang:"JavaScript",level:3,q:"Complete the destructuring assignment.",code:'const { name, ____ } = person;',type:"fill",options:[],answer:0,accept:["age","email","id"],hint:"Pick any common property name",explain:"Object destructuring extracts properties into variables."},
  {lang:"JavaScript",level:4,q:"Complete the Promise chain error handler.",code:'fetch(url)\n  .then(res => res.json())\n  .____((err) => console.error(err));',type:"fill",options:[],answer:0,accept:["catch"],hint:"The method that handles rejected promises",explain:"`.catch()` handles errors in a Promise chain."},
  {lang:"JavaScript",level:4,q:"Complete the async/await function body.",code:'async function getData() {\n  const res = ____ fetch("/api/data");\n  return res.json();\n}',type:"fill",options:[],answer:0,accept:["await","const res = await"],hint:"Keyword that pauses until the promise resolves",explain:"`await` pauses execution until the Promise resolves."},

  // Python - function bodies & loops
  {lang:"Python",level:3,q:"Complete the list comprehension to square numbers.",code:'squares = [____ for x in range(10)]',type:"fill",options:[],answer:0,accept:["x**2","x*x","x ** 2","x * x"],hint:"x raised to the power of 2",explain:"List comprehensions: `[expression for item in iterable]`."},
  {lang:"Python",level:3,q:"Complete the function to return the max of two numbers.",code:'def max_of_two(a, b):\n    return a if ____ else b',type:"fill",options:[],answer:0,accept:["a > b","a >= b","a>b","a>=b"],hint:"Compare a and b",explain:"Ternary expression: `a if condition else b`."},
  {lang:"Python",level:4,q:"Complete the decorator syntax.",code:'____\ndef my_view(request):\n    return render(request, "home.html")',type:"fill",options:[],answer:0,accept:["@login_required","@app.route('/')","@staticmethod","@classmethod"],hint:"Decorators start with the @ symbol",explain:"Decorators use `@decorator_name` syntax above the function definition."},
  {lang:"Python",level:3,q:"Complete the dictionary comprehension.",code:'squares = {x: ____ for x in range(5)}',type:"fill",options:[],answer:0,accept:["x**2","x*x","x ** 2","x * x"],hint:"The value should be x squared",explain:"Dict comprehension: `{key: value for item in iterable}`."},
  {lang:"Python",level:4,q:"Fill in the method to handle exceptions.",code:'try:\n    result = 10 / 0\n____ ZeroDivisionError:\n    print("Cannot divide by zero")',type:"fill",options:[],answer:0,accept:["except"],hint:"The keyword that catches exceptions",explain:"`except` catches and handles specific exceptions in Python."},

  // Java - function bodies
  {lang:"Java",level:3,q:"Complete the for-each loop.",code:'for (String item ____ list) {\n    System.out.println(item);\n}',type:"fill",options:[],answer:0,accept:[":","in"],hint:"Single character separator in enhanced for loop",explain:"Enhanced for loop uses `:` — `for (Type var : collection)`."},
  {lang:"Java",level:3,q:"Complete the method signature to return an integer.",code:'public ____ add(int a, int b) {\n    return a + b;\n}',type:"fill",options:[],answer:0,accept:["int","Integer"],hint:"The return type for whole numbers",explain:"Methods must declare their return type — `int` for integers."},
  {lang:"Java",level:4,q:"Fill in the interface implementation keyword.",code:'public class Dog ____ Animal {\n    public void speak() { }\n}',type:"fill",options:[],answer:0,accept:["implements","extends"],hint:"Keyword for implementing an interface or extending a class",explain:"`implements` for interfaces, `extends` for class inheritance."},
  {lang:"Java",level:4,q:"Complete the lambda expression.",code:'list.forEach(item ____ System.out.println(item));',type:"fill",options:[],answer:0,accept:["->"],hint:"The arrow operator in Java lambdas",explain:"`->` separates parameters from the lambda body."},

  // SQL - complex queries
  {lang:"SQL",level:3,q:"Complete the JOIN clause.",code:'SELECT * FROM orders\n____ JOIN customers\nON orders.customer_id = customers.id;',type:"fill",options:[],answer:0,accept:["INNER","LEFT","RIGHT","FULL","inner","left","right"],hint:"Type of join — INNER is most common",explain:"JOIN types: INNER (matching rows), LEFT (all left + matching right), etc."},
  {lang:"SQL",level:3,q:"Fill in the aggregate function to count rows.",code:'SELECT department, ____(*)\nFROM employees\nGROUP BY department;',type:"fill",options:[],answer:0,accept:["COUNT","count"],hint:"Counts the number of rows",explain:"`COUNT(*)` counts all rows in each group."},
  {lang:"SQL",level:4,q:"Complete the subquery.",code:'SELECT name FROM employees\nWHERE salary > (\n  SELECT ____(salary) FROM employees\n);',type:"fill",options:[],answer:0,accept:["AVG","avg"],hint:"The aggregate function for average",explain:"`AVG()` calculates the average value — this finds employees earning above average."},

  // C - systems programming
  {lang:"C",level:3,q:"Complete the pointer declaration.",code:'int x = 42;\nint ____ p = &x;',type:"fill",options:[],answer:0,accept:["*","*p"],hint:"The symbol that declares a pointer",explain:"`*` declares a pointer variable — `int *p` points to an integer."},
  {lang:"C",level:3,q:"Fill in the memory allocation function.",code:'int *arr = (int *)____(10 * sizeof(int));',type:"fill",options:[],answer:0,accept:["malloc","calloc"],hint:"Memory allocation function from stdlib.h",explain:"`malloc()` allocates dynamic memory on the heap."},

  // TypeScript
  {lang:"TypeScript",level:3,q:"Complete the generic function signature.",code:'function identity______(arg: T): T {\n    return arg;\n}',type:"fill",options:[],answer:0,accept:["<T>"],hint:"Angle brackets with a type parameter",explain:"Generics use `<T>` to create reusable type-safe functions."},
  {lang:"TypeScript",level:3,q:"Fill in the type for an async function return.",code:'async function fetchData(): ____<string> {\n    return "data";\n}',type:"fill",options:[],answer:0,accept:["Promise"],hint:"Async functions always return this wrapper type",explain:"Async functions return `Promise<T>` where T is the resolved value type."},

  // React
  {lang:"React",level:3,q:"Complete the hook to run code on mount.",code:'____(() => {\n  fetchData();\n}, []);',type:"fill",options:[],answer:0,accept:["useEffect"],hint:"The hook for side effects",explain:"`useEffect` with an empty dependency array runs once on mount."},
  {lang:"React",level:3,q:"Fill in the hook for state management.",code:'const [count, setCount] = ____(0);',type:"fill",options:[],answer:0,accept:["useState"],hint:"The most basic React hook for component state",explain:"`useState` returns a state variable and its setter function."},
  {lang:"React",level:4,q:"Complete the memoization hook.",code:'const expensiveValue = ____(() => {\n  return computeExpensive(data);\n}, [data]);',type:"fill",options:[],answer:0,accept:["useMemo"],hint:"Hook that memoizes a computed value",explain:"`useMemo` caches expensive computations and recalculates only when dependencies change."},

  // DSA - algorithm implementations
  {lang:"DSA",level:3,q:"Complete the swap in bubble sort.",code:'if (arr[j] > arr[j + 1]) {\n  [arr[j], arr[j+1]] = [____, ____];\n}',type:"fill",options:[],answer:0,accept:["arr[j+1], arr[j]","arr[j + 1], arr[j]"],hint:"Swap the two elements — reverse order",explain:"Destructuring swap: `[a, b] = [b, a]` swaps without a temp variable."},
  {lang:"DSA",level:4,q:"Complete the merge step of merge sort.",code:'if (left[i] ____ right[j]) {\n  result.push(left[i]);\n  i++;\n} else {\n  result.push(right[j]);\n  j++;\n}',type:"fill",options:[],answer:0,accept:["<=","<"],hint:"Compare left and right elements",explain:"Merge sort compares elements from both halves, taking the smaller one."},
  {lang:"DSA",level:4,q:"Fill in the hash function operation.",code:'function hash(key, size) {\n  return key ____ size;\n}',type:"fill",options:[],answer:0,accept:["%","% size"],hint:"The modulo operator ensures the index fits in the array",explain:"`key % size` maps any key to a valid array index using the modulo operator."},

  // ===== WRITE-FROM-SCRATCH =====
  {lang:"JavaScript",level:2,q:"Write a function `add(a, b)` that returns the sum of two numbers.",code:null,type:"scratch",options:[],answer:0,
    requirements:["Function named `add`","Takes two parameters","Returns their sum"],
    mustMatch:["function\\s+add\\s*\\(", "return\\s+[a-z_]+\\s*\\+\\s*[a-z_]+"],
    solution:"function add(a, b) {\n  return a + b;\n}",
    explain:"The function declaration with `return a + b` is the canonical solution.",
    explainKeywords:["return","sum","add","plus"]},
  {lang:"JavaScript",level:3,q:"Write a function `reverseString(s)` that returns the reverse of a string.",code:null,type:"scratch",options:[],answer:0,
    requirements:["Function named `reverseString`","Returns reversed string","Handle empty strings"],
    mustMatch:["function\\s+reverseString\\s*\\(", "(split\\s*\\(\\s*[\"']{1}[\"']{1}\\s*\\)|for\\s*\\(|reduce)"],
    solution:"function reverseString(s) {\n  return s.split('').reverse().join('');\n}",
    explain:"Split into chars, reverse the array, join back into a string.",
    explainKeywords:["reverse","split","array"]},
  {lang:"DSA",level:3,q:"Write a function `binarySearch(arr, target)` that returns the index of target, or -1 if not found. Assume arr is sorted.",code:null,type:"scratch",options:[],answer:0,
    requirements:["Function named `binarySearch`","Use two pointers (low, high)","Return index or -1"],
    mustMatch:["function\\s+binarySearch\\s*\\(", "while\\s*\\(", "(mid|middle)", "return\\s+-?1?"],
    mustNotMatch:["\\.indexOf\\s*\\(", "\\.includes\\s*\\(", "\\.find\\s*\\("],
    solution:"function binarySearch(arr, target) {\n  let low = 0, high = arr.length - 1;\n  while (low <= high) {\n    const mid = Math.floor((low + high) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) low = mid + 1;\n    else high = mid - 1;\n  }\n  return -1;\n}",
    explain:"Binary search halves the search space each iteration → O(log n).",
    explainKeywords:["log","half","sorted","divide"]},
  {lang:"Python",level:2,q:"Write a function `is_even(n)` that returns True if n is even.",code:null,type:"scratch",options:[],answer:0,
    requirements:["Function named `is_even`","Returns boolean"],
    mustMatch:["def\\s+is_even\\s*\\(", "%\\s*2"],
    solution:"def is_even(n):\n    return n % 2 == 0",
    explain:"`n % 2 == 0` checks divisibility by 2.",
    explainKeywords:["modulo","remainder","divisible","%"]},
  {lang:"DSA",level:4,q:"Write a recursive function `factorial(n)` that returns n!.",code:null,type:"scratch",options:[],answer:0,
    requirements:["Recursive (calls itself)","Base case for n <= 1","Returns n * factorial(n-1)"],
    mustMatch:["function\\s+factorial\\s*\\(|def\\s+factorial\\s*\\(", "factorial\\s*\\(\\s*n\\s*-\\s*1\\s*\\)", "(if|return)\\s+.*(<=|==|<)\\s*1"],
    solution:"function factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}",
    explain:"Recursion needs a base case (n <= 1) and a recursive case (n * factorial(n-1)).",
    explainKeywords:["base case","recursion","stack","calls itself"]},

  // ===== BUG-FIX =====
  {lang:"JavaScript",level:2,q:"This function should return the sum of an array. Find and fix the bug.",code:null,type:"bugfix",options:[],answer:0,
    buggyCode:"function sum(arr) {\n  let total = 0;\n  for (let i = 0; i <= arr.length; i++) {\n    total += arr[i];\n  }\n  return total;\n}",
    mustMatch:["i\\s*<\\s*arr\\.length"],
    mustNotMatch:["i\\s*<=\\s*arr\\.length"],
    solution:"function sum(arr) {\n  let total = 0;\n  for (let i = 0; i < arr.length; i++) {\n    total += arr[i];\n  }\n  return total;\n}",
    hint:"Off-by-one in the loop condition.",
    explain:"`i <= arr.length` reads one past the end (undefined). Use `i < arr.length`.",
    explainKeywords:["off-by-one","undefined","length","bounds"]},
  {lang:"JavaScript",level:2,q:"This greeting function has a bug. Fix it.",code:null,type:"bugfix",options:[],answer:0,
    buggyCode:"function greet(name) {\n  if (name = 'admin') {\n    return 'Hello boss';\n  }\n  return 'Hello ' + name;\n}",
    mustMatch:["name\\s*===?\\s*['\"]admin['\"]"],
    mustNotMatch:["name\\s*=\\s*['\"]admin"],
    solution:"function greet(name) {\n  if (name === 'admin') {\n    return 'Hello boss';\n  }\n  return 'Hello ' + name;\n}",
    hint:"Assignment vs comparison.",
    explain:"`=` assigns, `===` compares. The buggy version always assigns 'admin' to name.",
    explainKeywords:["assignment","comparison","===","equality"]},
  {lang:"Python",level:2,q:"This function should return the max of a list. Fix the bug.",code:null,type:"bugfix",options:[],answer:0,
    buggyCode:"def find_max(nums):\n    max_val = 0\n    for n in nums:\n        if n > max_val:\n            max_val = n\n    return max_val",
    mustMatch:["max_val\\s*=\\s*nums\\[0\\]|float\\(['\"]-inf['\"]\\)|None"],
    mustNotMatch:["max_val\\s*=\\s*0"],
    solution:"def find_max(nums):\n    max_val = nums[0]\n    for n in nums:\n        if n > max_val:\n            max_val = n\n    return max_val",
    hint:"What if all numbers are negative?",
    explain:"Initializing to 0 fails for all-negative lists. Use nums[0] or float('-inf').",
    explainKeywords:["negative","initial","initialize","-inf"]},
  {lang:"DSA",level:3,q:"This linked list traversal has a bug — it crashes on empty lists. Fix it.",code:null,type:"bugfix",options:[],answer:0,
    buggyCode:"function printList(head) {\n  let node = head;\n  while (node.next) {\n    console.log(node.value);\n    node = node.next;\n  }\n  console.log(node.value);\n}",
    mustMatch:["while\\s*\\(\\s*node(\\s*!==?\\s*null)?\\s*\\)|if\\s*\\(\\s*!?\\s*head"],
    mustNotMatch:["while\\s*\\(\\s*node\\.next\\s*\\)\\s*\\{\\s*console"],
    solution:"function printList(head) {\n  let node = head;\n  while (node) {\n    console.log(node.value);\n    node = node.next;\n  }\n}",
    hint:"What happens when `head` is null?",
    explain:"`while (node)` handles both empty list and end-of-list cleanly.",
    explainKeywords:["null","empty","check","guard"]},
  {lang:"Java",level:3,q:"This method should return the average. Find the subtle bug.",code:null,type:"bugfix",options:[],answer:0,
    buggyCode:"public double average(int[] nums) {\n    int sum = 0;\n    for (int n : nums) sum += n;\n    return sum / nums.length;\n}",
    mustMatch:["\\(double\\)\\s*sum|sum\\s*\\*\\s*1\\.0|1\\.0\\s*\\*\\s*sum"],
    solution:"public double average(int[] nums) {\n    int sum = 0;\n    for (int n : nums) sum += n;\n    return (double) sum / nums.length;\n}",
    hint:"Integer division truncates.",
    explain:"`int / int` is integer division in Java. Cast to double first.",
    explainKeywords:["integer division","cast","double","truncate"]},

  // ===== BIG-O MODE =====
  {lang:"DSA",level:2,q:"What is the time complexity of this snippet?",code:"for (let i = 0; i < n; i++) {\n  console.log(i);\n}",type:"bigO",options:["O(1)","O(log n)","O(n)","O(n²)"],answer:2,explain:"A single loop over n items runs in linear time."},
  {lang:"DSA",level:2,q:"What is the time complexity?",code:"for (let i = 0; i < n; i++) {\n  for (let j = 0; j < n; j++) {\n    console.log(i, j);\n  }\n}",type:"bigO",options:["O(n)","O(n log n)","O(n²)","O(2ⁿ)"],answer:2,explain:"Nested loops over n give n × n = n² operations."},
  {lang:"DSA",level:3,q:"Time complexity of binary search?",code:"function bsearch(arr, t) {\n  let l=0, r=arr.length-1;\n  while (l<=r) {\n    const m=(l+r)>>1;\n    if (arr[m]===t) return m;\n    if (arr[m]<t) l=m+1; else r=m-1;\n  }\n}",type:"bigO",options:["O(n)","O(log n)","O(n log n)","O(1)"],answer:1,explain:"Halving the search space each iteration → log₂ n."},
  {lang:"DSA",level:3,q:"Time complexity?",code:"function fib(n) {\n  if (n<2) return n;\n  return fib(n-1) + fib(n-2);\n}",type:"bigO",options:["O(n)","O(n²)","O(2ⁿ)","O(log n)"],answer:2,explain:"Naive recursive fib has two recursive calls per level → exponential."},
  {lang:"DSA",level:3,q:"Space complexity of merge sort?",code:null,type:"bigO",options:["O(1)","O(log n)","O(n)","O(n²)"],answer:2,explain:"Merge sort uses an auxiliary array of size n."},
  {lang:"DSA",level:4,q:"Time complexity?",code:"for (let i=1; i<n; i*=2) {\n  for (let j=0; j<n; j++) console.log(j);\n}",type:"bigO",options:["O(n)","O(n log n)","O(n²)","O(log n)"],answer:1,explain:"Outer loop runs log n times, inner runs n times → n log n."},
  {lang:"DSA",level:4,q:"What's the average time complexity of a hash map lookup?",code:null,type:"bigO",options:["O(1)","O(log n)","O(n)","O(n²)"],answer:0,explain:"Hash map lookup is O(1) average, O(n) worst-case with collisions."},

  // ===== PREDICT-OUTPUT MODE =====
  {lang:"JavaScript",level:2,q:"What does this print?",code:"console.log([1,2,3].map(x => x*2).filter(x => x > 2));",type:"predict",options:[],answer:0,accept:["[4,6]","[ 4, 6 ]","[4, 6]"],hint:"Map then filter.",explain:"Map → [2,4,6], filter > 2 → [4,6]."},
  {lang:"JavaScript",level:2,q:"What does this print?",code:"console.log(0.1 + 0.2 === 0.3);",type:"predict",options:[],answer:0,accept:["false"],hint:"IEEE 754 floats.",explain:"Floating-point precision means 0.1 + 0.2 = 0.30000000000000004."},
  {lang:"JavaScript",level:3,q:"What does this print?",code:"const a = [1,2,3];\nconst b = a;\nb.push(4);\nconsole.log(a.length);",type:"predict",options:[],answer:0,accept:["4"],hint:"Reference vs copy.",explain:"`b` references the same array — mutations affect both."},
  {lang:"Python",level:2,q:"What does this print?",code:"print([i*i for i in range(4)])",type:"predict",options:[],answer:0,accept:["[0, 1, 4, 9]","[0,1,4,9]"],explain:"List comprehension squares 0..3."},
  {lang:"Python",level:3,q:"What does this print?",code:"def f(x, lst=[]):\n    lst.append(x)\n    return lst\nprint(f(1)); print(f(2))",type:"predict",options:[],answer:0,accept:["[1]\n[1, 2]","[1] [1, 2]","[1]\n[1,2]"],hint:"Mutable default arguments.",explain:"Default `lst=[]` is created once and reused — classic Python gotcha."},
  {lang:"Java",level:2,q:"What does this print?",code:"String a = \"hi\";\nString b = \"hi\";\nSystem.out.println(a == b);",type:"predict",options:[],answer:0,accept:["true"],explain:"String literals are interned — both refer to the same object."},

  // ===== TRADE-OFF MODE =====
  {lang:"DSA",level:3,q:"When would you use a HashMap over a TreeMap?",code:null,type:"tradeoff",options:["Always — it's faster","When you need O(1) lookup and don't care about key order","When you need sorted keys","Never — TreeMap is better"],answer:1,explain:"HashMap = O(1) lookup, no order. TreeMap = O(log n) lookup, sorted keys. Choose based on whether you need order."},
  {lang:"React",level:3,q:"When should you use `useMemo`?",code:null,type:"tradeoff",options:["On every value","Only when computing a value is expensive AND the inputs change rarely","Never — it's deprecated","To replace useState"],answer:1,explain:"useMemo has overhead. Use it for expensive calculations, not trivially cheap ones."},
  {lang:"SQL",level:3,q:"When would you use NoSQL over SQL?",code:null,type:"tradeoff",options:["Always — it's modern","When you need flexible schema, horizontal scale, and can sacrifice ACID guarantees","When you need joins","When you have tabular data"],answer:1,explain:"SQL = strong consistency + relations. NoSQL = flexible schema + scale. Pick based on data shape and consistency needs."},
  {lang:"DSA",level:4,q:"When would you pick a linked list over an array?",code:null,type:"tradeoff",options:["Always — it's more flexible","When you need O(1) insertion/deletion at known positions and don't need random access","When you need fast indexing","When memory is tight"],answer:1,explain:"Arrays = O(1) random access, contiguous memory. Linked lists = O(1) splice but no random access and more memory overhead."},
  {lang:"DSA",level:4,q:"When would you use BFS over DFS?",code:null,type:"tradeoff",options:["Never","When you need the shortest path in an unweighted graph","When the graph is deep","When you need to detect cycles"],answer:1,explain:"BFS finds shortest path (in edges) first. DFS is better for going deep, topological sort, or detecting cycles."},

  // ===== SYSTEM DESIGN MODE =====
  {lang:"DSA",level:4,q:"Design a notification system that delivers messages to 10M users with low latency. Outline your approach: data flow, storage, scaling concerns, and trade-offs.",code:null,type:"design",options:[],answer:0,
    keywordGroups:[
      ["queue","kafka","rabbitmq","pub/sub","pubsub","sqs"],
      ["fanout","push","websocket","sse","poll"],
      ["shard","partition","horizontal","scale","scaling"],
      ["cache","redis","memcached"],
      ["retry","dead letter","dlq","fail","idempoten"]
    ],
    passThreshold:0.6,
    explain:"Strong answers cover: a message queue (Kafka/SQS), a fanout strategy (push vs pull, websockets), sharding by user, caching for delivery state, and retry/DLQ for failures.",
    hint:"Think queue → fanout → delivery → persistence → failure handling."},
  {lang:"DSA",level:4,q:"Design a URL shortener (like bit.ly). Cover: ID generation, storage, read path, and how you'd handle 100k requests/sec.",code:null,type:"design",options:[],answer:0,
    keywordGroups:[
      ["base62","hash","counter","snowflake","uuid"],
      ["redis","cache","memcached","cdn"],
      ["database","postgres","mysql","dynamo","key-value"],
      ["shard","replica","read replica","scale"],
      ["collision","unique","constraint"]
    ],
    passThreshold:0.6,
    explain:"Solid designs include: base62/hash for short IDs, key-value store for the mapping, aggressive caching (Redis/CDN), read replicas/sharding for scale, and collision handling.",
    hint:"ID scheme → storage → caching → scaling reads → collisions."},
  {lang:"DSA",level:4,q:"Design a rate limiter for an API serving 1M req/sec across many servers. Compare algorithms and discuss state storage.",code:null,type:"design",options:[],answer:0,
    keywordGroups:[
      ["token bucket","leaky bucket","sliding window","fixed window"],
      ["redis","centralized","distributed","memcached"],
      ["per user","per ip","per key"],
      ["atomic","lua","race","concurrent"]
    ],
    passThreshold:0.6,
    explain:"Cover: algorithms (token bucket vs sliding window), distributed state (Redis with Lua scripts), keying (user/IP/API-key), and race-condition handling.",
    hint:"Algorithm → storage → key → atomicity."},

  // ===== MOCK INTERVIEW MODE =====
  {lang:"DSA",level:3,q:"Walk me through how you'd find the first non-repeating character in a string. Explain your thought process before writing code: brute force first, then optimize.",code:null,type:"mock",options:[],answer:0,
    keywordGroups:[
      ["brute","nested","two loop","o(n²)","o(n*n)"],
      ["hash","map","dict","frequency","count"],
      ["o(n)","linear","two pass","single pass"],
      ["edge","empty","case","unicode"]
    ],
    passThreshold:0.6,
    explain:"Strong answer: state brute force (O(n²)), propose hash map of counts (two-pass O(n)), discuss edge cases (empty, all repeating, case sensitivity).",
    hint:"Brute first → identify bottleneck → propose data structure → discuss edges."},
  {lang:"DSA",level:3,q:"You're given a stream of integers. Walk through how you'd find the running median efficiently. Talk through your data structure choice.",code:null,type:"mock",options:[],answer:0,
    keywordGroups:[
      ["heap","priority queue","two heap","min heap","max heap"],
      ["balance","rebalance","equal size"],
      ["o(log n)","logarithmic","insert"],
      ["odd","even","middle","median"]
    ],
    passThreshold:0.6,
    explain:"Two heaps: a max-heap for the lower half, min-heap for the upper. Rebalance after each insert. Median is heap top(s). O(log n) insert, O(1) query.",
    hint:"Naive sort is O(n log n) per insert — find a better data structure."},

  // ===== BUILD-UP CHAIN: array sum =====
  {lang:"DSA",level:1,chainId:"sum-chain",chainStep:1,q:"Step 1/3 — Declare a variable `total` initialized to 0.",code:null,type:"scratch",options:[],answer:0,
    requirements:["Declare `total`","Initialize it to 0"],
    mustMatch:["(let|const|var)\\s+total\\s*=\\s*0"],
    solution:"let total = 0;",
    explain:"Foundation: a counter starts at zero before accumulating."},
  {lang:"DSA",level:2,chainId:"sum-chain",chainStep:2,q:"Step 2/3 — Now write a `for` loop over an array `nums` that adds each value to `total`.",code:null,type:"scratch",options:[],answer:0,
    requirements:["Loop over `nums`","Add each element to `total`"],
    mustMatch:["for\\s*\\(","total\\s*\\+=|total\\s*=\\s*total\\s*\\+"],
    solution:"let total = 0;\nfor (let i = 0; i < nums.length; i++) {\n  total += nums[i];\n}",
    explain:"Loop + accumulator is the building block of reduce, average, sum, count, etc."},
  {lang:"DSA",level:3,chainId:"sum-chain",chainStep:3,q:"Step 3/3 — Wrap that into a function `sumArray(nums)` that returns the total. Handle empty arrays cleanly.",code:null,type:"scratch",options:[],answer:0,
    requirements:["Function named `sumArray`","Takes `nums` parameter","Returns the total","Works on empty arrays"],
    mustMatch:["function\\s+sumArray\\s*\\(\\s*nums\\s*\\)|sumArray\\s*=\\s*\\(?\\s*nums","return\\s+total"],
    solution:"function sumArray(nums) {\n  let total = 0;\n  for (const n of nums) total += n;\n  return total;\n}",
    explain:"You've now built a reusable utility from scratch — variable → loop → function.",
    explainKeywords:["abstract","reusable","function","encapsul"]},
];

