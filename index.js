const fs = require('fs');

function readNumbersFromFile(filename) {
  try {
    const data = fs.readFileSync(filename, 'utf8');
    return [
      ...new Set(
        data
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter((line) => line !== '')
      ),
    ].map(String);
  } catch (err) {
    console.error('Помилка читання файлу:', err);
    return [];
  }
}

class DigitPuzzleSolver {
  constructor(numbers) {
    this.numbers = numbers;
    this.graph = new Map();
    this.memo = new Map();
    this.buildGraph();
  }

  buildGraph() {
    for (let num of this.numbers) {
      let lastTwo = num.slice(-2);
      for (let other of this.numbers) {
        if (num !== other && other.startsWith(lastTwo)) {
          if (!this.graph.has(num)) {
            this.graph.set(num, []);
          }
          this.graph.get(num).push(other);
        }
      }
    }
  }

  dfs(current, visited = new Set()) {
    if (visited.has(current)) return '';
    if (this.memo.has(current)) return this.memo.get(current);

    visited.add(current);
    let longestPath = current;

    if (this.graph.has(current)) {
      for (let next of this.graph.get(current)) {
        let newPath = this.dfs(next, visited);
        let mergedPath = current + newPath.slice(2);
        if (mergedPath.length > longestPath.length) {
          longestPath = mergedPath;
        }
      }
    }

    this.memo.set(current, longestPath);
    return longestPath;
  }

  findLongestChain() {
    // console.log('graph', this.graph);
    let longestSequence = '';
    for (let num of this.numbers) {
      let sequence = this.dfs(num);
      if (sequence.length > longestSequence.length) {
        longestSequence = sequence;
      }
    }
    return longestSequence;
  }
}

const filename = 'file.txt';
const numbers = readNumbersFromFile(filename);
// const numbers = ['248460', '962282', '608017', '994725', '177092'];
const solver = new DigitPuzzleSolver(numbers);

console.time('Execution Time');
const result = solver.findLongestChain();
console.log('Найдовша послідовність:', result);
console.timeEnd('Execution Time');
