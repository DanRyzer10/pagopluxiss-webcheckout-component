export default (cedula:string) => {
  if (!cedula) return false;
    const ced = cedula.split("").map(Number);
    let factor = 1;
    const result = ced.reduce((accum:number, curr:number, index:number) => {
      curr *= factor;
      factor = 1 << index % 2;
      return accum + (curr - (curr > 9 ? 9 : 0));
    }, 0);
    if (result % 10 === 0 && result > 0) {
      return true;
    } else {
      return false;
    }
};