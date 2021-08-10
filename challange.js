//! Generate Pascal triangle with javascript.
// function pascals(numRows) {
//   if (numRows === 0) return [];
//   if (numRows === 1) return [[1]];
//   let result = [];
//   for (let row = 1; row <= numRows; row++) {
//     let arr = [];
//     for (let col = 0; col < row; col++) {
//       if (col === 0 || col === row - 1) {
//         arr.push(1);
//       } else {
//         arr.push(result[row - 2][col - 1] + result[row - 2][col]);
//       }
//     }
//     result.push(arr);
//   }
//   return result;
// }
// console.log(pascals(5));

// function rowIndexes(rowIndex) {
//   if (rowIndex === 1) return [[1]];
//   let result = [];
//   for (let row = 1; row <= rowIndex + 1; row++) {
//     let arr = [];
//     for (let col = 0; col < row; col++) {
//       if (col === 0 || col === row - 1) {
//         arr.push(1);
//       } else {
//         arr.push(result[row - 2][col - 1] + result[row - 2][col]);
//       }
//     }
//     result.push(arr);
//   }
//   console.log(result);
//   return result[rowIndex];
// }

// console.log(rowIndexes(3));
