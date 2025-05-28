export const test = async () => {
  const response = await fetch('https://lh3.googleusercontent.com/place-photos/AJnk2cw3uRB4QxHoZfgDeWKl5PPR31iY41P9A84OB0xseKy4MCIKiofzLBXp75r1FOkmHZIt6MushoTl2F3cqu8Z5Avx1bTkZj1R_TK0nrayR5HApGse1SKf8Gjof426TMVMipy5DYPLsoFC6TKjYA=s4800-h1600', {
    method: 'GET'
  });
  
  const data = await response.text();
  console.log(data);
  console.log(response.status);
}

test();