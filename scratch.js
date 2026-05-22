const regex = /^(?:\[(\d+)\])?(?:(?:\.)([a-zA-Z_$][a-zA-Z0-9_$]*)|\["([^"]+)"\]|\['([^']+)'\])?$/;
const tests = [
  '',
  '[0]',
  '[1].id',
  '[1]["user.name"]',
  '.id',
  '["user.name"]',
  '[123].status_code'
];
tests.forEach(t => {
  const m = t.match(regex);
  console.log(t, '->', m ? [m[1], m[2], m[3], m[4]] : 'null');
});
